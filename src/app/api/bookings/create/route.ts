import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      hotelId = 'vamana-inn-tirupati',
      hotelName = 'Hotel Vamana Inn',
      guestName,
      guestPhone,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      budgetPerNight = 2500,
      cabPreference = 'yes',
      specialRequirements = '',
      communicationLanguage = 'Telugu',
      totalAmount,
      whatsappPhone = '919398542837'
    } = body;

    // Server-side validation
    const trimmedName = typeof guestName === 'string' ? guestName.trim() : '';
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const cleanPhone = String(guestPhone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }
    const formattedPhone = cleanPhone.slice(-10);

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Please select both check-in and check-out dates.' },
        { status: 400 }
      );
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid check-in or check-out date format.' },
        { status: 400 }
      );
    }

    if (outDate < inDate) {
      return NextResponse.json(
        { success: false, error: 'Check-out date cannot be earlier than check-in date.' },
        { status: 400 }
      );
    }

    const guestsCount = Math.max(1, Math.min(30, Number(guests) || 2));
    const roomsCount = Math.max(1, Math.min(10, Number(rooms) || 1));
    const budget = Math.max(500, Number(budgetPerNight) || 2500);
    const calculatedAmount = totalAmount ? Number(totalAmount) : budget;
    const bookingId = `SRTH-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const bookingRecord = {
      id: bookingId,
      hotel_id: hotelId,
      hotel_name: hotelName,
      guest_name: trimmedName,
      guest_phone: formattedPhone,
      check_in: checkIn,
      check_out: checkOut,
      guests_count: guestsCount,
      rooms_count: roomsCount,
      budget_per_night: budget,
      cab_preference: cabPreference,
      special_requirements: typeof specialRequirements === 'string' ? specialRequirements.trim() : '',
      communication_language: communicationLanguage || 'Telugu',
      total_amount: calculatedAmount,
      status: 'new',
      admin_notes: '',
      created_at: nowIso,
      updated_at: nowIso
    };

    // 1. Central JSON fallback file store (ensures instant zero-downtime reliability)
    try {
      const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'hotel-bookings.json');
      let allBookings: any[] = [];
      if (fs.existsSync(BOOKINGS_FILE)) {
        try {
          allBookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
          if (!Array.isArray(allBookings)) allBookings = [];
        } catch {
          allBookings = [];
        }
      }
      allBookings.unshift(bookingRecord);
      if (allBookings.length > 500) allBookings = allBookings.slice(0, 500);
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(allBookings, null, 2));
    } catch (fsErr) {
      console.warn('Local hotel-bookings file write warning:', fsErr);
    }

    // 2. Record into launch-notifications.json for real-time room count
    try {
      const NOTIF_FILE = path.join(process.cwd(), 'data', 'launch-notifications.json');
      let store: any = { total: 0, cabs: 0, rooms: 0, items: [] };
      if (fs.existsSync(NOTIF_FILE)) {
        store = JSON.parse(fs.readFileSync(NOTIF_FILE, 'utf-8'));
      }
      store.rooms = (Number(store.rooms) || 0) + 1;
      store.total = (Number(store.total) || 0) + 1;
      if (!Array.isArray(store.items)) store.items = [];
      store.items.unshift({
        id: bookingId,
        service: 'rooms',
        timestamp: nowIso,
        phone: formattedPhone,
        hotelName,
        totalAmount: calculatedAmount,
      });
      if (store.items.length > 500) store.items = store.items.slice(0, 500);
      fs.writeFileSync(NOTIF_FILE, JSON.stringify(store, null, 2));

      // Sync to Supabase live_updates for instant Realtime notification
      try {
        const { data: currentSb } = await supabase
          .from('live_updates')
          .select('value')
          .eq('module', 'launch_waitlist')
          .maybeSingle();

        let sbStore: any = { total: 0, cabs: 0, rooms: 0, items: [] };
        if (currentSb?.value) {
          sbStore = typeof currentSb.value === 'string' ? JSON.parse(currentSb.value) : currentSb.value;
        }
        sbStore.rooms = (Number(sbStore.rooms) || 0) + 1;
        sbStore.total = (Number(sbStore.total) || 0) + 1;
        if (!Array.isArray(sbStore.items)) sbStore.items = [];
        sbStore.items.unshift({
          id: bookingId,
          service: 'rooms',
          timestamp: nowIso,
          phone: formattedPhone,
          hotelName,
          totalAmount: calculatedAmount,
        });
        if (sbStore.items.length > 100) sbStore.items = sbStore.items.slice(0, 100);

        const { error: waitlistErr } = await supabase
          .from('live_updates')
          .update({
            value: JSON.stringify(sbStore),
            updated_at: nowIso
          })
          .eq('module', 'launch_waitlist');

        if (waitlistErr) {
          console.warn('Supabase waitlist update notice:', waitlistErr.message);
        }
      } catch (sbErr) {
        console.warn('Supabase waitlist sync notice:', sbErr);
      }
    } catch (e) {
      console.warn('Failed to update notifications store:', e);
    }

    // 3. Secure Supabase hotel_bookings persistence
    try {
      const { error: insertError } = await supabase
        .from('hotel_bookings')
        .insert([bookingRecord]);
      if (insertError) {
        if (insertError.message?.includes('communication_language')) {
          const { communication_language, ...recordWithoutLang } = bookingRecord;
          await supabase.from('hotel_bookings').insert([recordWithoutLang]);
        } else {
          console.warn('Supabase hotel_bookings notice:', insertError.message);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase hotel_bookings table notice (non-fatal):', dbErr);
    }

    // 3b. 100% persistent cloud backup in live_updates table (never wiped by Vercel cold starts)
    try {
      const { error: luInsertErr } = await supabase.from('live_updates').insert([
        {
          city_id: 'fe00af26-47fd-4a92-a988-8c0c9565709f',
          module: 'hotel_booking',
          title: `Booking: ${trimmedName}`,
          value: JSON.stringify(bookingRecord),
          badge: 'NEW',
          is_active: true,
          updated_at: nowIso
        }
      ]);
      if (luInsertErr) {
        console.warn('live_updates insert notice:', luInsertErr.message);
      }
    } catch (luErr) {
      console.warn('live_updates backup sync notice:', luErr);
    }

    // 4. Build WhatsApp coordinate message
    const cabText = cabPreference === 'yes' ? 'Yes, Cab needed' : cabPreference === 'contact' ? 'Discuss cab options' : 'No cab (Room only)';
    const message = 
      `*New Pilgrim Stay Request - Saarthi*\n` +
      `-----------------------------------\n` +
      `• *Ref ID:* ${bookingId}\n` +
      `• *Guest:* ${trimmedName}\n` +
      `• *Phone:* ${formattedPhone}\n` +
      `• *Language:* ${communicationLanguage || 'Telugu'}\n` +
      `• *Check-in:* ${checkIn}\n` +
      `• *Check-out:* ${checkOut}\n` +
      `• *Pilgrims:* ${guestsCount} Pilgrim(s)\n` +
      `• *Budget:* ₹${budget} per room/night\n` +
      `• *Cab Preference:* ${cabText}\n` +
      (specialRequirements ? `• *Special Notes:* ${specialRequirements}\n` : '') +
      `-----------------------------------\n` +
      `_Submitted via Saarthi Pilgrim App. Team coordination required._`;

    const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,
      details: {
        bookingId,
        hotelName,
        guestName: trimmedName,
        guestPhone: formattedPhone,
        communicationLanguage: communicationLanguage || 'Telugu',
        checkIn,
        checkOut,
        guestsCount,
        budget,
        cabPreference,
        specialRequirements
      }
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process stay request.' },
      { status: 500 }
    );
  }
}

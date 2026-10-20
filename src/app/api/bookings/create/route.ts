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
      totalAmount = 799,
      whatsappPhone = '919876543210'
    } = body;

    if (!guestName || !guestPhone) {
      return NextResponse.json(
        { success: false, error: 'Guest name and phone number are required.' },
        { status: 400 }
      );
    }

    const bookingId = `SRTH-${Date.now().toString().slice(-6)}`;

    // 1. Record into launch-notifications.json for real-time room count
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
        timestamp: new Date().toISOString(),
        phone: guestPhone,
        hotelName,
        totalAmount,
      });
      if (store.items.length > 500) store.items = store.items.slice(0, 500);
      fs.writeFileSync(NOTIF_FILE, JSON.stringify(store, null, 2));

      // Sync to Supabase live_updates for instant Realtime notification
      try {
        const { data: currentSb } = await supabase
          .from('live_updates')
          .select('value')
          .eq('module', 'launch_waitlist')
          .single();

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
          timestamp: new Date().toISOString(),
          phone: guestPhone,
          hotelName,
          totalAmount,
        });
        if (sbStore.items.length > 100) sbStore.items = sbStore.items.slice(0, 100);

        await supabase
          .from('live_updates')
          .update({
            value: JSON.stringify(sbStore),
            updated_at: new Date().toISOString()
          })
          .eq('module', 'launch_waitlist');
      } catch (sbErr) {
        console.warn('Supabase waitlist sync notice:', sbErr);
      }
    } catch (e) {
      console.warn('Failed to update notifications store:', e);
    }

    // 2. Optional: attempt recording to Supabase hotel_bookings if table exists
    try {
      await supabase
        .from('hotel_bookings')
        .insert([
          {
            id: bookingId,
            hotel_id: hotelId,
            hotel_name: hotelName,
            guest_name: guestName,
            guest_phone: guestPhone,
            check_in: checkIn,
            check_out: checkOut,
            guests_count: guests,
            rooms_count: rooms,
            total_amount: totalAmount,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);
    } catch (dbErr) {
      // Graceful fallback - proceed without blocking guest
      console.warn('Supabase hotel_bookings table notice (non-fatal):', dbErr);
    }

    // Build WhatsApp URL
    const message = 
      `*New Booking Request - ${hotelName}*\n` +
      `-----------------------------------\n` +
      `• *Ref ID:* ${bookingId}\n` +
      `• *Guest:* ${guestName}\n` +
      `• *Phone:* ${guestPhone}\n` +
      `• *Check-in:* ${checkIn}\n` +
      `• *Check-out:* ${checkOut}\n` +
      `• *Rooms:* ${rooms} Room(s)\n` +
      `• *Guests:* ${guests} Guest(s)\n` +
      `• *Total Price:* ₹${totalAmount}\n` +
      `-----------------------------------\n` +
      `_Booked via Saarthi App. Please confirm room availability._`;

    const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,
      details: {
        hotelName,
        guestName,
        checkIn,
        checkOut,
        totalAmount
      }
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process booking.' },
      { status: 500 }
    );
  }
}

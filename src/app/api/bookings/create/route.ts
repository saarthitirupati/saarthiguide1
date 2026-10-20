import { NextResponse } from 'next/server';
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

    // Optional: attempt recording to Supabase hotel_bookings if table exists
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

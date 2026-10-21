import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isAuthorized(req: Request): boolean {
  // 1. Check custom hotel-auth header
  const authHeader = req.headers.get('x-hotel-auth') || req.headers.get('authorization');
  if (authHeader && (authHeader.includes('vamana') || authHeader.includes('saarthi_admin') || authHeader.includes('Bearer'))) {
    return true;
  }
  // 2. Check admin cookie
  const cookie = req.headers.get('cookie') || '';
  if (cookie.includes('hotel_auth=') || cookie.includes('saarthi_admin=')) {
    return true;
  }
  // Fallback for partner portal session token
  const partnerHeader = req.headers.get('x-partner-id');
  if (partnerHeader === 'vamana-inn-tirupati' || partnerHeader === 'hoteladmin') {
    return true;
  }
  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Partner authentication required.' }, { status: 401 });
  }

  try {
    const bookingsMap = new Map<string, any>();

    // 1. Try hotel_bookings table
    const { data: sbData, error: sbError } = await supabase
      .from('hotel_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!sbError && Array.isArray(sbData)) {
      for (const b of sbData) {
        if (b?.id) bookingsMap.set(b.id, b);
      }
    }

    // 2. Persistent live_updates cloud table (module = hotel_booking)
    const { data: luData, error: luError } = await supabase
      .from('live_updates')
      .select('*')
      .eq('module', 'hotel_booking')
      .order('updated_at', { ascending: false });

    if (!luError && Array.isArray(luData)) {
      for (const row of luData) {
        try {
          const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
          if (parsed?.id && !bookingsMap.has(parsed.id)) {
            bookingsMap.set(parsed.id, parsed);
          }
        } catch {}
      }
    }

    // 3. Fallback to launch_waitlist room reservations in live_updates
    const { data: waitlistRow } = await supabase
      .from('live_updates')
      .select('value')
      .eq('module', 'launch_waitlist')
      .maybeSingle();

    if (waitlistRow?.value) {
      try {
        const parsed = typeof waitlistRow.value === 'string' ? JSON.parse(waitlistRow.value) : waitlistRow.value;
        const roomItems = (parsed.items || [])
          .filter((item: any) => item.service === 'rooms' && item.hotelName);

        for (const item of roomItems) {
          if (item?.id && !bookingsMap.has(item.id)) {
            bookingsMap.set(item.id, {
              id: item.id,
              hotel_id: 'vamana-inn-tirupati',
              hotel_name: item.hotelName || 'Hotel Vamana Inn & Partner Stays',
              guest_name: item.guest_name || item.name || 'Pilgrim Guest',
              guest_phone: item.phone || '',
              check_in: item.check_in || new Date().toISOString().slice(0, 10),
              check_out: item.check_out || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
              guests_count: item.guests_count || 2,
              rooms_count: item.rooms_count || 1,
              budget_per_night: item.totalAmount || 2500,
              cab_preference: 'yes',
              status: item.status || 'new',
              created_at: item.timestamp || new Date().toISOString()
            });
          }
        }
      } catch {}
    }

    const merged = Array.from(bookingsMap.values()).sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, bookings: merged, count: merged.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, adminNotes, agreedPrice } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Booking ID and status are required.' }, { status: 400 });
    }

    const validStatuses = ['new', 'contacted', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid booking status.' }, { status: 400 });
    }

    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString()
    };
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    if (agreedPrice !== undefined) updatePayload.total_amount = Number(agreedPrice);

    // 1. Update in hotel_bookings table
    try {
      await supabase
        .from('hotel_bookings')
        .update(updatePayload)
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase hotel_bookings update notice:', e);
    }

    // 2. Update in live_updates cloud table
    try {
      const { data: existingRows } = await supabase
        .from('live_updates')
        .select('id, value')
        .eq('module', 'hotel_booking');

      if (existingRows && existingRows.length > 0) {
        for (const row of existingRows) {
          try {
            const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
            if (parsed && parsed.id === id) {
              const updatedVal = { ...parsed, ...updatePayload };
              await supabase
                .from('live_updates')
                .update({
                  value: JSON.stringify(updatedVal),
                  badge: status.toUpperCase(),
                  updated_at: new Date().toISOString()
                })
                .eq('id', row.id);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Supabase live_updates update notice:', e);
    }

    return NextResponse.json({ success: true, updated: { id, ...updatePayload } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

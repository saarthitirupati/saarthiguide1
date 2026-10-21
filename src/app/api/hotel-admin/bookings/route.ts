import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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
    // 1. Try Supabase first
    const { data: sbData, error: sbError } = await supabase
      .from('hotel_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!sbError && sbData && sbData.length > 0) {
      return NextResponse.json({ success: true, bookings: sbData, source: 'supabase' });
    }

    // 2. Fallback to local JSON store
    const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'hotel-bookings.json');
    if (fs.existsSync(BOOKINGS_FILE)) {
      try {
        const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
        const bookings = JSON.parse(fileContent);
        if (Array.isArray(bookings)) {
          return NextResponse.json({ success: true, bookings, source: 'local_file' });
        }
      } catch (e) {
        console.warn('Failed to parse local bookings file:', e);
      }
    }

    return NextResponse.json({ success: true, bookings: [], source: 'empty' });
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

    // 1. Update in local file store
    try {
      const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'hotel-bookings.json');
      if (fs.existsSync(BOOKINGS_FILE)) {
        const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
        let bookings = JSON.parse(fileContent);
        if (Array.isArray(bookings)) {
          bookings = bookings.map((b: any) => (b.id === id ? { ...b, ...updatePayload } : b));
          fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
        }
      }
    } catch (e) {
      console.warn('Failed to update local bookings file:', e);
    }

    // 2. Update in Supabase
    try {
      await supabase
        .from('hotel_bookings')
        .update(updatePayload)
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase update notice:', e);
    }

    return NextResponse.json({ success: true, updated: { id, ...updatePayload } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

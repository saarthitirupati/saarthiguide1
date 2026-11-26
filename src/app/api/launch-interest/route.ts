import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTIF_FILE = path.join(DATA_DIR, 'launch-notifications.json');

export type LeadStatus = 'pending' | 'not_lifted' | 'callback' | 'contacted' | 'yes' | 'no' | 'booked';

interface LaunchNotificationItem {
  id: string;
  service: 'cabs' | 'rooms';
  timestamp: string;
  name?: string;
  phone?: string;
  email?: string;
  leadStatus?: LeadStatus;
  checkIn?: string;
  checkOut?: string;
  budget?: string;
  note?: string;
}

interface LaunchNotificationStore {
  total: number;
  cabs: number;
  rooms: number;
  items: LaunchNotificationItem[];
}

function getStore(): LaunchNotificationStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(NOTIF_FILE)) {
      const initial: LaunchNotificationStore = { total: 0, cabs: 0, rooms: 0, items: [] };
      fs.writeFileSync(NOTIF_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(NOTIF_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      total: Number(parsed.total) || 0,
      cabs: Number(parsed.cabs) || 0,
      rooms: Number(parsed.rooms) || 0,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch (e) {
    console.error('Error reading launch notifications store:', e);
    return { total: 0, cabs: 0, rooms: 0, items: [] };
  }
}

function saveStore(store: LaunchNotificationStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('Error saving launch notifications store:', e);
  }
}

async function getSupabaseStore(): Promise<{ store: LaunchNotificationStore; rowId?: string } | null> {
  try {
    const { data, error } = await supabase
      .from('live_updates')
      .select('id, value, updated_at')
      .eq('module', 'launch_waitlist')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (!error && Array.isArray(data) && data.length > 0) {
      const mergedMap = new Map<string, LaunchNotificationItem>();
      let maxCabs = 0;
      let maxRooms = 0;
      let maxTotal = 0;

      for (const row of data) {
        if (!row?.value) continue;
        try {
          const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
          maxCabs = Math.max(maxCabs, Number(parsed.cabs) || 0);
          maxRooms = Math.max(maxRooms, Number(parsed.rooms) || 0);
          maxTotal = Math.max(maxTotal, Number(parsed.total) || 0);
          if (Array.isArray(parsed.items)) {
            for (const item of parsed.items) {
              if (item?.id && !mergedMap.has(item.id)) {
                mergedMap.set(item.id, item);
              }
            }
          }
        } catch {}
      }

      const items = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const roomItemCount = items.filter((i) => i.service === 'rooms').length;
      const cabItemCount = items.filter((i) => i.service === 'cabs').length;

      return {
        rowId: data[0].id,
        store: {
          total: Math.max(maxTotal, items.length),
          cabs: Math.max(maxCabs, cabItemCount),
          rooms: Math.max(maxRooms, roomItemCount),
          items,
        },
      };
    }
  } catch (e) {
    console.warn('Supabase waitlist fetch notice:', e);
  }
  return null;
}

async function saveSupabaseStore(store: LaunchNotificationStore, rowId?: string) {
  try {
    const payload = JSON.stringify({
      total: store.total,
      cabs: store.cabs,
      rooms: store.rooms,
      items: store.items.slice(0, 500),
      updatedAt: new Date().toISOString()
    });

    const query = rowId
      ? supabase.from('live_updates').update({ value: payload, updated_at: new Date().toISOString() }).eq('id', rowId)
      : supabase.from('live_updates').update({ value: payload, updated_at: new Date().toISOString() }).eq('module', 'launch_waitlist');

    const { data, error } = await query.select('id');

    if (error || !data || data.length === 0) {
      await supabase.from('live_updates').insert([{
        city_id: 'fe00af26-47fd-4a92-a988-8c0c9565709f',
        module: 'launch_waitlist',
        title: 'Real-Time Cabs & Room Booking Demand',
        value: payload,
        badge: 'ACTIVE',
        is_active: true
      }]);
    }
  } catch (e) {
    console.warn('Supabase waitlist update notice:', e);
  }
}

export async function GET() {
  const sbResult = await getSupabaseStore();
  const fileStore = getStore();
  const store = sbResult?.store || fileStore;

  return NextResponse.json({
    success: true,
    total: store.total,
    cabs: store.cabs,
    rooms: store.rooms,
    recent: store.items.slice(0, 500),
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const service: 'cabs' | 'rooms' = body?.service === 'rooms' ? 'rooms' : 'cabs';
    const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : undefined;
    const phone = typeof body?.phone === 'string' ? body.phone.slice(0, 30) : undefined;
    const email = typeof body?.email === 'string' ? body.email.slice(0, 80) : undefined;

    const sbResult = await getSupabaseStore();
    const store = sbResult?.store || getStore();

    const item: LaunchNotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      service,
      timestamp: new Date().toISOString(),
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
    };

    store.items.unshift(item);
    // Keep max 500 records
    if (store.items.length > 500) {
      store.items = store.items.slice(0, 500);
    }
    store.total = (store.total || 0) + 1;
    if (service === 'cabs') {
      store.cabs = (store.cabs || 0) + 1;
    } else {
      store.rooms = (store.rooms || 0) + 1;
    }

    // Persist to Supabase (broadcasts Realtime update) and local store
    await saveSupabaseStore(store, sbResult?.rowId);
    saveStore(store);

    return NextResponse.json({
      success: true,
      message: 'Notification preference saved successfully',
      service,
      counts: {
        total: store.total,
        cabs: store.cabs,
        rooms: store.rooms,
      }
    });
  } catch (error: any) {
    console.error('Launch interest POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record preference' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    if (!cookie.includes('saarthi_hotel_admin=') && !cookie.includes('saarthi_admin=')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetService = searchParams.get('service') === 'cabs' ? 'cabs' : 'rooms';

    const sbResult = await getSupabaseStore();
    const store = sbResult?.store || getStore();

    store.items = store.items.filter((item) => item.service !== targetService);
    if (targetService === 'rooms') {
      store.rooms = 0;
    } else {
      store.cabs = 0;
    }
    store.total = (store.cabs || 0) + (store.rooms || 0);

    await saveSupabaseStore(store, sbResult?.rowId);
    saveStore(store);

    return NextResponse.json({
      success: true,
      message: `Cleared ${targetService} notify data`,
      counts: {
        total: store.total,
        cabs: store.cabs,
        rooms: store.rooms,
      }
    });
  } catch (error: any) {
    console.error('Launch interest DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear data' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    if (!cookie.includes('saarthi_hotel_admin=') && !cookie.includes('saarthi_admin=')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === 'string' ? body.id : '';
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    const sbResult = await getSupabaseStore();
    const store = sbResult?.store || getStore();

    const idx = store.items.findIndex((item) => item.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const validStatuses: LeadStatus[] = ['pending', 'not_lifted', 'callback', 'contacted', 'yes', 'no', 'booked'];
    const nextStatus = validStatuses.includes(body?.leadStatus) ? body.leadStatus : store.items[idx].leadStatus;

    store.items[idx] = {
      ...store.items[idx],
      ...(nextStatus ? { leadStatus: nextStatus } : {}),
      ...(typeof body?.checkIn === 'string' ? { checkIn: body.checkIn.slice(0, 20) } : {}),
      ...(typeof body?.checkOut === 'string' ? { checkOut: body.checkOut.slice(0, 20) } : {}),
      ...(typeof body?.budget === 'string' ? { budget: body.budget.slice(0, 40) } : {}),
      ...(typeof body?.note === 'string' ? { note: body.note.slice(0, 300) } : {}),
    };

    await saveSupabaseStore(store, sbResult?.rowId);
    saveStore(store);

    return NextResponse.json({
      success: true,
      item: store.items[idx],
    });
  } catch (error: any) {
    console.error('Launch interest PATCH error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}

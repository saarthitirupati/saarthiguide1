import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTIF_FILE = path.join(DATA_DIR, 'launch-notifications.json');

interface LaunchNotificationItem {
  id: string;
  service: 'cabs' | 'rooms';
  timestamp: string;
  phone?: string;
  email?: string;
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

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    success: true,
    total: store.total,
    cabs: store.cabs,
    rooms: store.rooms,
    recent: store.items.slice(0, 50),
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
    const phone = typeof body?.phone === 'string' ? body.phone.slice(0, 30) : undefined;
    const email = typeof body?.email === 'string' ? body.email.slice(0, 80) : undefined;

    const store = getStore();
    const item: LaunchNotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      service,
      timestamp: new Date().toISOString(),
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

    saveStore(store);

    // Optional non-fatal async save to Supabase
    try {
      await supabase.from('launch_waitlist').insert([{
        id: item.id,
        service: item.service,
        timestamp: item.timestamp,
        phone: item.phone || null,
        email: item.email || null,
      }]);
    } catch {
      // Non-blocking fallback
    }

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

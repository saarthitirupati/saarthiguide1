import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { notifyLiveStatusUpdates, notifySsdUpdates, pushNotifyAll } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const before = await readStatus();
    const updated = await updateStatus(body);

    // Guaranteed push notification to all devices on every admin Save
    const wait = updated.waitTime || 'Current queue active';
    const crowd = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
    const notice = updated.notice?.trim() ? ` • ${updated.notice.trim()}` : '';

    pushNotifyAll({
      title: 'Tirumala Live Status Updated',
      body: `Live update: Wait time is ${wait}${crowd}.${notice} Tap for darshan guide.`,
      url: '/alerts',
      tag: 'live-status-update',
      category: 'High Priority'
    }).catch((err: any) => {
      console.error('[PushNotify] Error broadcasting guaranteed Live Status update:', err);
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


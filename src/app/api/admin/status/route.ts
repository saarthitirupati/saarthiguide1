import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

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
    const { sendPush, pushTitle, pushBody, pushUrl, pushCategory, ...statusUpdates } = body;
    const before = await readStatus();
    const updated = await updateStatus(statusUpdates);

    const timestamp = Date.now();

    // Strict Notification Opt-In Guard: Every push dispatch requires body.sendPush === true
    if (sendPush === true) {
      const wait = updated.waitTime || 'Current queue active';
      const crowd = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
      const notice = updated.notice?.trim() ? ` • ${updated.notice.trim()}` : '';

      let defaultTitle = 'Tirumala Live Status Updated';
      if (body.notice && body.notice.trim() !== (before.notice || '').trim()) {
        defaultTitle = 'Tirumala Live Advisory';
      } else if (body.waitTime && body.waitTime !== before.waitTime) {
        defaultTitle = 'Darshan Wait Time Updated';
      } else if (body.crowdLevel && body.crowdLevel !== before.crowdLevel) {
        defaultTitle = 'Tirumala Crowd Level Updated';
      }

      const title = (typeof pushTitle === 'string' && pushTitle.trim())
        ? pushTitle.trim()
        : defaultTitle;
      const messageBody = (typeof pushBody === 'string' && pushBody.trim())
        ? pushBody.trim()
        : `Live update: Wait time is ${wait}${crowd}.${notice} Tap for darshan guide.`;
      const url = (typeof pushUrl === 'string' && (pushUrl.startsWith('/') || pushUrl.startsWith('https://')))
        ? pushUrl
        : '/alerts';
      const category = pushCategory || 'High Priority';

      await pushNotifyAll({
        title,
        body: messageBody,
        url,
        tag: `live-status-${timestamp}`,
        category
      }).catch((err: any) => {
        console.error('[PushNotify] Error broadcasting Live Status update:', err);
      });
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

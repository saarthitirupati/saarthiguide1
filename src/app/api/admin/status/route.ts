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

    // If SSD fields were updated, broadcast dedicated SSD alert; otherwise broadcast live status update
    const hasSsdUpdate = body.ssdTokenStatus !== undefined || body.ssdNextTokenTime !== undefined || body.ssdTokenSlots !== undefined;
    if (hasSsdUpdate) {
      const ssdTitle = updated.ssdTokenStatus === 'suspended'
        ? 'SSD Tokens Suspended (Brahmotsavam)'
        : updated.ssdTokenStatus === 'closed-for-day'
        ? 'Today’s SSD Token Quota Closed'
        : (updated.ssdTokenStatus === 'paused'
            ? 'SSD Offline Tokens Paused'
            : (updated.ssdTokenStatus === 'issuing'
                ? 'Free SSD Tokens Issuing Now'
                : `SSD Token Counters: Next at ${updated.ssdNextTokenTime || 'morning'}`));

      const ssdBody = updated.ssdNotice?.trim() || (updated.ssdTokenStatus === 'closed-for-day'
        ? `Offline SSD quota complete for today. Next token issuance: ${updated.ssdNextTokenTime || 'tomorrow morning'}.`
        : `Tirupati offline SSD counters updated. Next release: ${updated.ssdNextTokenTime || 'active'}.`);

      await pushNotifyAll({
        title: ssdTitle,
        body: ssdBody,
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
        category: 'High Priority'
      }).catch((err: any) => {
        console.error('[PushNotify] Error broadcasting SSD update from status route:', err);
      });
    } else {
      const wait = updated.waitTime || 'Current queue active';
      const crowd = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
      const notice = updated.notice?.trim() ? ` • ${updated.notice.trim()}` : '';

      await pushNotifyAll({
        title: 'Tirumala Live Status Updated',
        body: `Live update: Wait time is ${wait}${crowd}.${notice} Tap for darshan guide.`,
        url: '/alerts',
        tag: 'live-status-update',
        category: 'High Priority'
      }).catch((err: any) => {
        console.error('[PushNotify] Error broadcasting guaranteed Live Status update:', err);
      });
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


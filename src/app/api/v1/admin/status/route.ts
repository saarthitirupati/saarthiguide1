import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { notifyLiveStatusUpdates, notifySsdUpdates, pushNotifyAll } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const before = await readStatus();
    const updated = await updateStatus(body);

    const timestamp = Date.now();

    // 1. Guaranteed Live Status / Darshan update notification
    const wait = updated.waitTime || 'Current queue active';
    const crowd = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
    const notice = updated.notice?.trim() ? ` • ${updated.notice.trim()}` : '';

    let title = 'Tirumala Live Status Updated';
    if (body.notice && body.notice.trim() !== (before.notice || '').trim()) {
      title = 'Tirumala Live Advisory';
    } else if (body.waitTime && body.waitTime !== before.waitTime) {
      title = 'Darshan Wait Time Updated';
    } else if (body.crowdLevel && body.crowdLevel !== before.crowdLevel) {
      title = 'Tirumala Crowd Level Updated';
    }

    await pushNotifyAll({
      title,
      body: `Live update: Wait time is ${wait}${crowd}.${notice} Tap for darshan guide.`,
      url: '/alerts',
      tag: `live-status-${timestamp}`,
      category: 'High Priority'
    }).catch((err: any) => {
      console.error('[PushNotify] Error broadcasting guaranteed Live Status update:', err);
    });

    // 2. Guaranteed SSD push when SSD fields are changed
    const hasSsdUpdate = (body.ssdTokenStatus !== undefined && body.ssdTokenStatus !== before.ssdTokenStatus) ||
                         (body.ssdNextTokenTime !== undefined && body.ssdNextTokenTime !== before.ssdNextTokenTime) ||
                         (body.ssdNotice !== undefined && body.ssdNotice.trim() !== (before.ssdNotice || '').trim());

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
        tag: `ssd-status-${timestamp}`,
        category: 'High Priority'
      }).catch((err: any) => {
        console.error('[PushNotify] Error broadcasting SSD update from status route:', err);
      });
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating status in admin API:', e);
    return NextResponse.json({ error: e.message || 'Failed to update status' }, { status: 400 });
  }
}


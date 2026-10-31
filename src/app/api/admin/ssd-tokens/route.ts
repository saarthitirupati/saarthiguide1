import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';
import { formatSsdTokenNotification } from '@/lib/notificationFormatter';

export async function GET() {
  try {
    const status = await readStatus();
    
    // Find Divya Darshan (DD) entry if present
    const ddDarshan = status.darshans?.find(
      (d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath')
    );

    return NextResponse.json({
      ssdTokenStatus: status.ssdTokenStatus || 'closed-for-day',
      ssdNextTokenTime: status.ssdNextTokenTime || '',
      ssdTokenSlots: status.ssdTokenSlots || [],
      ssdNotice: status.ssdNotice || '',
      ssdTimingsGuide: status.ssdTimingsGuide || '',
      ssdTokenDetails: (status as any).ssdTokenDetails || null,
      ddTokenDetails: (status as any).ddTokenDetails || null,
      ssdCounters: status.ssdCounters || [],
      ssdAdvisoryTag: status.ssdAdvisoryTag || '',
      ssdModeBadge: status.ssdModeBadge || '',
      lastUpdated: status.lastUpdated,
      ddWaitTime: ddDarshan?.waitTime || '8-10 hours',
      darshans: status.darshans || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch SSD/DD token status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      ssdTokenStatus,
      ssdNextTokenTime,
      ssdNotice,
      ssdTimingsGuide,
      ssdAdvisoryTag,
      ssdModeBadge,
      ssdTokenDetails,
      ddTokenDetails,
      sendSsdPush = false,
      sendDdPush = false,
      sendToAll = true,
      scheduledAt,
      customNotification
    } = body;

    const updates: any = {};
    if (ssdTokenStatus !== undefined) updates.ssdTokenStatus = ssdTokenStatus;
    if (ssdNextTokenTime !== undefined) updates.ssdNextTokenTime = ssdNextTokenTime;
    if (ssdNotice !== undefined) updates.ssdNotice = ssdNotice;
    if (ssdTimingsGuide !== undefined) updates.ssdTimingsGuide = ssdTimingsGuide;
    if (ssdAdvisoryTag !== undefined) updates.ssdAdvisoryTag = ssdAdvisoryTag;
    if (ssdModeBadge !== undefined) updates.ssdModeBadge = ssdModeBadge;
    if (ssdTokenDetails !== undefined) updates.ssdTokenDetails = ssdTokenDetails;
    if (ddTokenDetails !== undefined) updates.ddTokenDetails = ddTokenDetails;

    const updated = await updateStatus(updates);

    // Strict Notification Opt-In Guard: accept strictly boolean literal `true`
    let pushResultData: any = null;
    const isSsdPush = sendSsdPush === true;
    const isDdPush = sendDdPush === true;
    const shouldSendPush = isSsdPush || isDdPush;

    if (shouldSendPush) {
      let pushType = 'SSD + DD';
      if (isSsdPush && !isDdPush) pushType = 'SSD';
      else if (!isSsdPush && isDdPush) pushType = 'DD';

      const fallback = formatSsdTokenNotification({
        status: (ssdTokenStatus || 'closed-for-day') as any,
        ssdStatus: ssdTokenDetails?.status,
        ddStatus: ddTokenDetails?.status,
        ssdAvailable: ssdTokenDetails?.tokensLeft || '0',
        ddAvailable: ddTokenDetails?.tokensLeft || '0',
        nextBatchTime: ssdNextTokenTime,
        customNotice: ssdNotice,
        language: 'en'
      });

      const finalTitle = customNotification?.title?.trim() || fallback.title;
      const finalBody = customNotification?.body?.trim() || fallback.body;

      const dispatchResult = await pushNotifyAll({
        title: finalTitle,
        body: finalBody,
        url: '/darshan/ssd-token',
        tag: `ssd-dd-status-${Date.now()}`,
        category: 'High Priority'
      });

      const hasDelivered = Boolean(
        dispatchResult &&
        dispatchResult.success &&
        'fcm' in dispatchResult &&
        (((dispatchResult.fcm?.delivered ?? 0) > 0) || ((dispatchResult.web?.delivered ?? 0) > 0) || ((dispatchResult.web?.total ?? 0) > 0))
      );

      pushResultData = {
        status: hasDelivered ? 'Sent' : (dispatchResult?.success ? 'Sent' : 'Failed'),
        type: pushType,
        message: finalTitle,
        sentTo: sendToAll ? 'All Users' : 'Subscribers',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
        details: dispatchResult
      };
    }

    return NextResponse.json({
      success: true,
      pushSent: shouldSendPush,
      notification: pushResultData,
      ssdTokenStatus: updated.ssdTokenStatus,
      ssdNextTokenTime: updated.ssdNextTokenTime,
      ssdNotice: updated.ssdNotice,
      ssdTimingsGuide: updated.ssdTimingsGuide,
      ssdAdvisoryTag: updated.ssdAdvisoryTag,
      ssdModeBadge: updated.ssdModeBadge,
      lastUpdated: updated.lastUpdated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update SSD/DD token status' }, { status: 400 });
  }
}

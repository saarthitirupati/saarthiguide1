import { NextResponse } from 'next/server';
import { fetchLiveAlerts, saveLiveAlert, deleteLiveAlert } from '@/lib/alertsStore';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const alerts = await fetchLiveAlerts(showAll);
    return NextResponse.json(alerts, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=10',
      },
    });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts GET):', error);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=5',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const createdAlert = await saveLiveAlert(body);

    const shouldSendPush = body.sendPush === true;
    let pushResultData: any = null;
    if (shouldSendPush && createdAlert && createdAlert.status === 'Published') {
      try {
        const dispatchResult: any = await pushNotifyAll({
          title: createdAlert.title ? createdAlert.title : 'Tirumala Operational Alert',
          body: createdAlert.description || (createdAlert as any).message || '',
          url: '/alerts',
          tag: `alert-${createdAlert.id || 'live'}`,
          target_location: createdAlert.target_location || 'All Users',
          category: createdAlert.category || 'High Priority',
          image: createdAlert.image || undefined
        });

        const fcmSent = dispatchResult?.fcm?.delivered ?? 0;
        const webSent = dispatchResult?.web?.delivered ?? 0;
        const totalDelivered = fcmSent + webSent;
        const totalTargets = (dispatchResult?.fcm?.total ?? 0) + (dispatchResult?.web?.total ?? 0);

        pushResultData = {
          sent: totalDelivered > 0 ? totalDelivered : totalTargets,
          delivered: totalDelivered,
          targets: totalTargets,
          status: dispatchResult?.success ? 'Sent' : 'Failed',
          details: dispatchResult
        };
      } catch (err: any) {
        console.error('[PushNotify] Error broadcasting live alert:', err);
        pushResultData = { status: 'Failed', error: err?.message };
      }
    }

    return NextResponse.json({
      ...createdAlert,
      pushSent: shouldSendPush,
      notification: pushResultData
    }, { status: 201 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts POST):', error);
    return NextResponse.json({ error: error?.message || 'Failed to create alert' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
    }

    const updatedAlert = await saveLiveAlert(body);

    const shouldSendPush = body.sendPush === true;
    let pushResultData: any = null;
    if (shouldSendPush && updatedAlert && updatedAlert.status === 'Published') {
      try {
        const dispatchResult: any = await pushNotifyAll({
          title: updatedAlert.title ? updatedAlert.title : 'Tirumala Operational Alert',
          body: updatedAlert.description || (updatedAlert as any).message || '',
          url: '/alerts',
          tag: `alert-${updatedAlert.id || 'live'}`,
          target_location: updatedAlert.target_location || 'All Users',
          category: updatedAlert.category || 'High Priority',
          image: updatedAlert.image || undefined
        });

        const fcmSent = dispatchResult?.fcm?.delivered ?? 0;
        const webSent = dispatchResult?.web?.delivered ?? 0;
        const totalDelivered = fcmSent + webSent;
        const totalTargets = (dispatchResult?.fcm?.total ?? 0) + (dispatchResult?.web?.total ?? 0);

        pushResultData = {
          sent: totalDelivered > 0 ? totalDelivered : totalTargets,
          delivered: totalDelivered,
          targets: totalTargets,
          status: dispatchResult?.success ? 'Sent' : 'Failed',
          details: dispatchResult
        };
      } catch (err: any) {
        console.error('[PushNotify] Error broadcasting updated alert:', err);
        pushResultData = { status: 'Failed', error: err?.message };
      }
    }

    return NextResponse.json({
      ...updatedAlert,
      pushSent: shouldSendPush,
      notification: pushResultData
    }, { status: 200 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts PUT):', error);
    return NextResponse.json({ error: error?.message || 'Failed to update alert' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });

    await deleteLiveAlert(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete alert' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAuthorizedAdmin } from '@/lib/authGuard';

export async function GET(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const [subsRes, devRes] = await Promise.allSettled([
      supabase.from('push_subscriptions').select('endpoint'),
      supabase.from('user_devices').select('device_id, fcm_token').eq('is_active', true).not('fcm_token', 'is', null)
    ]);

    const subs = subsRes.status === 'fulfilled' && subsRes.value.data ? subsRes.value.data : [];
    const devices = devRes.status === 'fulfilled' && devRes.value.data ? devRes.value.data : [];

    const uniqueFcm = new Set<string>();
    let webCount = 0;

    for (const s of subs) {
      if (s.endpoint.startsWith('https://fcm.googleapis.com/fcm/native/')) {
        const token = s.endpoint.replace('https://fcm.googleapis.com/fcm/native/', '').trim();
        if (token.length > 20) uniqueFcm.add(token);
      } else {
        webCount++;
      }
    }

    for (const d of devices) {
      const token = d.fcm_token?.trim();
      if (token && token.length > 20) uniqueFcm.add(token);
    }

    const totalCount = webCount + uniqueFcm.size;
    return NextResponse.json({ count: totalCount, web: webCount, android: uniqueFcm.size });
  } catch (err: any) {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const sub = await req.json();
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Check if this is a new subscriber before upsert
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('endpoint')
      .eq('endpoint', sub.endpoint)
      .maybeSingle();

    await supabase.from('push_subscriptions').upsert(
      {
        endpoint: sub.endpoint,
        keys_p256dh: sub.keys.p256dh,
        keys_auth: sub.keys.auth,
        last_seen_at: now,
        // Only set subscribed_at on first insert — ignored on conflict update
        ...(existing ? {} : { subscribed_at: now }),
      },
      { onConflict: 'endpoint' }
    );

    // Fire welcome notification for brand-new subscribers only
    if (!existing && process.env.CRON_SECRET) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.saarthiguide.in';
      fetch(`${siteUrl}/api/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': process.env.CRON_SECRET,
        },
        body: JSON.stringify({ type: 'welcome', endpoint: sub.endpoint }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (endpoint) {
      await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}

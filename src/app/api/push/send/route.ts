import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { supabase } from '@/lib/supabase';
import {
  buildDailySpotNotification,
  buildFestivalReminder,
  buildWeekendSuggestion,
  buildReEngagementNotification,
  buildWelcomeNotification,
  type NotificationPayload,
} from '@/lib/notifications';

function buildPayload(type: string, daysSince?: number): NotificationPayload | null {
  switch (type) {
    case 'daily_spot':   return buildDailySpotNotification();
    case 'festival':     return buildFestivalReminder();
    case 'weekend':      return buildWeekendSuggestion();
    case 'reengagement': return buildReEngagementNotification(daysSince ?? 3);
    case 'welcome':      return buildWelcomeNotification();
    default:             return null;
  }
}

export async function POST(req: Request) {
  // Validate cron secret
  if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Init VAPID at request time (env vars not available at build time)
  webpush.setVapidDetails(
    'mailto:admin@saarthiguide.in',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  const { type, endpoint, daysSince } = await req.json();
  const payload = buildPayload(type, daysSince);
  if (!payload) return NextResponse.json({ ok: true, sent: 0 });

  // Fetch subscriptions — specific endpoint or all; re-engagement filters by inactivity
  let query = supabase
    .from('push_subscriptions')
    .select('endpoint, keys_p256dh, keys_auth');

  if (endpoint) {
    query = query.eq('endpoint', endpoint);
  } else if (type === 'reengagement') {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (daysSince ?? 3));
    query = query.lt('last_seen_at', cutoff.toISOString());
  }

  const { data: subs } = await query;
  if (!subs?.length) return NextResponse.json({ ok: true, sent: 0 });

  const dead: string[] = [];
  let sent = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
          JSON.stringify(payload),
        );
        sent++;
      } catch (err: any) {
        // 404/410 = subscription expired — remove it
        if (err?.statusCode === 410 || err?.statusCode === 404) dead.push(sub.endpoint);
      }
    })
  );

  // Prune dead subscriptions in one query
  if (dead.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', dead);
  }

  return NextResponse.json({ ok: true, sent, pruned: dead.length });
}

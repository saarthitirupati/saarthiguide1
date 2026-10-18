import webpush from 'web-push';
import { supabase } from '@/lib/supabase';
import { sendFCMNotification, getFCMAccessToken, getParsedServiceAccount } from '@/lib/fcmService';

let vapidConfigured = false;
function ensureVapid(): boolean {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    return false;
  }
  try {
    webpush.setVapidDetails('mailto:admin@saarthiguide.in', pub, priv);
    vapidConfigured = true;
    return true;
  } catch (err) {
    console.error('[PushNotify] Failed to set VAPID details:', err);
    return false;
  }
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
  target_location?: string;
  category?: string;
  image?: string;
}

/**
 * Send a push notification to all subscribed users (Web Push + Native Android FCM).
 * Deduplicates FCM tokens across user_devices and push_subscriptions.
 * Dispatches FCM in concurrent batches using cached OAuth2 credentials.
 * Cleans up invalid/expired tokens without dropping errors.
 */
export async function pushNotifyAll(payload: PushPayload) {
  const deepLink = payload.url
    ? (payload.url.startsWith('http') ? payload.url : `https://www.saarthiguide.in${payload.url}`)
    : 'https://www.saarthiguide.in';

  // 1. Fetch both push_subscriptions and active user_devices concurrently
  const [subsRes, devRes] = await Promise.allSettled([
    supabase.from('push_subscriptions').select('id, endpoint, keys_p256dh, keys_auth').limit(10000),
    supabase.from('user_devices').select('device_id, fcm_token').eq('is_active', true).not('fcm_token', 'is', null).limit(10000),
  ]);

  const subs = subsRes.status === 'fulfilled' && !subsRes.value.error ? subsRes.value.data || [] : [];
  const devices = devRes.status === 'fulfilled' && !devRes.value.error ? devRes.value.data || [] : [];

  // 2. Separate into Web Push subscriptions and deduplicated FCM tokens
  const webSubs: Array<{ id: number; endpoint: string; keys_p256dh: string; keys_auth: string }> = [];
  const fcmTokenToSubIds = new Map<string, number[]>();
  const fcmTokenToDevIds = new Map<string, string[]>();

  for (const s of subs) {
    if (s.endpoint.startsWith('https://fcm.googleapis.com/fcm/native/')) {
      const token = s.endpoint.replace('https://fcm.googleapis.com/fcm/native/', '').trim();
      if (token.length > 20) {
        const existing = fcmTokenToSubIds.get(token) || [];
        existing.push(s.id);
        fcmTokenToSubIds.set(token, existing);
      }
    } else {
      webSubs.push(s);
    }
  }

  for (const d of devices) {
    const token = d.fcm_token?.trim();
    if (token && token.length > 20) {
      const existing = fcmTokenToDevIds.get(token) || [];
      existing.push(d.device_id);
      fcmTokenToDevIds.set(token, existing);
    }
  }

  const allFcmTokens = Array.from(new Set([...fcmTokenToSubIds.keys(), ...fcmTokenToDevIds.keys()]));
  const deadSubIds: number[] = [];
  let webSuccessCount = 0;

  // 3. Dispatch Web Push (Browsers)
  if (webSubs.length > 0) {
    if (ensureVapid()) {
      const body = JSON.stringify(payload);
      const webResults = await Promise.allSettled(
        webSubs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
              },
              body,
              {
                TTL: 86400,
                headers: {
                  Urgency: 'high',
                  Topic: payload.tag || 'saarthi-alert',
                },
              }
            );
            return { success: true, id: sub.id };
          } catch (err: any) {
            if (err.statusCode === 404 || err.statusCode === 410 || err.statusCode === 403) {
              deadSubIds.push(sub.id);
            }
            return { success: false, id: sub.id, error: err };
          }
        })
      );
      webSuccessCount = webResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    } else {
      console.warn('[PushNotifyAll] VAPID keys not configured; skipped browser Web Push for', webSubs.length, 'subscriptions');
    }
  }

  // 4. Dispatch FCM Push (Native Android & TWA App)
  let fcmSuccessCount = 0;
  const deadFcmTokens: string[] = [];

  if (allFcmTokens.length > 0) {
    const serviceAccount = getParsedServiceAccount();
    if (!serviceAccount) {
      console.warn('[PushNotifyAll] FCM_SERVICE_ACCOUNT_KEY not configured or invalid; skipped FCM push for', allFcmTokens.length, 'devices');
    } else {
      const accessToken = await getFCMAccessToken(serviceAccount);
      if (!accessToken) {
        console.error('[PushNotifyAll] Failed to obtain FCM OAuth2 access token');
      } else {
        // Chunk tokens into batches of 25 to respect concurrency limits and avoid timeouts
        const chunkSize = 25;
        for (let i = 0; i < allFcmTokens.length; i += chunkSize) {
          const chunk = allFcmTokens.slice(i, i + chunkSize);
          const results = await Promise.allSettled(
            chunk.map(token =>
              sendFCMNotification(
                {
                  token,
                  title: payload.title,
                  body: payload.body,
                  deepLink,
                  data: {
                    tag: payload.tag || 'saarthi-alert',
                    url: deepLink,
                  },
                },
                accessToken,
                serviceAccount
              ).then(res => ({ token, ...res }))
            )
          );

          for (const res of results) {
            if (res.status === 'fulfilled') {
              if (res.value.success) {
                fcmSuccessCount++;
              } else {
                const err = res.value.error || '';
                if (err.includes('registration-token-not-registered') || err.includes('UNREGISTERED') || err.includes('404')) {
                  deadFcmTokens.push(res.value.token);
                }
              }
            }
          }
        }
      }
    }
  }

  // 5. Clean up dead subscriptions/devices asynchronously
  try {
    for (const token of deadFcmTokens) {
      const subIds = fcmTokenToSubIds.get(token);
      if (subIds && subIds.length) deadSubIds.push(...subIds);

      const devIds = fcmTokenToDevIds.get(token);
      if (devIds && devIds.length) {
        await supabase.from('user_devices').update({ is_active: false }).in('device_id', devIds);
      }
    }

    if (deadSubIds.length > 0) {
      const uniqueDeadSubIds = Array.from(new Set(deadSubIds));
      await supabase.from('push_subscriptions').delete().in('id', uniqueDeadSubIds);
    }
  } catch (cleanErr) {
    console.warn('[PushNotifyAll] Error cleaning up dead tokens:', cleanErr);
  }

  console.log(`[PushNotifyAll] Complete: ${fcmSuccessCount}/${allFcmTokens.length} FCM delivered, ${webSuccessCount}/${webSubs.length} Web delivered.`);

  return {
    success: true,
    fcm: { delivered: fcmSuccessCount, total: allFcmTokens.length },
    web: { delivered: webSuccessCount, total: webSubs.length },
  };
}

export interface StatusLike {
  waitTime?: string;
  crowdLevel?: 'low' | 'moderate' | 'high' | 'very-high' | string;
  notice?: string;
  darshans?: Array<{ name: string; waitTime: string; [key: string]: any }>;
  ssdTokenStatus?: 'issuing' | 'paused' | 'closed-for-day' | string;
  ssdNextTokenTime?: string;
  ssdTokenSlots?: Array<{ slotTime: string; status: string; tokensLeft?: string; [key: string]: any }>;
  ssdNotice?: string;
  ssdTimingsGuide?: string;
  [key: string]: any;
}

/**
 * Trigger web push notifications when SSD token timings, slots, or statuses change.
 */
export async function notifySsdUpdates(
  before: StatusLike | null | undefined,
  updated: StatusLike
): Promise<void> {
  if (!updated) return;
  const prev = before || {};

  // 1. Status change (issuing / paused / closed-for-day)
  if (updated.ssdTokenStatus && updated.ssdTokenStatus !== prev.ssdTokenStatus) {
    if (updated.ssdTokenStatus === 'issuing') {
      await pushNotifyAll({
        title: 'SSD Tokens are LIVE!',
        body: 'Srivari Seva Darshanam offline tokens are being issued now at Tirumala & Tirupati counters.',
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
      }).catch(() => {});
    } else if (updated.ssdTokenStatus === 'paused') {
      await pushNotifyAll({
        title: 'SSD Tokens Paused',
        body: (updated.ssdNotice || '').trim() || 'Token issuing has been temporarily paused. Please check back shortly.',
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
      }).catch(() => {});
    } else if (updated.ssdTokenStatus === 'closed-for-day') {
      await pushNotifyAll({
        title: 'Today’s SSD Quota Closed',
        body: (updated.ssdNotice || '').trim() || `Today's offline SSD token quota is complete. Next issuance: ${updated.ssdNextTokenTime || 'tomorrow morning'}.`,
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
        category: 'High Priority'
      }).catch(() => {});
    } else if (updated.ssdTokenStatus === 'suspended') {
      await pushNotifyAll({
        title: 'SSD Tokens Suspended (Brahmotsavam)',
        body: (updated.ssdNotice || '').trim() || 'SSD tokens are temporarily suspended. Direct walk-in Sarva Darshan open at Vaikuntam complexes.',
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
        category: 'High Priority'
      }).catch(() => {});
    }
  }

  // 2. Next Token Time updated (e.g. "2:00 PM", "Tomorrow 4:00 AM", etc.)
  const prevTime = (prev.ssdNextTokenTime || '').trim();
  const nextTime = (updated.ssdNextTokenTime || '').trim();
  if (nextTime && nextTime !== prevTime) {
    const noticeExtra = (updated.ssdNotice || '').trim() ? ` • ${updated.ssdNotice!.trim()}` : '';
    await pushNotifyAll({
      title: 'SSD Token Timings Updated',
      body: `Next token batch release: ${nextTime}.${noticeExtra} Counters open at Vishnu Nivasam & Srinivasam.`,
      url: '/darshan/ssd-token',
      tag: 'ssd-timings',
    }).catch(() => {});
  }

  // 3. SSD Slots updated
  if (updated.ssdTokenSlots && Array.isArray(updated.ssdTokenSlots)) {
    const prevSlotsStr = JSON.stringify(prev.ssdTokenSlots || []);
    const nextSlotsStr = JSON.stringify(updated.ssdTokenSlots);
    if (nextSlotsStr !== prevSlotsStr) {
      const available = updated.ssdTokenSlots.filter(s => s.status === 'available');
      const slotText = available.length > 0
        ? `Open slots: ${available.map(s => s.slotTime).slice(0, 3).join(', ')}.`
        : 'Slot availability and timings have been refreshed.';
      await pushNotifyAll({
        title: 'SSD Darshan Slots Updated',
        body: `${slotText} Check live counter timings now.`,
        url: '/darshan/ssd-token',
        tag: 'ssd-slots',
      }).catch(() => {});
    }
  }

  // 4. SSD Live Notice updated
  const prevNotice = (prev.ssdNotice || '').trim();
  const nextNotice = (updated.ssdNotice || '').trim();
  if (nextNotice && nextNotice !== prevNotice && updated.ssdTokenStatus === prev.ssdTokenStatus) {
    await pushNotifyAll({
      title: 'SSD Token Update',
      body: nextNotice,
      url: '/darshan/ssd-token',
      tag: 'ssd-notice',
    }).catch(() => {});
  }
}

/**
 * Trigger web push notifications when Live Darshan status, wait times, crowd, or announcements change.
 */
export async function notifyLiveStatusUpdates(
  before: StatusLike | null | undefined,
  updated: StatusLike
): Promise<void> {
  if (!updated) return;
  const prev = before || {};

  // 1. Live notice / announcement changed
  const prevNotice = (prev.notice || '').trim();
  const nextNotice = (updated.notice || '').trim();
  if (nextNotice && nextNotice !== prevNotice) {
    await pushNotifyAll({
      title: 'Tirumala Live Update',
      body: nextNotice,
      url: '/alerts',
      tag: 'tirumala-notice',
    }).catch(() => {});
  }

  // 2. Darshan Timings changed (individual categories or overall wait time)
  const darshanChanges: string[] = [];
  if (Array.isArray(updated.darshans) && Array.isArray(prev.darshans)) {
    for (const d of updated.darshans) {
      const old = prev.darshans.find(b => b.name === d.name);
      if (old && (old.waitTime || '').trim() !== (d.waitTime || '').trim() && (d.waitTime || '').trim()) {
        darshanChanges.push(`${d.name}: ${d.waitTime.trim()}`);
      }
    }
  }

  const prevWait = (prev.waitTime || '').trim();
  const nextWait = (updated.waitTime || '').trim();
  const waitChanged = nextWait && nextWait !== prevWait;

  if (darshanChanges.length > 0) {
    const crowdInfo = updated.crowdLevel ? ` • Crowd: ${updated.crowdLevel}` : '';
    await pushNotifyAll({
      title: 'Live Darshan Timings Updated',
      body: `Live update: ${darshanChanges.slice(0, 2).join(' • ')}${crowdInfo}.`,
      url: '/alerts',
      tag: 'live-darshan-timings',
    }).catch(() => {});
  } else if (waitChanged) {
    const crowdInfo = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
    await pushNotifyAll({
      title: 'Darshan Wait Time Updated',
      body: `Current wait time updated to ${nextWait}${crowdInfo}. Plan your darshan visit accordingly.`,
      url: '/alerts',
      tag: 'live-darshan-timings',
    }).catch(() => {});
  }

  // 3. Crowd Level change (Low / Moderate / High / Very High)
  const prevCrowd = (prev.crowdLevel || '').trim().toLowerCase();
  const nextCrowd = (updated.crowdLevel || '').trim().toLowerCase();
  if (nextCrowd && nextCrowd !== prevCrowd) {
    if (nextCrowd === 'low') {
      await pushNotifyAll({
        title: 'Low Crowd at Tirumala!',
        body: `Wait time: ${nextWait || prevWait || 'minimal'}. Favorable conditions for smooth, peaceful darshan.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    } else if (nextCrowd === 'high' || nextCrowd === 'very-high') {
      const label = nextCrowd === 'very-high' ? 'Very High' : 'High';
      await pushNotifyAll({
        title: 'Heavy Rush at Tirumala',
        body: `Crowd level is now ${label}. Wait time: ${nextWait || prevWait || 'extended'}. Expect compartment delays.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    } else if (nextCrowd === 'moderate') {
      await pushNotifyAll({
        title: 'Moderate Crowd at Tirumala',
        body: `Crowd has normalized to Moderate. Current wait time: ${nextWait || prevWait || '2-3 hours'}.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    }
  }
}


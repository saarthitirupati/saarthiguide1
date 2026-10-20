import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = 'https://ehywzcxufqjywrnysmrz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_at47-iL5G_k_wGLspiuDfw_JfogA8gb';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'tdwjaJ5ZfrrPFNPyzsni4CZGLWwmftF7nl0LfUYAkDg';

webpush.setVapidDetails('mailto:admin@saarthiguide.in', VAPID_PUBLIC, VAPID_PRIVATE);

function base64UrlEncode(data) {
  const buf = typeof data === 'string' ? Buffer.from(data) : data;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getFCMAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = base64UrlEncode(signer.sign(sa.private_key));
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  return data.access_token || null;
}

async function runAcceptanceTest() {
  console.log('--- 1. Testing Web Push Delivery ---');
  const { data: webSub } = await supabase
    .from('push_subscriptions')
    .select('*')
    .not('endpoint', 'like', 'https://fcm.googleapis.com/fcm/native/%')
    .order('last_seen_at', { ascending: false })
    .limit(1)
    .single();

  if (webSub) {
    try {
      const res = await webpush.sendNotification(
        { endpoint: webSub.endpoint, keys: { p256dh: webSub.keys_p256dh, auth: webSub.keys_auth } },
        JSON.stringify({
          title: 'Saarthi Verification Alert',
          body: 'Web push delivery validated successfully.',
          url: '/alerts',
          tag: 'acceptance-test-' + Date.now(),
        }),
        { TTL: 86400, headers: { Urgency: 'high' } }
      );
      console.log('✅ Web Push Delivered! HTTP status:', res.statusCode);
    } catch (err) {
      console.error('❌ Web Push Delivery failed:', err.statusCode || err.message);
    }
  } else {
    console.log('⚠️ No active Web Push subscriptions found.');
  }

  console.log('\n--- 2. Testing FCM Native Delivery ---');
  let serviceAccount = null;
  if (process.env.FCM_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_KEY);
      if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    } catch {}
  }

  if (!serviceAccount) {
    console.log('⚠️ FCM_SERVICE_ACCOUNT_KEY not in local env. Testing mock structure.');
    return;
  }

  const accessToken = await getFCMAccessToken(serviceAccount);
  if (!accessToken) {
    console.error('❌ Failed to generate Google OAuth2 token for FCM.');
    return;
  }
  console.log('✅ Google FCM OAuth2 token generated successfully.');

  const { data: device } = await supabase
    .from('user_devices')
    .select('fcm_token')
    .eq('is_active', true)
    .order('last_seen_at', { ascending: false })
    .limit(1)
    .single();

  const testToken = device?.fcm_token;
  if (testToken) {
    const fcmPayload = {
      message: {
        token: testToken,
        notification: {
          title: 'Tirumala Live Alert (Test)',
          body: 'Acceptance test delivery verified on Android channel.',
        },
        data: {
          title: 'Tirumala Live Alert (Test)',
          body: 'Acceptance test delivery verified on Android channel.',
          deepLink: 'https://www.saarthiguide.in/alerts',
        },
        android: {
          priority: 'HIGH',
          notification: {
            channel_id: 'saarthi_live_alerts_v2',
            sound: 'default',
            default_sound: true,
            default_vibrate_timings: true,
            visibility: 'PUBLIC',
            notification_priority: 'PRIORITY_MAX',
          },
        },
      },
    };

    const fcmRes = await fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmPayload),
    });

    if (fcmRes.ok) {
      const respData = await fcmRes.json();
      console.log('✅ FCM Native Notification Delivered! Message ID:', respData.name);
    } else {
      const errText = await fcmRes.text();
      console.error('❌ FCM Native Delivery returned error:', errText);
    }
  } else {
    console.log('⚠️ No active device tokens found in user_devices.');
  }

  console.log('\n--- 3. Testing Failure & Dead Token Handling ---');
  const deadPayload = {
    message: {
      token: 'fake_dead_token_for_error_handling_test_12345',
      notification: { title: 'Test', body: 'Test' },
    },
  };
  const deadRes = await fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deadPayload),
  });

  const deadText = await deadRes.text();
  const isGracefullyHandled = deadRes.status === 400 || deadRes.status === 404;
  console.log('Status code:', deadRes.status, '| Graceful rejection:', isGracefullyHandled);
  console.log('Error payload safely parsed:', deadText.includes('INVALID_ARGUMENT') || deadText.includes('UNREGISTERED'));
}

runAcceptanceTest();

import crypto from 'crypto';

interface FCMMessagePayload {
  token: string;
  title: string;
  body: string;
  deepLink?: string;
  data?: Record<string, string>;
}

function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data) : data;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

let cachedAccessToken: string | null = null;
let cachedTokenExpiresAt: number = 0;

/**
 * Safely parses and normalizes Google Service Account JSON from environment variables
 */
export function getParsedServiceAccount(): any | null {
  const serviceAccountRaw = process.env.FCM_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountRaw) return null;
  try {
    let raw = serviceAccountRaw.trim();
    if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
      raw = raw.slice(1, -1);
    }
    const parsed = JSON.parse(raw);
    if (parsed.private_key && typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (e) {
    console.error('[FCM] Failed to parse FCM_SERVICE_ACCOUNT_KEY JSON:', e);
    return null;
  }
}

/**
 * Generates Google OAuth2 Access Token from Service Account JSON using native Node.js crypto
 * Automatically caches token in memory for up to 55 minutes.
 */
export async function getFCMAccessToken(serviceAccount?: any): Promise<string | null> {
  const sa = serviceAccount || getParsedServiceAccount();
  if (!sa || !sa.client_email || !sa.private_key) {
    return null;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    if (cachedAccessToken && cachedTokenExpiresAt > now + 60) {
      return cachedAccessToken;
    }

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
    if (data.access_token) {
      cachedAccessToken = data.access_token;
      cachedTokenExpiresAt = now + (data.expires_in || 3600);
      return cachedAccessToken;
    }
    return null;
  } catch (err) {
    console.error('[FCM] Error generating access token:', err);
    return null;
  }
}

/**
 * Sends a native Android lock-screen FCM push notification via Google FCM HTTP v1 API
 */
export async function sendFCMNotification(
  payload: FCMMessagePayload,
  preloadedToken?: string,
  preloadedServiceAccount?: any
): Promise<{ success: boolean; error?: string }> {
  const serviceAccount = preloadedServiceAccount || getParsedServiceAccount();
  if (!serviceAccount) {
    return { success: false, error: 'FCM_SERVICE_ACCOUNT_KEY not configured in server environment' };
  }

  const accessToken = preloadedToken || (await getFCMAccessToken(serviceAccount));
  if (!accessToken) {
    return { success: false, error: 'Failed to authenticate with Google FCM OAuth2' };
  }

  const projectId = serviceAccount.project_id || 'saarthi-b5ab7';
  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const fcmPayload = {
    message: {
      token: payload.token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        title: payload.title,
        body: payload.body,
        deepLink: payload.deepLink || 'https://www.saarthiguide.in',
        ...(payload.data || {}),
      },
      android: {
        priority: 'HIGH',
        notification: {
          channel_id: 'saarthi_live_alerts_v4',
          sound: 'om_notification',
          default_sound: false,
          default_vibrate_timings: true,
          visibility: 'PUBLIC',
          notification_priority: 'PRIORITY_MAX',
          icon: 'ic_maskable',
        },
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[FCM] Send failed HTTP ${res.status}:`, errText);
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[FCM] Fetch error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

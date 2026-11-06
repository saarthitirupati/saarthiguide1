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
        collapse_key: payload.data?.tag || 'saarthi-alert',
        priority: 'HIGH',
        notification: {
          channel_id: 'saarthi_live_alerts_v4',
          sound: 'om_notification',
          default_sound: false,
          default_vibrate_timings: true,
          visibility: 'PUBLIC',
          notification_priority: 'PRIORITY_MAX',
          icon: 'ic_maskable',
          tag: payload.data?.tag || 'saarthi-alert',
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

interface FCMTopicPayload {
  topic: string;
  title: string;
  body: string;
  deepLink?: string;
  data?: Record<string, string>;
}

/**
 * Broadcasts an FCM push notification to a topic (e.g. 'saarthi_all') in a single subrequest.
 * Delivers to thousands of subscribed Android devices concurrently via Google Cloud fanout.
 */
export async function sendFCMTopicNotification(
  payload: FCMTopicPayload,
  preloadedToken?: string,
  preloadedServiceAccount?: any
): Promise<{ success: boolean; messageId?: string; error?: string }> {
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
  const cleanTopic = payload.topic.replace(/^\/topics\//, '');

  const fcmPayload = {
    message: {
      topic: cleanTopic,
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
        collapse_key: payload.data?.tag || 'saarthi-alert',
        priority: 'HIGH',
        notification: {
          channel_id: 'saarthi_live_alerts_v4',
          sound: 'om_notification',
          default_sound: false,
          default_vibrate_timings: true,
          visibility: 'PUBLIC',
          notification_priority: 'PRIORITY_MAX',
          icon: 'ic_maskable',
          tag: payload.data?.tag || 'saarthi-alert',
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
      console.error(`[FCM Topic] Send failed HTTP ${res.status}:`, errText);
      return { success: false, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { success: true, messageId: data.name };
  } catch (err: any) {
    console.error('[FCM Topic] Fetch error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Subscribes FCM registration tokens to a topic via Google IID API.
 * Supports up to 1,000 tokens per call.
 */
export async function addTokensToTopic(
  tokens: string[],
  topic: string = 'saarthi_all'
): Promise<{ success: boolean; count?: number; error?: any }> {
  if (!tokens || tokens.length === 0) return { success: true, count: 0 };
  const validTokens = tokens
    .map(t => (typeof t === 'string' ? t.trim() : ''))
    .filter(t => t.length > 20);
  if (validTokens.length === 0) return { success: true, count: 0 };

  try {
    const serviceAccount = getParsedServiceAccount();
    const accessToken = await getFCMAccessToken(serviceAccount);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (process.env.FCM_SERVER_KEY) {
      headers['Authorization'] = `key=${process.env.FCM_SERVER_KEY}`;
    } else if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      headers['access_token_auth'] = 'true';
    } else {
      console.warn('[FCM] Cannot enroll tokens to topic: No FCM credentials available');
      return { success: false, error: 'No FCM credentials' };
    }

    const cleanTopic = topic.replace(/^\/topics\//, '');
    const res = await fetch('https://iid.googleapis.com/iid/v1:batchAdd', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: `/topics/${cleanTopic}`,
        registration_tokens: validTokens,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[FCM IID] batchAdd returned HTTP ${res.status}:`, errText);
      return { success: false, error: errText };
    }

    const json = (await res.json()) as { results?: Array<{ error?: string }> };
    const successCount = (json.results || []).filter(r => !r.error).length;
    return { success: true, count: successCount };
  } catch (err: any) {
    console.warn('[FCM IID] batchAdd exception:', err?.message || err);
    return { success: false, error: err?.message || 'Network exception' };
  }
}


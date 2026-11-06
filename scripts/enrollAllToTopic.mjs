import fs from 'fs';
import crypto from 'crypto';

function base64UrlEncode(data) {
  const buf = typeof data === 'string' ? Buffer.from(data) : data;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa) {
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
  return data.access_token;
}

async function fetchAllTokens(supabaseUrl, supabaseKey) {
  const allTokens = new Set();
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  };

  // 1. Fetch from user_devices
  console.log('Fetching tokens from user_devices...');
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(`${supabaseUrl}/rest/v1/user_devices?select=fcm_token&is_active=eq.true&fcm_token=not.is.null&order=updated_at.desc&limit=${pageSize}&offset=${offset}`, { headers });
    if (!res.ok) {
      console.error(`Failed to fetch user_devices at offset ${offset}:`, res.status, await res.text());
      break;
    }
    const rows = await res.json();
    if (!rows || rows.length === 0) break;
    for (const r of rows) {
      const tok = r.fcm_token?.trim();
      if (tok && tok.length > 20) allTokens.add(tok);
    }
    offset += rows.length;
    if (rows.length < pageSize) break;
  }
  console.log(`Loaded ${allTokens.size} unique tokens from user_devices`);

  // 2. Fetch from push_subscriptions (native android)
  console.log('Fetching tokens from push_subscriptions...');
  offset = 0;
  while (true) {
    const res = await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?select=endpoint&endpoint=like.*fcm.googleapis.com/fcm/native/*&order=last_seen_at.desc&limit=${pageSize}&offset=${offset}`, { headers });
    if (!res.ok) {
      console.error(`Failed to fetch push_subscriptions at offset ${offset}:`, res.status, await res.text());
      break;
    }
    const rows = await res.json();
    if (!rows || rows.length === 0) break;
    for (const r of rows) {
      const ep = r.endpoint || '';
      if (ep.startsWith('https://fcm.googleapis.com/fcm/native/')) {
        const tok = ep.replace('https://fcm.googleapis.com/fcm/native/', '').trim();
        if (tok && tok.length > 20) allTokens.add(tok);
      }
    }
    offset += rows.length;
    if (rows.length < pageSize) break;
  }
  console.log(`Total unique FCM tokens to enroll: ${allTokens.size}`);
  return Array.from(allTokens);
}

async function main() {
  const envContent = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
  const matchKey = envContent.match(/FCM_SERVICE_ACCOUNT_KEY=([^\r\n]+)/);
  const matchServerKey = envContent.match(/FCM_SERVER_KEY=([^\r\n]+)/);

  let serverKey = process.env.FCM_SERVER_KEY || (matchServerKey ? matchServerKey[1].trim() : null);
  let accessToken = null;

  if (serverKey) {
    console.log('Using legacy FCM_SERVER_KEY for IID API');
  } else if (process.env.FCM_SERVICE_ACCOUNT_KEY || matchKey) {
    const rawSa = process.env.FCM_SERVICE_ACCOUNT_KEY || matchKey[1].trim();
    const cleanSa = rawSa.replace(/^['"]|['"]$/g, '');
    const sa = JSON.parse(cleanSa);
    if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    console.log('Generating OAuth2 token from Service Account...');
    accessToken = await getAccessToken(sa);
    if (!accessToken) {
      console.error('Failed to obtain OAuth2 access token');
      process.exit(1);
    }
    console.log('OAuth2 access token generated successfully.');
  } else {
    console.error('No FCM credentials found in environment or .env.local');
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ehywzcxufqjywrnysmrz.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_at47-iL5G_k_wGLspiuDfw_JfogA8gb';

  const tokens = await fetchAllTokens(supabaseUrl, supabaseKey);
  const TOPIC = 'saarthi_all';
  const BATCH_SIZE = 1000;

  console.log(`\nEnrolling ${tokens.length} devices into topic '/topics/${TOPIC}' in batches of ${BATCH_SIZE}...`);

  let successCount = 0;
  let failedCount = 0;
  const invalidTokens = [];

  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const chunk = tokens.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(tokens.length / BATCH_SIZE);

    const headers = {
      'Content-Type': 'application/json',
    };
    if (serverKey) {
      headers['Authorization'] = `key=${serverKey}`;
    } else {
      headers['Authorization'] = `Bearer ${accessToken}`;
      headers['access_token_auth'] = 'true';
    }

    try {
      const res = await fetch('https://iid.googleapis.com/iid/v1:batchAdd', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: `/topics/${TOPIC}`,
          registration_tokens: chunk,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error(`Batch ${batchNum}/${totalBatches} failed with HTTP ${res.status}:`, json);
        failedCount += chunk.length;
        continue;
      }

      const results = json.results || [];
      let batchSuccess = 0;
      let batchFail = 0;

      results.forEach((r, idx) => {
        if (!r.error) {
          batchSuccess++;
        } else {
          batchFail++;
          if (r.error === 'NOT_FOUND' || r.error === 'INVALID_ARGUMENT') {
            invalidTokens.push(chunk[idx]);
          }
        }
      });

      successCount += batchSuccess;
      failedCount += batchFail;
      console.log(`Batch ${batchNum}/${totalBatches}: Enrolled ${batchSuccess} tokens (${batchFail} errors)`);
    } catch (err) {
      console.error(`Batch ${batchNum}/${totalBatches} network error:`, err);
      failedCount += chunk.length;
    }
  }

  console.log(`\n==============================================`);
  console.log(`Enrollment Complete!`);
  console.log(`Successfully enrolled in 'saarthi_all': ${successCount} devices`);
  console.log(`Errors / Stale tokens: ${failedCount}`);
  console.log(`Total processed: ${tokens.length}`);
  console.log(`==============================================`);

  if (invalidTokens.length > 0) {
    console.log(`Note: ${invalidTokens.length} tokens were stale (app uninstalled / expired).`);
  }
}

main().catch(err => {
  console.error('Fatal error running enrollment:', err);
  process.exit(1);
});

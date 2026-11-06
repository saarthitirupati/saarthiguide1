import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { addTokensToTopic } from '@/lib/fcmService';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Protect cron with CRON_SECRET if configured
  const authHeader = req.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('user_devices')
      .select('fcm_token')
      .gte('updated_at', oneDayAgo)
      .not('fcm_token', 'is', null)
      .eq('is_active', true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tokens = [...new Set((data || []).map(d => d.fcm_token?.trim()))].filter(
      (t): t is string => Boolean(t && t.length > 20)
    );

    if (!tokens.length) {
      return NextResponse.json({ synced: 0, message: 'No new active devices in past 24 hours' });
    }

    let enrolledCount = 0;
    for (let i = 0; i < tokens.length; i += 1000) {
      const chunk = tokens.slice(i, i + 1000);
      const res = await addTokensToTopic(chunk, 'saarthi_all');
      if (res.success) {
        enrolledCount += res.count || chunk.length;
      }
    }

    return NextResponse.json({
      success: true,
      synced: tokens.length,
      enrolled: enrolledCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[CronSyncTopics] Error:', err);
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 });
  }
}

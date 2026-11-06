import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// In-memory cache for live delivery tracking fallback
const inMemoryAcks = new Map<string, { total: number; byVersion: Record<string, number>; lastSeen: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tag, appVersion, deviceId } = body || {};

    if (!tag || !deviceId) {
      return NextResponse.json({ ok: false, error: 'Missing tag or deviceId' }, { status: 400 });
    }

    const version = (typeof appVersion === 'string' && appVersion.trim()) ? appVersion.trim() : 'unknown';
    const cleanTag = String(tag).trim();

    // 1. Update in-memory live counter for instant response
    let entry = inMemoryAcks.get(cleanTag);
    if (!entry) {
      entry = { total: 0, byVersion: {}, lastSeen: Date.now() };
      inMemoryAcks.set(cleanTag, entry);
    }
    entry.total += 1;
    entry.byVersion[version] = (entry.byVersion[version] || 0) + 1;
    entry.lastSeen = Date.now();

    // 2. Persist to database asynchronously (non-blocking)
    const waitUntil = (globalThis as any).waitUntil || ((p: Promise<any>) => { p.catch(() => {}); });
    waitUntil(
      (async () => {
        try {
          await supabase.from('notification_telemetry').upsert(
            {
              tag: cleanTag,
              device_id: String(deviceId).substring(0, 40),
              app_version: version,
              delivered_at: new Date().toISOString(),
            },
            { onConflict: 'tag,device_id' }
          );
        } catch {
          // Gracefully handles if table is not yet created in Supabase
        }
      })()
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get('tag');
  if (!tag) {
    return NextResponse.json({ ok: false, error: 'Missing tag parameter' }, { status: 400 });
  }

  const cleanTag = tag.trim();

  // 1. Try DB first
  try {
    const { data, count, error } = await supabase
      .from('notification_telemetry')
      .select('app_version', { count: 'exact' })
      .eq('tag', cleanTag);

    if (!error && count !== null && count > 0) {
      const byVersion = (data || []).reduce((acc: Record<string, number>, r: any) => {
        const v = r.app_version || 'unknown';
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {});

      return NextResponse.json({
        delivered: count,
        byVersion,
        source: 'database',
      });
    }
  } catch {}

  // 2. Fallback to in-memory live cache
  const cached = inMemoryAcks.get(cleanTag) || { total: 0, byVersion: {} };
  return NextResponse.json({
    delivered: cached.total,
    byVersion: cached.byVersion,
    source: 'in-memory',
  });
}

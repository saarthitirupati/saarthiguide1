import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'public, max-age=15, s-maxage=60, stale-while-revalidate=120',
        'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Cloudflare-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (e: any) {
    console.error('Failed to fetch status:', e);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}


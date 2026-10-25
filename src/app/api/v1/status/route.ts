import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'public, max-age=5, s-maxage=15, stale-while-revalidate=60',
        'CDN-Cache-Control': 'public, s-maxage=15',
      },
    });
  } catch (e: any) {
    console.error('Failed to fetch status:', e);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}


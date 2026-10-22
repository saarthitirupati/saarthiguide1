import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'public, max-age=3, s-maxage=5, stale-while-revalidate=10',
      },
    });
  } catch (e: any) {
    console.error('Failed to fetch status:', e);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}


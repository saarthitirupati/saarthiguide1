import { NextResponse } from 'next/server';

export const revalidate = 600; // cache 10 minutes

export async function GET() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=13.6832&longitude=79.3473&current=temperature_2m,weather_code',
      { signal: AbortSignal.timeout(1500), next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=300'
      }
    });
  } catch (_err: any) {
    return NextResponse.json({
      current: {
        temperature_2m: 23,
        weather_code: 1
      },
      fallback: true
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=300'
      }
    });
  }
}

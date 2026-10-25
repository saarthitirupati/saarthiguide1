import { NextResponse } from 'next/server';

let cachedWeather: any = null;
let lastFetchTime = 0;
const CACHE_MS = 15 * 60 * 1000; // 15 minutes in-memory cache

export const revalidate = 600; // cache 10 minutes

export async function GET() {
  const now = Date.now();
  if (cachedWeather && (now - lastFetchTime < CACHE_MS)) {
    return NextResponse.json(cachedWeather, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=600',
        'X-Cache': 'HIT',
      }
    });
  }

  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=13.6832&longitude=79.3473&current=temperature_2m,weather_code',
      { signal: AbortSignal.timeout(1500), next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    cachedWeather = data;
    lastFetchTime = now;
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=600',
        'X-Cache': 'MISS',
      }
    });
  } catch (_err: any) {
    if (cachedWeather) {
      return NextResponse.json(cachedWeather, {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=600',
          'X-Cache': 'STALE-FALLBACK',
        }
      });
    }
    return NextResponse.json({
      current: {
        temperature_2m: 24,
        weather_code: 1
      },
      fallback: true
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=600'
      }
    });
  }
}

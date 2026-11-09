/**
 * Signal Collector Service
 * Collects raw signals from GPS, Weather, Festival, Crowd, Parking, and RTC APIs.
 */

import { TIRUPATI_CENTER } from '@/utils/location';
import { readStatus } from '@/lib/statusDb';
import { FESTIVALS_2026, Festival } from '@/data/festivals';

function getFestivalDurationDays(f: Festival): number {
  if (!f.dateEnd || f.dateEnd === f.date) return 1;
  const [y1, m1, d1] = f.date.split('-').map(Number);
  const [y2, m2, d2] = f.dateEnd.split('-').map(Number);
  return Math.max(1, Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000) + 1);
}

export interface RawSignals {
  gps: { lat: number; lng: number };
  timestamp: string;
  dayOfWeek: string;
  timeHour: number;
  weather: 'sunny' | 'rain' | 'cloudy' | 'heatwave';
  activeFestival: string | null;
  activeFestivals: Festival[];
  activeFestivalPlaceIds: string[];
  liveCrowdStatus: 'low' | 'moderate' | 'high' | 'extreme';
  roadClosures: string[];
  parkingStatus: Record<string, 'available' | 'limited' | 'full'>;
  journeyStage: 'before_darshan' | 'after_darshan' | 'returning' | 'general';
}

export async function collectRawSignals(query: {
  lat?: string | number;
  lng?: string | number;
  journeyStage?: string;
}): Promise<RawSignals> {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = days[now.getDay()];
  const timeHour = now.getHours();

  // Ingest GPS or fallback
  const parsedLat = Number(query.lat);
  const parsedLng = Number(query.lng);
  const lat = (!isNaN(parsedLat) && parsedLat !== 0) ? parsedLat : TIRUPATI_CENTER.lat;
  const lng = (!isNaN(parsedLng) && parsedLng !== 0) ? parsedLng : TIRUPATI_CENTER.lng;

  // Active festival check for today in IST using pure string comparison
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
  const activeFestivals = FESTIVALS_2026.filter(f => {
    const start = f.date;
    const end = f.dateEnd || f.date;
    return todayStr >= start && todayStr <= end;
  });

  // Sort: narrowest range first (single-day event wins headline over month-long umbrella),
  // tie-break by gravityScore descending
  activeFestivals.sort((a, b) => {
    const durA = getFestivalDurationDays(a);
    const durB = getFestivalDurationDays(b);
    if (durA !== durB) return durA - durB;
    return (b.gravityScore || 0) - (a.gravityScore || 0);
  });

  const todayFestival = activeFestivals[0] ?? null;
  const activeFestivalPlaceIds = Array.from(new Set(
    activeFestivals.map(f => f.placeId).filter((id): id is string => Boolean(id))
  ));

  // Live weather & crowd signals from statusDb
  let weather: 'sunny' | 'rain' | 'cloudy' | 'heatwave' = 'sunny';
  let liveCrowdStatus: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate';

  try {
    const liveStatus = await readStatus();
    if (liveStatus) {
      const wText = (liveStatus.weather || '').toLowerCase();
      if (wText.includes('rain') || wText.includes('shower') || wText.includes('storm') || wText.includes('drizzle')) {
        weather = 'rain';
      } else if (wText.includes('heat') || wText.includes('hot') || wText.includes('35') || wText.includes('36') || wText.includes('37') || wText.includes('38') || wText.includes('39') || wText.includes('40')) {
        weather = 'heatwave';
      } else if (wText.includes('cloud') || wText.includes('overcast') || wText.includes('mist')) {
        weather = 'cloudy';
      } else {
        weather = 'sunny';
      }

      const cText = (liveStatus.crowdLevel || '').toLowerCase();
      if (cText.includes('very-high') || cText.includes('heavy') || cText.includes('extreme')) {
        liveCrowdStatus = 'extreme';
      } else if (cText.includes('high')) {
        liveCrowdStatus = 'high';
      } else if (cText.includes('low') || cText.includes('light')) {
        liveCrowdStatus = 'low';
      } else {
        liveCrowdStatus = 'moderate';
      }
    }
  } catch (e) {
    // Time-based fallback if DB unreadable
    if (timeHour >= 11 && timeHour <= 15) {
      weather = 'sunny';
    } else if (timeHour >= 16) {
      weather = 'cloudy';
    }
  }

  return {
    gps: { lat, lng },
    timestamp: now.toISOString(),
    dayOfWeek,
    timeHour,
    weather,
    activeFestival: todayFestival?.name || null,
    activeFestivals,
    activeFestivalPlaceIds,
    liveCrowdStatus,
    roadClosures: [],
    parkingStatus: {
      'vishnu-nivasam': 'available',
      'srinivasam': 'limited',
      'bhudevi': 'available'
    },
    journeyStage: (query.journeyStage as any) || 'general'
  };
}

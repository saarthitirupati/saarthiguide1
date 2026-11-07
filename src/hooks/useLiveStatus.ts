import { useState, useEffect, useMemo } from 'react';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';

const FALLBACK_STATUS = {
  waitTime: '',
  crowdLevel: 'moderate' as const,
  sevaStatus: 'All sevas open',
  notice: '',
  lastUpdated: '',
  darshanSpeed: 'normal' as const,
  accommodationStatus: 'available' as const,
  ladduAvailability: 'available' as const,
  weather: 'Pleasant, 24°C',
  darshans: [],
  ssdTokenStatus: 'closed-for-day' as const,
  ssdNextTokenTime: '',
  ssdTokenSlots: [],
  ssdNotice: '',
  ssdTimingsGuide: '',
  ssdCounters: []
};

export function useLiveStatus() {
  const { status: rawLiveStatus } = useRealtimeStatus();
  const [realtimeWeather, setRealtimeWeather] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/weather')
      .then(res => res.json())
      .then(data => {
        if (data?.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let cond = 'Clear Sky';
          if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
          else if (code === 45 || code === 48) cond = 'Foggy';
          else if (code >= 51 && code <= 67) cond = 'Rainy';
          else if (code >= 80 && code <= 82) cond = 'Rain Showers';
          else if (code >= 95 && code <= 99) cond = 'Thunderstorm';
          setRealtimeWeather(`${cond}, ${temp}°C`);
        }
      })
      .catch(console.error);
  }, []);

  const liveStatus = useMemo(() => {
    const base = rawLiveStatus || FALLBACK_STATUS;
    if (realtimeWeather && (!base.weather || base.weather === 'Auto (API)')) {
      return { ...base, weather: realtimeWeather };
    }
    return base;
  }, [rawLiveStatus, realtimeWeather]);

  const formattedWaitTime = useMemo(() => {
    if (!liveStatus) return '2-3 hours';
    const val = liveStatus.waitTime;
    if (!val) return '2-3 hours';
    const clean = val.trim();
    if (/^\d+$/.test(clean)) {
      const num = parseInt(clean, 10);
      return `${num} ${num === 1 ? 'hour' : 'hours'}`;
    }
    return clean;
  }, [liveStatus]);

  const weatherTemp = useMemo(() => {
    if (!liveStatus?.weather) return '27°C';
    const match = liveStatus.weather.match(/(\d+°C|\d+)/);
    if (match) {
      return match[0].includes('°C') ? match[0] : `${match[0]}°C`;
    }
    return '27°C';
  }, [liveStatus]);

  return { liveStatus, formattedWaitTime, weatherTemp };
}

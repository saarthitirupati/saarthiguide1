import { useState, useEffect, useMemo, useRef } from 'react';
import { useRealtimeAlerts, LiveAlert } from '@/lib/useRealtimeAlerts';
import { useTrip } from '@/components/TripContext';
import { playOmNotificationSound } from '@/lib/audioBell';

const DAILY_LIMIT_KEY = 'saarthi_daily_notif_tracker';
const MAX_DAILY_AUTO_NOTIFS = 3;

interface DailyNotifTracker {
  date: string;
  count: number;
  shownIds: string[];
}

function getDailyTracker(): DailyNotifTracker {
  if (typeof window === 'undefined') {
    return { date: '', count: 0, shownIds: [] };
  }
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(DAILY_LIMIT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today) {
        return {
          date: today,
          count: typeof parsed.count === 'number' ? parsed.count : 0,
          shownIds: Array.isArray(parsed.shownIds) ? parsed.shownIds : []
        };
      }
    }
  } catch {}
  return { date: today, count: 0, shownIds: [] };
}

function incrementDailyTracker(alertId: string): void {
  if (typeof window === 'undefined') return;
  const tracker = getDailyTracker();
  if (!tracker.shownIds.includes(alertId)) {
    tracker.shownIds.push(alertId);
    tracker.count += 1;
    try {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(tracker));
    } catch {}
  }
}

export function useAlerts() {
  const { alerts, loading } = useRealtimeAlerts();
  const { userLocation } = useTrip();
  const [activePopupAlert, setActivePopupAlert] = useState<LiveAlert | null>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const lastChimedAlertIdRef = useRef<string | null>(null);
  const adminPushedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
      setDismissedAlertIds(dismissed);
    }

    const onLiveUpdate = () => {
      adminPushedTimeRef.current = Date.now();
    };
    window.addEventListener('saarthi:live_update', onLiveUpdate);
    return () => window.removeEventListener('saarthi:live_update', onLiveUpdate);
  }, []);

  useEffect(() => {
    if (activePopupAlert && activePopupAlert.id !== lastChimedAlertIdRef.current) {
      lastChimedAlertIdRef.current = activePopupAlert.id;
      incrementDailyTracker(activePopupAlert.id);
      playOmNotificationSound().catch(() => {});
    }
  }, [activePopupAlert]);

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setActivePopupAlert(null);
      return;
    }
    
    const tracker = getDailyTracker();

    // Pick the most recent active alert that hasn't been dismissed by this user
    const alertToShow = alerts.find(alert => {
      if (dismissedAlertIds.includes(alert.id)) {
        return false;
      }
      
      // Location targeting check (if user location is present and specified)
      if (alert.target_location && alert.target_location !== 'All Users' && userLocation) {
        const lat = userLocation.lat;
        const lon = userLocation.lng;
        
        if (alert.target_location === 'Tirumala') {
          const isNearTirumala = Math.abs(lat - 13.6833) < 0.1 && Math.abs(lon - 79.3500) < 0.1;
          if (!isNearTirumala) return false;
        } else if (alert.target_location === 'Tirupati') {
          const isNearTirupati = Math.abs(lat - 13.6288) < 0.1 && Math.abs(lon - 79.4192) < 0.1;
          if (!isNearTirupati) return false;
        }
      }
      
      // Check if this alert was already shown today
      const alreadyShownToday = tracker.shownIds.includes(alert.id);

      // Check if alert was recently created/updated by admin (within last 5 minutes or fresh event)
      const alertTime = new Date(alert.updated_at || alert.created_at).getTime();
      const isRecentAdminPush = (Date.now() - alertTime < 5 * 60 * 1000)
        || (Date.now() - adminPushedTimeRef.current < 30 * 1000);

      // Emergency category or fresh admin push always breaks through
      const isPrivileged = alert.category === 'Emergency' || isRecentAdminPush;

      // If not already shown today and not privileged, enforce 3 notifications/day cap
      if (!alreadyShownToday && !isPrivileged && tracker.count >= MAX_DAILY_AUTO_NOTIFS) {
        return false;
      }

      return true;
    });

    setActivePopupAlert(prev => {
      if (prev?.id === (alertToShow?.id || null)) return prev;
      return alertToShow || null;
    });
  }, [alerts, userLocation?.lat, userLocation?.lng, dismissedAlertIds]);

  const activeAlertsCount = useMemo(() => {
    if (!alerts) return 0;
    return alerts.filter(a => !dismissedAlertIds.includes(a.id)).length;
  }, [alerts, dismissedAlertIds]);

  const dismissAlert = (id: string) => {
    const updated = [...dismissedAlertIds, id];
    localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
    setDismissedAlertIds(updated);
    if (activePopupAlert && activePopupAlert.id === id) {
      setActivePopupAlert(null);
    }
  };

  return {
    alerts,
    activePopupAlert,
    dismissedAlertIds,
    activeAlertsCount,
    dismissAlert,
    loading
  };
}

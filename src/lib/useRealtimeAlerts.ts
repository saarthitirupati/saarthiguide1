'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { safeFetchJson } from './safeFetch';

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

// Singleton tab-wide in-flight fetch and cache to prevent duplicate requests across components
let activeAlertsFetch: Promise<LiveAlert[] | null> | null = null;
let lastAlertsFetchTime = 0;
let cachedAlertsData: LiveAlert[] = [];

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState<LiveAlert[]>(cachedAlertsData);
  const [loading, setLoading] = useState(cachedAlertsData.length === 0);

  const fetchAlerts = useCallback(async (force: boolean = false) => {
    try {
      const now = Date.now();
      // Reuse cached data if fetched less than 10 seconds ago and not forced
      if (!force && cachedAlertsData.length > 0 && now - lastAlertsFetchTime < 10000) {
        setAlerts(cachedAlertsData);
        setLoading(false);
        return;
      }

      // Deduplicate simultaneous component fetches into a single network call
      if (!activeAlertsFetch) {
        activeAlertsFetch = safeFetchJson<LiveAlert[]>('/api/v1/alerts').then(data => {
          if (Array.isArray(data)) {
            cachedAlertsData = data;
            lastAlertsFetchTime = Date.now();
          }
          return data;
        }).finally(() => {
          activeAlertsFetch = null;
        });
      }

      const data = await activeAlertsFetch;
      if (Array.isArray(data)) {
        setAlerts(prev => {
          if (prev.length === data.length && prev.every((p, i) => p.id === data[i].id && p.updated_at === data[i].updated_at)) {
            return prev;
          }
          return data;
        });
      }
    } catch (err) {
      console.error('Failed to fetch live alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch initial active alerts
    fetchAlerts();

    // 2. Poll fallback every 30 seconds (only when tab is visible)
    const pollInterval = setInterval(() => {
      if (typeof document === 'undefined' || !document.hidden) {
        fetchAlerts();
      }
    }, 30000);

    // 3. Instant local & cross-tab admin event listeners
    const handleCustomEvent = () => fetchAlerts(true);
    window.addEventListener('saarthi:live_update', handleCustomEvent);

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('saarthi_admin_channel');
      broadcastChannel.onmessage = (msg) => {
        if (msg.data?.type === 'LIVE_UPDATE') {
          fetchAlerts();
        }
      };
    } catch (e) {}

    // 4. Supabase Realtime channel subscription with unique identifier
    const channelName = `public:live_alerts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let subscription: any;
    try {
      subscription = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'live_updates' },
          (payload: any) => {
            if (!payload?.new?.module || payload.new.module === 'live_alerts') {
              fetchAlerts();
            }
          }
        )
        .subscribe();
    } catch (err) {
      // Silent fallback: 6s API polling is already active
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('saarthi:live_update', handleCustomEvent);
      if (broadcastChannel) {
        try { broadcastChannel.close(); } catch (e) {}
      }
      if (subscription) {
        try {
          supabase.removeChannel(subscription);
        } catch (e) {}
      }
    };
  }, [fetchAlerts]);

  return { alerts, refresh: fetchAlerts, loading };
}

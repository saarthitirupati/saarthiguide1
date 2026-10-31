'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './LiveUpdates.module.css';
import { 
  Activity, 
  Clock, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Users, 
  Ticket, 
  Bell, 
  Send, 
  X,
  Car,
  Bus,
  Footprints,
  Star,
  Save,
  Eye,
  ChevronDown,
  Building2,
  Info
} from 'lucide-react';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminLiveUpdates() {
  const [weatherState, setWeatherState] = useState<string>('Auto (API)');
  const [livePlaces, setLivePlaces] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [placeUpdateStatus, setPlaceUpdateStatus] = useState<Record<string, string>>({});

  // Tirumala Specific State & Controls
  const [actionChoice, setActionChoice] = useState<'update_only' | 'update_and_notify'>('update_only');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [templePushTitle, setTemplePushTitle] = useState<string>('Tirumala Live Darshan Update');
  const [templePushBody, setTemplePushBody] = useState<string>('');

  // Global Push Modal State (Header Action)
  const [showPushModal, setShowPushModal] = useState<boolean>(false);
  const [pushTitle, setPushTitle] = useState<string>('Tirumala Live Crowd Update');
  const [pushBody, setPushBody] = useState<string>('');
  const [pushUrl, setPushUrl] = useState<string>('/');
  const [pushCategory, setPushCategory] = useState<'Operational' | 'High Priority' | 'Emergency'>('Operational');
  const [isSendingPush, setIsSendingPush] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getAdminHeaders = () => {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026')
      : 'saarthi_admin_token_2026';
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchLiveData = useCallback(async () => {
    try {
      const headers = getAdminHeaders();
      const [fetchedStatus, placesData] = await Promise.all([
        safeFetchJson<any>('/api/admin/status?t=' + Date.now(), { headers }),
        safeFetchJson<any>('/api/admin/live-places?t=' + Date.now(), { headers })
      ]);

      if (fetchedStatus) {
        setStatusData(fetchedStatus);
        if (fetchedStatus.weather) {
          setWeatherState(fetchedStatus.weather);
        }
      }

      if (placesData && placesData.places) {
        setLivePlaces(placesData.places);
      }

      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Failed to fetch live operations data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(() => {
      if (typeof document === 'undefined' || !document.hidden) {
        fetchLiveData();
      }
    }, 10000);

    const handleCustomEvent = () => fetchLiveData();
    window.addEventListener('saarthi:live_update', handleCustomEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('saarthi:live_update', handleCustomEvent);
    };
  }, [fetchLiveData]);

  // Push Notification Dispatcher via /api/push/send
  const sendPushNotification = async (payload: { title: string; body: string; url?: string; category?: string }) => {
    const trimmedTitle = (payload.title || '').trim();
    const trimmedBody = (payload.body || '').trim();
    let targetUrl = (payload.url || '/').trim();

    if (!trimmedTitle || !trimmedBody) {
      showToast('Validation Error: Notification title and message cannot be empty.');
      return false;
    }

    if (!targetUrl.startsWith('/') && !targetUrl.startsWith('https://')) {
      showToast('Validation Error: Target URL must begin with "/" or "https://".');
      return false;
    }

    setIsSendingPush(true);
    try {
      const headers = { ...getAdminHeaders(), 'Content-Type': 'application/json' };
      const res = await safeFetchJson<any>('/api/push/send', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          title: trimmedTitle,
          body: trimmedBody,
          url: targetUrl,
          category: payload.category || 'Operational',
          tag: `live-ops-${Date.now()}`
        })
      });

      if (res && res.error) {
        showToast(`Push dispatch failed: ${res.error}`);
        return false;
      }

      if (res && (res.ok || res.broadcast || res.scheduled)) {
        showToast('Push notification broadcasted successfully to all subscribers!');
        return true;
      }

      showToast('Notification request completed.');
      return true;
    } catch (err: any) {
      showToast(`Error dispatching push: ${err.message || 'Network error'}`);
      return false;
    } finally {
      setIsSendingPush(false);
    }
  };

  const handleWeatherOverride = async (weather: string) => {
    setWeatherState(weather);
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        credentials: 'include',
        body: JSON.stringify({ weather })
      });
      notifyRealtimeUpdate();
      showToast(`Weather Override set to "${weather}"`);
    } catch (e) {
      showToast('Failed to update weather override');
    }
  };

  const handleEmergencyAlert = async () => {
    const alertMsg = prompt('Enter Emergency Alert Notice to publish on the website:', 'HIGH CROWD WARNING: Ghat road traffic slow. Exercise caution.');
    if (!alertMsg) return;

    try {
      const headers = { 'Content-Type': 'application/json', ...getAdminHeaders() };
      await fetch('/api/admin/alerts', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          title: 'Emergency Operational Alert',
          description: alertMsg,
          category: 'Emergency',
          severity: 'Critical',
          status: 'Published'
        })
      });
      await fetch('/api/admin/status', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ notice: alertMsg, sendPush: false })
      });
      notifyRealtimeUpdate();
      showToast('Emergency Alert published to website!');
      fetchLiveData();

      const alsoSendPush = confirm('Emergency alert is now live on the website.\n\nDo you ALSO want to dispatch a Push Notification to all active subscribers?');
      if (alsoSendPush) {
        await sendPushNotification({
          title: 'Emergency Operational Alert',
          body: alertMsg,
          url: '/alerts',
          category: 'Emergency'
        });
      }
    } catch (e) {
      showToast('Failed to publish emergency alert');
    }
  };

  // Submit Handler for Tirumala Venkateswara Temple
  const handleTirumalaUpdate = async () => {
    const tirumalaCard = document.getElementById('tirumala-operational-card');
    if (!tirumalaCard) return;

    const crowd = (tirumalaCard.querySelector('[name="crowd"]') as HTMLSelectElement)?.value || 'LOW';
    const parking = (tirumalaCard.querySelector('[name="parking"]') as HTMLSelectElement)?.value || 'AVAILABLE';
    const rtc = (tirumalaCard.querySelector('[name="rtc"]') as HTMLSelectElement)?.value || 'NORMAL';
    const sarva = (tirumalaCard.querySelector('[name="sarva"]') as HTMLInputElement)?.value?.trim() || '4-8 Hours';
    const divya = (tirumalaCard.querySelector('[name="divya"]') as HTMLInputElement)?.value?.trim() || '2-5 Hours';
    const special = (tirumalaCard.querySelector('[name="special"]') as HTMLInputElement)?.value?.trim() || '1-2 Hours';

    // Build default push message if not customized
    const dynamicMessage = templePushBody.trim() || `Sarva Darshan Wait: ${sarva}. Crowd: ${crowd.charAt(0) + crowd.slice(1).toLowerCase()}. Parking: ${parking.charAt(0) + parking.slice(1).toLowerCase()}.`;
    const notificationTitle = templePushTitle.trim() || 'Tirumala Live Darshan Update';

    let sendPushApproved = false;
    if (actionChoice === 'update_and_notify') {
      sendPushApproved = confirm(
        `Dispatch Push Notification to all subscribers for this live status update?\n\nTitle: ${notificationTitle}\nMessage: ${dynamicMessage}`
      );
      if (!sendPushApproved) {
        return; // Admin cancelled push dispatch, abort
      }
    }

    setPlaceUpdateStatus(prev => ({ ...prev, 'uuid-1': 'Updating...' }));

    try {
      const headers = { ...getAdminHeaders(), 'Content-Type': 'application/json' };

      // 1. Update live places entry for Tirumala
      await safeFetchJson<any>('/api/admin/live-places', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          id: 'uuid-1',
          updates: {
            time: sarva,
            crowd,
            parking,
            rtc,
            sarva,
            divya,
            special
          }
        })
      });

      // 2. Update global Tirumala status in statusDb
      const globalStatusUpdates: any = {
        waitTime: sarva,
        crowdLevel: crowd === 'LOW' ? 'low' : crowd === 'MEDIUM' ? 'moderate' : crowd === 'HIGH' ? 'high' : 'very-high',
        accommodationStatus: parking === 'FULL' ? 'full' : 'available',
        sendPush: sendPushApproved,
        pushTitle: sendPushApproved ? notificationTitle : undefined,
        pushBody: sendPushApproved ? dynamicMessage : undefined,
        pushUrl: sendPushApproved ? '/' : undefined,
        pushCategory: sendPushApproved ? 'Operational' : undefined
      };

      // Update the 3 distinct darshan queues independently
      const existingDarshans = statusData?.darshans || [
        { name: 'Sarva Darshan (Free)', waitTime: sarva, peakHours: 'Daily 10 AM - 6 PM' },
        { name: 'Special Entry (₹300)', waitTime: special, peakHours: 'Daily 9 AM - 3 PM' },
        { name: 'Divya Darshan (Footpath)', waitTime: divya, peakHours: 'Daily 8 AM - 4 PM' },
        { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
      ];

      globalStatusUpdates.darshans = existingDarshans.map((d: any) => {
        const nameLower = (d.name || '').toLowerCase();
        if (nameLower.includes('sarva') || nameLower.includes('free')) {
          return { ...d, waitTime: sarva };
        }
        if (nameLower.includes('divya') || nameLower.includes('footpath')) {
          return { ...d, waitTime: divya };
        }
        if (nameLower.includes('300') || nameLower.includes('special')) {
          return { ...d, waitTime: special };
        }
        return d;
      });

      await fetch('/api/admin/status', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(globalStatusUpdates)
      });

      notifyRealtimeUpdate();
      fetchLiveData();
      setPlaceUpdateStatus(prev => ({ ...prev, 'uuid-1': '✓ Updated!' }));
      showToast(sendPushApproved ? 'Live status updated & push notification sent!' : 'Live Temple Status updated successfully!');
      setTimeout(() => {
        setPlaceUpdateStatus(prev => ({ ...prev, 'uuid-1': '' }));
      }, 2500);
    } catch (e: any) {
      setPlaceUpdateStatus(prev => ({ ...prev, 'uuid-1': 'Failed' }));
      showToast(`Update error: ${e.message || 'Network error'}`);
    }
  };

  // Generic Place Update Handler for secondary regional hubs
  const handleGenericPlaceUpdate = async (id: string, updates: any) => {
    setPlaceUpdateStatus(prev => ({ ...prev, [id]: 'Updating...' }));
    try {
      const headers = { ...getAdminHeaders(), 'Content-Type': 'application/json' };
      const data = await safeFetchJson<any>('/api/admin/live-places', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ id, updates })
      });

      if (data && data.places) {
        setLivePlaces(data.places);
        notifyRealtimeUpdate();
        fetchLiveData();
        setPlaceUpdateStatus(prev => ({ ...prev, [id]: '✓ Updated!' }));
        showToast('Place status updated successfully!');
        setTimeout(() => {
          setPlaceUpdateStatus(prev => ({ ...prev, [id]: '' }));
        }, 2500);
      }
    } catch (e) {
      setPlaceUpdateStatus(prev => ({ ...prev, [id]: 'Failed' }));
    }
  };

  const tirumalaPlace = livePlaces.find(p => p.id === 'uuid-1' || p.name?.toLowerCase().includes('tirumala')) || {
    id: 'uuid-1',
    name: 'Tirumala Venkateswara Temple',
    time: statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('sarva') || d.name?.toLowerCase().includes('free'))?.waitTime || '4-8 Hours',
    crowd: statusData?.crowdLevel ? (statusData.crowdLevel === 'very-high' ? 'EXTREME' : statusData.crowdLevel.toUpperCase()) : 'LOW',
    parking: statusData?.accommodationStatus === 'full' ? 'FULL' : 'AVAILABLE',
    rtc: 'NORMAL',
    updated: '2 mins ago'
  };

  const otherPlaces = livePlaces.filter(p => !(p.id === 'uuid-1' || p.name?.toLowerCase().includes('tirumala')));

  const sarvaDefault = statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('sarva') || d.name?.toLowerCase().includes('free'))?.waitTime || '4-8 Hours';
  const divyaDefault = statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath'))?.waitTime || '2-5 Hours';
  const specialDefault = statusData?.darshans?.find((d: any) => d.name?.includes('300') || d.name?.toLowerCase().includes('special'))?.waitTime || '1-2 Hours';

  return (
    <div className={styles.container}>
      {/* Dynamic Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '13.5px',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Operations</h1>
          <p className={styles.subtitle}>Manage real-time crowd, parking, and transit status across all key hubs</p>
        </div>
        <div className={styles.quickActions} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#16A34A',
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            padding: '5px 12px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            Live Sync (5s) {lastUpdated && `· ${lastUpdated}`}
          </span>
          <button 
            onClick={fetchLiveData} 
            title="Refresh Live Operations"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '9px 14px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setPushTitle('Tirumala Live Crowd Update');
              setPushBody(statusData?.waitTime ? `Current Tirumala Sarva Darshan wait: ${statusData.waitTime}. Crowd level: ${statusData.crowdLevel || 'Moderate'}.` : '');
              setPushUrl('/');
              setPushCategory('Operational');
              setShowPushModal(true);
            }}
            style={{
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 14px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
            }}
            title="Open modal to broadcast a push notification to subscribers"
          >
            <Bell size={15} /> Send Live Push
          </button>
          <button className={styles.dangerButton} onClick={handleEmergencyAlert}>
            <AlertTriangle size={16} /> Broadcast Emergency Alert
          </button>
        </div>
      </div>

      {/* ── WEATHER OVERRIDE ── */}
      <div className={styles.globalOverride}>
        <div className={styles.overrideHeader}>
          <Zap size={18} color="#d97706" />
          <h3>Global Weather Override</h3>
          <span style={{ fontSize: '11px', color: '#B45309', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={13} /> Temporary override (manual)
          </span>
        </div>
        <p className={styles.overrideDesc}>Forces the recommendation engine and live status banner to display this active weather condition.</p>
        <div className={styles.weatherToggles} style={{ flexWrap: 'wrap' }}>
          {['Auto (API)', 'Clear Sky, 26°C', 'Pleasant, 24°C', 'Heavy Rain, 22°C', 'Extreme Heat, 38°C'].map(w => (
            <button 
              key={w}
              className={`${styles.weatherBtn} ${weatherState === w ? styles.active : ''}`}
              onClick={() => handleWeatherOverride(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRIMARY FEATURED CARD: TIRUMALA VENKATESWARA TEMPLE ── */}
      <div 
        id="tirumala-operational-card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.05)'
        }}
      >
        {/* Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          paddingBottom: '16px',
          borderBottom: '1px solid #F1F5F9',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="#2563EB" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                Tirumala Venkateswara Temple
              </h2>
            </div>
            {placeUpdateStatus['uuid-1'] && (
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: placeUpdateStatus['uuid-1'].includes('✓') ? '#16A34A' : '#2563EB', background: placeUpdateStatus['uuid-1'].includes('✓') ? '#DCFCE7' : '#EFF6FF', padding: '3px 10px', borderRadius: '999px' }}>
                {placeUpdateStatus['uuid-1']}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
            <Clock size={13} /> Last updated: {lastUpdated || tirumalaPlace.updated || '2 mins ago'}
          </span>
        </div>

        {/* 1. Operational Status */}
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
            Operational Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Overall Crowd Level */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Users size={15} color="#16A34A" /> Overall Crowd Level
              </label>
              <select 
                name="crowd" 
                defaultValue={statusData?.crowdLevel ? (statusData.crowdLevel === 'very-high' ? 'EXTREME' : statusData.crowdLevel.toUpperCase()) : (tirumalaPlace.crowd || 'LOW')}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', fontWeight: 600, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EXTREME">Extreme</option>
              </select>
            </div>

            {/* Parking Status */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Car size={15} color="#16A34A" /> Parking Status
              </label>
              <select 
                name="parking" 
                defaultValue={statusData?.accommodationStatus === 'full' ? 'FULL' : (tirumalaPlace.parking || 'AVAILABLE')}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', fontWeight: 600, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              >
                <option value="AVAILABLE">Available</option>
                <option value="FULL">Full</option>
              </select>
            </div>

            {/* RTC Status */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Bus size={15} color="#16A34A" /> RTC Status
              </label>
              <select 
                name="rtc" 
                defaultValue={tirumalaPlace.rtc || 'NORMAL'}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', fontWeight: 600, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              >
                <option value="NORMAL">Normal</option>
                <option value="DELAYED">Delayed</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Darshan Queue Waiting Times */}
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
            Darshan Queue Waiting Times
          </h3>
          <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={13} color="#94A3B8" /> These are estimated queue waiting times for devotees already at the temple.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Sarva Darshan (SSD) Queue Wait */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C2410C', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                <Users size={16} color="#EA580C" />
                <span>Sarva Darshan (SSD) Queue Wait</span>
              </div>
              <input 
                name="sarva" 
                type="text" 
                defaultValue={sarvaDefault}
                placeholder="4-8 Hours" 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                General darshan queue waiting time inside Tirumala.
              </span>
            </div>

            {/* Divya Darshan (Footpath) Queue Wait */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                <Footprints size={16} color="#0284C7" />
                <span>Divya Darshan (Footpath) Queue Wait</span>
              </div>
              <input 
                name="divya" 
                type="text" 
                defaultValue={divyaDefault}
                placeholder="2-5 Hours" 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                Footpath (Divya Darshan) queue waiting time.
              </span>
            </div>

            {/* Special Entry Darshan (₹300) Wait */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
                <Star size={16} color="#D97706" />
                <span>Special Entry Darshan (₹300) Wait</span>
              </div>
              <input 
                name="special" 
                type="text" 
                defaultValue={specialDefault}
                placeholder="1-2 Hours" 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A', background: '#FFFFFF', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                Special entry darshan queue waiting time.
              </span>
            </div>
          </div>
        </div>

        {/* 3. What do you want to do? (Notification choice) */}
        <div style={{
          background: '#FFF1F2',
          border: '1px solid #FFE4E6',
          borderRadius: '14px',
          padding: '16px 18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
            <Bell size={18} color="#E11D48" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#9F1239', margin: '0 0 2px 0' }}>
                What do you want to do?
              </h4>
              <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                Choose whether to just update the status or also send a push notification to all subscribers.
              </p>
            </div>
          </div>

          {/* 2 Radio Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            {/* Option A: Update only (Default) */}
            <div 
              onClick={() => setActionChoice('update_only')}
              style={{
                border: actionChoice === 'update_only' ? '2px solid #16A34A' : '1px solid #E2E8F0',
                background: actionChoice === 'update_only' ? '#F0FDF4' : '#FFFFFF',
                padding: '12px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: actionChoice === 'update_only' ? '5px solid #16A34A' : '2px solid #CBD5E1',
                marginTop: '2px',
                flexShrink: 0,
                background: '#FFFFFF',
                boxSizing: 'border-box'
              }} />
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>Update only</span>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  Update the live status. No notification will be sent.
                </span>
              </div>
            </div>

            {/* Option B: Update and send notification */}
            <div 
              onClick={() => setActionChoice('update_and_notify')}
              style={{
                border: actionChoice === 'update_and_notify' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                background: actionChoice === 'update_and_notify' ? '#EFF6FF' : '#FFFFFF',
                padding: '12px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: actionChoice === 'update_and_notify' ? '5px solid #2563EB' : '2px solid #CBD5E1',
                marginTop: '2px',
                flexShrink: 0,
                background: '#FFFFFF',
                boxSizing: 'border-box'
              }} />
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>Update and send notification</span>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  Update the live status and send a push notification to all subscribers.
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Notification Preview */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '10px 14px'
          }}>
            <div 
              onClick={() => setShowPreview(!showPreview)} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={15} color="#2563EB" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Notification Preview (optional)
                </span>
              </div>
              <ChevronDown 
                size={16} 
                color="#64748B" 
                style={{ transform: showPreview ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} 
              />
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0 23px' }}>
              This will be used only if you select &apos;Update and send notification&apos;.
            </p>

            {showPreview && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Notification Title
                  </label>
                  <input 
                    type="text"
                    value={templePushTitle}
                    onChange={(e) => setTemplePushTitle(e.target.value)}
                    placeholder="Tirumala Live Darshan Update"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Notification Message
                  </label>
                  <textarea 
                    rows={2}
                    value={templePushBody}
                    onChange={(e) => setTemplePushBody(e.target.value)}
                    placeholder={`e.g. Sarva Darshan Wait: ${sarvaDefault}. Crowd: Low. Parking: Available.`}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Action Footer Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '4px' }}>
          <button 
            type="button"
            onClick={handleTirumalaUpdate}
            style={{
              backgroundColor: '#0F766E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 24px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Save size={16} /> Update Live Status
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#475569' }}>
            <Info size={14} color="#64748B" />
            <span><strong>Notification is OFF by default</strong> · You can choose to send a notification only when needed.</span>
          </div>
        </div>
      </div>

      {/* ── SECONDARY REGIONAL HUBS (IF ANY) ── */}
      {otherPlaces.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Regional Transit & Pilgrim Hubs
          </h3>
          <div className={styles.grid}>
            {otherPlaces.map(place => (
              <div key={place.id} className={styles.liveCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.placeName}>{place.name}</h3>
                    {placeUpdateStatus[place.id] && (
                      <span style={{ fontSize: '11px', fontWeight: 800, color: placeUpdateStatus[place.id].includes('✓') ? '#16A34A' : '#2563EB' }}>
                        {placeUpdateStatus[place.id]}
                      </span>
                    )}
                  </div>
                  <span className={styles.lastUpdated}><Clock size={12}/> {place.updated}</span>
                </div>
                
                <div className={styles.controls} id={`controls-${place.id}`}>
                  <div className={styles.controlGroup}>
                    <label>Wait Time (Hrs / Mins)</label>
                    <input name="time" type="text" className={styles.input} defaultValue={place.time} placeholder="e.g. 2-3 hours" />
                  </div>

                  <div className={styles.controlGroup}>
                    <label>Crowd Level</label>
                    <select name="crowd" className={styles.select} defaultValue={place.crowd}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="EXTREME">Extreme</option>
                    </select>
                  </div>

                  <div className={styles.controlGroup}>
                    <label>Parking Status</label>
                    <select name="parking" className={styles.select} defaultValue={place.parking}>
                      <option value="AVAILABLE">Available</option>
                      <option value="FULL">Full</option>
                    </select>
                  </div>
                  
                  <div className={styles.controlGroup}>
                    <label>RTC Status</label>
                    <select name="rtc" className={styles.select} defaultValue={place.rtc || 'NORMAL'}>
                      <option value="NORMAL">Normal</option>
                      <option value="DELAYED">Delayed</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>

                <button 
                  className={styles.updateButton} 
                  onClick={() => {
                    const controls = document.getElementById(`controls-${place.id}`);
                    if (!controls) return;
                    const time = (controls.querySelector('[name="time"]') as HTMLInputElement).value;
                    const crowd = (controls.querySelector('[name="crowd"]') as HTMLSelectElement).value;
                    const parking = (controls.querySelector('[name="parking"]') as HTMLSelectElement).value;
                    const rtc = (controls.querySelector('[name="rtc"]') as HTMLSelectElement).value;

                    handleGenericPlaceUpdate(place.id, { time, crowd, parking, rtc });
                  }}
                >
                  Update Live Status
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BROADCAST LIVE PUSH MODAL (Top Action Button) ── */}
      {showPushModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Bell size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Broadcast Live Push Notification</h3>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>Sends to active Web Push & Native Android FCM subscribers</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPushModal(false)}
                disabled={isSendingPush}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Notification Title *
                </label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  placeholder="e.g. Tirumala Live Crowd Update"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Notification Message / Body *
                </label>
                <textarea
                  rows={3}
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  placeholder="e.g. Sarva Darshan wait is 3–6 hours. Ghat road traffic is smooth."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={pushUrl}
                    onChange={(e) => setPushUrl(e.target.value)}
                    placeholder="/ or /alerts"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={pushCategory}
                    onChange={(e) => setPushCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box', background: '#FFFFFF' }}
                  >
                    <option value="Operational">Operational</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px', fontSize: '11.5px', color: '#64748B' }}>
                ⚠️ <strong>Confirmation Required:</strong> Clicking broadcast will prompt for confirmation before sending to all subscribed devices.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  disabled={isSendingPush}
                  onClick={() => setShowPushModal(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingPush}
                  onClick={async () => {
                    if (!pushTitle.trim() || !pushBody.trim()) {
                      alert('Please provide both a notification title and body message.');
                      return;
                    }
                    const confirmed = confirm(
                      `Are you sure you want to broadcast this push notification to all subscribers?\n\nTitle: ${pushTitle}\nBody: ${pushBody}\nCategory: ${pushCategory}`
                    );
                    if (!confirmed) return;

                    const ok = await sendPushNotification({
                      title: pushTitle,
                      body: pushBody,
                      url: pushUrl,
                      category: pushCategory
                    });

                    if (ok) {
                      setShowPushModal(false);
                    }
                  }}
                  style={{
                    backgroundColor: isSendingPush ? '#94A3B8' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isSendingPush ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={14} />
                  {isSendingPush ? 'Broadcasting...' : 'Broadcast Push Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './LiveUpdates.module.css';
import { Activity, Clock, Zap, AlertTriangle, RefreshCw, CheckCircle2, Users, Ticket, Bell, Send, X } from 'lucide-react';
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

  // Push Notification Controls (OFF by default)
  const [showPushModal, setShowPushModal] = useState<boolean>(false);
  const [pushTitle, setPushTitle] = useState<string>('Tirumala Live Crowd Update');
  const [pushBody, setPushBody] = useState<string>('');
  const [pushUrl, setPushUrl] = useState<string>('/');
  const [pushCategory, setPushCategory] = useState<'Operational' | 'High Priority' | 'Emergency'>('Operational');
  const [isSendingPush, setIsSendingPush] = useState<boolean>(false);
  const [notifyOnTempleUpdate, setNotifyOnTempleUpdate] = useState<boolean>(false);

  // Reusable Push Notification Dispatcher via /api/push/send
  const sendPushNotification = async (payload: { title: string; body: string; url?: string; category?: string }) => {
    const trimmedTitle = (payload.title || '').trim();
    const trimmedBody = (payload.body || '').trim();
    let targetUrl = (payload.url || '/').trim();

    // Validation
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
    const alertMsg = prompt('Enter Emergency Alert Notice to broadcast to all visitors:', 'HIGH CROWD WARNING: Ghat road traffic slow. Exercise caution.');
    if (!alertMsg) return;

    // Optional confirmation step to dispatch push notification
    const alsoSendPush = confirm('Emergency alert text confirmed.\n\nDo you ALSO want to broadcast a Push Notification to all active subscribers?');

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
        body: JSON.stringify({ notice: alertMsg })
      });
      notifyRealtimeUpdate();
      showToast('Emergency Alert Broadcasted Live to all visitors!');

      if (alsoSendPush) {
        await sendPushNotification({
          title: 'Emergency Operational Alert',
          body: alertMsg,
          url: '/alerts',
          category: 'Emergency'
        });
      }

      fetchLiveData();
    } catch (e) {
      showToast('Failed to send emergency broadcast');
    }
  };

  const handlePlaceUpdate = async (id: string, updates: any) => {
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
        
        if (id === 'uuid-1' || id.includes('1') || id === 'tirumala') {
          const globalStatusUpdates: any = {};
          if (updates.time) globalStatusUpdates.waitTime = updates.time;
          if (updates.crowd) {
            const c = updates.crowd.toUpperCase();
            if (c === 'LOW') globalStatusUpdates.crowdLevel = 'low';
            else if (c === 'MEDIUM') globalStatusUpdates.crowdLevel = 'moderate';
            else if (c === 'HIGH') globalStatusUpdates.crowdLevel = 'high';
            else if (c === 'EXTREME') globalStatusUpdates.crowdLevel = 'very-high';
            else globalStatusUpdates.crowdLevel = updates.crowd.toLowerCase();
          }
          if (updates.parking) globalStatusUpdates.accommodationStatus = updates.parking === 'FULL' ? 'full' : 'available';

          // Update individual Darshan Category wait times
          if (updates.sarva || updates.ssd || updates.special || updates.time) {
            const list = statusData?.darshans || [
              { name: 'Sarva Darshan (Free)', waitTime: '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
              { name: 'Special Entry (₹300)', waitTime: '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
              { name: 'Divya Darshan (Footpath)', waitTime: '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
              { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
            ];
            globalStatusUpdates.darshans = list.map((d: any) => {
              const nameLower = (d.name || '').toLowerCase();
              if ((updates.sarva || updates.time) && (nameLower.includes('sarva') || nameLower.includes('free'))) {
                return { ...d, waitTime: updates.sarva || updates.time };
              }
              if (updates.ssd && (nameLower.includes('divya') || nameLower.includes('footpath') || nameLower.includes('ssd'))) {
                return { ...d, waitTime: updates.ssd };
              }
              if (updates.special && (nameLower.includes('300') || nameLower.includes('special'))) {
                return { ...d, waitTime: updates.special };
              }
              return d;
            });
            if (updates.sarva) {
              globalStatusUpdates.waitTime = updates.sarva;
            }
          }
          
          await fetch('/api/admin/status', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(globalStatusUpdates)
          });
        }
        
        notifyRealtimeUpdate();
        fetchLiveData();
        setPlaceUpdateStatus(prev => ({ ...prev, [id]: '✓ Updated!' }));
        showToast('Live Temple Status updated and broadcasted live!');

        // Optional Push notification dispatch if admin enabled it
        if (notifyOnTempleUpdate && (id === 'uuid-1' || id.includes('1') || id === 'tirumala')) {
          const confirmed = confirm(
            `Dispatch Push Notification for this live update?\n\nSarva Wait: ${updates.sarva || updates.time || 'Normal'}\nCrowd: ${updates.crowd || 'Normal'}\nParking: ${updates.parking || 'Available'}`
          );
          if (confirmed) {
            await sendPushNotification({
              title: 'Tirumala Live Darshan Update',
              body: `Sarva Darshan Wait: ${updates.sarva || updates.time || 'Updated'}. Crowd: ${updates.crowd || 'Normal'}. Parking: ${updates.parking || 'Available'}.`,
              url: '/',
              category: 'Operational'
            });
          }
        }
        setTimeout(() => {
          setPlaceUpdateStatus(prev => ({ ...prev, [id]: '' }));
        }, 2500);
      }
    } catch (e) {
      setPlaceUpdateStatus(prev => ({ ...prev, [id]: 'Failed' }));
    }
  };

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

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Operations</h1>
          <p className={styles.subtitle}>Manage real-time crowd, parking, and transit status across all key hubs</p>
        </div>
        <div className={styles.quickActions} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      <div className={styles.globalOverride}>
        <div className={styles.overrideHeader}>
          <Zap size={18} color="#d97706" />
          <h3>Global Weather Override</h3>
        </div>
        <p className={styles.overrideDesc}>Forces the recommendation engine and live status banner to display this active weather condition.</p>
        <div className={styles.weatherToggles}>
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

      <div className={styles.grid}>
        {livePlaces.map(place => (
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

              {(place.id === 'uuid-1' || place.name.includes('Tirumala')) && (
                <>
                  <div className={styles.controlGroup} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '6px' }}>
                    <label style={{ color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} /> Sarva Darshan Wait
                    </label>
                    <input 
                      name="sarva" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('sarva') || d.name?.toLowerCase().includes('free'))?.waitTime || '12-15 hours'
                      } 
                      placeholder="e.g. 10-12 hours" 
                    />
                  </div>
                  <div className={styles.controlGroup}>
                    <label style={{ color: '#0284C7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ticket size={13} /> SSD / DD Wait
                    </label>
                    <input 
                      name="ssd" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath') || d.name?.toLowerCase().includes('ssd'))?.waitTime || '8-10 hours'
                      } 
                      placeholder="e.g. 4-6 hours" 
                    />
                  </div>
                  <div className={styles.controlGroup}>
                    <label style={{ color: '#CA8A04', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} /> ₹300 Special Entry Wait
                    </label>
                    <input 
                      name="special" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.includes('300') || d.name?.toLowerCase().includes('special'))?.waitTime || '3-4 hours'
                      } 
                      placeholder="e.g. 3-5 hours" 
                    />
                  </div>
                </>
              )}
              {(place.id === 'uuid-1' || place.name.includes('Tirumala')) && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={notifyOnTempleUpdate}
                      onChange={(e) => setNotifyOnTempleUpdate(e.target.checked)}
                      style={{ width: '15px', height: '15px', accentColor: '#2563EB', cursor: 'pointer' }}
                    />
                    <span>Also notify subscribers about this status change</span>
                  </label>
                  <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '2px', marginLeft: '23px' }}>
                    Sends a push notification to subscribers on update (OFF by default)
                  </span>
                </div>
              )}
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

                const sarvaEl = controls.querySelector('[name="sarva"]') as HTMLInputElement | null;
                const ssdEl = controls.querySelector('[name="ssd"]') as HTMLInputElement | null;
                const specialEl = controls.querySelector('[name="special"]') as HTMLInputElement | null;

                const sarva = sarvaEl?.value;
                const ssd = ssdEl?.value;
                const special = specialEl?.value;

                handlePlaceUpdate(place.id, { time, crowd, parking, rtc, sarva, ssd, special });
              }}
            >
              Update Live Status
            </button>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          SEND LIVE PUSH MODAL (Admin Controlled)
          ═══════════════════════════════════════════════════════ */}
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
            {/* Modal Header */}
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

            {/* Modal Form */}
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

              {/* Confirmation Notice */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px', fontSize: '11.5px', color: '#64748B' }}>
                ⚠️ <strong>Confirmation Required:</strong> Clicking broadcast will prompt for confirmation before sending to all subscribed devices.
              </div>

              {/* Modal Actions */}
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
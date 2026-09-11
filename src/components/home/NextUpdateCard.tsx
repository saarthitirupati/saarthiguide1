import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Heart, Loader2 } from 'lucide-react';
import { getNotificationPermission, subscribeToPushNotifications } from '@/lib/pushClient';

export function NextUpdateCard() {
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const perm = getNotificationPermission();
      if (perm === 'granted') {
        setNotified(true);
      }
    }
  }, []);

  const handleNotifyToggle = async () => {
    if (notified) return;

    setLoading(true);
    const res = await subscribeToPushNotifications();
    setLoading(false);

    if (res.success && res.permission === 'granted') {
      setNotified(true);
    }
  };

  return (
    <div style={{ padding: '0 16px 20px 16px' }}>
      
      {/* CARING REASSURANCE BANNER */}
      <div style={{
        backgroundColor: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: '16px',
        padding: '14px 16px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Heart size={20} color="#059669" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', lineHeight: '1.4' }}>
          Don&apos;t worry. Saarthi is watching live queue traffic and will remind you when it&apos;s the best time for Darshan.
        </div>
      </div>

      {/* NEXT UPDATE COUNTDOWN & RETENTION CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '20px',
        padding: '18px',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
            NEXT AUTOMATIC UPDATE
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.3' }}>
            Queue expected to improve in <span style={{ color: '#34D399' }}>2h 15m</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', fontWeight: 500 }}>
            We&apos;ll send an alert directly to your phone.
          </div>
        </div>

        <button
          onClick={handleNotifyToggle}
          disabled={loading}
          style={{
            backgroundColor: notified ? '#059669' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          aria-label={notified ? "Alerts Active" : "Notify Me"}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Enabling...</span>
            </>
          ) : notified ? (
            <>
              <Check size={16} />
              <span>Alerts Active</span>
            </>
          ) : (
            <>
              <Bell size={16} />
              <span>Notify Me</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCircle2, Sparkles, Phone, Building2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BASE_ROOM_WAITLIST = 142;

export default function RoomBookingPage() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saarthi_notified_rooms');
      if (stored === 'true') {
        setNotified(true);
        const storedPhone = localStorage.getItem('saarthi_notified_rooms_phone');
        if (storedPhone) setPhone(storedPhone);
      }
    }

    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from('live_updates')
          .select('value')
          .eq('module', 'launch_waitlist')
          .maybeSingle();

        if (!error && data?.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (typeof parsed?.rooms === 'number') {
            setWaitlistCount(parsed.rooms);
            return;
          }
        }
      } catch {
        // Fallback to internal API
      }

      try {
        const res = await fetch('/api/launch-interest');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && typeof data?.rooms === 'number') {
            setWaitlistCount(data.rooms);
          }
        }
      } catch (err) {
        console.error('Failed to load room waitlist count:', err);
      }
    };

    fetchCount();

    const channelName = `realtime_rooms_waitlist_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_updates' },
        (payload: any) => {
          try {
            const row = payload?.new;
            if (row?.module === 'launch_waitlist' && row?.value) {
              const parsed = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
              if (typeof parsed?.rooms === 'number') {
                setWaitlistCount(parsed.rooms);
              }
            }
          } catch (e) {
            console.error('Error handling realtime room waitlist:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNotify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (notified || submitting) return;
    setSubmitting(true);
    setNotified(true);
    setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saarthi_notified_rooms', 'true');
        if (phone.trim()) {
          localStorage.setItem('saarthi_notified_rooms_phone', phone.trim());
        }
      }
      const res = await fetch('/api/launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'rooms', phone: phone.trim() || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.counts?.rooms && typeof data.counts.rooms === 'number') {
          setWaitlistCount(data.counts.rooms);
        }
      }
    } catch (e) {
      console.error('Failed to record room launch interest:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPilgrims = BASE_ROOM_WAITLIST + (waitlistCount !== null ? waitlistCount : 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAF7',
      color: '#1B2A1E',
      maxWidth: '680px',
      margin: '0 auto',
      paddingBottom: '104px',
      boxSizing: 'border-box'
    }}>
      {/* ── TOP HEADER ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #ECEEEA',
        padding: 'calc(14px + var(--safe-area-top, 0px)) 18px 14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F0',
              color: '#0F5132',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#1B2A1E', lineHeight: 1.2 }}>
              Rooms Booking
            </h1>
            <p style={{ fontSize: '11px', margin: 0, color: '#687968' }}>
              Verified Tirupati Stays & Pilgrim Mutts
            </p>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#B45309',
          backgroundColor: '#FEF3C7',
          padding: '4px 10px',
          borderRadius: '12px'
        }}>
          Coming Soon
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #064E3B 0%, #0F5132 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
          boxShadow: '0 12px 28px -6px rgba(15, 81, 50, 0.28)'
        }}>
          <Building2 size={36} strokeWidth={1.8} />
        </div>

        <h2 style={{
          fontSize: '22px',
          fontWeight: 800,
          color: '#1B2A1E',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em'
        }}>
          Direct Zero-Broker Room Booking
        </h2>
        <p style={{
          fontSize: '13.5px',
          color: '#526356',
          maxWidth: '400px',
          margin: '0 0 18px 0',
          lineHeight: 1.5
        }}>
          Book clean, verified pilgrim rooms near Tirupati Railway Station, Alipiri &amp; Srinivasam with transparent prices and zero middleman commission.
        </p>

        {/* ── COMING SOON BADGE ── */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: '24px',
          padding: '8px 18px',
          marginBottom: '12px',
          boxSizing: 'border-box'
        }}>
          <Sparkles size={16} color="#D97706" />
          <span style={{
            fontSize: '13.5px',
            fontWeight: 800,
            color: '#92400E',
            letterSpacing: '0.02em'
          }}>
            Coming Soon • Verified Pilgrim Rooms
          </span>
        </div>

        {/* ── REAL-TIME DYNAMIC WAITLIST PILL ── */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '20px',
          padding: '5px 14px',
          margin: '2px auto 12px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#15803D'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#16A34A',
            display: 'inline-block'
          }} />
          <span>{`${totalPilgrims} Pilgrims on Priority Waitlist`}</span>
        </div>

        {/* ── PHONE NUMBER INPUT & NOTIFY ACTION ── */}
        {!notified ? (
          <form
            onSubmit={handleNotify}
            style={{
              width: '100%',
              maxWidth: '360px',
              margin: '8px auto 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '28px',
              padding: '4px 14px',
              boxShadow: '0 2px 8px rgba(15, 81, 50, 0.06)',
              boxSizing: 'border-box'
            }}>
              <Phone size={16} color="#0F5132" style={{ marginRight: '8px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginRight: '6px' }}>
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1B2A1E',
                  padding: '12px 0',
                  letterSpacing: phone.length > 0 ? '0.04em' : 'normal'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || phone.replace(/\D/g, '').length < 10}
              style={{
                width: '100%',
                backgroundColor: phone.replace(/\D/g, '').length === 10 ? '#0F5132' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '28px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: phone.replace(/\D/g, '').length === 10 ? (submitting ? 'wait' : 'pointer') : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: phone.replace(/\D/g, '').length === 10 ? '0 6px 18px rgba(15, 81, 50, 0.28)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              {submitting ? (
                <>
                  <Bell size={18} />
                  <span>Saving Preference...</span>
                </>
              ) : (
                <>
                  <Bell size={18} />
                  <span>Notify Me When Live</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '360px',
            margin: '8px auto 18px'
          }}>
            <div style={{
              width: '100%',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              border: '1.5px solid #A7F3D0',
              borderRadius: '28px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxSizing: 'border-box'
            }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>You&apos;ll be notified</span>
            </div>

            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '12.5px',
              color: '#15803D',
              fontWeight: 600,
              marginTop: '12px',
              lineHeight: 1.45,
              textAlign: 'center'
            }}>
              Joined along with {totalPilgrims} pilgrims. {phone ? `We will alert +91 ${phone} first` : 'We will alert you first'} when direct room booking goes live!
            </div>
          </div>
        )}

        {/* ── HELPFUL LINK TO EXISTING FREE TTD PAC & MUTT DIRECTORY ── */}
        <Link
          href="/rooms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1E2CF',
            borderRadius: '16px',
            padding: '12px 18px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0F5132',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(15, 81, 50, 0.05)',
            marginBottom: '16px'
          }}
        >
          <span>View Free TTD PACs &amp; Mutt Directory</span>
          <ArrowRight size={15} />
        </Link>
      </main>
    </div>
  );
}

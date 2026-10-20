'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Sparkles, CheckCircle2, Phone, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BASE_ROOM_WAITLIST = 98;

export default function TirupatiHotelsPage() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saarthi_notified_rooms');
      if (stored === 'true') {
        setNotified(true);
      }
    }

    // 1. Initial direct fetch from Supabase live_updates
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from('live_updates')
          .select('value')
          .eq('module', 'launch_waitlist')
          .single();

        if (!error && data?.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (typeof parsed?.rooms === 'number') {
            setWaitlistCount(parsed.rooms);
            return;
          }
        }
      } catch (err) {
        // Fallback to internal API
      }

      fetch('/api/launch-interest', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && typeof data?.rooms === 'number') {
            setWaitlistCount(data.rooms);
          }
        })
        .catch((err) => console.error('Failed to load waitlist count:', err));
    };

    fetchCount();

    // 2. Real-time WebSocket connection to Supabase live_updates
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

    // 3. Fallback interval every 8s
    const interval = setInterval(fetchCount, 8000);

    return () => {
      clearInterval(interval);
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
      }
      await fetch('/api/launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'rooms', phone: phone.trim() || undefined }),
      });
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
      paddingBottom: '96px',
      boxSizing: 'border-box'
    }}>
      {/* ── TOP HEADER ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #ECEEEA',
        padding: '14px 18px',
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
              Room Booking
            </h1>
            <p style={{ fontSize: '11px', margin: 0, color: '#687968' }}>
              Tirupati & Tirumala Stays
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
      <main style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* SVG ARTWORK: Sacred Pilgrim Hotel Room */}
        <div style={{
          width: '100%',
          maxWidth: '340px',
          margin: '0 auto 20px',
          filter: 'drop-shadow(0 12px 24px rgba(15, 81, 50, 0.08))'
        }}>
          <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <style>{`
                @keyframes lampGlowPulse {
                  0%, 100% { transform: scale(1); opacity: 0.35; }
                  50% { transform: scale(1.15); opacity: 0.65; }
                }
                @keyframes tulsiBreeze {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(2deg) skewX(1deg); }
                }
                @keyframes windowSunGlow {
                  0%, 100% { transform: scale(1); opacity: 0.85; }
                  50% { transform: scale(1.08); opacity: 1; }
                }
                @keyframes divineSparkle {
                  0%, 100% { transform: scale(0.85) rotate(0deg); opacity: 0.5; }
                  50% { transform: scale(1.2) rotate(15deg); opacity: 1; }
                }
                .anim-lamp { transform-origin: 320px 180px; animation: lampGlowPulse 2.8s ease-in-out infinite; }
                .anim-tulsi { transform-origin: 70px 210px; animation: tulsiBreeze 3.2s ease-in-out infinite; }
                .anim-window-sun { transform-origin: 200px 95px; animation: windowSunGlow 3.6s ease-in-out infinite; }
                .anim-sparkle { transform-origin: center; animation: divineSparkle 2.2s ease-in-out infinite; }
              `}</style>
              <linearGradient id="hotelBg" x1="200" y1="0" x2="200" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4F8F3" />
                <stop offset="1" stopColor="#E6F0E5" />
              </linearGradient>
              <linearGradient id="windowSky" x1="200" y1="40" x2="200" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF3C7" />
                <stop offset="0.6" stopColor="#FED7AA" />
                <stop offset="1" stopColor="#E0E7FF" />
              </linearGradient>
              <linearGradient id="blanketGrad" x1="120" y1="180" x2="280" y2="280" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0F5132" />
                <stop offset="1" stopColor="#083822" />
              </linearGradient>
              <linearGradient id="lampGlow" x1="320" y1="140" x2="320" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Room Frame */}
            <rect x="20" y="20" width="360" height="280" rx="28" fill="url(#hotelBg)" stroke="#D1E2CF" strokeWidth="2" />
            
            {/* Arched Window with Hills View */}
            <g>
              <path d="M140 160V90C140 56.8629 166.863 30 200 30C233.137 30 260 56.8629 260 90V160H140Z" fill="url(#windowSky)" stroke="#CBD5E1" strokeWidth="3" />
              {/* Distant Tirumala Hills */}
              <path d="M140 160C165 140 185 125 210 135C230 143 245 130 260 140V160H140Z" fill="#15803D" opacity="0.65" />
              <path d="M140 160C170 148 190 142 225 150C240 153 255 148 260 152V160H140Z" fill="#0F5132" opacity="0.85" />
              {/* Rising Sun */}
              <g className="anim-window-sun">
                <circle cx="200" cy="95" r="18" fill="#F59E0B" opacity="0.85" />
                <circle cx="200" cy="95" r="26" fill="#FDE68A" opacity="0.4" />
              </g>
              {/* Window Grids */}
              <line x1="200" y1="30" x2="200" y2="160" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
              <line x1="140" y1="105" x2="260" y2="105" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
              {/* Window Sill */}
              <rect x="132" y="157" width="136" height="7" rx="3.5" fill="#94A3B8" />
            </g>

            {/* Nightstand & Lamp (Right) */}
            <g>
              {/* Lamp Light Glow */}
              <ellipse className="anim-lamp" cx="320" cy="180" rx="35" ry="30" fill="url(#lampGlow)" />
              {/* Nightstand Table */}
              <rect x="295" y="195" width="48" height="55" rx="6" fill="#D97706" opacity="0.85" />
              <rect x="300" y="200" width="38" height="18" rx="3" fill="#B45309" />
              <circle cx="319" cy="209" r="2.5" fill="#FEF3C7" />
              {/* Lamp */}
              <rect x="317" y="165" width="5" height="30" rx="2" fill="#78350F" />
              <path d="M305 165L312 142H326L333 165H305Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            </g>

            {/* Plant Pot (Left) */}
            <g>
              <rect x="52" y="210" width="36" height="40" rx="5" fill="#B45309" opacity="0.75" />
              {/* Sacred Tulsi/Leaves */}
              <g className="anim-tulsi">
                <path d="M70 210C60 190 50 195 55 180C65 180 70 195 70 210Z" fill="#16A34A" />
                <path d="M70 210C80 188 92 192 88 178C76 178 72 195 70 210Z" fill="#22C55E" />
                <path d="M70 210C68 180 72 170 70 165C76 175 74 195 70 210Z" fill="#15803D" />
              </g>
            </g>

            {/* Cozy Pilgrim Bed */}
            <g>
              {/* Headboard */}
              <rect x="100" y="150" width="180" height="65" rx="12" fill="#78350F" stroke="#5C2607" strokeWidth="2" />
              {/* Headboard Inset Panels */}
              <rect x="110" y="158" width="75" height="38" rx="6" fill="#92400E" />
              <rect x="195" y="158" width="75" height="38" rx="6" fill="#92400E" />
              
              {/* Mattress / White Sheet */}
              <rect x="90" y="195" width="200" height="75" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              
              {/* Pillows */}
              <rect x="105" y="180" width="68" height="32" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" transform="rotate(-4 105 180)" />
              <rect x="205" y="176" width="68" height="32" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" transform="rotate(4 205 176)" />
              
              {/* Emerald Green Quilt/Blanket */}
              <path d="M90 220C90 212 96 205 104 205H276C284 205 290 212 290 220V260C290 268 284 272 276 272H104C96 272 90 268 90 260V220Z" fill="url(#blanketGrad)" />
              {/* Golden Folded Runner */}
              <rect x="90" y="235" width="200" height="14" fill="#D97706" opacity="0.9" />
              <line x1="90" y1="242" x2="290" y2="242" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Bed Wooden Base & Legs */}
              <rect x="94" y="270" width="192" height="10" rx="3" fill="#5C2607" />
              <rect x="102" y="278" width="12" height="14" rx="2" fill="#5C2607" />
              <rect x="266" y="278" width="12" height="14" rx="2" fill="#5C2607" />
            </g>

            {/* Sparkles / Divine Blessing */}
            <g fill="#F59E0B" className="anim-sparkle">
              <path d="M78 60L81 68L89 71L81 74L78 82L75 74L67 71L75 68L78 60Z" opacity="0.8" />
              <path d="M320 68L322 74L328 76L322 78L320 84L318 78L312 76L318 74L320 68Z" opacity="0.8" />
              <circle cx="295" cy="48" r="3" opacity="0.6" />
              <circle cx="105" cy="95" r="2.5" opacity="0.6" />
            </g>
          </svg>
        </div>

        {/* Title & Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '20px',
          padding: '6px 14px',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} color="#0F5132" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132', letterSpacing: '0.02em' }}>
            Handpicked Pilgrim Stays
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1B2A1E', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Room Booking is Coming Soon
        </h2>

        <p style={{ fontSize: '13.5px', color: '#556857', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.55 }}>
          We are curating clean, verified pilgrim stays, mutts, and lodges near Tirupati Station, Srinivasam, and Alipiri foothills with zero-commission direct booking.
        </p>

        {/* Dynamic Pilgrim Counter Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: '20px',
          padding: '5px 14px',
          marginBottom: '20px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#92400E'
        }}>
          <Users size={14} color="#D97706" />
          <span>
            {`${totalPilgrims} pilgrims awaiting verified room bookings`}
          </span>
        </div>

        {/* Dynamic Action: Notify Form or Confirmation Banner */}
        {notified ? (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            borderRadius: '16px',
            padding: '16px 20px',
            maxWidth: '380px',
            width: '100%',
            margin: '0 auto 28px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#166534',
              fontWeight: 700,
              fontSize: '14px',
              marginBottom: '6px'
            }}>
              <CheckCircle2 size={18} />
              You&apos;re on the priority room waitlist!
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#047857', lineHeight: 1.45 }}>
              Joined along with {totalPilgrims} other pilgrims. We will alert you first when verified pilgrim rooms & mutts open!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleNotify}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              maxWidth: '360px',
              margin: '0 auto 28px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #D1D5DB',
              borderRadius: '24px',
              padding: '6px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              boxSizing: 'border-box'
            }}>
              <Phone size={15} color="#0F5132" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                type="tel"
                placeholder="WhatsApp / Mobile (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: '#1B2A1E',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                backgroundColor: '#0F5132',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                padding: '12px 24px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: submitting ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bell size={16} />
              {submitting ? 'Registering...' : 'Notify Me When Live'}
            </button>
            <span style={{ fontSize: '11px', color: '#687968' }}>
              🔒 Zero spam. Instant alert when room booking opens.
            </span>
          </form>
        )}
      </main>
    </div>
  );
}

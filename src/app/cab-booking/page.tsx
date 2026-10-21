'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BASE_CAB_WAITLIST = 98;

export default function CabBookingPage() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saarthi_notified_cabs');
      if (stored === 'true') {
        setNotified(true);
        const storedPhone = localStorage.getItem('saarthi_notified_cabs_phone');
        if (storedPhone) setPhone(storedPhone);
      }
    }

    // 1. Initial direct fetch from Supabase live_updates with resilient internal API fallback
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from('live_updates')
          .select('value')
          .eq('module', 'launch_waitlist')
          .maybeSingle();

        if (!error && data?.value) {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (typeof parsed?.cabs === 'number') {
            setWaitlistCount(parsed.cabs);
            return;
          }
        }
      } catch (err) {
        // Fallback to internal API
      }

      try {
        const res = await fetch('/api/launch-interest', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && typeof data?.cabs === 'number') {
            setWaitlistCount(data.cabs);
          }
        }
      } catch (err) {
        console.error('Failed to load waitlist count:', err);
      }
    };

    fetchCount();

    // 2. Real-time WebSocket connection to Supabase live_updates
    const channelName = `realtime_cabs_waitlist_${Date.now()}`;
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
              if (typeof parsed?.cabs === 'number') {
                setWaitlistCount(parsed.cabs);
              }
            }
          } catch (e) {
            console.error('Error handling realtime cab waitlist:', e);
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
        localStorage.setItem('saarthi_notified_cabs', 'true');
        if (phone.trim()) {
          localStorage.setItem('saarthi_notified_cabs_phone', phone.trim());
        }
      }
      const res = await fetch('/api/launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'cabs', phone: phone.trim() || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.counts?.cabs && typeof data.counts.cabs === 'number') {
          setWaitlistCount(data.counts.cabs);
        }
      }
    } catch (e) {
      console.error('Failed to record cab launch interest:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPilgrims = BASE_CAB_WAITLIST + (waitlistCount !== null ? waitlistCount : 0);

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
              Cab Booking
            </h1>
            <p style={{ fontSize: '11px', margin: 0, color: '#687968' }}>
              Tirumala Ghat Road & Local Cabs
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
      <main style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* SVG ARTWORK: Mountain Ghat Road with Pilgrim Cab (Edge-to-edge landscape with clipPath) */}
        <div style={{
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto 24px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 16px 36px -10px rgba(15, 81, 50, 0.16), 0 4px 12px rgba(0,0,0,0.04)',
          border: '1.5px solid #D1E2CF',
          backgroundColor: '#F8FAF7'
        }}>
          <svg viewBox="0 0 520 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <style>{`
                @keyframes cabBounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3.5px) rotate(-0.5deg); }
                }
                @keyframes roadDashesFlow {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: -32; }
                }
                @keyframes cloudFloatLeft {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(18px); }
                }
                @keyframes cloudFloatRight {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(-16px); }
                }
                @keyframes sunGlow {
                  0%, 100% { transform: scale(1); opacity: 0.88; }
                  50% { transform: scale(1.08); opacity: 1; }
                }
                @keyframes headlightBeam {
                  0%, 100% { opacity: 0.25; }
                  50% { opacity: 0.65; }
                }
                @keyframes sparkleFloat {
                  0%, 100% { transform: scale(0.85) rotate(0deg); opacity: 0.5; }
                  50% { transform: scale(1.2) rotate(18deg); opacity: 1; }
                }
                .anim-cab { animation: cabBounce 2.2s ease-in-out infinite; }
                .anim-road { animation: roadDashesFlow 1.4s linear infinite; }
                .anim-cloud-1 { animation: cloudFloatLeft 7s ease-in-out infinite; }
                .anim-cloud-2 { animation: cloudFloatRight 9s ease-in-out infinite; }
                .anim-sun { transform-origin: 400px 65px; animation: sunGlow 3.6s ease-in-out infinite; }
                .anim-beam { animation: headlightBeam 1.8s ease-in-out infinite; }
                .anim-sparkle { transform-origin: center; animation: sparkleFloat 2.4s ease-in-out infinite; }
              `}</style>
              
              <clipPath id="sceneryClip">
                <rect x="0" y="0" width="520" height="280" rx="22" />
              </clipPath>

              <linearGradient id="skyGrad" x1="260" y1="0" x2="260" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE" />
                <stop offset="0.55" stopColor="#FEF3C7" />
                <stop offset="1" stopColor="#FED7AA" />
              </linearGradient>
              <linearGradient id="hillBack" x1="260" y1="60" x2="260" y2="280" gradientUnits="userSpaceOnUse">
                <stop stopColor="#86EFAC" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
              <linearGradient id="hillMid" x1="260" y1="100" x2="260" y2="280" gradientUnits="userSpaceOnUse">
                <stop stopColor="#16A34A" />
                <stop offset="1" stopColor="#14532D" />
              </linearGradient>
              <linearGradient id="hillFront" x1="260" y1="140" x2="260" y2="280" gradientUnits="userSpaceOnUse">
                <stop stopColor="#15803D" />
                <stop offset="1" stopColor="#0B3E25" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="260" y1="130" x2="260" y2="280" gradientUnits="userSpaceOnUse">
                <stop stopColor="#64748B" />
                <stop offset="1" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="cabBody" x1="0" y1="0" x2="100" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>

            <g clipPath="url(#sceneryClip)">
              {/* Sky Background */}
              <rect x="0" y="0" width="520" height="280" fill="url(#skyGrad)" />
              
              {/* Morning Sun over Seshachalam Hills */}
              <g className="anim-sun">
                <circle cx="400" cy="65" r="28" fill="#FBBF24" opacity="0.9" />
                <circle cx="400" cy="65" r="42" fill="#FDE68A" opacity="0.35" />
              </g>

              {/* Gentle Floating Clouds */}
              <path className="anim-cloud-1" d="M60 55C60 48 66 44 73 44C76 39 82 37 88 40C93 36 101 37 104 43C110 43 115 47 115 53C115 58 109 63 103 63H70C64 63 60 59 60 55Z" fill="#FFFFFF" opacity="0.9" />
              <path className="anim-cloud-2" d="M180 40C180 34 185 30 191 30C194 26 200 24 205 27C209 23 216 24 219 29C224 29 228 33 228 38C228 43 223 47 218 47H188C183 47 180 44 180 40Z" fill="#FFFFFF" opacity="0.8" />
              <path className="anim-cloud-1" d="M330 35C330 30 334 27 340 27C343 23 348 22 352 24C355 21 361 22 363 26C367 26 370 29 370 33C370 37 366 40 362 40H336C332 40 330 38 330 35Z" fill="#FFFFFF" opacity="0.75" />

              {/* Distant Mountains (Back Layer - Seshachalam Range) */}
              <path d="M0 160C80 120 160 110 240 130C320 150 410 100 520 140V280H0V160Z" fill="url(#hillBack)" opacity="0.8" />
              
              {/* Temple Shikharam / Gopuram on Ridge */}
              <g transform="translate(255, 108) scale(0.7)" fill="#0F5132">
                <path d="M12 0L24 16H0L12 0Z" />
                <rect x="3" y="16" width="18" height="12" />
                <rect x="1" y="28" width="22" height="10" />
                <circle cx="12" cy="-3" r="2.5" fill="#F59E0B" />
              </g>

              {/* Mid Mountain Layer */}
              <path d="M0 185C90 145 190 165 280 145C370 125 450 160 520 135V280H0V185Z" fill="url(#hillMid)" opacity="0.92" />

              {/* Winding Ghat Highway (Sweeping S-Curve) */}
              <path d="M180 138C220 155 350 180 320 220C290 260 170 245 220 280H315C275 255 365 240 395 215C425 185 305 160 230 138H180Z" fill="url(#roadGrad)" />
              <path className="anim-road" d="M195 138C235 158 360 183 345 220C325 255 215 250 258 280" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="8 5" fill="none" opacity="0.9" />

              {/* Front Mountain Slope (Solid Edge-to-Edge Fill Covering Bottom Completely) */}
              <path d="M0 215C90 175 190 195 245 215C295 232 230 255 200 280H0V215Z" fill="url(#hillFront)" />
              <path d="M375 235C415 210 470 215 520 225V280H300C330 262 355 245 375 235Z" fill="url(#hillFront)" />

              {/* Safety Ghat Barriers & Guide Posts */}
              <g stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
                <path d="M365 210L375 220" />
                <path d="M380 222L390 234" />
                <path d="M394 236L405 250" />
                <path d="M225 238L215 252" />
                <path d="M208 255L198 270" />
              </g>

              {/* Lush Pine & Forest Trees */}
              <g fill="#0B3E25">
                <polygon points="40,165 47,148 54,165" />
                <polygon points="42,175 47,162 52,175" />
                <polygon points="75,180 83,158 91,180" />
                <polygon points="77,192 83,174 89,192" />
                <polygon points="120,205 128,185 136,205" />
                <polygon points="440,165 449,145 458,165" />
                <polygon points="442,178 449,160 456,178" />
                <polygon points="475,185 483,165 491,185" />
                <polygon points="477,198 483,180 489,198" />
              </g>

              {/* Pilgrim Cab (Front 3/4 Perspective Traveling on the Ghat) */}
              <g transform="translate(295, 178)">
                {/* Cab Ground Shadow */}
                <ellipse cx="56" cy="50" rx="48" ry="8" fill="#0A1810" opacity="0.38" />

                <g className="anim-cab">
                  {/* Cab Main Body */}
                  <path d="M10 35C10 30 15 27 22 27L38 26L55 11C59 8 64 7 71 7H90C96 7 100 10 103 15L110 26H114C118 26 121 29 121 34V42C121 44 119 46 116 46H10C6 46 10 41 10 35Z" fill="url(#cabBody)" stroke="#B45309" strokeWidth="1.5" />
                  
                  {/* Roof Luggage Carrier (Essential Pilgrim Travel Detail) */}
                  <rect x="58" y="3" width="40" height="4.5" rx="1.5" fill="#334155" />
                  <line x1="64" y1="3" x2="64" y2="7" stroke="#334155" strokeWidth="2" />
                  <line x1="82" y1="3" x2="82" y2="7" stroke="#334155" strokeWidth="2" />
                  <line x1="94" y1="3" x2="94" y2="7" stroke="#334155" strokeWidth="2" />
                  {/* Luggage Duffel on Carrier */}
                  <rect x="66" y="-4" width="26" height="8" rx="2.5" fill="#0F5132" stroke="#0B3E25" strokeWidth="1" />

                  {/* Windshield & Windows */}
                  <path d="M57 14L43 26H70V14H57Z" fill="#E0F2FE" opacity="0.95" stroke="#CBD5E1" strokeWidth="1" />
                  <path d="M74 14H96L92 26H74V14Z" fill="#E0F2FE" opacity="0.95" stroke="#CBD5E1" strokeWidth="1" />
                  
                  {/* Glowing Headlight */}
                  <path d="M118 31L121 39H116L114 31H118Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
                  {/* Headlight Beam Sweeping Ghat Road */}
                  <polygon className="anim-beam" points="121,31 165,24 172,48 121,40" fill="#FEF08A" />

                  {/* Wheels */}
                  <g>
                    {/* Front Wheel */}
                    <circle cx="98" cy="46" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
                    <circle cx="98" cy="46" r="5.5" fill="#94A3B8" />
                    {/* Rear Wheel */}
                    <circle cx="30" cy="46" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
                    <circle cx="30" cy="46" r="5.5" fill="#94A3B8" />
                  </g>

                  {/* Taxi Roof Sign */}
                  <rect x="74" y="0" width="14" height="4" rx="1" fill="#FFFFFF" stroke="#0F5132" strokeWidth="1" />
                </g>
              </g>

              {/* Sparkles / Serene Holy Atmosphere */}
              <g fill="#F59E0B" className="anim-sparkle">
                <path d="M120 45L122 51L128 53L122 55L120 61L118 55L112 53L118 51L120 45Z" opacity="0.9" />
                <path d="M460 55L462 60L467 62L462 64L460 69L458 64L453 62L458 60L460 55Z" opacity="0.85" />
                <circle cx="480" cy="95" r="2.5" opacity="0.75" />
              </g>
            </g>
          </svg>
        </div>

        {/* ── COMING SOON BANNER ── */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '18px',
          padding: '12px 20px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(180, 83, 9, 0.06)',
          boxSizing: 'border-box'
        }}>
          <Sparkles size={16} color="#D97706" />
          <span style={{
            fontSize: '13.5px',
            fontWeight: 800,
            color: '#92400E',
            letterSpacing: '0.02em'
          }}>
            Coming Soon • Tirumala Ghat Cabs
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
          margin: '2px auto 10px',
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
          <span>
            {`${totalPilgrims} Pilgrims on Priority Waitlist`}
          </span>
        </div>

        {/* ── PHONE NUMBER INPUT & NOTIFY ACTION ── */}
        {!notified ? (
          <form
            onSubmit={handleNotify}
            style={{
              width: '100%',
              maxWidth: '360px',
              margin: '8px auto 16px',
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
                  <span>Notify Me</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '360px',
            margin: '8px auto 16px'
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
              Joined along with {totalPilgrims} pilgrims. {phone ? `We will alert +91 ${phone} first` : 'We will alert you first'} when verified Ghat cabs go live!
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0F5132',
            textDecoration: 'none',
            padding: '8px 16px'
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </main>
    </div>
  );
}

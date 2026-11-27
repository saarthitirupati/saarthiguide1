'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Sparkles,
  Phone,
  User,
  MapPin,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isRoomBookingOpenIST } from '@/lib/istDate';

const BASE_ROOM_WAITLIST = 142;

export default function RoomBookingPage() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [acceptedDownhill, setAcceptedDownhill] = useState(false);
  const [acceptedFamilyPolicy, setAcceptedFamilyPolicy] = useState(false);
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(() => isRoomBookingOpenIST());
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saarthi_notified_rooms');
      if (stored === 'true') {
        setNotified(true);
        const storedName = localStorage.getItem('saarthi_notified_rooms_name');
        const storedPhone = localStorage.getItem('saarthi_notified_rooms_phone');
        if (storedName) setName(storedName);
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

    const hoursTimer = setInterval(() => {
      setIsBookingOpen(isRoomBookingOpenIST());
    }, 60000);

    return () => {
      clearInterval(hoursTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNotify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isRoomBookingOpenIST()) {
      setIsBookingOpen(false);
      setBookingError('Room bookings are open from 6:00 AM to 10:00 PM IST only.');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    const trimmedName = name.trim();
    if (notified || submitting || trimmedName.length < 2 || digits.length !== 10 || !checkIn || !checkOut || checkOut < checkIn || !acceptedDownhill || !acceptedFamilyPolicy) return;

    setBookingError('');
    setSubmitting(true);
    setNotified(true);
    setWaitlistCount((prev) => (prev !== null ? prev + 1 : 1));

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('saarthi_notified_rooms', 'true');
        localStorage.setItem('saarthi_notified_rooms_name', trimmedName);
        localStorage.setItem('saarthi_notified_rooms_phone', digits);
      }
      const res = await fetch('/api/launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'rooms', name: trimmedName, phone: digits, checkIn, checkOut }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotified(false);
        setWaitlistCount((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('saarthi_notified_rooms');
        }
        if (res.status === 403 || data?.code === 'OUTSIDE_HOURS') {
          setIsBookingOpen(false);
        }
        setBookingError(data?.error || 'Unable to submit right now. Please try again.');
        return;
      }
      if (typeof data?.counts?.rooms === 'number') {
        setWaitlistCount(data.counts.rooms);
      }
    } catch (e) {
      console.error('Failed to record room launch interest:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.replace(/\D/g, '').length === 10;
  const isCheckInValid = checkIn.trim().length > 0;
  const isCheckOutValid = checkOut.trim().length > 0 && (!checkIn || checkOut >= checkIn);
  const todayIstDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  const isFormValid = isNameValid && isPhoneValid && isCheckInValid && isCheckOutValid && acceptedDownhill && acceptedFamilyPolicy;
  const totalPilgrims = BASE_ROOM_WAITLIST + (waitlistCount !== null ? waitlistCount : 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAF7',
      color: '#1B2A1E',
      maxWidth: '680px',
      margin: '0 auto',
      paddingBottom: 'calc(124px + env(safe-area-inset-bottom, 16px))',
      boxSizing: 'border-box'
    }}>
      {/* ── STICKY HEADER ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
            <p style={{ fontSize: '11px', margin: 0, color: '#687968', fontWeight: 500 }}>
              Verified Tirupati Pilgrim Stays
            </p>
          </div>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 800,
          color: '#B45309',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '4px 10px',
          borderRadius: '999px'
        }}>
          <Clock size={11} />
          <span>6 AM – 10 PM Desk</span>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '18px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* HERO ILLUSTRATION CARD */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto 18px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 18px 40px -12px rgba(6, 78, 59, 0.24), 0 4px 12px rgba(0,0,0,0.04)',
          border: '1.5px solid #D1E2CF',
          backgroundColor: '#064E3B'
        }}>
          <svg viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <style>{`
                @keyframes windowGlow {
                  0%, 100% { opacity: 0.72; }
                  50% { opacity: 1; }
                }
                @keyframes moonFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-4px); }
                }
                .anim-win { animation: windowGlow 2.8s ease-in-out infinite; }
                .anim-moon { animation: moonFloat 4s ease-in-out infinite; }
              `}</style>
              <linearGradient id="nightSky" x1="260" y1="0" x2="260" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#022C22" />
                <stop offset="0.55" stopColor="#064E3B" />
                <stop offset="1" stopColor="#0F5132" />
              </linearGradient>
            </defs>

            <rect width="520" height="220" fill="url(#nightSky)" />
            <path d="M0 158 Q95 102 195 148 T400 128 T520 148 L520 220 L0 220 Z" fill="#033326" opacity="0.85" />
            <circle cx="430" cy="48" r="17" fill="#FEF3C7" className="anim-moon" />
            <circle cx="88" cy="42" r="2" fill="#A7F3D0" opacity="0.85" />
            <circle cx="152" cy="28" r="1.8" fill="#FDE68A" opacity="0.9" />
            <circle cx="322" cy="36" r="2.2" fill="#A7F3D0" opacity="0.75" />

            {/* Stylized Pilgrim Lodge */}
            <rect x="135" y="72" width="250" height="118" rx="14" fill="#FFFFFF" />
            <rect x="125" y="62" width="270" height="16" rx="6" fill="#F59E0B" />
            <rect x="195" y="48" width="130" height="22" rx="8" fill="#14532D" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="260" y="63" textAnchor="middle" fill="#FEF3C7" fontSize="10" fontWeight="800" fontFamily="sans-serif">SAARTHI STAYS</text>

            <rect x="158" y="94" width="36" height="28" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" className="anim-win" />
            <rect x="212" y="94" width="36" height="28" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" className="anim-win" />
            <rect x="272" y="94" width="36" height="28" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" className="anim-win" />
            <rect x="326" y="94" width="36" height="28" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" className="anim-win" />

            <rect x="234" y="142" width="52" height="48" rx="8" fill="#0F5132" />
            <rect x="158" y="144" width="44" height="25" rx="5" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
            <rect x="318" y="144" width="44" height="25" rx="5" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
            <rect x="0" y="188" width="520" height="32" fill="#022C22" />
          </svg>
        </div>

        {/* COMING SOON BADGE BELOW IMAGE */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11.5px',
          fontWeight: 800,
          color: '#B45309',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '4px 12px',
          borderRadius: '999px',
          marginBottom: '10px'
        }}>
          <Sparkles size={12} />
          <span>Coming Soon</span>
        </div>

        {/* HEADING & LIVE COUNT */}
        <h2 style={{
          fontSize: '21px',
          fontWeight: 800,
          color: '#1B2A1E',
          margin: '0 0 4px 0',
          letterSpacing: '-0.02em'
        }}>
          Direct Room Bookings in Tirupati
        </h2>
        <p style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#0F5132',
          margin: '0 0 12px 0'
        }}>
          Kondakindha (Downhill Tirupati • Not Tirumala Hilltop)
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '999px',
          padding: '6px 14px',
          marginBottom: '18px',
          fontSize: '12.5px',
          fontWeight: 800,
          color: '#15803D',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#16A34A',
            display: 'inline-block'
          }} />
          <span>{`${totalPilgrims} Pilgrims Waiting`}</span>
        </div>

        {/* NOT-INSTANT & INSTANT NEED BANNER */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '18px',
          padding: '13px 14px',
          marginBottom: '14px',
          textAlign: 'left',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#92400E',
            marginBottom: '4px'
          }}>
            <AlertCircle size={15} color="#D97706" style={{ flexShrink: 0 }} />
            <span>Bookings are not instant</span>
          </div>
          <p style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#78350F',
            fontWeight: 600,
            margin: '0 0 10px 0'
          }}>
            Submit only if you&apos;re looking to book — our team calls (6 AM – 10 PM IST) to confirm availability.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            paddingTop: '8px',
            borderTop: '1px dashed #FCD34D'
          }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400E', marginRight: '2px' }}>
              Instant need?
            </span>
            <a
              href="tel:+919618831607"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#14532D',
                color: '#FFFFFF',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <Phone size={11} />
              <span>+91 96188 31607</span>
            </a>
            <a
              href="https://www.instagram.com/saarthi.tirupati/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FFFFFF',
                color: '#92400E',
                border: '1px solid #FCD34D',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <span>IG @saarthi.tirupati</span>
            </a>
          </div>
        </div>

        {/* ELEVATED NOTIFY CARD */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #D1E2CF',
          borderRadius: '22px',
          padding: '18px 16px',
          boxShadow: '0 8px 24px rgba(15, 81, 50, 0.06)',
          marginBottom: '16px',
          boxSizing: 'border-box'
        }}>
          {!notified ? (
            !isBookingOpen ? (
              <div style={{ padding: '14px 8px', textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Clock size={22} />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1B2A1E', marginBottom: '6px' }}>
                  Room Bookings Currently Closed
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.55, margin: '0 0 12px 0' }}>
                  Our room booking desk is open daily from <strong>6:00 AM to 10:00 PM IST</strong> only.
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  <Clock size={13} />
                  <span>Reopens at 6:00 AM IST</span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '12px 0 0 0', lineHeight: 1.5 }}>
                  For any instant need, call{' '}
                  <a
                    href="tel:+919618831607"
                    style={{ color: '#0F5132', fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap' }}
                  >
                    +91 96188 31607
                  </a>{' '}
                  or DM us on Instagram:{' '}
                  <a
                    href="https://www.instagram.com/saarthi.tirupati/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0F5132', fontWeight: 800, textDecoration: 'underline', whiteSpace: 'nowrap' }}
                  >
                    @saarthi.tirupati
                  </a>
                </p>
              </div>
            ) : (
            <form
              onSubmit={handleNotify}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {/* Booking Hours Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '999px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#15803D',
                alignSelf: 'center'
              }}>
                <Clock size={12} />
                <span>Bookings Open: 6:00 AM – 10:00 PM IST</span>
              </div>

              {bookingError && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textAlign: 'left'
                }}>
                  {bookingError}
                </div>
              )}

              {/* Clear Downhill-Only Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '14px',
                padding: '10px 12px',
                textAlign: 'left',
                fontSize: '12px',
                lineHeight: 1.45,
                color: '#92400E',
                fontWeight: 600
              }}>
                <MapPin size={15} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Tirupati Downhill (Kondakindha) Only:</strong> Rooms are in Tirupati town (Station / Bus Stand / Alipiri) — <strong>not uphill in Tirumala</strong>.
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAF7',
                border: `1.5px solid ${isNameValid ? '#14532D' : '#CBD5E1'}`,
                borderRadius: '16px',
                padding: '2px 14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}>
                <User size={16} color="#14532D" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  type="text"
                  minLength={2}
                  maxLength={60}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1B2A1E',
                    padding: '11px 0'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAF7',
                border: `1.5px solid ${isPhoneValid ? '#14532D' : '#CBD5E1'}`,
                borderRadius: '16px',
                padding: '2px 14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}>
                <Phone size={16} color="#14532D" style={{ marginRight: '8px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginRight: '6px' }}>+91</span>
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
                    padding: '11px 0',
                    letterSpacing: phone.length > 0 ? '0.04em' : 'normal'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                width: '100%'
              }}>
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  minWidth: 0
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', paddingLeft: '4px' }}>
                    Check-in <span style={{ color: '#DC2626' }}>*</span>
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAF7',
                    border: `1.5px solid ${isCheckInValid ? '#14532D' : '#CBD5E1'}`,
                    borderRadius: '14px',
                    padding: '2px 10px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    minWidth: 0
                  }}>
                    <Calendar size={14} color="#14532D" style={{ marginRight: '6px', flexShrink: 0 }} />
                    <input
                      type="date"
                      min={todayIstDate}
                      value={checkIn}
                      onChange={(e) => {
                        const nextIn = e.target.value;
                        setCheckIn(nextIn);
                        if (checkOut && nextIn && nextIn > checkOut) {
                          setCheckOut('');
                        }
                      }}
                      required
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: checkIn ? '#1B2A1E' : '#64748B',
                        padding: '10px 0'
                      }}
                    />
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  minWidth: 0
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', paddingLeft: '4px' }}>
                    Check-out <span style={{ color: '#DC2626' }}>*</span>
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAF7',
                    border: `1.5px solid ${isCheckOutValid ? '#14532D' : '#CBD5E1'}`,
                    borderRadius: '14px',
                    padding: '2px 10px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    minWidth: 0
                  }}>
                    <Calendar size={14} color="#14532D" style={{ marginRight: '6px', flexShrink: 0 }} />
                    <input
                      type="date"
                      min={checkIn || todayIstDate}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: checkOut ? '#1B2A1E' : '#64748B',
                        padding: '10px 0'
                      }}
                    />
                  </div>
                </label>
              </div>

              {/* Mandatory Downhill Confirmation Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                padding: '4px 4px 0'
              }}>
                <input
                  type="checkbox"
                  checked={acceptedDownhill}
                  onChange={(e) => setAcceptedDownhill(e.target.checked)}
                  required
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#14532D',
                    marginTop: '1px',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                />
                <span>
                  I understand rooms will open for <strong>Tirupati Downhill (Kondakindha)</strong>, not Tirumala uphill.
                </span>
              </label>

              {/* Mandatory Unmarried Couples Policy Checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                padding: '2px 4px 0'
              }}>
                <input
                  type="checkbox"
                  checked={acceptedFamilyPolicy}
                  onChange={(e) => setAcceptedFamilyPolicy(e.target.checked)}
                  required
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#14532D',
                    marginTop: '1px',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                />
                <span>
                  I understand rooms will <strong>not be booked for unmarried couples</strong> (families &amp; valid ID required).
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !isFormValid}
                style={{
                  width: '100%',
                  backgroundColor: isFormValid ? '#14532D' : '#94A3B8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '13px 20px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: isFormValid ? (submitting ? 'wait' : 'pointer') : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isFormValid ? '0 6px 18px rgba(20, 83, 45, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  marginTop: '2px'
                }}
              >
                <Bell size={17} />
                <span>{submitting ? 'Submitting...' : 'Request Room Booking Call'}</span>
              </button>
            </form>
            )
          ) : (
            <div>
              <div style={{
                width: '100%',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1.5px solid #A7F3D0',
                borderRadius: '16px',
                padding: '13px 16px',
                fontSize: '15px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>{`You're #${totalPilgrims} on the Notify List!`}</span>
              </div>
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '12.5px',
                color: '#15803D',
                fontWeight: 600,
                marginTop: '10px',
                lineHeight: 1.45
              }}>
                {phone
                  ? `Thank you${name ? `, ${name}` : ''}! We will notify +91 ${phone} first when Tirupati Downhill (Kondakindha) room booking goes live.`
                  : 'We will notify you first when Tirupati Downhill (Kondakindha) room booking goes live.'}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

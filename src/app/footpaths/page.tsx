'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Footprints, Clock, AlertTriangle, ShieldCheck, 
  MapPin, Navigation, Baby, ExternalLink, Share2, Check,
  Sparkles, CheckCircle2, ChevronRight, Droplet, UtensilsCrossed, 
  Hospital, Mountain, Bus, Sunrise, Sun, Coffee
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export default function FootpathsPage() {
  const lang = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<'both' | 'srivari' | 'alipiri'>('both');
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tirumala Footpath Routes & Live Trek Timings | Saarthi',
        text: 'Srivari Mettu (6:00 AM–5:30 PM, <12 yrs till 2:00 PM) & Alipiri Mettu (5:00 AM–9:30 PM). Live timings & guidelines.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F5',
      color: '#0F172A',
      fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif',
      paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 16px))'
    }}>
      {/* ── 1. STICKY TOP APP BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link 
            href="/"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              {lang === 'te' ? 'తిరుమల సోపాన మార్గాలు' : 'Footpath Routes'}
            </h1>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              {lang === 'te' ? 'లైవ్ సమయాలు & నిబంధనలు' : 'Live Gate Timings & Guidelines'}
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16A34A',
            cursor: 'pointer'
          }}
          aria-label="Share route details"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
        </button>
      </header>

      {/* ── 2. HERO HIGHLIGHT LOCKUP ── */}
      <div style={{
        background: 'linear-gradient(135deg, #022819 0%, #064E3B 100%)',
        color: '#FFFFFF',
        padding: '20px 16px 26px',
        borderBottom: '3px solid #C89B3C'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(200, 155, 60, 0.2)',
            border: '1px solid rgba(200, 155, 60, 0.4)',
            color: '#FDE047',
            padding: '3px 10px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <Sparkles size={12} color="#C89B3C" />
            <span>{lang === 'te' ? 'లైవ్ సమయాలు' : 'Live Timings'}</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.25 }}>
            {lang === 'te' ? 'తిరుమల కొండ నడక మార్గాలు' : 'Two Trek Pathways up Tirumala'}
          </h2>

          <p style={{ fontSize: '12.5px', color: '#D1FAE5', margin: 0, lineHeight: 1.45 }}>
            {lang === 'te'
              ? 'శ్రీవారి మెట్టు (2.1 కి.మీ - వేగవంతమైనది) • అలిపిరి (9 కి.మీ - 24/7 రక్షణ)'
              : 'Srivari Mettu (2.1 km • Faster) vs Alipiri Mettu (9 km • Historic 24/7 route)'}
          </p>

          {/* Quick Filter Switch */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '14px'
          }}>
            <button
              onClick={() => setSelectedRoute('both')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRoute === 'both' ? '#C89B3C' : 'rgba(255,255,255,0.15)',
                color: selectedRoute === 'both' ? '#022819' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'te' ? 'అన్నీ' : 'Compare'}
            </button>
            <button
              onClick={() => setSelectedRoute('srivari')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRoute === 'srivari' ? '#C89B3C' : 'rgba(255,255,255,0.15)',
                color: selectedRoute === 'srivari' ? '#022819' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'te' ? 'శ్రీవారి మెట్టు' : 'Srivari Mettu'}
            </button>
            <button
              onClick={() => setSelectedRoute('alipiri')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRoute === 'alipiri' ? '#C89B3C' : 'rgba(255,255,255,0.15)',
                color: selectedRoute === 'alipiri' ? '#022819' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'te' ? 'అలిపిరి' : 'Alipiri'}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN ROUTE DETAILS CONTAINER ── */}
      <main style={{ maxWidth: '680px', margin: '-14px auto 0', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* ── SIDE-BY-SIDE QUICK COMPARISON MATRIX (When Compare Both) ── */}
        {selectedRoute === 'both' && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #E2E8F0',
            padding: '14px 16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>Fastest</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Srivari Mettu</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>2.1 km • ~2,388 steps</div>
              </div>
              <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 6px', borderRadius: '4px' }}>Traditional</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Alipiri Mettu</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>9.0 km • ~3,550 steps</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div><strong>Hours:</strong> 6:00 AM – 5:30 PM</div>
                <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '12px' }}><strong>Hours:</strong> 5:00 AM – 9:30 PM</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div><strong>Trek:</strong> ~1.5 - 2 hrs</div>
                <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '12px' }}><strong>Trek:</strong> ~3.5 - 4.5 hrs</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0' }}>
                <div style={{ color: '#DC2626' }}><strong>Kids:</strong> Allowed till 2 PM</div>
                <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '12px', color: '#059669' }}><strong>Kids:</strong> Allowed till 9:30 PM</div>
              </div>
            </div>
          </section>
        )}

        {/* ── CARD 1: SRIVARI METTU ── */}
        {(selectedRoute === 'both' || selectedRoute === 'srivari') && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #FDE68A',
            padding: '16px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.06)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#B45309',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  padding: '2px 6px',
                  borderRadius: '5px'
                }}>
                  Shortest Route
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#78350F', margin: 0 }}>
                  Srivari Mettu
                </h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '12px' }}>
                Open Daily
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              padding: '8px 10px',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600 }}>Distance</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#92400E' }}>2.1 km</div>
              </div>
              <div style={{ borderLeft: '1px solid #FDE68A', borderRight: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600 }}>Steps</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#92400E' }}>2,388</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600 }}>Duration</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#92400E' }}>~1.5-2 hrs</div>
              </div>
            </div>

            {/* Gate Timings Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '6px 10px', marginBottom: '10px', fontSize: '11.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Gate Hours:</span>
              <span style={{ fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} color="#D97706" /> 6:00 AM – 5:30 PM
              </span>
            </div>

            {/* Child Restriction Pill */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#991B1B'
            }}>
              <Baby size={15} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>Children &lt;12 yrs entry strictly closes at 2:00 PM</span>
            </div>

            {/* Key Advantages Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Saves 2 hours trek time
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Fully sheltered steps
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Divya Darshan tokens at step 1,200
              </span>
            </div>

            {/* Free Bus Service: Tirupati Railway Station → Srivari Mettu */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Bus size={16} color="#0284C7" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    {lang === 'te' ? 'ఉచిత బస్సు సర్వీస్' : 'Free Bus Service'}
                  </span>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#0284C7',
                  backgroundColor: '#E0F2FE',
                  border: '1px solid #BAE6FD',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {lang === 'te' ? 'ఉచిత ప్రయాణం' : '100% Free TTD Bus'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '10px' }}>
                <MapPin size={13} color="#0284C7" style={{ flexShrink: 0 }} />
                <span>
                  {lang === 'te'
                    ? 'రూటు: తిరుపతి రైల్వే స్టేషన్ → శ్రీవారి మెట్టు'
                    : 'Route: Tirupati Railway Station → Srivari Mettu'}
                </span>
              </div>

              {/* Morning Schedule */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#B45309', marginBottom: '6px' }}>
                  <Sunrise size={13} color="#D97706" />
                  <span>{lang === 'te' ? 'ఉదయం బయలుదేరే వేళలు' : 'Morning Departures'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {['5:00 AM', '5:45 AM', '6:30 AM', '7:15 AM', '8:00 AM', '8:45 AM', '9:30 AM', '10:15 AM', '11:00 AM', '11:45 AM'].map((time, idx) => (
                    <span key={`m-${idx}`} style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1E293B',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '3px 7px',
                      borderRadius: '6px'
                    }}>
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Afternoon Schedule */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#C2410C', marginBottom: '6px' }}>
                  <Sun size={13} color="#EA580C" />
                  <span>{lang === 'te' ? 'మధ్యాహ్నం బయలుదేరే వేళలు' : 'Afternoon Departures'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {['12:30 PM', '1:15 PM', '2:00 PM', '2:45 PM', '3:30 PM', '4:15 PM', '5:00 PM'].map((time, idx) => (
                    <span key={`a-${idx}`} style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1E293B',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '3px 7px',
                      borderRadius: '6px'
                    }}>
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginTop: '8px' }}>
                {lang === 'te'
                  ? 'ప్రతి 45 నిమిషాలకు రైల్వే స్టేషన్ నుండి బస్సులు బయలుదేరుతాయి. శ్రీవారి మెట్టు బేస్ వద్ద నేరుగా దింపుతాయి.'
                  : 'Buses depart every 45 minutes from Tirupati Railway Station directly to Srivari Mettu base arch.'}
              </div>
            </div>

            {/* GPS Navigation Action */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=13.6267,79.3142"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                padding: '11px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
              }}
            >
              <Navigation size={15} />
              <span>Navigate to Srivari Mettu Gate</span>
              <ExternalLink size={13} style={{ opacity: 0.8 }} />
            </a>
          </section>
        )}

        {/* ── CARD 2: ALIPIRI METTU ── */}
        {(selectedRoute === 'both' || selectedRoute === 'alipiri') && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #BAE6FD',
            padding: '16px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.06)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#0369A1',
                  backgroundColor: '#E0F2FE',
                  border: '1px solid #BAE6FD',
                  padding: '2px 6px',
                  borderRadius: '5px'
                }}>
                  Historic Pathway
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Alipiri Mettu
                </h3>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '12px' }}>
                Open Daily
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              backgroundColor: '#F0F9FF',
              border: '1.5px solid #BAE6FD',
              borderRadius: '10px',
              padding: '8px 10px',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#0369A1', fontWeight: 600 }}>Distance</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284C7' }}>9.0 km</div>
              </div>
              <div style={{ borderLeft: '1px solid #BAE6FD', borderRight: '1px solid #BAE6FD' }}>
                <div style={{ fontSize: '10px', color: '#0369A1', fontWeight: 600 }}>Steps</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284C7' }}>3,550</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#0369A1', fontWeight: 600 }}>Duration</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284C7' }}>~3.5-4.5 hrs</div>
              </div>
            </div>

            {/* Gate Timings Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '6px 10px', marginBottom: '10px', fontSize: '11.5px' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Gate Hours:</span>
              <span style={{ fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} color="#0284C7" /> 5:00 AM – 9:30 PM
              </span>
            </div>

            {/* Key Advantages Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369A1', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ 24/7 Illuminated & Security
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369A1', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Free luggage van to Tirumala
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369A1', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Medical & RO water at Galigopuram
              </span>
            </div>

            {/* GPS Navigation Action */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=13.647051,79.405856"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                padding: '11px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
              }}
            >
              <Navigation size={15} />
              <span>Navigate to Alipiri Gate</span>
              <ExternalLink size={13} style={{ opacity: 0.8 }} />
            </a>
          </section>
        )}

        {/* ── CARD 3: TIRUMALA ANNAPRASADAM COMPLEX ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid #FDE68A',
          padding: '16px',
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.06)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FEF3C7',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}>
                <UtensilsCrossed size={16} color="#D97706" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#78350F', margin: 0 }}>
                  {lang === 'te' ? 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాదం' : 'Matrusri Tarigonda Vengamamba Annaprasadam'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  <MapPin size={11} color="#64748B" />
                  <span>{lang === 'te' ? 'తిరుమల కొండపై' : 'Annaprasadam Complex, Tirumala'}</span>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '12px', flexShrink: 0 }}>
              {lang === 'te' ? 'ఉచితం' : '100% Free'}
            </span>
          </div>

          {/* Guidelines Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '6px' }}>
              <CheckCircle2 size={12} color="#16A34A" />
              <span>{lang === 'te' ? 'భక్తులకు ఉచిత అన్నప్రసాదం' : 'Free Annaprasadam for devotees'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '6px' }}>
              <CheckCircle2 size={12} color="#16A34A" />
              <span>{lang === 'te' ? 'టిక్కెట్ లేదా చెల్లింపు అవసరం లేదు' : 'No ticket or payment required'}</span>
            </div>
          </div>

          {/* Timings Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, color: '#B45309' }}>
                <Coffee size={12} color="#D97706" />
                <span>{lang === 'te' ? 'టిఫిన్ సమయం' : 'Tiffin'}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                9:00 AM – 10:30 AM
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, color: '#B45309' }}>
                <Sun size={12} color="#EA580C" />
                <span>{lang === 'te' ? 'మధ్యాహ్న భోజనం' : 'Lunch'}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                10:30 AM – 4:00 PM
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, color: '#64748B' }}>
                <Clock size={12} color="#64748B" />
                <span>{lang === 'te' ? 'విరామం (క్లోజ్)' : 'Break'}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginTop: '2px' }}>
                4:00 PM – 5:00 PM
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, color: '#B45309' }}>
                <UtensilsCrossed size={12} color="#D97706" />
                <span>{lang === 'te' ? 'రాత్రి భోజనం' : 'Dinner'}</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                5:00 PM – 10:30 PM
              </div>
            </div>
          </div>

          {/* Food Details */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                {lang === 'te' ? 'టిఫిన్ మెనూ' : 'Tiffin Menu'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.4 }}>
                Upma, Pongal, Semiya Upma, Chutney
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                {lang === 'te' ? 'భోజనం మెనూ (మధ్యాహ్నం & రాత్రి)' : 'Lunch & Dinner Menu'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.4 }}>
                Rice, Curry, Sambar, Rasam, Chutney, Buttermilk, Sweet Pongal
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', marginBottom: '2px' }}>
                {lang === 'te' ? 'వడ ప్రసాదం' : 'Special Vada'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.4 }}>
                {lang === 'te'
                  ? 'TTD ప్రకటన ప్రకారం సుమారు ఉదయం 11:00 నుండి రాత్రి 10:00 వరకు అందుబాటులో ఉంటుంది.'
                  : 'Available approximately from 11:00 AM to 10:00 PM, according to TTD announcement.'}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

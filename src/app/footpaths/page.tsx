'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Footprints, Clock, AlertTriangle, ShieldCheck, 
  MapPin, Navigation, Baby, ExternalLink, Share2, Check,
  Sparkles, CheckCircle2, ChevronRight, Droplet, UtensilsCrossed, 
  Hospital, Mountain
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
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              {lang === 'te' ? 'తిరుమల సోపాన మార్గాలు' : 'Tirumala Footpath Routes'}
            </h1>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              {lang === 'te' ? 'అలిపిరి & శ్రీవారి మెట్టు వేళలు' : 'Alipiri & Srivari Mettu Trek Timings'}
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
        padding: '24px 18px 32px',
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
            padding: '4px 10px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} color="#C89B3C" />
            <span>{lang === 'te' ? 'నడకదారి భక్తుల సమయాలు' : 'Live Pedestrian Gate Timings'}</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.25 }}>
            {lang === 'te' 
              ? 'శ్రీవారి మెట్టు & అలిపిరి నడక మార్గాల పూర్తి వివరాలు' 
              : 'Two Sacred Routes up the Seven Hills'}
          </h2>

          <p style={{ fontSize: '13px', color: '#D1FAE5', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
            {lang === 'te'
              ? 'శ్రీవారి మెట్టు వేగవంతమైన ప్రత్యామ్నాయ మార్గం. అలిపిరి సాంప్రదాయ సుదీర్ఘ మార్గం. నియమాలను ముందుగా గమనించండి.'
              : 'Srivari Mettu offers the shorter 2.1 km trek. Alipiri is the historic 9 km pathway with 24/7 security & shelters.'}
          </p>

          {/* Quick Filter Switch */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '16px'
          }}>
            <button
              onClick={() => setSelectedRoute('both')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRoute === 'both' ? '#C89B3C' : 'rgba(255,255,255,0.15)',
                color: selectedRoute === 'both' ? '#022819' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'te' ? 'అన్నీ చూడండి' : 'Compare Both'}
            </button>
            <button
              onClick={() => setSelectedRoute('srivari')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
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
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRoute === 'alipiri' ? '#C89B3C' : 'rgba(255,255,255,0.15)',
                color: selectedRoute === 'alipiri' ? '#022819' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'te' ? 'అలిపిరి మెట్టు' : 'Alipiri Mettu'}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN ROUTE DETAILS CONTAINER ── */}
      <main style={{ maxWidth: '680px', margin: '-16px auto 0', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── CARD 1: SRIVARI METTU (ALTERNATIVE ROUTE) ── */}
        {(selectedRoute === 'both' || selectedRoute === 'srivari') && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #FDE68A',
            padding: '20px 18px',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.08)',
            position: 'relative'
          }}>
            {/* Header Lockup */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#B45309',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {lang === 'te' ? 'ప్రత్యామ్నాయ మార్గం • వేగవంతమైనది' : 'Alternative Route • Fastest Ascent'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#78350F', margin: '8px 0 2px' }}>
                  {lang === 'te' ? 'శ్రీవారి మెట్టు మార్గం' : 'Srivari Mettu Footpath'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  Srinivasa Mangapuram / Chandragiri side
                </span>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                padding: '4px 10px',
                borderRadius: '99px'
              }}>
                Open Daily
              </span>
            </div>

            {/* Timings Highlight Pill */}
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1.5px solid #FDE68A',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#B45309', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'ప్రవేశ సమయాలు' : 'Gate Opening Hours'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#92400E', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#B45309" />
                  <span>6:00 AM – 5:30 PM</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'మెట్లు & సమయం' : 'Steps & Duration'}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                  ~2,388 Steps • ~1.5 - 2 hrs
                </div>
              </div>
            </div>

            {/* ⚠️ CRITICAL CHILD RESTRICTION ALERT */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FECACA',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '14px'
            }}>
              <Baby size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                  {lang === 'te' ? 'పిల్లల ప్రవేశ నియంత్రణ (ముఖ్యమైనది)' : 'Children Safety Restriction (Strict)'}
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#7F1D1D', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  {lang === 'te'
                    ? '12 సంవత్సరాల లోపు పిల్లలను మధ్యాహ్నం 2:00 PM తర్వాత ఈ మార్గంలో అనుమతించరు.'
                    : 'Children under 12 years are NOT allowed to enter Srivari Mettu after 2:00 PM due to forest security.'}
                </span>
              </div>
            </div>

            {/* Key Advantages Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? 'అలిపిరి కంటే దాదాపు 2 గంటల సమయం ఆదా అవుతుంది.' : 'Saves approx. 2 hours of trek time compared to Alipiri.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? 'అత్యధిక భాగం సోపాన మార్గం కప్పబడి ఉంటుంది.' : 'Fully sheltered steps with continuous resting gazebos.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? 'దివ్య దర్శనం టోకెన్లు 1,200వ మెట్టు వద్ద లభిస్తాయి (కోటా ఉన్నప్పుడు).' : 'Divya Darshan biometric tokens at step 1,200 (when quota active).'}</span>
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
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13.5px',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)'
              }}
            >
              <Navigation size={16} />
              <span>{lang === 'te' ? 'శ్రీవారి మెట్టు ప్రవేశానికి GPS దారి' : 'Navigate to Srivari Mettu Gate'}</span>
              <ExternalLink size={14} style={{ opacity: 0.8 }} />
            </a>
          </section>
        )}

        {/* ── CARD 2: ALIPIRI METTU (TRADITIONAL ROUTE) ── */}
        {(selectedRoute === 'both' || selectedRoute === 'alipiri') && (
          <section style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #BAE6FD',
            padding: '20px 18px',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
            position: 'relative'
          }}>
            {/* Header Lockup */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#0369A1',
                  backgroundColor: '#E0F2FE',
                  border: '1px solid #BAE6FD',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {lang === 'te' ? 'ప్రధాన సాంప్రదాయ మార్గం' : 'Main Traditional Route • 9 KM'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '8px 0 2px' }}>
                  {lang === 'te' ? 'అలిపిరి మెట్ల మార్గం' : 'Alipiri Mettu Footpath'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  Alipiri Circle / Garuda Statue Base
                </span>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                padding: '4px 10px',
                borderRadius: '99px'
              }}>
                Open Daily
              </span>
            </div>

            {/* Timings Highlight Pill */}
            <div style={{
              backgroundColor: '#F0F9FF',
              border: '1.5px solid #BAE6FD',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369A1', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'ప్రవేశ సమయాలు' : 'Gate Opening Hours'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0369A1', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#0284C7" />
                  <span>5:00 AM – 9:30 PM</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'మెట్లు & సమయం' : 'Steps & Duration'}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                  ~3,550 Steps • ~3.5 - 4.5 hrs
                </div>
              </div>
            </div>

            {/* Key Advantages Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#0284C7" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? '24/7 విద్యుత్ దీపాలు మరియు పూర్తి సీసీటీవీ నిఘా రక్షణ.' : '24/7 illuminated pathway with full forest security patrols.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#0284C7" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? 'ఉచిత లగేజీ రవాణా: అలిపిరిలో ఇస్తే తిరుమలలో ఉచితంగా అందజేస్తారు.' : 'Free luggage van service: Drop bags at Alipiri, collect atop hills.'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#0284C7" style={{ flexShrink: 0 }} />
                <span>{lang === 'te' ? 'గాలిగోపురం వద్ద ఉచిత తాగునీరు, మజ్జిగ మరియు ప్రథమ చికిత్స కేంద్రాలు.' : 'Galigopuram rest station with free RO water & medical posts.'}</span>
              </div>
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
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13.5px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Navigation size={16} />
              <span>{lang === 'te' ? 'అలిపిరి ప్రవేశానికి GPS దారి' : 'Navigate to Alipiri Gate'}</span>
              <ExternalLink size={14} style={{ opacity: 0.8 }} />
            </a>
          </section>
        )}

        {/* ── 4. QUICK SUMMARY COMPARISON TABLE ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: '0 0 10px' }}>
            {lang === 'te' ? 'త్వరిత పోలిక పట్టిక' : 'Quick Route Comparison'}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Distance</span>
              <span style={{ fontWeight: 600 }}>Srivari Mettu (2.1 km) vs Alipiri (9 km)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Gate Open</span>
              <span style={{ fontWeight: 600 }}>6:00 AM (Srivari) vs 5:00 AM (Alipiri)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Gate Close</span>
              <span style={{ fontWeight: 600 }}>5:30 PM (Srivari) vs 9:30 PM (Alipiri)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Kids &lt;12 Cutoff</span>
              <span style={{ fontWeight: 600, color: '#DC2626' }}>2:00 PM at Srivari Mettu</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

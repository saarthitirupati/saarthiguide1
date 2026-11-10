'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Sun, Info, ChevronRight } from 'lucide-react';
import { FESTIVALS_2026 } from '@/data/festivals';
import { useLanguage } from '@/lib/useLanguage';

export function KarthikaAdvisoryCard() {
  const lang = useLanguage();
  const isTe = lang === 'te';

  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [todayString, setTodayString] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    const now = new Date();
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
    setTodayString(todayStr);

    const karthikaFest = FESTIVALS_2026.find(f => f.id === 'karthika-masam-2026');
    if (!karthikaFest) {
      setMounted(true);
      return;
    }

    const active = todayStr >= karthikaFest.date && todayStr <= (karthikaFest.dateEnd || karthikaFest.date);
    setIsActive(active);

    try {
      if (localStorage.getItem('karthika_advisory_voted') === 'true') {
        setFeedbackGiven(true);
      }
    } catch {}

    if (active) {
      try {
        const alreadyLogged = sessionStorage.getItem('karthika_advisory_imp_logged');
        if (!alreadyLogged) {
          sessionStorage.setItem('karthika_advisory_imp_logged', 'true');
          const sessionId = localStorage.getItem('saarthi_session_id') || `sess_${Date.now().toString(36)}`;

          fetch('/api/v1/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              eventType: 'karthika_advisory_impression',
              entityType: 'place',
              entityId: 'kapila-theertham',
              metadata: {
                cardVersion: 'v2_karthika_advisory_ui',
                date: todayStr
              }
            })
          }).catch(() => {});
        }
      } catch {}
    }

    setMounted(true);
  }, []);

  if (!mounted || !isActive) {
    return null;
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    try {
      localStorage.setItem('karthika_advisory_voted', 'true');
      const sessionId = localStorage.getItem('saarthi_session_id') || `sess_${Date.now().toString(36)}`;

      fetch('/api/v1/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'karthika_advisory_feedback',
          entityType: 'place',
          entityId: 'kapila-theertham',
          metadata: {
            helpful,
            cardVersion: 'v2_karthika_advisory_ui',
            date: todayString
          }
        })
      }).catch(() => {});
    } catch {}
  };

  return (
    <section 
      style={{
        margin: '0px 12px 10px',
        padding: 0,
        backgroundColor: '#FFFFFF',
        border: '1px solid #D5ECD8',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(10, 78, 51, 0.06)',
        color: '#0F172A',
        overflow: 'hidden',
        fontFamily: isTe ? 'var(--font-telugu, system-ui)' : 'var(--font-body, var(--font-sans))'
      }}
      aria-label={isTe ? 'కపిల తీర్థం కార్తీక మాస దర్శన సూచన' : 'Kapila Theertham Karthika Masam Timing Advisory'}
    >
      {/* ── CARD HEADER (SACRED EMERALD BANNER) ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #053320 0%, #0A4E33 55%, #0B5C3C 100%)',
        color: '#FFFFFF',
        padding: '14px 16px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Kapila Theertham Sacred Temple Backdrop */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '46%',
          pointerEvents: 'none',
          opacity: 0.92,
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 60%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 60%)',
          overflow: 'hidden'
        }}>
          <img
            src="/assets/temples/kapila-theertham.png"
            alt="Kapila Theertham Sacred Temple"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              display: 'block'
            }}
          />
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          minWidth: 0
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#FFFFFF'
          }} aria-hidden="true">
            <Calendar size={18} strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FDE047',
              textTransform: 'uppercase',
              marginBottom: '2px',
              lineHeight: 1.2
            }}>
              {isTe ? 'కార్తీక మాస సూచన' : 'Karthika Masam'}
            </div>
            <h3 style={{
              fontSize: '15.5px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.015em'
            }}>
              {isTe ? 'కపిల తీర్థం దర్శనం' : 'Kapila Theertham'}
            </h3>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '2px 0 0 0',
              fontWeight: 500
            }}>
              {isTe ? 'పుష్కరిణి స్నానం & దీపారాధన సమయాలు' : 'Pushkarini Snanam & Darshan Timing'}
            </p>
          </div>
        </div>

        <Link 
          href="/place/kapila-theertham"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#0F5132',
            textDecoration: 'none',
            backgroundColor: '#FFFFFF',
            padding: '5px 12px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.14)',
            flexShrink: 0
          }}
          aria-label={isTe ? 'కపిల తీర్థం పూర్తి వివరాలు' : 'Kapila Theertham details'}
        >
          <span>{isTe ? 'వివరాలు' : 'Details'}</span>
          <ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
        </Link>
      </div>

      {/* ── CARD BODY ── */}
      <div style={{ padding: '12px 10px 14px' }}>
        {/* ── 2-COLUMN SCANNABLE TILES (LOW TEXT, HIGH VISUAL) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px',
          marginBottom: '10px'
        }}>
          {/* Tile 1: Queue Times */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 60%, #EFF6FF 100%)',
            border: '1px solid #DBEAFE',
            borderRadius: '16px',
            padding: '12px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  flexShrink: 0
                }}>
                  <Clock size={13} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                  {isTe ? 'దర్శనం సమయం' : 'Estimated Wait'}
                </span>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#0F2C24',
                lineHeight: 1.2,
                marginBottom: '3px',
                letterSpacing: '-0.015em'
              }}>
                1.5 – 2.5 hrs
              </div>
            </div>
            <div style={{ fontSize: '10.5px', lineHeight: 1.35, color: '#2563EB', fontWeight: 600 }}>
              {isTe ? 'పండుగ రద్దీ అంచనా' : 'Festival queue estimate'}
            </div>
          </div>

          {/* Tile 2: Suggested Window */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 60%, #FFFBEB 100%)',
            border: '1px solid #FEF3C7',
            borderRadius: '16px',
            padding: '12px 10px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  flexShrink: 0
                }}>
                  <Sun size={13} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                  {isTe ? 'అనుకూల సమయం' : 'Best Window'}
                </span>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#0F2C24',
                lineHeight: 1.2,
                marginBottom: '3px',
                letterSpacing: '-0.015em'
              }}>
                12:30 – 3:30 PM
              </div>
            </div>
            <div style={{ fontSize: '10.5px', lineHeight: 1.35, color: '#B45309', fontWeight: 600 }}>
              {isTe ? 'రద్దీ తక్కువగా ఉండే సమయం' : 'Lighter rush period'}
            </div>
          </div>
        </div>

        {/* ── NOTICE BOX (CONCISE & PUNCHY) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #DCFCE7',
          borderRadius: '10px',
          padding: '8px 10px',
          marginBottom: '10px'
        }}>
          <Info size={14} color="#16A34A" strokeWidth={2.3} style={{ flexShrink: 0 }} aria-hidden="true" />
          <span style={{ fontSize: '11.5px', lineHeight: 1.4, color: '#166534', fontWeight: 500 }}>
            {isTe 
              ? 'పుష్కరిణి, జలపాతం ప్రవేశం స్థానిక భద్రతా సూచనలపై ఆధారపడి ఉంటుంది.'
              : 'Water & pushkarini entry subject to local safety rules on the day.'}
          </span>
        </div>

        {/* ── FEEDBACK FOOTER ── */}
        <div style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
            {feedbackGiven 
              ? (isTe ? 'ధన్యవాదాలు.' : 'Thank you for your feedback.') 
              : (isTe ? 'ఈ అంచనా ఉపయోగపడిందా?' : 'Was this estimate helpful?')}
          </span>
          {!feedbackGiven && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                aria-label={isTe ? 'అవును, ఈ సమాచారం ఉపయోగపడింది' : 'Yes, this estimate was helpful'}
                style={{
                  minHeight: '30px',
                  minWidth: '50px',
                  padding: '3px 14px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#166534',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  touchAction: 'manipulation'
                }}
              >
                {isTe ? 'అవును' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                aria-label={isTe ? 'కాదు, ఈ సమాచారం ఉపయోగపడలేదు' : 'No, this estimate was not helpful'}
                style={{
                  minHeight: '30px',
                  minWidth: '50px',
                  padding: '3px 14px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  touchAction: 'manipulation'
                }}
              >
                {isTe ? 'కాదు' : 'No'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

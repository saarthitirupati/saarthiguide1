'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Sun, Info, ChevronRight } from 'lucide-react';
import { FESTIVALS_2026 } from '@/data/festivals';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    karthikaBadge: 'Karthika Masam',
    title: 'Kapila Theertham',
    subtitle: 'Pushkarini Snanam & Darshan Timing',
    details: 'Details',
    estimatedWait: 'Estimated Wait',
    queueSub: 'Festival queue estimate',
    bestWindow: 'Best Window',
    windowSub: 'Lighter rush period',
    safetyNotice: 'Water & pushkarini entry subject to local safety rules on the day.',
    feedbackThanks: 'Thank you for your feedback.',
    feedbackAsk: 'Was this estimate helpful?',
    yes: 'Yes',
    no: 'No',
    ariaLabel: 'Kapila Theertham Karthika Masam Timing Advisory'
  },
  te: {
    karthikaBadge: 'కార్తీక మాస సూచన',
    title: 'కపిల తీర్థం దర్శనం',
    subtitle: 'పుష్కరిణి స్నానం & దీపారాధన సమయాలు',
    details: 'వివరాలు',
    estimatedWait: 'దర్శనం సమయం',
    queueSub: 'పండుగ రద్దీ అంచనా',
    bestWindow: 'అనుకూల సమయం',
    windowSub: 'రద్దీ తక్కువగా ఉండే సమయం',
    safetyNotice: 'పుష్కరిణి, జలపాతం ప్రవేశం స్థానిక భద్రతా సూచనలపై ఆధారపడి ఉంటుంది.',
    feedbackThanks: 'ధన్యవాదాలు.',
    feedbackAsk: 'ఈ అంచనా ఉపయోగపడిందా?',
    yes: 'అవును',
    no: 'కాదు',
    ariaLabel: 'కపిల తీర్థం కార్తీక మాస దర్శన సూచన'
  },
  kn: {
    karthikaBadge: 'ಕಾರ್ತಿಕ ಮಾಸದ ಮಾಹಿತಿ',
    title: 'ಕಪಿಲ ತೀರ್ಥಂ ದರ್ಶನ',
    subtitle: 'ಪುಷ್ಕರಿಣಿ ಸ್ನಾನ & ದೀಪಾರಾಧನೆ ಸಮಯ',
    details: 'ವಿವರಗಳು',
    estimatedWait: 'ದರ್ಶನ ಸಮಯ',
    queueSub: 'ಹಬ್ಬದ ಸಾಲಿನ ಅಂದಾಜು',
    bestWindow: 'ಅನುಕೂಲಕರ ಸಮಯ',
    windowSub: 'ಕಡಿಮೆ ಜನಸಂದಣಿಯ ಸಮಯ',
    safetyNotice: 'ಪುಷ್ಕರಿಣಿ ಮತ್ತು ಜಲಪಾತ ಪ್ರವೇಶವು ಅಂದಿನ ಸ್ಥಳೀಯ ಸುರಕ್ಷತಾ ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.',
    feedbackThanks: 'ಧನ್ಯವಾದಗಳು.',
    feedbackAsk: 'ಈ ಅಂದಾಜು ಉಪಯುಕ್ತವಾಗಿದೆಯೇ?',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    ariaLabel: 'ಕಪಿಲ ತೀರ್ಥಂ ಕಾರ್ತಿಕ ಮಾಸ ದರ್ಶನ ಮಾಹಿತಿ'
  },
  hi: {
    karthikaBadge: 'कार्तिक मास विशेष सूचना',
    title: 'कपिला तीर्थम दर्शन',
    subtitle: 'पुष्करिणी स्नान व दीप दर्शन समय',
    details: 'विवरण',
    estimatedWait: 'दर्शन का अनुमानित समय',
    queueSub: 'त्योहार की भीड़ का अनुमान',
    bestWindow: 'दर्शन का उत्तम समय',
    windowSub: 'कम भीड़ का समय',
    safetyNotice: 'पुष्करिणी व झरने में प्रवेश स्थानीय सुरक्षा नियमों के अधीन है।',
    feedbackThanks: 'आपकी प्रतिक्रिया के लिए धन्यवाद।',
    feedbackAsk: 'क्या यह अनुमान उपयोगी रहा?',
    yes: 'हाँ',
    no: 'नहीं',
    ariaLabel: 'कपिला तीर्थम कार्तिक मास दर्शन सूचना'
  },
  ta: {
    karthikaBadge: 'கார்த்திகை மாத தகவல்',
    title: 'கபில தீர்த்தம் தரிசனம்',
    subtitle: 'புஷ்கரிணி நீராடல் & தரிசன நேரம்',
    details: 'விவரங்கள்',
    estimatedWait: 'தரிசன நேரம்',
    queueSub: 'திருவிழா வரிசை மதிப்பீடு',
    bestWindow: 'சிறந்த நேரம்',
    windowSub: 'குறைந்த கூட்ட நேரம்',
    safetyNotice: 'புஷ்கரிணி மற்றும் நீர்வீழ்ச்சி நுழைவு உள்ளூர் பாதுகாப்பு விதிகளுக்கு உட்பட்டது.',
    feedbackThanks: 'உங்கள் கருத்துக்கு நன்றி.',
    feedbackAsk: 'இந்த மதிப்பீடு பயனுள்ளதாக இருந்ததா?',
    yes: 'ஆம்',
    no: 'இல்லை',
    ariaLabel: 'கபில தீர்த்தம் கார்த்திகை மாத தரிசன தகவல்'
  }
};

export function KarthikaAdvisoryCard() {
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

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
        fontFamily: lang === 'te' ? 'var(--font-telugu, system-ui)' : 'var(--font-body, var(--font-sans))'
      }}
      aria-label={t.ariaLabel}
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
              {t.karthikaBadge}
            </div>
            <h3 style={{
              fontSize: '15.5px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.015em'
            }}>
              {t.title}
            </h3>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '2px 0 0 0',
              fontWeight: 500
            }}>
              {t.subtitle}
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
          aria-label={t.title}
        >
          <span>{t.details}</span>
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
                  {t.estimatedWait}
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
              {t.queueSub}
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
                  {t.bestWindow}
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
              {t.windowSub}
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
            {t.safetyNotice}
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
              ? t.feedbackThanks 
              : t.feedbackAsk}
          </span>
          {!feedbackGiven && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                aria-label={t.yes}
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
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                aria-label={t.no}
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
                {t.no}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

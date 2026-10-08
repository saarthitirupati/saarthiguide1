'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, Lock, Clock, Info, Share2, ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage, AppLang } from '@/lib/useLanguage';

const VAIKUNTA_EKADASI_TARGET_DATE = new Date('2026-12-20T04:00:00+05:30').getTime();

interface ScheduleItem {
  date: string;
  month: string;
  title: string;
  desc: string;
}

interface TranslationSchema {
  tagline: string;
  title: string;
  daysLeft: string;
  targetDateStr: string;
  fullTargetDateStr: string;
  subtext: string;
  countdownTitle: string;
  subtitle: string;
  badgeText: string;
  goldDwaramText: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  darshanOpens: string;
  scheduleTitle: string;
  eventSchedule: string;
  importantInfo: string;
  scheduleItems: ScheduleItem[];
  bulletPoints: string[];
}

const TEXTS: Record<AppLang, TranslationSchema> = {
  en: {
    tagline: 'VAIKUNTA DWARA DARSHAN',
    title: 'VAIKUNTA EKADASI',
    daysLeft: 'DAYS LEFT',
    targetDateStr: 'Sun, 20 Dec 2026',
    fullTargetDateStr: 'Sunday, 20 December 2026',
    subtext: 'Vaikunta Ekadasi (Mukkoti Ekadasi)',
    countdownTitle: 'Countdown to VAIKUNTA EKADASI',
    subtitle: 'Divine Vaikunta Dwara Darshan',
    badgeText: 'Swami Vari Divya Darshanam',
    goldDwaramText: 'The golden Vaikunta Dwaram opens soon',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    darshanOpens: 'Darshan opens 20 Dec 2026',
    scheduleTitle: 'Schedule & information',
    eventSchedule: 'Event Schedule',
    importantInfo: 'Important Information',
    scheduleItems: [
      {
        date: '20',
        month: 'DEC 2026',
        title: 'Vaikunta Ekadasi (Mukkoti Ekadasi)',
        desc: 'The sacred Vaikunta Dwaram opens early in the morning. Swarna Ratham procession in the forenoon.'
      },
      {
        date: '21',
        month: 'DEC 2026',
        title: 'Vaikunta Dwadasi',
        desc: 'The traditional Chakra Snanam at Swami Pushkarini in the early morning.'
      },
      {
        date: '22 – 29',
        month: 'DEC 2026',
        title: 'Vaikunta Dwara Darshan continues',
        desc: 'The Vaikunta Dwaram stays open for devotees over the remaining days.'
      }
    ],
    bulletPoints: [
      'Huge crowds are expected during these 10 days - plan your visit early.',
      'Vaikunta Dwara Darshan tokens / tickets are released separately by TTD - watch for the official announcement.',
      'Follow TTD guidelines and queue discipline.',
      'Carry a valid photo ID proof.',
      'Check official TTD updates for the latest arrangements.'
    ]
  },
  te: {
    tagline: 'వైకుంఠ ద్వార దర్శనం',
    title: 'వైకుంఠ ఏకాదశి',
    daysLeft: 'రోజులు మిగిలి ఉన్నాయి',
    targetDateStr: 'ఆది, 20 డిసెంబర్ 2026',
    fullTargetDateStr: 'ఆదివారం, 20 డిసెంబర్ 2026',
    subtext: 'వైకుంఠ ఏకాదశి (ముక్కోటి ఏకాదశి)',
    countdownTitle: 'వైకుంఠ ఏకాదశి కౌంట్‌డౌన్',
    subtitle: 'దివ్య వైకుంఠ ద్వార దర్శనం',
    badgeText: 'స్వామివారి దివ్య దర్శనం',
    goldDwaramText: 'బంగారు వైకుంఠ ద్వారం త్వరలోనే తెరవబడుతుంది',
    days: 'రోజులు',
    hours: 'గంటలు',
    minutes: 'నిమిషాలు',
    seconds: 'సెకన్లు',
    darshanOpens: 'దర్శనం ప్రారంభం: 20 డిసెం 2026',
    scheduleTitle: 'షెడ్యూల్ & సమాచారం',
    eventSchedule: 'కార్యక్రమాల షెడ్యూల్',
    importantInfo: 'ముఖ్యమైన సమాచారం',
    scheduleItems: [
      {
        date: '20',
        month: 'డిసెం 2026',
        title: 'వైకుంఠ ఏకాదశి (ముక్కోటి ఏకాదశి)',
        desc: 'ఉదయాన్నే పవిత్ర వైకుంఠ ద్వారం తెరుచుకుంటుంది. మధ్యాహ్నం స్వర్ణ రథోత్సవం.'
      },
      {
        date: '21',
        month: 'డిసెం 2026',
        title: 'వైకుంఠ ద్వాదశి',
        desc: 'ఉదయాన్నే స్వామి పుష్కరిణిలో సాంప్రదాయ చక్రస్నానం.'
      },
      {
        date: '22 – 29',
        month: 'డిసెం 2026',
        title: 'వైకుంఠ ద్వార దర్శనం కొనసాగింపు',
        desc: 'మిగిలిన రోజుల్లో భక్తుల కోసం వైకుంఠ ద్వారం తెరిచే ఉంటుంది.'
      }
    ],
    bulletPoints: [
      'ఈ 10 రోజుల్లో భారీ రద్దీ ఉండే అవకాశం ఉంది - మీ ప్రయాణాన్ని ముందుగానే ప్లాన్ చేసుకోండి.',
      'వైకుంఠ ద్వార దర్శనం టోకెన్లు / టిక్కెట్లను TTD ప్రత్యేకంగా విడుదల చేస్తుంది - అధికారిక ప్రకటనను గమనించండి.',
      'TTD నిబంధనలు మరియు క్యూ క్రమశిక్షణను పాటించండి.',
      'చెల్లుబాటు అయ్యే ఫోటో గుర్తింపు కార్డును తీసుకురండి.',
      'తాజా ఏర్పాట్ల కోసం TTD అధికారిక అప్‌డేట్‌లను చూడండి.'
    ]
  },
  hi: {
    tagline: 'वैकुण्ठ द्वार दर्शन',
    title: 'वैकुण्ठ एकादशी',
    daysLeft: 'दिन शेष हैं',
    targetDateStr: 'रविवार, 20 दिसं 2026',
    fullTargetDateStr: 'रविवार, 20 दिसंबर 2026',
    subtext: 'वैकुण्ठ एकादशी (मुक्कोटी एकादशी)',
    countdownTitle: 'वैकुण्ठ एकादशी उलटी गिनती',
    subtitle: 'दिव्य वैकुण्ठ द्वार दर्शन',
    badgeText: 'स्वामी वारी दिव्य दर्शनम',
    goldDwaramText: 'सुनहरा वैकुण्ठ द्वार शीघ्र ही खुलेगा',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    darshanOpens: 'दर्शन प्रारंभ: 20 दिसंबर 2026',
    scheduleTitle: 'कार्यक्रम एवं जानकारी',
    eventSchedule: 'कार्यक्रम अनुसूची',
    importantInfo: 'महत्वपूर्ण जानकारी',
    scheduleItems: [
      {
        date: '20',
        month: 'दिसंबर 2026',
        title: 'वैकुण्ठ एकादशी (मुक्कोटी एकादशी)',
        desc: 'प्रातःकाल में पवित्र वैकुण्ठ द्वार खुलता है। दोपहर में स्वर्ण रथ यात्रा।'
      },
      {
        date: '21',
        month: 'दिसंबर 2026',
        title: 'वैकुण्ठ द्वादशी',
        desc: 'स्वामी पुष्करिणी में प्रातःकाल पारंपरिक चक्र स्नान।'
      },
      {
        date: '22 – 29',
        month: 'दिसंबर 2026',
        title: 'वैकुण्ठ द्वार दर्शन जारी रहेगा',
        desc: 'शेष दिनों में भक्तों के लिए वैकुण्ठ द्वार खुला रहेगा।'
      }
    ],
    bulletPoints: [
      'इन 10 दिनों के दौरान भारी भीड़ की संभावना है - अपनी यात्रा की योजना पहले से बनाएं।',
      'वैकुण्ठ द्वार दर्शन टोकन/टिकट टीटीडी द्वारा अलग से जारी किए जाते हैं - आधिकारिक घोषणा का ध्यान रखें।',
      'टीटीडी दिशानिर्देशों और कतार अनुशासन का पालन करें।',
      'एक वैध फोटो पहचान पत्र साथ रखें।',
      'नवीनतम व्यवस्थाओं के लिए आधिकारिक टीटीडी अपडेट देखें।'
    ]
  },
  ta: {
    tagline: 'வைகுண்ட த்வார தரிசனம்',
    title: 'வைகுண்ட ஏகாதசி',
    daysLeft: 'நாட்கள் மீதமுள்ளன',
    targetDateStr: 'ஞாயிறு, 20 டிசம் 2026',
    fullTargetDateStr: 'ஞாயிற்றுக்கிழமை, 20 டிசம்பர் 2026',
    subtext: 'வைகுண்ட ஏகாதசி (முக்கோடி ஏகாதசி)',
    countdownTitle: 'வைகுண்ட ஏகாதசி கவுண்ட்டவுன்',
    subtitle: 'திவ்ய வைகுண்ட த்வார தரிசனம்',
    badgeText: 'சுவாமி வாரி திவ்ய தரிசனம்',
    goldDwaramText: 'தங்க வைகுண்ட துவாரம் விரைவில் திறக்கப்படும்',
    days: 'நாட்கள்',
    hours: 'மணி',
    minutes: 'நிமிடம்',
    seconds: 'நொடி',
    darshanOpens: 'தரிசனம் ஆரம்பம்: 20 டிசம்பர் 2026',
    scheduleTitle: 'அட்டவணை & தகவல்கள்',
    eventSchedule: 'நிகழ்ச்சி நிரல்',
    importantInfo: 'முக்கிய தகவல்கள்',
    scheduleItems: [
      {
        date: '20',
        month: 'டிசம் 2026',
        title: 'வைகுண்ட ஏகாதசி (முக்கோடி ஏகாதசி)',
        desc: 'அதிகாலையில் புனித வைகுண்ட துவாரம் திறக்கப்படுகிறது. முற்பகலில் சுவர்ண ரத பவனி.'
      },
      {
        date: '21',
        month: 'டிசம் 2026',
        title: 'வைகுண்ட துவாதசி',
        desc: 'அதிகாலையில் சுவாமி புஷ்கரிணியில் பாரம்பரிய சக்ர ஸ்நானம்.'
      },
      {
        date: '22 – 29',
        month: 'டிசம் 2026',
        title: 'வைகுண்ட த்வார தரிசனம் தொடரும்',
        desc: 'மீதமுள்ள நாட்களில் பக்தர்களுக்காக வைகுண்ட துவாரம் திறந்திருக்கும்.'
      }
    ],
    bulletPoints: [
      'இந்த 10 நாட்களில் பெருந்திரளான பக்தர்கள் வருவார்கள் - உங்கள் பயணத்தை முன்னதாக திட்டமிடுங்கள்.',
      'வைகுண்ட த்வார தரிசன டோக்கன்கள் / டிக்கெட்டுகள் TTD ஆல் தனியாக வெளியிடப்படும் - அதிகாரப்பூர்வ அறிவிப்பை கவனியுங்கள்.',
      'TTD வழிகாட்டுதல்கள் மற்றும் வரிசை ஒழுங்கை பின்பற்றுங்கள்.',
      'செல்லுபடியாகும் புகைப்பட அடையாள சான்றை எடுத்து வாருங்கள்.',
      'சமீபத்திய ஏற்பாடுகளுக்கு அதிகாரப்பூர்வ TTD புதுப்பிப்புகளை சரிபார்க்கவும்.'
    ]
  }
};

/**
 * Returns script-specific font weights and line heights following First Principles.
 * Indic scripts (Hindi/Tamil/Telugu) require slightly lighter font weight & more line height
 * to prevent character stroke clipping and maintain pristine legibility.
 */
function getTypographyStyle(lang: AppLang) {
  switch (lang) {
    case 'hi':
      return {
        titleWeight: 800,
        bodyWeight: 500,
        titleLineHeight: 1.25,
        bodyLineHeight: 1.5,
        fontSizeScale: '102%'
      };
    case 'ta':
      return {
        titleWeight: 800,
        bodyWeight: 500,
        titleLineHeight: 1.3,
        bodyLineHeight: 1.5,
        fontSizeScale: '100%'
      };
    case 'te':
      return {
        titleWeight: 800,
        bodyWeight: 500,
        titleLineHeight: 1.25,
        bodyLineHeight: 1.45,
        fontSizeScale: '102%'
      };
    case 'en':
    default:
      return {
        titleWeight: 900,
        bodyWeight: 600,
        titleLineHeight: 1.1,
        bodyLineHeight: 1.4,
        fontSizeScale: '100%'
      };
  }
}

export function VaikuntaEkadasiBanner() {
  const lang = useLanguage();
  const t = TEXTS[lang] || TEXTS.en;
  const typo = getTypographyStyle(lang);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 72, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, VAIKUNTA_EKADASI_TARGET_DATE - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HOME SCREEN BANNER CARD (PLACEMENT: AFTER SSD TOKENS)
          ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '0 14px 10px 14px' }}>
        <div
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalOpen(true); }}
          style={{
            position: 'relative',
            borderRadius: '22px',
            overflow: 'hidden',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #1C0A33 0%, #2D0E4C 50%, #44146E 100%)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            boxShadow: '0 8px 24px -4px rgba(28, 10, 51, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
            padding: '16px 16px 14px 18px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '118px'
          }}
        >
          {/* Subtle Devotional Background Rays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              backgroundImage: 'radial-gradient(circle at 80% 50%, #FDE047 0%, transparent 65%)',
              pointerEvents: 'none'
            }}
          />

          {/* Left Text Block */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, paddingRight: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <Sparkles size={11} color="#FDE047" />
              <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', color: '#FDE047', textTransform: 'uppercase' }}>
                {t.tagline}
              </span>
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: typo.titleWeight,
                color: '#FDE68A',
                margin: '0 0 10px 0',
                letterSpacing: '-0.01em',
                lineHeight: typo.titleLineHeight,
                fontFamily: 'serif'
              }}
            >
              {t.title}
            </h3>

            {/* Countdown Badge Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(254, 240, 138, 0.3)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '4px 10px 4px 6px'
              }}
            >
              <div
                style={{
                  backgroundColor: '#F59E0B',
                  background: 'linear-gradient(180deg, #FDE047 0%, #D97706 100%)',
                  color: '#1E1B4B',
                  fontWeight: 900,
                  fontSize: '15px',
                  borderRadius: '11px',
                  padding: '3px 10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  lineHeight: 1
                }}
              >
                {timeLeft.days}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#FDE68A', letterSpacing: '0.05em', lineHeight: 1.1 }}>
                  {t.daysLeft}
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: typo.bodyWeight, color: '#E2E8F0', lineHeight: 1.1 }}>
                  {t.targetDateStr}
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual: Gopuram Emblem & Chevron Arrow */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Srivari Gopuram Visual Emblem */}
            <div
              style={{
                width: '85px',
                height: '100px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 6px 16px rgba(253, 224, 71, 0.35))'
              }}
            >
              <svg viewBox="0 0 100 120" style={{ width: '100%', height: '100%' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Radiant Divine Aura Background */}
                <circle cx="50" cy="55" r="45" fill="url(#gopuramSunburst)" opacity="0.45" />
                <path d="M50 0 L50 110 M0 55 L100 55 M15 20 L85 90 M15 90 L85 20" stroke="#FDE047" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />

                {/* Golden Ananda Nilayam Gopuram Tiers */}
                {/* Apex Kalasham & Vimana Top */}
                <path d="M48 6 H52 V14 H48 Z" fill="#F59E0B" />
                <path d="M50 2 L54 8 L46 8 Z" fill="#FDE047" />

                {/* Shikhara Dome */}
                <path d="M40 14 Q50 9 60 14 V22 Q50 24 40 22 Z" fill="url(#goldTierGrad)" />
                <path d="M46 16 H54 V21 H46 Z" fill="#78350F" opacity="0.7" />

                {/* Tier 1 (Top Tier) */}
                <path d="M34 22 H66 V34 H34 Z" fill="url(#goldTierGrad)" stroke="#FEF08A" strokeWidth="0.5" />
                <path d="M38 25 H42 V31 H38 Z M48 25 H52 V31 H48 Z M58 25 H62 V31 H58 Z" fill="#451A03" />

                {/* Tier 2 (Middle Tier) */}
                <path d="M27 34 H73 V50 H27 Z" fill="url(#goldTierGrad)" stroke="#FEF08A" strokeWidth="0.5" />
                <path d="M31 37 H36 V47 H31 Z M42 37 H47 V47 H42 Z M53 37 H58 V47 H53 Z M64 37 H69 V47 H64 Z" fill="#451A03" />

                {/* Tier 3 (Lower Main Tier) */}
                <path d="M19 50 H81 V70 H19 Z" fill="url(#goldTierGrad)" stroke="#FEF08A" strokeWidth="0.5" />
                <path d="M24 54 H30 V66 H24 Z M36 54 H42 V66 H36 Z M58 54 H64 V66 H58 Z M70 54 H76 V66 H70 Z" fill="#451A03" />

                {/* Main Entrance Sanctum Arch & Doorway */}
                <path d="M12 70 H88 V96 H12 Z" fill="#B45309" stroke="#FDE047" strokeWidth="0.75" />
                <path d="M40 72 H60 V96 H40 Z" fill="#290F02" stroke="#FDE047" strokeWidth="1" />

                {/* Srivari Thirunamam Emblem over Golden Arch */}
                <path d="M44 74 H56 V92 H44 Z" fill="#FEF08A" opacity="0.2" />
                <path d="M46 76 H49 V90 H46 Z M51 76 H54 V90 H51 Z" fill="#FFFFFF" />
                <path d="M49 80 H51 V92 H49 Z" fill="#DC2626" />

                {/* Foundation Base */}
                <path d="M6 96 H94 V108 H6 Z" fill="url(#goldTierGrad)" stroke="#F59E0B" strokeWidth="0.75" />
                <path d="M35 96 H65 V108 H35 Z" fill="#78350F" />

                <defs>
                  <linearGradient id="goldTierGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="40%" stopColor="#FDE047" />
                    <stop offset="85%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <radialGradient id="gopuramSunburst" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Circular Arrow Button */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(253, 224, 71, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FDE68A'
              }}
            >
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          FULL-SCREEN DIVINE COUNTDOWN MODAL (EXACT SPEC MATCH)
          ═══════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0F081D',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header Action Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(15,8,29,0.9) 0%, rgba(15,8,29,0.6) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Vaikunta Ekadasi 2026 - Saarthi',
                    text: 'Countdown to Divine Vaikunta Dwara Darshan at Tirumala',
                    url: window.location.href
                  }).catch(() => {});
                }
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Golden Vaikunta Dwaram Hero Banner Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '480px',
              padding: '10px 16px 40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              background: 'linear-gradient(180deg, #180B2B 0%, #2A1046 40%, #150824 100%)',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Devotional Lighting Rays */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120%',
                height: '350px',
                backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(253, 224, 71, 0.2) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 80%)',
                pointerEvents: 'none'
              }}
            />

            {/* Title Block */}
            <div style={{ textAlign: 'center', marginTop: '4px', marginBottom: '14px', zIndex: 2 }}>
              <span style={{ fontSize: '13.5px', fontFamily: 'serif', fontStyle: 'italic', color: '#FDE047', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
                {t.countdownTitle}
              </span>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: typo.titleWeight,
                  color: '#FDE68A',
                  margin: '0 0 4px',
                  fontFamily: 'serif',
                  letterSpacing: '0.03em',
                  lineHeight: typo.titleLineHeight,
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)'
                }}
              >
                {t.title}
              </h1>
              <p style={{ fontSize: '14px', color: '#FFFFFF', margin: 0, fontWeight: typo.bodyWeight, opacity: 0.95 }}>
                {t.subtitle}
              </p>

              {/* Gold Badge 1: Swami Vari Divya Darshanam */}
              <div style={{ display: 'inline-block', marginTop: '12px', padding: '6px 22px', borderRadius: '22px', backgroundColor: '#FFFDF5', border: '1.5px solid #FCD34D', boxShadow: '0 4px 16px rgba(252, 211, 77, 0.3)' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E1B4B', letterSpacing: '0.01em' }}>
                  {t.badgeText}
                </span>
              </div>

              {/* Gold Badge 2: The golden Vaikunta Dwaram opens soon */}
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '6px 18px', borderRadius: '18px', background: 'rgba(20, 8, 35, 0.85)', border: '1px solid rgba(253, 224, 71, 0.35)', backdropFilter: 'blur(6px)' }}>
                  <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#FDE68A', fontWeight: 500 }}>
                    {t.goldDwaramText}
                  </span>
                </div>
              </div>
            </div>

            {/* Golden Door Frame Graphic (Srivari Vaikunta Dwaram Gates - 1:1 Match to Image) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                height: '320px',
                borderRadius: '26px 26px 0 0',
                border: '4px solid #F59E0B',
                background: 'linear-gradient(180deg, #3B1663 0%, #170A2A 100%)',
                boxShadow: '0 14px 40px rgba(245, 158, 11, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '10px 0 0',
                overflow: 'hidden'
              }}
            >
              <svg viewBox="0 0 300 280" style={{ width: '100%', height: '100%' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Carved Golden Archway & Carved Pillars */}
                <path d="M10 280 V30 Q150 5 290 30 V280 Z" fill="url(#gateGoldGrad)" stroke="#FEF08A" strokeWidth="2.5" />
                <path d="M22 280 V44 Q150 22 278 44 V280 Z" fill="#240D03" />

                {/* Pillar Ornamentation Lines */}
                <line x1="16" y1="35" x2="16" y2="280" stroke="#FDE047" strokeWidth="1" opacity="0.6" />
                <line x1="284" y1="35" x2="284" y2="280" stroke="#FDE047" strokeWidth="1" opacity="0.6" />

                {/* Left Door Leaf */}
                <g id="leftDoor">
                  <rect x="28" y="48" width="118" height="220" rx="4" fill="url(#doorPanelGrad)" stroke="#FDE047" strokeWidth="3" />
                  
                  {/* Top Inner Carved Panel */}
                  <rect x="36" y="56" width="102" height="70" rx="3" stroke="#FDE047" strokeWidth="1.5" fill="none" />
                  {/* 8-Petal Carved Lotus Emblem (Top Panel) */}
                  <g transform="translate(87, 91)">
                    <circle cx="0" cy="0" r="18" fill="url(#lotusGold)" stroke="#FEF08A" strokeWidth="1" />
                    <circle cx="0" cy="0" r="8" fill="#78350F" />
                    <path d="M0 -18 L0 18 M-18 0 L18 0 M-13 -13 L13 13 M-13 13 L13 -13" stroke="#FDE047" strokeWidth="1.5" />
                  </g>

                  {/* Bottom Inner Carved Panel with U-Namam (Matches Image) */}
                  <rect x="36" y="136" width="102" height="120" rx="3" stroke="#FDE047" strokeWidth="1.5" fill="none" />
                  <circle cx="87" cy="196" r="34" fill="url(#namamGlow)" stroke="#FDE047" strokeWidth="2" />
                  
                  {/* Sacred Srivari U-Namam Emblem */}
                  <path d="M72 176 H102 V216 H72 Z" fill="#FFFDF5" rx="3" stroke="#FDE047" strokeWidth="1" />
                  <path d="M75 178 H81 V210 H75 Z M93 178 H99 V210 H93 Z" fill="#FFFFFF" />
                  <path d="M84 183 H90 V214 H84 Z" fill="#DC2626" />
                  <circle cx="87" cy="220" r="3.5" fill="#FDE047" />

                  {/* Brass Studs Matrix */}
                  <circle cx="42" cy="62" r="2.5" fill="#FDE047" /><circle cx="132" cy="62" r="2.5" fill="#FDE047" />
                  <circle cx="42" cy="118" r="2.5" fill="#FDE047" /><circle cx="132" cy="118" r="2.5" fill="#FDE047" />
                  <circle cx="42" cy="144" r="2.5" fill="#FDE047" /><circle cx="132" cy="144" r="2.5" fill="#FDE047" />
                  <circle cx="42" cy="248" r="2.5" fill="#FDE047" /><circle cx="132" cy="248" r="2.5" fill="#FDE047" />
                </g>

                {/* Right Door Leaf */}
                <g id="rightDoor">
                  <rect x="154" y="48" width="118" height="220" rx="4" fill="url(#doorPanelGrad)" stroke="#FDE047" strokeWidth="3" />
                  
                  {/* Top Inner Carved Panel */}
                  <rect x="162" y="56" width="102" height="70" rx="3" stroke="#FDE047" strokeWidth="1.5" fill="none" />
                  {/* 8-Petal Carved Lotus Emblem (Top Panel) */}
                  <g transform="translate(213, 91)">
                    <circle cx="0" cy="0" r="18" fill="url(#lotusGold)" stroke="#FEF08A" strokeWidth="1" />
                    <circle cx="0" cy="0" r="8" fill="#78350F" />
                    <path d="M0 -18 L0 18 M-18 0 L18 0 M-13 -13 L13 13 M-13 13 L13 -13" stroke="#FDE047" strokeWidth="1.5" />
                  </g>

                  {/* Bottom Inner Carved Panel with U-Namam (Matches Image) */}
                  <rect x="162" y="136" width="102" height="120" rx="3" stroke="#FDE047" strokeWidth="1.5" fill="none" />
                  <circle cx="213" cy="196" r="34" fill="url(#namamGlow)" stroke="#FDE047" strokeWidth="2" />
                  
                  {/* Sacred Srivari U-Namam Emblem */}
                  <path d="M198 176 H228 V216 H198 Z" fill="#FFFDF5" rx="3" stroke="#FDE047" strokeWidth="1" />
                  <path d="M201 178 H207 V210 H201 Z M219 178 H225 V210 H219 Z" fill="#FFFFFF" />
                  <path d="M210 183 H216 V214 H210 Z" fill="#DC2626" />
                  <circle cx="213" cy="220" r="3.5" fill="#FDE047" />

                  {/* Brass Studs Matrix */}
                  <circle cx="168" cy="62" r="2.5" fill="#FDE047" /><circle cx="258" cy="62" r="2.5" fill="#FDE047" />
                  <circle cx="168" cy="118" r="2.5" fill="#FDE047" /><circle cx="258" cy="118" r="2.5" fill="#FDE047" />
                  <circle cx="168" cy="144" r="2.5" fill="#FDE047" /><circle cx="258" cy="144" r="2.5" fill="#FDE047" />
                  <circle cx="168" cy="248" r="2.5" fill="#FDE047" /><circle cx="258" cy="248" r="2.5" fill="#FDE047" />
                </g>

                {/* Center Door Seam & Heavy Decorative Ring Handles */}
                <line x1="150" y1="48" x2="150" y2="272" stroke="#FDE047" strokeWidth="3.5" />
                <circle cx="138" cy="196" r="9" fill="url(#gateGoldGrad)" stroke="#FEF08A" strokeWidth="1.5" />
                <circle cx="162" cy="196" r="9" fill="url(#gateGoldGrad)" stroke="#FEF08A" strokeWidth="1.5" />

                {/* Decorative Festive Flower Garlands Hanging Across Top Arch */}
                <path d="M28 48 Q150 78 272 48" stroke="#DC2626" strokeWidth="4.5" strokeDasharray="6 3" />
                <path d="M28 56 Q150 86 272 56" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="6 3" />

                <defs>
                  <linearGradient id="gateGoldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="30%" stopColor="#FDE047" />
                    <stop offset="70%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <linearGradient id="doorPanelGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="40%" stopColor="#B45309" />
                    <stop offset="80%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#3B1606" />
                  </linearGradient>
                  <radialGradient id="lotusGold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#B45309" />
                  </radialGradient>
                  <radialGradient id="namamGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Floating Live Countdown Card Overlay */}
            <div
              style={{
                width: 'calc(100% - 24px)',
                maxWidth: '400px',
                backgroundColor: '#FFFDF7',
                borderRadius: '24px',
                padding: '20px 16px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                border: '1px solid #FEF3C7',
                color: '#1E1B4B',
                textAlign: 'center',
                zIndex: 5,
                marginTop: '-10px'
              }}
            >
              {/* 4-Column Metric Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#881337', display: 'block', lineHeight: 1.1 }}>
                    {timeLeft.days}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: typo.bodyWeight, color: '#64748B' }}>
                    {t.days}
                  </span>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#881337', display: 'block', lineHeight: 1.1 }}>
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: typo.bodyWeight, color: '#64748B' }}>
                    {t.hours}
                  </span>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#881337', display: 'block', lineHeight: 1.1 }}>
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: typo.bodyWeight, color: '#64748B' }}>
                    {t.minutes}
                  </span>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#881337', display: 'block', lineHeight: 1.1 }}>
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: typo.bodyWeight, color: '#64748B' }}>
                    {t.seconds}
                  </span>
                </div>
              </div>

              {/* Target Date Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '14px', marginBottom: '14px' }}>
                <Calendar size={18} color="#78350F" />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: typo.titleWeight, color: '#78350F', display: 'block', lineHeight: 1.2 }}>
                    {t.fullTargetDateStr}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#92400E', fontWeight: typo.bodyWeight }}>
                    {t.subtext}
                  </span>
                </div>
              </div>

              {/* Locked Status Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '12px', borderRadius: '25px', backgroundColor: '#57534E', color: '#F5F5F4', fontSize: '13px', fontWeight: 700 }}>
                <Lock size={15} color="#FDE047" />
                <span>{t.darshanOpens}</span>
              </div>
            </div>
          </div>

          {/* Lower Scrollable Content Area */}
          <div style={{ backgroundColor: '#FAF8F5', flex: 1, padding: '24px 16px 40px', color: '#0F172A' }}>
            
            {/* Event Schedule Section */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Calendar size={18} color="#4C1D95" />
                <h3 style={{ fontSize: '15px', fontWeight: typo.titleWeight, color: '#1E1B4B', margin: 0 }}>
                  {t.eventSchedule}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {t.scheduleItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '68px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '8px 4px', textAlign: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '17px', fontWeight: 900, color: '#78350F', display: 'block', lineHeight: 1 }}>
                        {item.date}
                      </span>
                      <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                        {item.month}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: typo.titleWeight, color: '#1E1B4B', margin: '0 0 3px', lineHeight: typo.titleLineHeight }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: typo.bodyLineHeight, fontWeight: typo.bodyWeight }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Information Section */}
            <div style={{ backgroundColor: '#FFFBEB', borderRadius: '20px', padding: '16px', border: '1px solid #FDE68A', boxShadow: '0 4px 14px rgba(251, 191, 36, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Info size={18} color="#B45309" />
                <h3 style={{ fontSize: '15px', fontWeight: typo.titleWeight, color: '#78350F', margin: 0 }}>
                  {t.importantInfo}
                </h3>
              </div>

              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#78350F', lineHeight: typo.bodyLineHeight, fontWeight: typo.bodyWeight }}>
                {t.bulletPoints.map((pt, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{pt}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

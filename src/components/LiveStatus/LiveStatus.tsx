'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Clock, Users, Bell, ChevronDown, ChevronUp, 
  RefreshCw, Zap, CalendarDays,
  Ticket, Star
} from 'lucide-react';
import styles from './LiveStatus.module.css';

interface DarshanTypeStatus {
  name: string;
  waitTime: string;
  peakHours: string;
}

// Status shape inferred from useRealtimeStatus hook

const CROWD_META = {
  low:       { label: 'Less Crowded', color: '#16A34A', bg: '#DCFCE7', pulse: '#16A34A', percent: 15 },
  moderate:  { label: 'Moderate',     color: '#D97706', bg: '#FEF3C7', pulse: '#D97706', percent: 45 },
  high:      { label: 'Heavy Crowd',  color: '#EA580C', bg: '#FFEDD5', pulse: '#EA580C', percent: 75 },
  'very-high': { label: 'Very Heavy', color: '#DC2626', bg: '#FEE2E2', pulse: '#DC2626', percent: 95 },
};

const ACCOMMODATION_META = {
  available: { label: 'Rooms Available', color: '#16A34A', bg: '#E8F5E9' },
  limited:   { label: 'Filling Fast', color: '#D97706', bg: '#FFF8E1' },
  full:      { label: 'Fully Booked', color: '#DC2626', bg: '#FFEBEE' },
};

const LADDU_META = {
  available: { label: 'Abundant Stock', color: '#16A34A', bg: '#E8F5E9' },
  limited:   { label: 'Limited Stock', color: '#D97706', bg: '#FFF8E1' },
  'no-stock':{ label: 'No Stock', color: '#DC2626', bg: '#FFEBEE' },
};

const DARSHAN_FLOW_META = {
  fast:   { label: 'Moving Fast', color: '#16A34A', bg: '#E8F5E9' },
  normal: { label: 'Normal Pace', color: '#D97706', bg: '#FFF8E1' },
  slow:   { label: 'Slow Moving', color: '#DC2626', bg: '#FFEBEE' },
};

import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS: Record<string, Record<string, string>> = {
  en: {
    title: 'Tirumala Live Status',
    verified: 'Verified · TTD Official',
    wait: 'Wait',
    lessCrowded: 'Less Crowded',
    moderate: 'Moderate',
    heavyCrowd: 'Heavy Crowd',
    veryHeavy: 'Very Heavy',
    queueCongestion: 'Queue congestion',
    overall: 'overall',
    darshanCategory: 'Darshan Category',
    waitTime: 'Wait Time',
    peakHours: 'Peak Hours',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    updatedAt: 'Updated at',
    shareToFamily: 'Share to Family',
    saarthiGuidance: 'SAARTHI GUIDANCE'
  },
  te: {
    title: 'తిరుమల లైవ్ పరిస్థితి',
    verified: 'ధృవీకరించబడింది · TTD అధికారికం',
    wait: 'వేచి సమయం',
    lessCrowded: 'తక్కువ రద్దీ',
    moderate: 'సాధారణ రద్దీ',
    heavyCrowd: 'అధిక రద్దీ',
    veryHeavy: 'అత్యధిక రద్దీ',
    queueCongestion: 'క్యూ రద్దీ నిష్పత్తి',
    overall: 'మొత్తం వేచి సమయం',
    darshanCategory: 'దర్శన వర్గం',
    waitTime: 'వేచి ఉండు సమయం',
    peakHours: 'రద్దీ గంటలు',
    refresh: 'రిఫ్రెష్',
    refreshing: 'రిఫ్రెష్ అవుతోంది...',
    updatedAt: 'సమయం',
    shareToFamily: 'కుటుంబానికి షేర్ చేయండి',
    saarthiGuidance: 'సారథి మార్గదర్శనం'
  },
  hi: {
    title: 'तिरुपति लाइव स्थिति',
    verified: 'सत्यापित · टीटीडी आधिकारिक',
    wait: 'प्रतीक्षा समय',
    lessCrowded: 'कम भीड़',
    moderate: 'सामान्य भीड़',
    heavyCrowd: 'भारी भीड़',
    veryHeavy: 'अत्यधिक भीड़',
    queueCongestion: 'कतार की भीड़',
    overall: 'कुल समय',
    darshanCategory: 'दर्शन श्रेणी',
    waitTime: 'प्रतीक्षा समय',
    peakHours: 'भीड़ के घंटे',
    refresh: 'ताज़ा करें',
    refreshing: 'ताज़ा हो रहा है...',
    updatedAt: 'अद्यतन समय',
    shareToFamily: 'परिवार को साझा करें',
    saarthiGuidance: 'सारथी मार्गदर्शन'
  },
  ta: {
    title: 'திருமலை நேரலை நிலை',
    verified: 'சரிபார்க்கப்பட்டது · TTD அதிகாரப்பூர்வ',
    wait: 'காத்திருப்பு நேரம்',
    lessCrowded: 'குறைந்த கூட்டம்',
    moderate: 'மிதமான கூட்டம்',
    heavyCrowd: 'அதிக கூட்டம்',
    veryHeavy: 'மிக அதிக கூட்டம்',
    queueCongestion: 'வரிசை நெரிசல்',
    overall: 'மொத்த நேரம்',
    darshanCategory: 'தரிசன பிரிவு',
    waitTime: 'காத்திருப்பு நேரம்',
    peakHours: 'அதிக கூட்ட நேரங்கள்',
    refresh: 'புதுப்பி',
    refreshing: 'புதுப்பிக்கப்படுகிறது...',
    updatedAt: 'புதுப்பிக்கப்பட்ட நேரம்',
    shareToFamily: 'குடும்பத்தினருடன் பகிரவும்',
    saarthiGuidance: 'சாரதி வழிகாட்டுதல்'
  }
};

export default function LiveStatus() {
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;
  
  const { status, refresh } = useRealtimeStatus();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (!status) return null;

  const metaKey = (status.crowdLevel as keyof typeof CROWD_META) || 'moderate';
  const meta = CROWD_META[metaKey] ?? CROWD_META.moderate;
  const localizedCrowdLabel = metaKey === 'low' ? t.lessCrowded : metaKey === 'high' ? t.heavyCrowd : metaKey === 'very-high' ? t.veryHeavy : t.moderate;

  const formatHeaderWait = (timeStr: string) => {
    const clean = timeStr.toLowerCase().replace('wait', '').replace('time', '').trim();
    if (lang === 'te') {
      return clean.includes('hour') || clean.includes('hrs') || clean.includes('h') ? `${clean.replace(/[^0-9-]/g, '')} గంటలు` : `${clean.replace(/[^0-9-]/g, '')} నిమిషాలు`;
    }
    if (lang === 'hi') {
      return clean.includes('hour') || clean.includes('hrs') || clean.includes('h') ? `${clean.replace(/[^0-9-]/g, '')} घंटे` : `${clean.replace(/[^0-9-]/g, '')} मिनट`;
    }
    if (lang === 'ta') {
      return clean.includes('hour') || clean.includes('hrs') || clean.includes('h') ? `${clean.replace(/[^0-9-]/g, '')} மணி நேரம்` : `${clean.replace(/[^0-9-]/g, '')} நிமிடம்`;
    }
    if (!clean.endsWith('h') && !clean.endsWith('hrs') && !clean.endsWith('hours') && !clean.endsWith('hour') && !clean.endsWith('m') && !clean.endsWith('mins') && !clean.endsWith('minutes')) {
      return `${clean} hrs`;
    }
    return clean;
  };

  const getDarshanIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('300') || lowercase.includes('special')) {
      return <Ticket size={13} className={styles.iconCyan} />;
    }
    if (lowercase.includes('footpath') || lowercase.includes('divya')) {
      return <Zap size={13} className={styles.iconBlue} />;
    }
    if (lowercase.includes('vip') || lowercase.includes('srivani')) {
      return <Star size={13} className={styles.iconGold} />;
    }
    return <CalendarDays size={13} className={styles.iconOrange} />;
  };

  const getWaitTimeBadgeStyle = (timeStr: string) => {
    const clean = timeStr.toLowerCase();
    // Extract numbers if present to color-code wait severity
    const matches = clean.match(/\d+/g);
    const hours = matches ? Math.max(...matches.map(Number)) : 0;
    
    if (clean.includes('15') || clean.includes('12') || clean.includes('10') || hours >= 8) {
      return { color: '#B91C1C', background: '#FEE2E2' }; // Red
    }
    if (clean.includes('3') || clean.includes('4') || clean.includes('5') || hours >= 3) {
      return { color: '#B45309', background: '#FEF3C7' }; // Amber
    }
    return { color: '#047857', background: '#D1FAE5' }; // Green
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return ''; }
  };

  return (
    <motion.div
      className={styles.banner}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Top row: always visible ── */}
      <div className={styles.topRow} onClick={() => setExpanded(e => !e)}>
        {/* Live dot + label */}
        <div className={styles.liveChip}>
          <span className={styles.liveDot} style={{ background: meta.pulse }} />
          <span>{t.verified}</span>
          {status.lastUpdated && (
            <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '4px', fontWeight: 600 }}>
              • {fmtTime(status.lastUpdated)}
            </span>
          )}
        </div>

        {/* Crowd badge */}
        <div
          className={styles.crowdBadge}
          style={{ background: meta.bg, color: meta.color }}
        >
          <Users size={12} />
          {localizedCrowdLabel}
        </div>

        {/* Wait time */}
        <div className={styles.waitTime}>
          <Clock size={12} />
          <span>{formatHeaderWait(status.waitTime)}</span>
        </div>

        {/* Expand toggle */}
        <div className={styles.toggleBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.details}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Queue Wait Progress Meter */}
            <div className={styles.meterContainer}>
              <div className={styles.meterLabels}>
                <span className={styles.meterTitle}>{t.queueCongestion}</span>
                <span className={styles.meterVal}>{formatHeaderWait(status.waitTime)} {t.overall}</span>
              </div>
              <div className={styles.meterTrack}>
                <div 
                  className={styles.meterBar} 
                  style={{ width: `${meta.percent}%`, backgroundColor: meta.color }}
                />
              </div>
            </div>

            {/* Darshan Breakdown */}
            {status.darshans && status.darshans.length > 0 && (
              <div className={styles.darshanList}>
                <div className={styles.darshanHeader}>
                  <span>{t.darshanCategory}</span>
                  <span style={{ textAlign: 'center' }}>{t.waitTime}</span>
                  <span style={{ textAlign: 'right' }}>{t.peakHours}</span>
                </div>
                {status.darshans.map((d: any, i: number) => (
                  <div key={i} className={styles.darshanRow}>
                    <div className={styles.darshanNameCol}>
                      {getDarshanIcon(d.name)}
                      <span className={styles.darshanName}>{d.name}</span>
                    </div>
                    <div className={styles.darshanTimeCol}>
                      <span 
                        className={styles.darshanTimeBadge} 
                        style={getWaitTimeBadgeStyle(d.waitTime)}
                      >
                        {formatHeaderWait(d.waitTime)}
                      </span>
                    </div>
                    <div className={styles.darshanPeakCol}>
                      <Clock size={11} className={styles.clockIcon} />
                      <span className={styles.darshanPeak}>{d.peakHours}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Grid removed - focusing on times only */}

            {status.notice && (
              <div className={styles.noticeBox}>
                <Bell size={14} />
                <span>{status.notice}</span>
              </div>
            )}

            {status.ssdTimingsGuide && (
              <div className={styles.noticeBox} style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' }}>
                <Ticket size={14} color="#D97706" style={{ flexShrink: 0 }} />
                <span>{status.ssdTimingsGuide}</span>
              </div>
            )}

            {/* Footer row */}
            <div className={styles.expandedFooter}>
              <button 
                className={`${styles.refreshButton} ${refreshing ? styles.refreshSpin : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={refreshing}
                title="Refresh Status"
              >
                <RefreshCw size={13} />
                <span>{refreshing ? t.refreshing : t.refresh}</span>
              </button>
              <p className={styles.updatedAt}>{t.updatedAt} {fmtTime(status.lastUpdated)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

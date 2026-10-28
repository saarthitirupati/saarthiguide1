'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { darshanRegistry } from '@/content/darshans';
import styles from './page.module.css';
import { DarshanDetail } from '@/types/darshan';
import { 
  ArrowLeft, CheckCircle2, XCircle, Activity, Info, Coins, ShieldAlert, 
  MapPin, Sparkles, Shirt, Lightbulb, Droplet, UtensilsCrossed, 
  Toilet, Hospital, Accessibility, Baby, Clock, Share2, Check,
  Navigation, Ticket, Users, Zap, ShieldCheck, ChevronDown, Lock,
  RefreshCw, AlertCircle, Compass, Gift, Train, Bus, Mountain, ExternalLink,
  Layers, Crown, ArrowUpRight
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';
import SaarthiGuidanceCard from '@/components/SaarthiGuidanceCard';

import { motion, AnimatePresence } from 'framer-motion';

export default function DarshanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';
  const id = rawId === 'ssd-tokens' || rawId === 'ssd' ? 'ssd-token' : rawId;
  const lang = useLanguage();

  const [data, setData] = useState<DarshanDetail | null>(() => {
    return darshanRegistry[id] || darshanRegistry[rawId] || null;
  });
  const [liveWaitTime, setLiveWaitTime] = useState<string>('');
  const [crowdLevel, setCrowdLevel] = useState<'NORMAL' | 'MODERATE' | 'HIGH' | 'EXTREME'>('MODERATE');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Dynamic TTD Status Data
  const [ssdTokenStatus, setSsdTokenStatus] = useState<'issuing' | 'paused' | 'closed-for-day' | 'suspended'>('closed-for-day');
  const [ssdNextTokenTime, setSsdNextTokenTime] = useState<string>('');
  const [ssdNotice, setSsdNotice] = useState<string>('');
  const [ssdAdvisoryTag, setSsdAdvisoryTag] = useState<string>('');
  const [ssdModeBadge, setSsdModeBadge] = useState<string>('');

  // Collapsible Sections (Roadmap & Why Wait open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    roadmap: true,
    dress: false,
    amenities: false,
    whyWait: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    const targetData = darshanRegistry[id] || darshanRegistry[rawId] || null;
    if (targetData) {
      setData(targetData);
    }
  }, [id, rawId]);

  const fetchStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/v1/status', { cache: 'no-store' });
      if (res.ok) {
        const statusData: TirumalaStatus = await res.json();
        
        if (statusData.ssdTokenStatus) {
          setSsdTokenStatus(statusData.ssdTokenStatus);
        }
        if (statusData.ssdNextTokenTime) {
          setSsdNextTokenTime(statusData.ssdNextTokenTime);
        }
        if (statusData.ssdNotice) {
          setSsdNotice(statusData.ssdNotice);
        }
        if (statusData.ssdAdvisoryTag) {
          setSsdAdvisoryTag(statusData.ssdAdvisoryTag);
        }
        if (statusData.ssdModeBadge) {
          setSsdModeBadge(statusData.ssdModeBadge);
        }

        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        if (statusData && statusData.darshans) {
          const mapNameToId = (name: string): string => {
            const lower = name.toLowerCase();
            if (lower.includes('sarva')) return 'sarva-darshan';
            if (lower.includes('300') || lower.includes('special')) return 'special-entry';
            if (lower.includes('ssd') || lower.includes('slotted') || lower.includes('token')) return 'ssd-token';
            if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
            if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
            return 'sarva-darshan';
          };

          const match = statusData.darshans.find((d: any) => mapNameToId(d.name) === id);
          if (match) {
            setLiveWaitTime(match.waitTime);
            const matchWait = match.waitTime || '';
            const matches = matchWait.match(/\d+/g);
            const matchNum = matches ? Math.max(...matches.map(Number)) : 0;
            if (matchNum >= 12 || /extreme|full|closed|heavy/i.test(matchWait)) {
              setCrowdLevel('EXTREME');
            } else if (matchNum >= 6 || /high|rush/i.test(matchWait)) {
              setCrowdLevel('HIGH');
            } else if (matchNum >= 3) {
              setCrowdLevel('MODERATE');
            } else {
              setCrowdLevel('NORMAL');
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch live status", err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 20000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchStatus();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (!data || loading) {
    return (
      <div className={styles.container}>
        <header className={styles.topAppBar}>
          <div className={styles.appBarTitleBlock}>
            <div className={styles.skeletonBox} style={{ width: '140px', height: '18px' }} />
          </div>
        </header>
        <div className={styles.mainLayoutGrid}>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonBox} style={{ width: '60%', height: '24px' }} />
            <div className={styles.skeletonBox} style={{ width: '40%', height: '36px', marginTop: '10px' }} />
            <div className={styles.skeletonBox} style={{ width: '100%', height: '80px', marginTop: '10px' }} />
          </div>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonBox} style={{ width: '50%', height: '20px' }} />
            <div className={styles.skeletonBox} style={{ width: '100%', height: '60px', marginTop: '8px' }} />
            <div className={styles.skeletonBox} style={{ width: '100%', height: '60px', marginTop: '8px' }} />
            <div className={styles.skeletonBox} style={{ width: '100%', height: '60px', marginTop: '8px' }} />
          </div>
        </div>
      </div>
    );
  }

  const themeColor = data.themeColor || '#0F5132';

  const getStepIcon = (index: number) => {
    switch(index) {
      case 1: return <MapPin size={17} />;
      case 2: return <ShieldCheck size={17} />;
      case 3: return <Users size={17} />;
      case 4: return <Navigation size={17} />;
      case 5: return <Sparkles size={17} />;
      case 6: return <Gift size={17} />;
      default: return <Compass size={17} />;
    }
  };

  const getFacilityVisual = (type: string) => {
    switch(type) {
      case 'water':      return { icon: <Droplet size={18} />, label: 'RO Water', color: '#0284C7', bg: '#F0F9FF' };
      case 'food':       return { icon: <UtensilsCrossed size={18} />, label: 'Annaprasadam', color: '#D97706', bg: '#FEF3C7' };
      case 'restroom':   return { icon: <Toilet size={18} />, label: 'Restrooms', color: '#475569', bg: '#F8FAFC' };
      case 'medical':    return { icon: <Hospital size={18} />, label: '24/7 Clinic', color: '#DC2626', bg: '#FEF2F2' };
      case 'wheelchair': return { icon: <Accessibility size={18} />, label: 'Wheelchair', color: '#7C3AED', bg: '#FAF5FF' };
      case 'infant':     return { icon: <Baby size={18} />, label: 'Infant Milk', color: '#DB2777', bg: '#FDF2F8' };
      default:           return { icon: <Sparkles size={18} />, label: 'Amenity', color: '#64748B', bg: '#F8FAFC' };
    }
  };

  return (
    <div className={styles.container} style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 16px))' }}>
      
      {/* ── 1. MINIMAL APP BAR (SINGLE HEADER LOCKUP) ── */}
      <header className={styles.topAppBar}>
        <button onClick={() => router.back()} className={styles.iconButton} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className={styles.appBarTitleBlock}>
          <span className={styles.livePulseIndicator} />
          <h1 className={`${styles.appBarTitle} ${lang === 'te' ? styles.teluguFont : ''}`}>
            {lang === 'te' ? 'తిరుమల దర్శన మార్గదర్శి' : 'Srivari Pilgrim Guide'}
          </h1>
        </div>
        <div className={styles.appBarActions}>
          <button 
            onClick={() => fetchStatus(true)} 
            className={`${styles.iconButton} ${refreshing ? styles.spinAnimation : ''}`} 
            aria-label="Refresh status"
            title="Refresh status"
          >
            <RefreshCw size={16} />
          </button>
          <button onClick={handleShare} className={styles.iconButton} aria-label="Share">
            {copied ? <Check size={16} color="#16A34A" /> : <Share2 size={16} />}
          </button>
        </div>
      </header>

      {/* Copy Toast */}
      {copied && (
        <div className={styles.toastNotification}>
          <CheckCircle2 size={15} /> Link copied to clipboard
        </div>
      )}

      {/* ── 2 & 3. RESPONSIVE DUAL-COLUMN LAYOUT ── */}
      <main className={styles.mainLayoutGrid}>

            {/* ── LEFT COLUMN: HERO STATUS CARD ── */}
        <div className={styles.leftColumn}>
          <section className={styles.heroStatusCard}>
            
            {/* Header: Icon + Title + Status Pill */}
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardTitleWrap}>
                <div className={styles.cardTypeIcon} style={{ color: themeColor, backgroundColor: `${themeColor}12` }}>
                  <Ticket size={18} />
                </div>
                <h2 className={`${styles.cardMainHeading} ${lang === 'te' ? styles.teluguFont : ''}`}>
                  {lang === 'te' ? (data.teluguTitle || data.title) : data.title}
                </h2>
              </div>
              <span
                className={styles.statusPill}
                style={{
                  background: id === 'ssd-token' && ssdTokenStatus === 'suspended' ? '#FEF2F2' : 'rgba(217, 119, 6, 0.12)',
                  color: id === 'ssd-token' && ssdTokenStatus === 'suspended' ? '#B91C1C' : '#92400E',
                  fontWeight: 700
                }}
              >
                {id === 'ssd-token' 
                  ? (ssdTokenStatus === 'suspended' ? (lang === 'te' ? 'నిలిపివేయబడింది' : (ssdAdvisoryTag || 'SUSPENDED')) : (ssdModeBadge || 'TOKEN ENTRY'))
                  : id === 'special-entry' ? 'ONLINE SLOT' : 'WALK-IN DARSHAN'}
              </span>
            </div>

            {/* ⏱️ ESTIMATED WAITING TIME HERO BLOCK */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(30, 35, 45, 0.08)',
              borderRadius: '16px',
              padding: '16px 18px',
              marginTop: '4px',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {lang === 'te' ? 'అంచనా వేచియుండు సమయం' : 'ESTIMATED WAITING TIME'}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {id === 'ssd-token'
                    ? (ssdTokenStatus === 'suspended' ? (lang === 'te' ? 'నిలిపివేయబడింది' : 'Suspended') : ssdTokenStatus === 'closed-for-day' ? (lang === 'te' ? 'నేడు క్లోజ్' : 'Closed') : liveWaitTime || '2–4 hrs')
                    : (liveWaitTime || data.waitTime)}
                </span>
                
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  backgroundColor: id === 'ssd-token' && (ssdTokenStatus === 'suspended' || ssdTokenStatus === 'closed-for-day') ? '#FEE2E2' : crowdLevel === 'EXTREME' ? '#FEE2E2' : crowdLevel === 'HIGH' || crowdLevel === 'MODERATE' ? '#FEF3C7' : '#DCFCE7',
                  color: id === 'ssd-token' && (ssdTokenStatus === 'suspended' || ssdTokenStatus === 'closed-for-day') ? '#DC2626' : crowdLevel === 'EXTREME' ? '#DC2626' : crowdLevel === 'HIGH' || crowdLevel === 'MODERATE' ? '#B45309' : '#15803D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: id === 'ssd-token' && (ssdTokenStatus === 'suspended' || ssdTokenStatus === 'closed-for-day') ? '#DC2626' : crowdLevel === 'EXTREME' ? '#DC2626' : crowdLevel === 'HIGH' ? '#D97706' : '#16A34A',
                    display: 'inline-block'
                  }} />
                  <span>
                    {id === 'ssd-token' && ssdTokenStatus === 'suspended'
                      ? (lang === 'te' ? 'ప్రత్యక్ష దర్శనం కొనసాగుతుంది' : 'Direct Walk-in Active')
                      : id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' 
                        ? (lang === 'te' ? 'నేడు క్లోజ్' : 'Closed for Day') 
                        : `${crowdLevel} WAIT · ${lastSyncTime}`}
                  </span>
                </span>
              </div>

              {/* BEFORE YOU GO: 3 VISUAL PILLS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '10px',
                  padding: '8px 6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Ticket size={15} color="#15803D" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', lineHeight: 1.2 }}>
                    {id === 'special-entry' ? '₹300 Ticket' : id === 'ssd-token' ? 'SSD Token' : 'Free Walk-in'}
                  </span>
                </div>

                <Link 
                  href="/darshan/entry-points"
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: '10px',
                    padding: '8px 6px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                  title="View all 15 Tirumala Darshan entry gates"
                >
                  <MapPin size={15} color="#2563EB" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', lineHeight: 1.2 }}>
                    {(data.entryGate || 'VQC-II').split(',')[0]} ↗
                  </span>
                </Link>

                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  borderRadius: '10px',
                  padding: '8px 6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <UtensilsCrossed size={15} color="#D97706" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', lineHeight: 1.2 }}>
                    Free Meals & RO
                  </span>
                </div>
              </div>

              {/* 🎯 PRIMARY ACTION CTA BUTTON */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('darshan-journey');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setOpenSections(prev => ({ ...prev, roadmap: true }));
                }}
                style={{
                  width: '100%',
                  marginTop: '14px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lang === 'te' ? 'దర్శన మార్గం చూడండి →' : 'View Darshan Route →'}</span>
              </button>
            </div>

            {/* ✨ SAARTHI SUGGESTS RECOMMENDATION CARD */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(30, 35, 45, 0.08)',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#92400E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    SAARTHI SUGGESTS
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E232D', marginTop: '1px' }}>
                    {lang === 'te' ? 'సమయం ఉందా? తిరుచానూరు శ్రీ పద్మావతి అమ్మవారిని దర్శించుకోండి.' : 'Have extra time today? Visit Sri Padmavathi Ammavari Temple.'}
                  </div>
                </div>
              </div>
              <Link 
                href="/explore" 
                style={{ 
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706' }}>
                  {lang === 'te' ? 'వివరాలు →' : 'View details →'}
                </span>
              </Link>
            </div>

            {/* OFFICIAL TTD BOOKING ACTION CARD (FOR SPECIAL ENTRY ₹300 ONLY) */}
            {id === 'special-entry' && (
              <a
                href="https://ttdevasthanams.ap.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                  color: '#FFFFFF',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Ticket size={18} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 600 }}>Book ₹300 Ticket on Official TTD Portal</div>
                      <div style={{ fontSize: '10.5px', opacity: 0.9 }}>ttdevasthanams.ap.gov.in</div>
                    </div>
                  </div>
                  <ExternalLink size={16} color="#FFFFFF" />
                </div>
              </a>
            )}

            {/* TIRUPATI SSD TOKEN COUNTER TILES (SSD TOKEN ONLY) */}
            {id === 'ssd-token' && (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Ticket size={14} color="#E11D48" />
                  <span>{lang === 'te' ? 'SSD ఉచిత టోకెన్ కేంద్రాలు (తిరుపతి)' : 'Tirupati SSD Token Counters'}</span>
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(() => {
                    const dynamicStatus = (() => {
                      if (ssdTokenStatus === 'suspended') {
                        return {
                          text: lang === 'te' ? 'టోకెన్లు నిలిపివేయబడ్డాయి · తిరుమలలో ప్రత్యక్ష దర్శనం' : 'Tokens Suspended · Direct Walk-in Active',
                          bg: '#FEF2F2',
                          border: '#FECACA',
                          color: '#B91C1C'
                        };
                      }
                      if (ssdTokenStatus === 'issuing') {
                        return {
                          text: lang === 'te' ? 'ప్రస్తుతం టోకెన్లు జారీ అవుతున్నాయి (కోటా ఉన్నంత వరకు)' : 'Actively Issuing Now (until quota lasts)',
                          bg: '#F0FDF4',
                          border: '#BBF7D0',
                          color: '#15803D'
                        };
                      }
                      if (ssdTokenStatus === 'paused') {
                        return {
                          text: lang === 'te' 
                            ? `తాత్కాలికంగా నిలిపివేయబడింది${ssdNextTokenTime ? ` · ${ssdNextTokenTime}` : ''}`
                            : `Temporarily Paused${ssdNextTokenTime ? ` · ${ssdNextTokenTime}` : ''}`,
                          bg: '#FFFBEB',
                          border: '#FDE68A',
                          color: '#B45309'
                        };
                      }
                      if (ssdNextTokenTime) {
                        const isCancelledOrSuspended = /cancel|suspend|close/i.test(ssdNextTokenTime);
                        if (isCancelledOrSuspended) {
                          return {
                            text: ssdNextTokenTime,
                            bg: '#FEF2F2',
                            border: '#FECACA',
                            color: '#DC2626'
                          };
                        }
                        return {
                          text: lang === 'te' ? `మరుసటి విడుదల: ${ssdNextTokenTime} (కోటా ఉన్నంత వరకు)` : `Next Release: ${ssdNextTokenTime} (until quota lasts)`,
                          bg: '#FFF7ED',
                          border: '#FED7AA',
                          color: '#C2410C'
                        };
                      }
                      return {
                        text: lang === 'te' ? 'ఉదయం వేళల్లో తెరువబడును (కోటా ఉన్నంత వరకు)' : 'Opens early morning daily (until quota lasts)',
                        bg: '#FFF7ED',
                        border: '#FED7AA',
                        color: '#C2410C'
                      };
                    })();

                    const counters = [
                      { 
                        name: lang === 'te' ? 'విష్ణు నివాసం కాంప్లెక్స్' : 'Vishnu Nivasam Complex', 
                        addr: lang === 'te' ? 'తిరుపతి రైల్వే స్టేషన్ ప్లాట్‌ఫారమ్ 1 ఎదురుగా' : 'Directly opposite Tirupati Main Railway Station (Platform 1 Exit)', 
                        mapUrl: 'https://www.google.com/maps/place/Tirupathi+in+vishnu+nivasam+rest+house/@13.6291509,79.4159267,16.57z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4bead70ef80b:0x67019ead37155b82!8m2!3d13.6291294!4d79.421782!16s%2Fg%2F11ssb0tp1j', 
                        icon: Train, 
                        iconColor: '#2563EB', 
                        iconBg: '#EFF6FF' 
                      },
                      { 
                        name: lang === 'te' ? 'శ్రీనివాసం కాంప్లెక్స్' : 'Srinivasam Complex', 
                        addr: lang === 'te' ? 'తిరుపతి సెంట్రల్ ఆర్టీసీ బస్టాండ్ ఎదురుగా' : 'Opposite Tirupati Central RTC Bus Station', 
                        mapUrl: 'https://www.google.com/maps/place/Srinivasam+Complex,+SH+61,+Kothapalli,+Tirupati,+Andhra+Pradesh+517501/@13.6322127,79.4275624,18.77z/data=!4m10!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m6!1s0x3a4d4ba8fb3a7c87:0xbb1d8612f380be25!8m2!3d13.6324562!4d79.4288488!15sChtTcmluaXZhc2FtIENvbXBsZXggVGlydXBhdGmSAQpzdWJwcmVtaXNl4AEA!16s%2Fg%2F11zhwd46nj', 
                        icon: Bus, 
                        iconColor: '#D97706', 
                        iconBg: '#FEF3C7' 
                      },
                      { 
                        name: lang === 'te' ? 'భూదేవి కాంప్లెక్స్' : 'Bhudevi Complex', 
                        addr: lang === 'te' ? 'అలిపిరి మెట్ల మార్గం ప్రారంభం వద్ద' : 'Alipiri Foot of the Hills (Alipiri Bypass Bus Stop)', 
                        mapUrl: 'https://www.google.com/maps/place/Sri+Bhudevi+pilgrimage+Ttd+Dharshan%E2%80%99s+free+tickets/@13.6455158,79.4054241,17z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4b38f66460f1:0x73e082c2b7f1b30!8m2!3d13.6473239!4d79.4095922!16s%2Fg%2F11j8lvd91q', 
                        icon: Mountain, 
                        iconColor: '#059669', 
                        iconBg: '#D1FAE5' 
                      },
                    ];

                    return counters.map((c, idx) => {
                      const IconComp = c.icon;
                      return (
                        <div
                          key={idx}
                          role="button"
                          tabIndex={0}
                          onClick={() => window.open(c.mapUrl, '_blank', 'noopener,noreferrer')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              window.open(c.mapUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '14px',
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: c.iconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <IconComp size={20} color={c.iconColor} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                                {c.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 500, marginTop: '2px', lineHeight: 1.35 }}>
                                {c.addr}
                              </div>
                              <div style={{
                                marginTop: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: dynamicStatus.bg,
                                border: `1px solid ${dynamicStatus.border}`,
                                color: dynamicStatus.color,
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: 600
                              }}>
                                <Clock size={11} color={dynamicStatus.color} />
                                <span>{dynamicStatus.text}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: '#F0FDF4',
                            border: '1px solid #DCFCE7',
                            color: '#0F5132',
                            padding: '6px 9px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            flexShrink: 0
                          }}>
                            <span>{lang === 'te' ? 'నావిగేట్' : 'Navigate'}</span>
                            <ArrowUpRight size={13} color="#0F5132" />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* DYNAMIC ADVISORY NOTICE (SSD TOKENS ONLY) */}
            {id === 'ssd-token' && ssdNotice && (
              <div style={{
                background: '#FEF2F2',
                border: '1.5px solid #FECACA',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.06)'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldAlert size={18} color="#DC2626" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#991B1B', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block' }}>
                    {lang === 'te' ? 'ముఖ్యమైన హెచ్చరిక' : 'IMPORTANT ADVISORY'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#7F1D1D', lineHeight: 1.45, display: 'block', marginTop: '3px' }}>
                    {ssdNotice.replace(/@/g, ' · ')}
                  </span>
                </div>
              </div>
            )}

          </section>
        </div>

        {/* ── RIGHT COLUMN: ACCORDIONS & DETAILS ── */}
        <div className={styles.rightColumn}>
          
          {/* ── SECTION 2: YOUR DARSHAN JOURNEY (COMPACT 6-STEP EXPANDABLE TIMELINE) ── */}
          <div id="darshan-journey" className={styles.minimalAccordionCard}>
            <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className={styles.accordionHeading} style={{ fontSize: '16px', color: '#0F172A' }}>
                  {lang === 'te' ? 'మీ దర్శన ప్రయాణం' : 'Your Darshan Journey'}
                </h3>
                <span className={styles.miniPillBadge} style={{ background: '#DCFCE7', color: '#15803D' }}>
                  {data.journeySteps.length} STEPS · {liveWaitTime || '4–8 HRS'}
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '4px 0 0', fontWeight: 500 }}>
                {lang === 'te' ? 'వివరాలు చూడటానికి ఏదైనా మెట్టును నొక్కండి' : 'Tap any step to see entry guidelines & reporting rules'}
              </p>
            </div>

            <div style={{ padding: '8px 12px 14px' }}>
              <div className={styles.stepsTimeline}>
                {data.journeySteps.map((step) => {
                  const isExpanded = activeStep === step.step;
                  return (
                    <div 
                      key={step.step}
                      className={`${styles.stepNode} ${isExpanded ? styles.stepNodeActive : ''}`}
                      onClick={() => setActiveStep(isExpanded ? 0 : step.step)}
                      style={{
                        border: isExpanded ? '1.5px solid #0F5132' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        marginBottom: '6px',
                        background: isExpanded ? '#F0FDF4' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div className={styles.stepBulletWrap}>
                        <div className={`${styles.stepBullet} ${isExpanded ? styles.stepBulletActive : ''}`} style={{ width: '28px', height: '28px' }}>
                          {getStepIcon(step.step)}
                        </div>
                      </div>
                      <div className={styles.stepContent}>
                        <div className={styles.stepHeader} style={{ justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={styles.stepNumberTag}>● {step.step}.</span>
                            <h4 className={styles.stepTitle} style={{ fontSize: '13px', fontWeight: 600 }}>{step.title}</h4>
                          </div>
                          <ChevronDown size={15} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: '#64748B' }} />
                        </div>
                        
                        <div style={{ fontSize: '12px', color: '#475569', fontWeight: 500, marginTop: '2px' }}>
                          {step.desc.split('.')[0]}.
                        </div>

                        {/* EXPANDABLE STEP DETAILS (PROGRESSIVE DISCLOSURE) */}
                        {isExpanded && (
                          <div style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid #DCFCE7',
                            fontSize: '12px',
                            color: '#166534',
                            lineHeight: 1.5,
                            animation: 'fadeIn 0.2s ease-out'
                          }}>
                            <p style={{ margin: 0, fontWeight: 500 }}>{step.desc}</p>
                            {step.estimatedTime && (
                              <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 600, color: '#0F5132', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} />
                                <span>Approx. Duration: {step.estimatedTime}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: UNIFIED USEFUL INFORMATION ACCORDIONS ── */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '0.02em', paddingLeft: '2px' }}>
              {lang === 'te' ? 'ఉపయోగకరమైన సమాచారం' : 'Useful Information'}
            </div>

            <div className={styles.accordionGroup}>

              {/* ── ACCORDION 1: DRESS CODE (VISUAL GRAPHIC CARDS) ── */}
              <div className={styles.minimalAccordionCard}>
                <button 
                  onClick={() => toggleSection('dress')} 
                  className={styles.accordionHeader}
                  aria-expanded={openSections.dress}
                >
                  <div className={styles.accordionHeaderLeft}>
                    <div className={styles.sectionIconBadge} style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                      <Shirt size={17} />
                    </div>
                    <div>
                      <h3 className={styles.accordionHeading}>{lang === 'te' ? 'దుస్తుల నిబంధనలు' : 'Dress Code & Guidelines'}</h3>
                      <span className={styles.accordionSubheading}>{lang === 'te' ? 'సాంప్రదాయ దుస్తులు తప్పనిసరి' : 'Mandatory traditional TTD attire'}</span>
                    </div>
                  </div>
                  <div className={styles.accordionHeaderRight}>
                    <span className={styles.miniPillBadge} style={{ color: '#16A34A' }}>{lang === 'te' ? 'మార్గదర్శకాలు →' : 'View guidelines →'}</span>
                    <ChevronDown size={17} className={`${styles.chevron} ${openSections.dress ? styles.chevronRotated : ''}`} />
                  </div>
                </button>

                {openSections.dress && (
                  <div className={styles.accordionBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {/* Permitted Card */}
                      <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '12px', padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span>{lang === 'te' ? 'అనుమతించబడినవి' : 'Permitted Attire'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#14532D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Shirt size={13} color="#16A34A" /> Men: Dhoti / Kurta-Pyjama
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#14532D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Shirt size={13} color="#16A34A" /> Women: Saree / Salwar Dupatta
                          </span>
                        </div>
                      </div>

                      {/* Prohibited Card */}
                      <div style={{ background: '#FEF2F2', border: '1.5px solid #FECDD3', borderRadius: '12px', padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <XCircle size={15} color="#DC2626" />
                          <span>{lang === 'te' ? 'నిషేధించబడినవి' : 'Prohibited Attire'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#7F1D1D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <XCircle size={13} color="#DC2626" /> Shorts, Jeans, T-Shirts
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#7F1D1D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <XCircle size={13} color="#DC2626" /> Sleeveless & Western Casuals
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: '#92400E'
                    }}>
                      <ShieldAlert size={15} color="#D97706" style={{ flexShrink: 0 }} />
                      <span>{lang === 'te' ? 'ఫోన్‌లు & పాదరక్షలు VQC వెలుపలి ఉచిత లాకర్లలో డిపాజిట్ చేయండి.' : 'Deposit phones, cameras, smartwatches & shoes at free VQC lockers before gate entry.'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── ACCORDION 2: QUEUE FACILITIES (VISUAL GRAPHIC GRID) ── */}
              <div className={styles.minimalAccordionCard}>
                <button 
                  onClick={() => toggleSection('amenities')} 
                  className={styles.accordionHeader}
                  aria-expanded={openSections.amenities}
                >
                  <div className={styles.accordionHeaderLeft}>
                    <div className={styles.sectionIconBadge} style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                      <UtensilsCrossed size={17} />
                    </div>
                    <div>
                      <h3 className={styles.accordionHeading}>{lang === 'te' ? 'ఆహారం & సౌకర్యాలు' : 'Food & Queue Facilities'}</h3>
                      <span className={styles.accordionSubheading}>{lang === 'te' ? 'ఉచిత సేవలు & అన్నప్రసాదం' : 'Free Annaprasadam, RO water & clinic'}</span>
                    </div>
                  </div>
                  <div className={styles.accordionHeaderRight}>
                    <span className={styles.miniPillBadge} style={{ color: '#2563EB' }}>{lang === 'te' ? 'సౌకర్యాలు →' : 'View facilities →'}</span>
                    <ChevronDown size={17} className={`${styles.chevron} ${openSections.amenities ? styles.chevronRotated : ''}`} />
                  </div>
                </button>

                {openSections.amenities && (
                  <div className={styles.accordionBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Droplet size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>RO Drinking Water</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Every 10m in halls</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <UtensilsCrossed size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Hot Annaprasadam</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Meals & milk 24/7</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Toilet size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Restrooms</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Attached to each hall</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEE2E2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Hospital size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>24/7 Medical Clinic</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Doctors & paramedics</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FCE7F3', color: '#BE185D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Baby size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Infant Warm Milk</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Prioritized for toddlers</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EDE9FE', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Accessibility size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Wheelchair Ramps</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Attendant priority lane</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── ACCORDION 3: WHY THIS WAIT TIME (INFOGRAPHIC CARDS) ── */}
              <div className={styles.minimalAccordionCard}>
                <button 
                  onClick={() => toggleSection('whyWait')} 
                  className={styles.accordionHeader}
                  aria-expanded={openSections.whyWait}
                >
                  <div className={styles.accordionHeaderLeft}>
                    <div className={styles.sectionIconBadge} style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                      <Lightbulb size={17} />
                    </div>
                    <div>
                      <h3 className={styles.accordionHeading}>{lang === 'te' ? 'ఈ వేచియుండు సమయం ఎందుకు?' : 'Why This Wait Time?'}</h3>
                      <span className={styles.accordionSubheading}>{lang === 'te' ? 'రద్దీ & కారణాలు' : 'Understand queue movement & factors'}</span>
                    </div>
                  </div>
                  <div className={styles.accordionHeaderRight}>
                    <span className={styles.miniPillBadge} style={{ color: '#D97706' }}>{lang === 'te' ? 'కారణాలు →' : 'Understand wait time →'}</span>
                    <ChevronDown size={17} className={`${styles.chevron} ${openSections.whyWait ? styles.chevronRotated : ''}`} />
                  </div>
                </button>

                {openSections.whyWait && (
                  <div className={styles.accordionBody}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Factor 1 */}
                      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Layers size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#78350F' }}>31 Sequential Compartments</div>
                          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 500 }}>Approx. 45–60 mins per hall release cycle</div>
                        </div>
                      </div>

                      {/* Factor 2 */}
                      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Crown size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#78350F' }}>VIP & Seva Kainkaryam Clearances</div>
                          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 500 }}>Intermittent priority slots inside main shrine</div>
                        </div>
                      </div>

                      {/* Pro-Tip Visual Card */}
                      <div style={{ background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)', color: '#FFFFFF', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        <Sparkles size={20} color="#FDE68A" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BEST DARSHAN WINDOW</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, marginTop: '1px' }}>Tuesdays & Wednesdays, 11:00 PM – 4:00 AM</div>
                          <div style={{ fontSize: '10.5px', opacity: 0.85, fontWeight: 500 }}>Least crowd & fastest queue movement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* ── 4. STICKY BOTTOM BUTTON ── */}
      <footer className={styles.bottomBarWrap}>
        <button onClick={() => router.push('/')} className={styles.returnDashboardBtn}>
          Back to Live Dashboard
        </button>
      </footer>

    </div>
  );
}




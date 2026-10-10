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
  Layers, Crown
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
  const [ssdTokenStatus, setSsdTokenStatus] = useState<'issuing' | 'paused' | 'closed-for-day'>('closed-for-day');
  const [ssdNextTokenTime, setSsdNextTokenTime] = useState<string>('2:00 AM');
  const [ssdNotice, setSsdNotice] = useState<string>('');

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
    <div className={styles.container}>
      
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
              <span className={styles.statusPill} style={{ backgroundColor: themeColor, color: '#FFFFFF' }}>
                {id === 'ssd-token' ? 'TOKEN ENTRY' : id === 'special-entry' ? 'ONLINE SLOT' : 'WALK-IN DARSHAN'}
              </span>
            </div>

            {/* ⏱️ ESTIMATED WAITING TIME HERO BLOCK */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 18px',
              marginTop: '4px',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {lang === 'te' ? 'అంచనా వేచియుండు సమయం' : 'ESTIMATED WAITING TIME'}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {id === 'ssd-token'
                    ? (ssdTokenStatus === 'closed-for-day' ? 'Closed' : liveWaitTime || '2–4 hrs')
                    : (liveWaitTime || data.waitTime)}
                </span>
                
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  backgroundColor: id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? '#FEE2E2' : crowdLevel === 'EXTREME' ? '#FEE2E2' : crowdLevel === 'HIGH' || crowdLevel === 'MODERATE' ? '#FEF3C7' : '#DCFCE7',
                  color: id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? '#DC2626' : crowdLevel === 'EXTREME' ? '#DC2626' : crowdLevel === 'HIGH' || crowdLevel === 'MODERATE' ? '#B45309' : '#15803D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? '#DC2626' : crowdLevel === 'EXTREME' ? '#DC2626' : crowdLevel === 'HIGH' ? '#D97706' : '#16A34A',
                    display: 'inline-block'
                  }} />
                  <span>{id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? (lang === 'te' ? 'నేడు క్లోజ్' : 'Closed for Day') : `${crowdLevel} WAIT · ${lastSyncTime}`}</span>
                </span>
              </div>

              {/* BEFORE YOU GO (3 CONCISE CHECKPOINTS) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {lang === 'te' ? 'వెళ్ళే ముందు ముఖ్యమైనవి' : 'Before You Go'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
                  <Ticket size={14} color="#0F5132" style={{ flexShrink: 0 }} />
                  <span>{id === 'special-entry' ? (lang === 'te' ? 'ఆన్‌లైన్ స్లాట్ టికెట్ తప్పనిసరి' : 'Advance ₹300 Online Ticket Required') : id === 'ssd-token' ? (lang === 'te' ? 'ఉచిత టోకెన్ లేదా తిరుపతి కౌంటర్' : 'Free SSD Token Voucher Required') : (lang === 'te' ? 'ముందస్తు టికెట్ అవసరం లేదు' : 'No advance ticket or token required')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
                  <MapPin size={14} color="#0F5132" style={{ flexShrink: 0 }} />
                  <span>{lang === 'te' ? 'ప్రవేశం: వైకుంఠం క్యూ కాంప్లెక్స్-2 (VQC-II)' : `Entry Point: ${(data.entryGate || 'VQC-II, Tirumala').split(',')[0]}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
                  <UtensilsCrossed size={14} color="#0F5132" style={{ flexShrink: 0 }} />
                  <span>{lang === 'te' ? 'ఉచిత అన్నప్రసాదం & తాగునీరు అందుబాటులో ఉన్నాయి' : 'Free Annaprasadam, Milk & RO Water Included'}</span>
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
                  fontWeight: 800,
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
              background: 'linear-gradient(135deg, #FFFDF7 0%, #FEF3C7 100%)',
              border: '1.5px solid #FDE68A',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#B45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    ✨ SAARTHI SUGGESTS
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#78350F', marginTop: '1px' }}>
                    {lang === 'te' ? 'సమయం ఉందా? తిరుచానూరు శ్రీ పద్మావతి అమ్మవారిని దర్శించుకోండి.' : 'Have extra time today? Visit Sri Padmavathi Ammavari Temple.'}
                  </div>
                </div>
              </div>
              <Link 
                href="/explore" 
                style={{ 
                  fontSize: '11.5px', 
                  fontWeight: 800, 
                  color: '#78350F', 
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  background: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #F59E0B',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  flexShrink: 0
                }}
              >
                {lang === 'te' ? 'వివరాలు →' : 'View details →'}
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
                      <div style={{ fontSize: '12.5px', fontWeight: 800 }}>Book ₹300 Ticket on Official TTD Portal</div>
                      <div style={{ fontSize: '10.5px', opacity: 0.9 }}>ttdevasthanams.ap.gov.in</div>
                    </div>
                  </div>
                  <ExternalLink size={16} color="#FFFFFF" />
                </div>
              </a>
            )}

            {/* TIRUPATI SSD TOKEN COUNTER TILES (SSD TOKEN ONLY) */}
            {id === 'ssd-token' && data.tokenLocations && data.tokenLocations.length > 0 && (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Ticket size={14} color="#E11D48" />
                  <span>{lang === 'te' ? 'SSD ఉచిత టోకెన్ కేంద్రాలు (తిరుపతి)' : 'Tirupati SSD Token Counters'}</span>
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.tokenLocations.map((loc, idx) => {
                    const mapsUrl = idx === 0 
                      ? "https://www.google.com/maps/place/Vishnu+Nivasam/@13.6292776,79.4215889"
                      : idx === 1
                      ? "https://www.google.com/maps/place/Srinivasam/@13.6315627,79.4288389"
                      : "https://www.google.com/maps/place/Bhudevi+complex/@13.6464948,79.4097309";
                    const icon = idx === 0 ? <Train size={16} color="#2563EB" /> : idx === 1 ? <Bus size={16} color="#D97706" /> : <Mountain size={16} color="#059669" />;
                    const iconBg = idx === 0 ? '#EFF6FF' : idx === 1 ? '#FEF3C7' : '#D1FAE5';
                    return (
                      <a key={idx} href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '8px',
                              background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              {icon}
                            </div>
                            <div>
                              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>{loc.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>{loc.landmark}</div>
                              <div style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={11} color="#DC2626" />
                                <span>{loc.counterHours}</span>
                              </div>
                            </div>
                          </div>
                          <Compass size={16} color="#64748B" style={{ flexShrink: 0 }} />
                        </div>
                      </a>
                    );
                  })}
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
                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#991B1B', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block' }}>
                    {lang === 'te' ? 'ముఖ్యమైన హెచ్చరిక' : 'IMPORTANT ADVISORY'}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#7F1D1D', lineHeight: 1.45, display: 'block', marginTop: '3px' }}>
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
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '4px 0 0', fontWeight: 600 }}>
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
                            <h4 className={styles.stepTitle} style={{ fontSize: '13px', fontWeight: 800 }}>{step.title}</h4>
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
                              <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 800, color: '#0F5132', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', marginBottom: '8px', letterSpacing: '0.02em', paddingLeft: '2px' }}>
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
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span>{lang === 'te' ? 'అనుమతించబడినవి' : 'Permitted Attire'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#14532D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Shirt size={13} color="#16A34A" /> Men: Dhoti / Kurta-Pyjama
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#14532D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Shirt size={13} color="#16A34A" /> Women: Saree / Salwar Dupatta
                          </span>
                        </div>
                      </div>

                      {/* Prohibited Card */}
                      <div style={{ background: '#FEF2F2', border: '1.5px solid #FECDD3', borderRadius: '12px', padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <XCircle size={15} color="#DC2626" />
                          <span>{lang === 'te' ? 'నిషేధించబడినవి' : 'Prohibited Attire'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7F1D1D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <XCircle size={13} color="#DC2626" /> Shorts, Jeans, T-Shirts
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#7F1D1D', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                      fontWeight: 700,
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
                      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Droplet size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0369A1' }}>RO Drinking Water</div>
                          <div style={{ fontSize: '10px', color: '#0284C7', fontWeight: 600 }}>Every 10m in halls</div>
                        </div>
                      </div>

                      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <UtensilsCrossed size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#92400E' }}>Hot Annaprasadam</div>
                          <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600 }}>Meals & milk 24/7</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#475569', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Toilet size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155' }}>Restrooms</div>
                          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Attached to each hall</div>
                        </div>
                      </div>

                      <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DC2626', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Hospital size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#991B1B' }}>24/7 Medical Clinic</div>
                          <div style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600 }}>Doctors & paramedics</div>
                        </div>
                      </div>

                      <div style={{ background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DB2777', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Baby size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#9D174D' }}>Infant Warm Milk</div>
                          <div style={{ fontSize: '10px', color: '#DB2777', fontWeight: 600 }}>Prioritized for toddlers</div>
                        </div>
                      </div>

                      <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Accessibility size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#6B21A8' }}>Wheelchair Ramps</div>
                          <div style={{ fontSize: '10px', color: '#7C3AED', fontWeight: 600 }}>Attendant priority lane</div>
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
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#78350F' }}>31 Sequential Compartments</div>
                          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 500 }}>Approx. 45–60 mins per hall release cycle</div>
                        </div>
                      </div>

                      {/* Factor 2 */}
                      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Crown size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#78350F' }}>VIP & Seva Kainkaryam Clearances</div>
                          <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 500 }}>Intermittent priority slots inside main shrine</div>
                        </div>
                      </div>

                      {/* Pro-Tip Visual Card */}
                      <div style={{ background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)', color: '#FFFFFF', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        <Sparkles size={20} color="#FDE68A" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 900, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BEST DARSHAN WINDOW</div>
                          <div style={{ fontSize: '12.5px', fontWeight: 800, marginTop: '1px' }}>Tuesdays & Wednesdays, 11:00 PM – 4:00 AM</div>
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




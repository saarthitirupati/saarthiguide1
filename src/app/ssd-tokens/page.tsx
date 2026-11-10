'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Ticket, Clock, ShieldAlert, CheckCircle2, 
  MapPin, Train, Bus, Mountain, Compass, RefreshCw, Share2, Check, 
  ChevronRight, Navigation, Calendar, ShieldCheck, Lightbulb, Bell,
  Play, Square
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';

const COLLECTION_CENTRES = [
  {
    id: 'vishnu-nivasam',
    nameEn: 'Vishnu Nivasam Complex',
    nameTe: 'విష్ణు నివాసం కాంప్లెక్స్',
    landmarkEn: 'Directly opposite Tirupati Main Railway Station (Platform 1 Exit)',
    landmarkTe: 'తిరుపతి రైల్వే స్టేషన్ ప్లాట్‌ఫారమ్ 1 ఎదురుగా',
    counterHours: 'Opens early morning daily (subject to live quota)',
    quotaInfoEn: 'High-capacity counter; fills quickly due to train arrivals',
    quotaInfoTe: 'రైలు భక్తులు ఎక్కువగా వచ్చే ప్రధాన కేంద్రం',
    iconType: 'train',
    mapsUrl: 'https://www.google.com/maps/place/Tirupathi+in+vishnu+nivasam+rest+house/@13.6291509,79.4159267,16.57z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4bead70ef80b:0x67019ead37155b82!8m2!3d13.6291294!4d79.421782!16s%2Fg%2F11ssb0tp1j'
  },
  {
    id: 'srinivasam',
    nameEn: 'Srinivasam Complex',
    nameTe: 'శ్రీనివాసం కాంప్లెక్స్',
    landmarkEn: 'Opposite Tirupati Central RTC Bus Station',
    landmarkTe: 'తిరుపతి సెంట్రల్ ఆర్టీసీ బస్టాండ్ ఎదురుగా',
    counterHours: 'Opens early morning daily (subject to live quota)',
    quotaInfoEn: 'Primary counter for bus passengers with multi-lane desks',
    quotaInfoTe: 'ఆర్టీసీ బస్సు భక్తుల కోసం బహుళ బయోమెట్రిక్ కౌంటర్లు',
    iconType: 'bus',
    mapsUrl: 'https://www.google.com/maps/place/Srinivasam+Complex,+SH+61,+Kothapalli,+Tirupati,+Andhra+Pradesh+517501/@13.6322127,79.4275624,18.77z/data=!4m10!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m6!1s0x3a4d4ba8fb3a7c87:0xbb1d8612f380be25!8m2!3d13.6324562!4d79.4288488!15sChtTcmluaXZhc2FtIENvbXBsZXggVGlydXBhdGmSAQpzdWJwcmVtaXNl4AEA!16s%2Fg%2F11zhwd46nj'
  },
  {
    id: 'bhudevi',
    nameEn: 'Bhudevi Complex',
    nameTe: 'భూదేవి కాంప్లెక్స్',
    landmarkEn: 'Alipiri Foot of the Hills (Alipiri Bypass Bus Stop)',
    landmarkTe: 'అలిపిరి మెట్ల మార్గం ప్రారంభం వద్ద',
    counterHours: 'Opens early morning daily (subject to live quota)',
    quotaInfoEn: 'Recommended for private vehicle travelers & footpath pilgrims',
    quotaInfoTe: 'సొంత వాహనాలు మరియు నడకదారి భక్తులకు అత్యంత అనుకూలం',
    iconType: 'mountain',
    mapsUrl: 'https://www.google.com/maps/place/Sri+Bhudevi+pilgrimage+Ttd+Dharshan%E2%80%99s+free+tickets/@13.6455158,79.4054241,17z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4b38f66460f1:0x73e082c2b7f1b30!8m2!3d13.6473239!4d79.4095922!16s%2Fg%2F11j8lvd91q'
  }
];

export default function SsdTokensStandalonePage() {
  const router = useRouter();
  const lang = useLanguage();

  const [ssdStatus, setSsdStatus] = useState<'issuing' | 'paused' | 'closed-for-day' | 'suspended'>('closed-for-day');
  const [nextTokenTime, setNextTokenTime] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Updated: 10 Nov 2026, 6:17 PM');
  const [copied, setCopied] = useState(false);

  const fetchStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/v1/status?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: TirumalaStatus = await res.json();
        if (data.ssdTokenStatus) setSsdStatus(data.ssdTokenStatus);
        if (data.ssdNextTokenTime) setNextTokenTime(data.ssdNextTokenTime);
        if (data.ssdNotice) setNotice(data.ssdNotice);

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        setLastSyncTime(`Updated: ${dateStr}, ${timeStr}`);
      }
    } catch (err) {
      console.error('Failed to fetch SSD token status:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 20000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const isClosed = ssdStatus === 'closed-for-day' || ssdStatus === 'suspended';

  return (
    <div style={{
      maxWidth: '540px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAF9',
      color: '#0F172A',
      paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
    }}>

      {/* ── 1. SACRED GREEN HERO HEADER WITH PANORAMA ── */}
      <header style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #053320 0%, #0A4E33 55%, #0B5C3C 100%)',
        color: '#FFFFFF',
        padding: '16px 16px 28px 16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(10, 78, 51, 0.15)'
      }}>
        {/* Gopuram Sunrise Panorama Image on the Right with subtle fade */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '58%',
          pointerEvents: 'none',
          opacity: 0.95,
          zIndex: 1
        }}>
          <img
            src="/images/places/tirumala_sunrise_panorama.jpg"
            alt="Tirumala Sunrise Panorama"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,1) 75%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,1) 75%)'
            }}
          />
        </div>

        {/* Top Control Bar: Back, Refresh, Share */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <button 
            onClick={() => router.back()} 
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => fetchStatus(true)} 
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Refresh status"
            >
              <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
            </button>
            <button 
              onClick={handleShare} 
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Share"
            >
              {copied ? <Check size={15} color="#86EFAC" /> : <Share2 size={15} />}
            </button>
          </div>
        </div>

        {/* Hero Title & Status Lockup */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '13px',
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              color: '#86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Ticket size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{
                fontSize: '18.5px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                {lang === 'te' ? 'SSD & DD టోకెన్ స్థితి' : 'SSD & DD Token Status'}
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#D1FAE5',
                fontWeight: 500,
                margin: '2px 0 0 0',
                opacity: 0.95
              }}>
                {lang === 'te' ? 'తిరుమల సర్వదర్శనం టోకెన్లు' : 'Tirumala Sarva Darshan Tokens'}
              </p>
            </div>
          </div>

          {/* Closed / Live Status Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: isClosed ? '#FEE2E2' : '#DCFCE7',
            color: isClosed ? '#B91C1C' : '#15803D',
            fontSize: '11.5px',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            flexShrink: 0
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isClosed ? '#DC2626' : '#16A34A'
            }} />
            <span>
              {isClosed
                ? (lang === 'te' ? 'ముగిసింది' : 'Closed')
                : (lang === 'te' ? 'జారీ అవుతున్నాయి' : 'Issuing')}
            </span>
          </div>
        </div>
      </header>

      {/* Copy Toast */}
      {copied && (
        <div style={{
          position: 'fixed', top: '72px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '12px', fontWeight: 700,
          padding: '7px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center',
          gap: '6px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)', zIndex: 1000
        }}>
          <CheckCircle2 size={14} color="#4ADE80" /> {lang === 'te' ? 'లింక్ కాపీ చేయబడింది' : 'Link copied to clipboard'}
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER (WHITE ROUNDED SHELL) ── */}
      <main style={{
        marginTop: '-16px',
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        padding: '16px 14px 24px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)'
      }}>

        {/* 🕒 Timestamp Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: '#F1F5F9',
          color: '#475569',
          fontSize: '11px',
          fontWeight: 600,
          alignSelf: 'flex-start'
        }}>
          <Clock size={12} strokeWidth={2.4} color="#64748B" />
          <span>{lastSyncTime}</span>
        </div>

        {/* ── CARD 1: TODAY'S DATE & QUOTA COMPLETION STATUS ── */}
        <section style={{
          background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
          border: '1px solid #FEE2E2',
          borderRadius: '18px',
          padding: '12px 14px',
          boxShadow: '0 1px 4px rgba(220, 38, 38, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={16} strokeWidth={2.3} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                {lang === 'te' ? 'ఈ రోజు • 10 నవంబర్ 2026' : 'Today • 10 Nov 2026'}
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 9px',
              borderRadius: '9999px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '10.5px',
              fontWeight: 800,
              border: '1px solid #FECACA'
            }}>
              {lang === 'te' ? 'నేటి కోటా పూర్తయింది' : "Today's quota completed"}
            </div>
          </div>

          <p style={{
            fontSize: '11.5px',
            color: '#7F1D1D',
            fontWeight: 500,
            margin: '8px 0 0 0',
            lineHeight: 1.4
          }}>
            {notice || (lang === 'te'
              ? '10 నవంబర్ 2026 నాటి టోకెన్లు పూర్తిగా జారీ చేయబడ్డాయి.'
              : 'Tokens for 10 Nov 2026 have been fully issued.')}
          </p>
        </section>

        {/* ── 2-COLUMN GRID: SSD TOKENS & DD TOKENS ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px'
        }}>
          {/* LEFT: SSD TOKENS */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FBF6 100%)',
            border: '1px solid #D5ECD8',
            borderRadius: '18px',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 6px rgba(10, 78, 51, 0.04)'
          }}>
            {/* Top Icon & Titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L6 8v12h12V8l-6-6z" />
                  <path d="M10 14h4v6h-4z" />
                  <path d="M6 11h12" />
                  <path d="M12 2v6" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'te' ? 'SSD టోకెన్లు' : 'SSD Tokens'}
                </h3>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lang === 'te' ? 'స్లాటెడ్ సర్వదర్శనం' : 'Slotted Sarva Darshan'}
                </span>
              </div>
            </div>

            {/* Big Numbers Counter */}
            <div style={{ margin: '4px 0 6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>0</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>/ 10,000</span>
              </div>
            </div>

            {/* Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2.5px 8px',
              borderRadius: '9999px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '10px',
              fontWeight: 800,
              alignSelf: 'flex-start',
              marginBottom: '10px',
              border: '1px solid #FECACA'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Completed'}</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0 8px 0' }} />

            {/* Timelines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#DCFCE7',
                  color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px'
                }}>
                  <Play size={8} fill="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'ప్రారంభం' : 'Started at'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                    10 Nov, 5:00 PM
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#FEE2E2',
                  color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px'
                }}>
                  <Square size={7} fill="#DC2626" />
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'కోటా పూర్తయిన సమయం' : 'Quota completed at'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                    10 Nov, 6:12 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: DD TOKENS */}
          <div style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
            border: '1px solid #FEF3C7',
            borderRadius: '18px',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.04)'
          }}>
            {/* Top Icon & Titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L6 8v12h12V8l-6-6z" />
                  <path d="M10 14h4v6h-4z" />
                  <path d="M6 11h12" />
                  <path d="M12 2v6" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'te' ? 'DD టోకెన్లు' : 'DD Tokens'}
                </h3>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lang === 'te' ? 'దివ్యదర్శనం (మెట్ల మార్గం)' : 'Divya Darshan (Footpath)'}
                </span>
              </div>
            </div>

            {/* Big Numbers Counter */}
            <div style={{ margin: '4px 0 6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>0</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>/ 2,000</span>
              </div>
            </div>

            {/* Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2.5px 8px',
              borderRadius: '9999px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '10px',
              fontWeight: 800,
              alignSelf: 'flex-start',
              marginBottom: '10px',
              border: '1px solid #FECACA'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
              <span>{lang === 'te' ? 'పూర్తయింది' : 'Completed'}</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0 8px 0' }} />

            {/* Timelines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#DCFCE7',
                  color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px'
                }}>
                  <Play size={8} fill="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'ప్రారంభం' : 'Started at'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                    10 Nov, 5:00 PM
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#FEE2E2',
                  color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px'
                }}>
                  <Square size={7} fill="#DC2626" />
                </div>
                <div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'కోటా పూర్తయిన సమయం' : 'Quota completed at'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                    10 Nov, 6:10 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARD 3: NEXT EXPECTED RELEASE ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                {lang === 'te' ? 'తదుపరి విడుదల సమయం' : 'Next Expected Release'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {lang === 'te' ? '11 నవంబర్ 2026 (రేపు)' : '11 Nov 2026 (Tomorrow)'}
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(lang === 'te' ? 'నోటిఫికేషన్ అలర్ట్ సెట్ చేయబడింది!' : 'Notification alert set for next release!')}
            style={{
              background: '#064E3B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(6, 78, 59, 0.2)'
            }}
          >
            <Bell size={13} strokeWidth={2.5} />
            <span>{nextTokenTime || '5:30 PM'}</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </section>

        {/* ── CARD 4: ADVISORY / GREEN TIP CARD ── */}
        <section style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F8ED 100%)',
          border: '1px solid #BBF7D0',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          boxShadow: '0 1px 4px rgba(21, 128, 61, 0.04)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '1px'
          }}>
            <Lightbulb size={16} strokeWidth={2.3} />
          </div>
          <div>
            <h4 style={{
              fontSize: '12.5px',
              fontWeight: 800,
              color: '#14532D',
              margin: '0 0 2px 0'
            }}>
              {lang === 'te' ? 'నేటి ఎస్‌ఎస్‌డి & డిడి టోకెన్ కోటా పూర్తయింది.' : "Today's SSD & DD token quotas are completed."}
            </h4>
            <p style={{
              fontSize: '11px',
              color: '#166534',
              margin: 0,
              lineHeight: 1.4,
              fontWeight: 500
            }}>
              {lang === 'te'
                ? 'దయచేసి తదుపరి విడుదల కోసం వేచి ఉండండి. టోకెన్ సమయాలు టీటీడీ అప్‌డేట్‌లకు లోబడి ఉంటాయి.'
                : 'Please wait for the next release. Token timings are subject to TTD updates.'}
            </p>
          </div>
        </section>

        {/* ── CARD 5: TIRUPATI PHYSICAL TOKEN COUNTERS ── */}
        <section style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#059669" />
              <span>{lang === 'te' ? 'తిరుపతి ఎస్‌ఎస్‌డి టోకెన్ కౌంటర్లు' : 'Tirupati Token Counter Locations'}</span>
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>3 Centers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {COLLECTION_CENTRES.map((center) => {
              const icon = center.iconType === 'train' ? <Train size={16} color="#2563EB" /> : center.iconType === 'bus' ? <Bus size={16} color="#D97706" /> : <Mountain size={16} color="#059669" />;
              const iconBg = center.iconType === 'train' ? '#EFF6FF' : center.iconType === 'bus' ? '#FEF3C7' : '#D1FAE5';
              return (
                <div key={center.id} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '12px',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '9px', backgroundColor: iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {lang === 'te' ? center.nameTe : center.nameEn}
                        </h4>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                          {lang === 'te' ? center.landmarkTe : center.landmarkEn}
                        </p>
                      </div>
                    </div>

                    <a 
                      href={center.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A',
                        padding: '5px 8px', borderRadius: '7px', fontSize: '10.5px', fontWeight: 700,
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0
                      }}
                    >
                      <Compass size={12} /> Maps
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CARD 6: MANDATORY RULES ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '14px'
        }}>
          <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16A34A" />
            <span>{lang === 'te' ? 'టోకెన్ పొందడానికి తప్పనిసరి నియమాలు' : 'Mandatory Rules & Requirements'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>Original Aadhaar Card Mandatory</strong>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '1px 0 0 0' }}>Every individual pilgrim (including children 5+ years) MUST carry their physical original Aadhaar card.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>In-Person Physical Presence Required</strong>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '1px 0 0 0' }}>Live biometric facial photo and fingerprint scan is taken at the counter. One person cannot collect for others.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>30-Day Frequency Limit Rule</strong>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '1px 0 0 0' }}>A pilgrim can obtain an SSD biometric token only once every 30 days per Aadhaar number.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARD 7: STEP-BY-STEP DARSHAN FLOW ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '14px'
        }}>
          <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={15} color="#059669" />
            <span>{lang === 'te' ? 'ఎస్‌ఎస్‌డి టోకెన్ దర్శన విధానం' : 'SSD Token Journey Steps'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { step: 1, title: "Reach Token Counter in Tirupati", desc: "Visit Vishnu Nivasam, Srinivasam, or Bhudevi complex early morning." },
              { step: 2, title: "Aadhaar Biometric Scan & Token Slip", desc: "Scan Aadhaar & take live photo. Receive printed slip with assigned time slot." },
              { step: 3, title: "Ascend to Tirumala", desc: "Travel to Tirumala via ghat road or footpath 2 hours ahead of your allotted time." },
              { step: 4, title: "Report at Slotted Queue Gate", desc: "Arrive at designated SSD entry gate at the exact slot printed on your token." },
              { step: 5, title: "Biometric Verification & Darshan", desc: "Fingerprint re-scan matches counter data, leading smoothly to Srivari Darshan & Laddu." }
            ].map((st) => (
              <div key={st.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E0F2FE',
                  color: '#0369A1', fontSize: '11px', fontWeight: 800, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {st.step}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{st.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. QUICK NAVIGATION ACTION LINKS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <Link href="/darshan/sarva-darshan" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '10px', textAlign: 'center', color: '#0F172A', fontSize: '11.5px', fontWeight: 700
            }}>
              Sarva Darshan Guide →
            </div>
          </Link>

          <Link href="/darshan/special-entry" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '10px', textAlign: 'center', color: '#059669', fontSize: '11.5px', fontWeight: 700
            }}>
              ₹300 Special Entry →
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Ticket, Clock, ShieldAlert, CheckCircle2, 
  MapPin, Mountain, Footprints, RefreshCw, Share2, Check, 
  ExternalLink, Sparkles, ChevronRight, Navigation, 
  Luggage, ShieldCheck, Play, Lightbulb, AlertTriangle
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';

interface DdCollectionCentre {
  id: string;
  nameEn: string;
  nameTe: string;
  pathwayEn: string;
  pathwayTe: string;
  stepsCount: string;
  distance: string;
  duration: string;
  counterHours: string;
  descriptionEn: string;
  descriptionTe: string;
  mapsUrl: string;
}

const DD_COUNTERS: DdCollectionCentre[] = [
  {
    id: 'srivari-mettu',
    nameEn: 'Srivari Mettu Footpath Counter',
    nameTe: 'శ్రీవారి మెట్టు నడకదారి కౌంటర్',
    pathwayEn: 'Srivari Mettu Trail (via Srinivasa Mangapuram)',
    pathwayTe: 'శ్రీనివాస మంగాపురం మీదుగా శ్రీవారి మెట్టు మార్గం',
    stepsCount: '2,388 Steps',
    distance: '2.1 km',
    duration: '1.5 – 2.5 Hours',
    counterHours: 'Opens 6:00 AM daily (or evening release)',
    descriptionEn: 'Shortest and steepest historic trail. Tokens issued at the 1,200th step checkpoint. Highest quota allocation.',
    descriptionTe: 'అతి తక్కువ దూరం (2.1 కి.మీ). 1,200వ మెట్టు వద్ద బయోమెట్రిక్ కౌంటర్ ఉంటుంది.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Srivari+Mettu+Tirupati'
  },
  {
    id: 'alipiri-mettu',
    nameEn: 'Alipiri Mettu (Galigopuram Counter)',
    nameTe: 'అలిపిరి మెట్టు (గాలిగోపురం కౌంటర్)',
    pathwayEn: 'Alipiri Mettu Footpath (Tirupati Base to Tirumala)',
    pathwayTe: 'అలిపిరి మెట్ల మార్గం (తిరుపతి నుండి తిరుమల)',
    stepsCount: '3,550 Steps',
    distance: '9.0 km',
    duration: '3.5 – 5.0 Hours',
    counterHours: 'Open 3:00 AM – 10:00 PM for trekking',
    descriptionEn: 'Historic covered pathway with night lighting, continuous drinking water, and medical support. Biometric token verification at Galigopuram (Step ~2,083).',
    descriptionTe: 'చారిత్రాత్మక మార్గం. 24 గంటల భద్రత, ఉచిత తాగునీరు. గాలిగోపురం వద్ద తనిఖీ మరియు టోకెన్ ధృవీకరణ.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Alipiri+Mettu+Galigopuram+Tirupati'
  }
];

export default function DdTokensStandalonePage() {
  const router = useRouter();
  const lang = useLanguage();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [copied, setCopied] = useState(false);

  // Status state
  const [ssdNotice, setSsdNotice] = useState<string>('');
  const [rawGuide, setRawGuide] = useState<string>('');
  const [ddStatus, setDdStatus] = useState<'issuing' | 'completed' | 'paused'>('completed');
  const [ddStartTimestamp, setDdStartTimestamp] = useState<string>('5:30 PM (29 Oct)');
  const [ddCompleteTimestamp, setDdCompleteTimestamp] = useState<string>('5:25 AM (30 Oct)');
  const [nextReleaseTime, setNextReleaseTime] = useState<string>('5:30 PM Daily');

  const fetchStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/v1/status?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data: TirumalaStatus = await res.json();
        if (data.ssdNotice) setSsdNotice(data.ssdNotice);
        if (data.ssdNextTokenTime) setNextReleaseTime(data.ssdNextTokenTime);

        const guideText = data.ssdTimingsGuide || '';
        setRawGuide(guideText);

        // Parse DD timestamps
        const matchDdStart =
          guideText.match(/(?:DD|Divya Darshan).*?(?:Started|Issue Started)[^@\d]*@?\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i) ||
          guideText.match(/(?:Started|Issue Started)[^@\d]*@?\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);

        const matchDdComplete = guideText.match(
          /(?:DD|Divya Darshan|Srivari Mettu).*?(?:Completed|Finished|Closed)[^@\d]*@?\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)(?:\s*\([^)]+\))?)/i
        );

        if (matchDdStart) {
          const matchStartDay = guideText.match(/(?:for\s+)?(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)/i);
          setDdStartTimestamp(matchStartDay ? `${matchDdStart[1]} (${matchStartDay[1].replace(/(\d+)(?:st|nd|rd|th)/, '$1')})` : matchDdStart[1]);
        }

        if (matchDdComplete) {
          setDdCompleteTimestamp(matchDdComplete[1]);
          setDdStatus('completed');
        } else if (matchDdStart && !matchDdComplete) {
          setDdStatus('issuing');
        }

        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to fetch DD token status:', err);
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

  const isCompleted = ddStatus === 'completed';
  const isIssuing = ddStatus === 'issuing';

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 16px))',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
    }}>
      {/* ── 1. STICKY TOP APP BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        zIndex: 100
      }}>
        <button 
          onClick={() => router.back()} 
          style={{
            background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
            width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', 
            backgroundColor: isIssuing ? '#10B981' : '#DC2626',
            flexShrink: 0, 
            boxShadow: isIssuing ? '0 0 6px #10B981' : '0 0 6px #DC2626'
          }} />
          <h1 style={{
            fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {lang === 'te' ? 'దివ్య దర్శనం (DD) టోకెన్ సమాచారం' : 'DD Tokens (Divya Darshan) • Live Status'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => fetchStatus(true)} 
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
              width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Refresh status"
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          </button>
          <button 
            onClick={handleShare} 
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
              width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Share"
          >
            {copied ? <Check size={16} color="#16A34A" /> : <Share2 size={16} />}
          </button>
        </div>
      </header>

      {/* Copy Toast */}
      {copied && (
        <div style={{
          position: 'fixed', top: '68px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700,
          padding: '8px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center',
          gap: '6px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', zIndex: 1000
        }}>
          <CheckCircle2 size={15} /> Link copied to clipboard
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── 1. HERO LIVE STATUS CARD ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.05)'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FEF3C7',
                color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Mountain size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  {lang === 'te' ? 'దివ్య దర్శనం టోకెన్లు (నడకదారి)' : 'Divya Darshan (DD) Tokens'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
                    2,000 (2K) / day
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'మెట్ల మార్గం కోటా' : 'Footpath Trek Quota'}
                  </span>
                </div>
              </div>
            </div>

            <span style={{
              fontSize: '11.5px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
              backgroundColor: isIssuing ? '#DCFCE7' : '#FEE2E2',
              color: isIssuing ? '#166534' : '#991B1B',
              border: `1px solid ${isIssuing ? '#86EFAC' : '#FECACA'}`,
              display: 'inline-flex', alignItems: 'center', gap: '5px'
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: isIssuing ? '#16A34A' : '#DC2626'
              }} />
              {isIssuing ? (lang === 'te' ? 'జారీ అవుతున్నాయి' : 'Issuing Now') : (lang === 'te' ? 'పూర్తయింది' : 'Completed')}
            </span>
          </div>

          {/* Timeline Box */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16A34A', fontSize: '11px', fontWeight: 700 }}>
                <Play size={10} fill="#16A34A" />
                <span>{lang === 'te' ? 'జారీ ప్రారంభం' : 'Issuing Started'}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {ddStartTimestamp}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isCompleted ? '#DC2626' : '#16A34A', fontSize: '11px', fontWeight: 700 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isCompleted ? '#DC2626' : '#16A34A' }} />
                <span>{lang === 'te' ? 'కోటా పూర్తయిన సమయం' : 'Quota Completed'}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {ddCompleteTimestamp}
              </div>
            </div>
          </div>

          {/* Next Release Information Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#1D4ED8" />
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'మరుసటి రోజు టోకెన్ జారీ సమయం' : 'Next Expected Token Release'}
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#1E3A8A' }}>
                  {nextReleaseTime || '5:30 PM (Daily)'}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 700 }}>
              {lastSyncTime}
            </span>
          </div>

          {/* Important Advisory if any */}
          {ssdNotice && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              padding: '10px 12px',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <ShieldAlert size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: 1.4, fontWeight: 500 }}>
                {ssdNotice}
              </div>
            </div>
          )}
        </section>

        {/* ── 2. SAARTHI ACTIONABLE GUIDANCE CARD ── */}
        <section style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #DCFCE7',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DCFCE7',
            color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
          }}>
            <Lightbulb size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#14532D', margin: '0 0 3px 0' }}>
              {isCompleted
                ? (lang === 'te' ? 'నేటి డివి టోకెన్లు పూర్తయినా దర్శనం ఎలా?' : 'DD Quota Completed: You can still trek!')
                : (lang === 'te' ? 'దివ్య దర్శనం పొందడానికి సలహా' : 'Trekking with Divya Darshan Token')}
            </h3>
            <p style={{ fontSize: '12px', color: '#166534', margin: 0, lineHeight: 1.45 }}>
              {isCompleted
                ? (lang === 'te'
                    ? 'నేటి 2,000 టోకెన్లు ముగిసినప్పటికీ, భక్తులు అలిపిరి లేదా శ్రీవారి మెట్టు ద్వారా నడిచి తిరుమల చేరుకుని ఉచిత సర్వదర్శనం (Sarva Darshan) లైన్లలో నేరుగా ప్రవేశించవచ్చు.'
                    : "Even after the 2K footpath quota completes, pilgrims can still trek up Alipiri or Srivari Mettu freely and join the general Sarva Darshan (Free Walk-in) queue directly at Tirumala with zero ticket required.")
                : (lang === 'te'
                    ? 'టోకెన్ జారీ వేళల్లో శ్రీవారి మెట్టు కౌంటర్ వద్ద ఒరిజినల్ ఆధార్ కార్డుతో బయోమెట్రిక్ టోకెన్ పొందవచ్చు.'
                    : 'Collect your token at the Srivari Mettu base / 1,200th step checkpoint using your original physical Aadhaar card.')}
            </p>
          </div>
        </section>

        {/* ── 3. FOOTPATH TOKEN COLLECTION COUNTERS ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#D97706" />
              <span>{lang === 'te' ? 'దివ్య దర్శనం కౌంటర్లు & నడకమార్గాలు' : 'DD Footpath Counters & Trail Checkpoints'}</span>
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>2 Pathways</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DD_COUNTERS.map((counter) => (
              <div key={counter.id} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      backgroundColor: counter.id === 'srivari-mettu' ? '#FEF3C7' : '#EFF6FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Footprints size={20} color={counter.id === 'srivari-mettu' ? '#B45309' : '#1D4ED8'} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {lang === 'te' ? counter.nameTe : counter.nameEn}
                      </h4>
                      <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                        {lang === 'te' ? counter.pathwayTe : counter.pathwayEn}
                      </p>

                      {/* Badges Row */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, color: '#0F172A', backgroundColor: '#F1F5F9',
                          padding: '2px 7px', borderRadius: '6px'
                        }}>
                          ⛰️ {counter.stepsCount}
                        </span>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, color: '#0F172A', backgroundColor: '#F1F5F9',
                          padding: '2px 7px', borderRadius: '6px'
                        }}>
                          📏 {counter.distance}
                        </span>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, color: '#166534', backgroundColor: '#DCFCE7',
                          padding: '2px 7px', borderRadius: '6px'
                        }}>
                          ⏱️ ~{counter.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={counter.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A',
                      padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0
                    }}
                  >
                    <Navigation size={13} /> Maps
                  </a>
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  marginTop: '10px',
                  paddingTop: '8px',
                  fontSize: '11.5px',
                  color: '#475569',
                  lineHeight: 1.4
                }}>
                  {lang === 'te' ? counter.descriptionTe : counter.descriptionEn}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MANDATORY RULES & CHECKLIST ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16A34A" />
            <span>{lang === 'te' ? 'దివ్య దర్శనం నియమాలు' : 'Mandatory Rules for Divya Darshan'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Original Physical Aadhaar Card Mandatory</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Every individual pilgrim (including children 5+ years) must produce physical Aadhaar card for biometric thumb & photo capture.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Physical Climb Verification</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Tokens are verified at intermediate checkpoints along the steps. Pilgrims must trek the hill on foot to validate token entry.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Free Luggage Transit Service</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>TTD provides free luggage transport. Deposit your heavy bags at Alipiri or Srivari Mettu base counters and collect them safely at Tirumala hilltop.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Traditional Dress Code at VQC</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Comfortable footwear and attire allowed during the climb. However, traditional dress (Dhoti/Kurta for men, Saree/Chudidar with dupatta for women) is mandatory upon queue entry at Tirumala.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>30-Day Biometric Limitation</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>A pilgrim can obtain a Divya Darshan / SSD token only once every 30 days per Aadhaar number.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. STEP-BY-STEP DIVYA DARSHAN JOURNEY ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={16} color="#059669" />
            <span>{lang === 'te' ? 'దివ్య దర్శనం ప్రయాణ విధానం' : 'Divya Darshan Trek & Entry Roadmap'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: 1, title: 'Deposit Luggage & Begin Climb', desc: 'Hand over baggage at Alipiri or Srivari Mettu base luggage counter for free transit to Tirumala.', time: '20 Mins' },
              { step: 2, title: 'Biometric Scan at Intermediate Checkpoint', desc: 'Scan Aadhaar, take facial photo, and collect printed token slip along the pathway.', time: '10 Mins' },
              { step: 3, title: 'Reach Tirumala Hilltop & Refresh', desc: 'Arrive at Tirumala, collect deposited luggage at PAC centers, and refresh with hot water bath.', time: '1 Hour' },
              { step: 4, title: 'Wear Traditional Dress & Report to VQC', desc: 'Change into approved traditional attire and report at the designated Divya Darshan queue line.', time: '15 Mins' },
              { step: 5, title: 'Fast-Track Darshan & Free Prasadam', desc: 'Pass through holding compartments to sanctum sanctorum for Srivari Darshan and receive free blessed Laddu.', time: '3 – 5 Hours' }
            ].map((st) => (
              <div key={st.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#D1FAE5',
                  color: '#059669', fontSize: '12px', fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {st.step}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{st.title}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. QUICK ALTERNATIVE ACTION LINKS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <Link href="/ssd-tokens" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '12px', textAlign: 'center', color: '#0F172A', fontSize: '12px', fontWeight: 600
            }}>
              SSD Tokens (10K/day) →
            </div>
          </Link>

          <Link href="/footpaths" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '12px', textAlign: 'center', color: '#059669', fontSize: '12px', fontWeight: 600
            }}>
              Footpath Timings & Guide →
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}


import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Ticket, Flag, CheckCircle2, ArrowRight, ArrowUpRight, Circle, Compass, ChevronRight, Train, Bus, Mountain, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    ssdStatus: 'SSD Token Status',
    issuingNow: 'Issuing Now',
    paused: 'Paused',
    closed: 'Closed for Day',
    nextRelease: 'Next Release / Issuing Time',
    tokensBeingIssued: 'Tokens Being Issued Now',
    activelyIssuing: 'Tokens actively issuing — collect at counters listed below',
    issuingPaused: 'Issuing temporarily paused — next batch resume time above',
    quotaCompleted: 'Daily quota completed — next token release time indicated above',
    collectionCentres: 'Collection Centres',
    importantAdvisory: 'IMPORTANT ADVISORY'
  },
  te: {
    ssdStatus: 'SSD టోకెన్ స్థితి',
    issuingNow: 'ఇప్పుడు జారీ అవుతోంది',
    paused: 'తాత్కాలికంగా నిలిపివేయబడింది',
    closed: 'ఈ రోజుకు మూసివేయబడింది',
    nextRelease: 'తదుపరి విడుదల / జారీ సమయం',
    tokensBeingIssued: 'టోకెన్లు ఇప్పుడు జారీ అవుతున్నాయి',
    activelyIssuing: 'టోకెన్లు జారీ అవుతున్నాయి — కింద ఉన్న కౌంటర్ల వద్ద సేకరించండి',
    issuingPaused: 'జారీ తాత్కాలికంగా నిలిపివేయబడింది — తదుపరి బ్యాచ్ పునఃప్రారంభ సమయం పైన ఉంది',
    quotaCompleted: 'రోజువారీ కోటా పూర్తయింది — తదుపరి టోకెన్ విడుదల సమయం పైన సూచించబడింది',
    collectionCentres: 'సేకరణ కేంద్రాలు',
    importantAdvisory: 'ముఖ్యమైన సూచన'
  },
  hi: {
    ssdStatus: 'एसएसडी टोकन स्थिति',
    issuingNow: 'अभी जारी हो रहे हैं',
    paused: 'स्थगित',
    closed: 'आज के लिए बंद',
    nextRelease: 'अगला समय',
    tokensBeingIssued: 'टोकन अभी जारी हो रहे हैं',
    activelyIssuing: 'टोकन सक्रिय रूप से जारी — नीचे दिए गए काउंटरों पर प्राप्त करें',
    issuingPaused: 'जारी करना अस्थायी रूप से रुका हुआ है — अगला समय ऊपर दिया गया है',
    quotaCompleted: 'दैनिक कोटा पूरा — अगला टोकन जारी होने का समय ऊपर दर्शाया गया है',
    collectionCentres: 'संग्रह केंद्र',
    importantAdvisory: 'महत्वपूर्ण सूचना'
  },
  ta: {
    ssdStatus: 'SSD டோக்கன் நிலை',
    issuingNow: 'இப்போது வழங்கப்படுகிறது',
    paused: 'நிறுத்தப்பட்டுள்ளது',
    closed: 'இன்றைக்கு மூடப்பட்டது',
    nextRelease: 'அடுத்த நேரம்',
    tokensBeingIssued: 'டோக்கன்கள் இப்போது வழங்கப்படுகின்றன',
    activelyIssuing: 'டோக்கன்கள் வழங்கப்படுகின்றன — கீழே உள்ள மையங்களில் பெறவும்',
    issuingPaused: 'டோக்கன் வழங்குவது தற்காலிகமாக நிறுத்தப்பட்டுள்ளது',
    quotaCompleted: 'இன்றைய ஒதுக்கீடு முடிந்தது — அடுத்த டோக்கன் வழங்கும் நேரம் மேலே குறிப்பிடப்பட்டுள்ளது',
    collectionCentres: 'டோக்கன் பெறுமிடம்',
    importantAdvisory: 'முக்கிய அறிவிப்பு'
  }
};

function cleanTime(timeStr?: string): string {
  if (!timeStr) return '';
  return timeStr
    .replace(/[\u{1F300}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*(AM|PM|am|pm)/i, ' $1')
    .trim();
}

function cleanTimingsGuide(raw: string): string[] {
  if (!raw) return [];
  const clean = raw.replace(/[\u{1F300}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '');

  if (clean.includes('*') || clean.includes('\n')) {
    const rawParts = clean
      .split(/[*•\n]+/)
      .map(s => s.trim().replace(/^[-–—:]\s*/, '').replace(/\s+/g, ' '))
      .filter(s => s.length > 2);

    const grouped: string[] = [];
    for (let i = 0; i < rawParts.length; i++) {
      const part = rawParts[i];
      if (i > 0 && /^Quota/i.test(part) && grouped.length > 0) {
        grouped[grouped.length - 1] += ` : ${part}`;
      } else {
        grouped.push(part);
      }
    }
    return grouped;
  }

  return [clean.replace(/\s+/g, ' ').trim()];
}

export function QuickChecklist(props: any) {
  const { liveStatus } = props;
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  if (!liveStatus) return null;

  const formattedNextTime = cleanTime(liveStatus.ssdNextTokenTime);
  const cleanNotice = liveStatus.ssdNotice
    ? liveStatus.ssdNotice.replace(/[\u{1F300}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').replace(/\*/g, '').trim()
    : null;

  const isSuspended = Boolean(
    (cleanNotice && /suspend|cancel|brahmotsavam/i.test(cleanNotice)) ||
    (formattedNextTime && /suspend|cancel/i.test(formattedNextTime)) ||
    liveStatus.ssdTokenStatus === 'cancelled'
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SSD TOKEN CARD (ELEVATED & DE-CLUTTERED HIGHLIGHT)
          ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '0 14px 2px 14px' }}>
        <div
          onClick={() => router.push('/darshan/ssd-token')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push('/darshan/ssd-token'); }}
          style={{
            display: 'block',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            background: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '16px',
            padding: '14px 14px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif)',
            transition: 'transform 0.16s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.16s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          className="active:scale-[0.985] transition-transform duration-150"
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={13} color="#0F5132" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{t.ssdStatus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '999px',
                background: isSuspended ? 'rgba(239, 68, 68, 0.08)' : liveStatus.ssdTokenStatus === 'issuing' ? '#DCFCE7' : liveStatus.ssdTokenStatus === 'paused' ? '#FEF3C7' : '#F1F5F9',
                color: isSuspended ? '#991B1B' : liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#475569',
                border: `1px solid ${isSuspended ? 'rgba(239, 68, 68, 0.15)' : liveStatus.ssdTokenStatus === 'issuing' ? '#86EFAC' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#E2E8F0'}`
              }}>
                {isSuspended
                  ? (lang === 'te' ? 'తాత్కాలిక నిలిపివేత' : 'Suspended')
                  : liveStatus.ssdTokenStatus === 'issuing'
                  ? t.issuingNow
                  : liveStatus.ssdTokenStatus === 'paused'
                  ? t.paused
                  : t.closed}
              </span>
              <ChevronRight size={14} color="#94A3B8" />
            </div>
          </div>

          {/* UNIFIED ADVISORY BANNER (CALM & DEDUPLICATED) */}
          {cleanNotice && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              padding: '10px 12px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldAlert size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#991B1B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {t.importantAdvisory}
                  </span>
                  {(liveStatus.ssdAdvisoryTag?.trim() || isSuspended) && (
                    <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#991B1B', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1px 6px', borderRadius: '4px' }}>
                      {liveStatus.ssdAdvisoryTag?.trim() || (/brahmotsavam/i.test(cleanNotice) ? 'Brahmotsavam' : /vaikunta/i.test(cleanNotice) ? 'Vaikunta Ekadasi' : /rathasapthami/i.test(cleanNotice) ? 'Rathasapthami' : /rush/i.test(cleanNotice) ? 'High Rush' : /weather|rain/i.test(cleanNotice) ? 'Weather Alert' : 'Festival Alert')}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#7F1D1D', lineHeight: 1.45, display: 'block', marginTop: '3px' }}>
                  {cleanNotice}
                </span>
                {/* Visual tip (Deduplicated: shown only if distinct guidance is provided, or a concise direct walk-in note) */}
                {isSuspended ? (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #FCA5A5', fontSize: '11px', color: '#991B1B', fontWeight: 500, lineHeight: 1.35, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>💡</span>
                    <span>{lang === 'te' ? 'తిరుమలలో ఉచిత దర్శనం (టోకెన్ లేకుండా నేరుగా వైకుంఠం క్యూ)' : 'Direct walk-in Sarva Darshan open at Tirumala (No tokens needed)'}</span>
                  </div>
                ) : liveStatus.ssdTimingsGuide?.trim() ? (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #FCA5A5', fontSize: '11px', color: '#991B1B', fontWeight: 500, lineHeight: 1.35 }}>
                    💡 {liveStatus.ssdTimingsGuide.trim()}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* NEXT RELEASE / DARSHAN MODE ROW */}
          <div style={{
            background: liveStatus.ssdTokenStatus === 'issuing' ? '#F0FDF4' : '#F8FAFC',
            border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#BBF7D0' : '#E2E8F0'}`,
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: isSuspended ? '10px' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : '#64748B'} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block' }}>
                  {isSuspended ? (lang === 'te' ? 'దర్శన విధానం' : 'Darshan Entry Mode') : t.nextRelease}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : '#1E293B', marginTop: '1px', display: 'block' }}>
                  {isSuspended
                    ? (formattedNextTime && !/suspend|cancel/i.test(formattedNextTime) ? formattedNextTime : (lang === 'te' ? 'టోకెన్ లేకుండా నేరుగా వైకుంఠం క్యూ' : 'Direct Walk-in Sarva Darshan'))
                    : (formattedNextTime ? formattedNextTime : (liveStatus.ssdTokenStatus === 'issuing' ? t.tokensBeingIssued : '4:00 AM'))}
                </span>
              </div>
            </div>
            {(liveStatus.ssdModeBadge?.trim() || isSuspended) && (
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                {liveStatus.ssdModeBadge?.trim() || 'Open 24/7'}
              </span>
            )}
          </div>

          {/* Status helper text (only shown when NOT suspended to avoid contradictory messaging) */}
          {!isSuspended && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.35 }}>
                {liveStatus.ssdTokenStatus === 'issuing'
                  ? t.activelyIssuing
                  : liveStatus.ssdTokenStatus === 'paused'
                  ? t.issuingPaused
                  : t.quotaCompleted}
              </span>
            </div>
          )}

          {/* COLLECTION CENTRES */}
          {isSuspended ? (
            /* Compact 3-Column Tappable Collection Centre Cards when Closed/Suspended */
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    {t.collectionCentres}
                  </span>
                  <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: '9.5px', fontWeight: 600, padding: '1px 7px', borderRadius: '999px', border: '1px solid #E2E8F0' }}>
                    {lang === 'te' ? 'మూసివేయబడ్డాయి' : 'Closed'}
                  </span>
                </div>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F5132' }}>
                  {lang === 'te' ? 'మ్యాప్ డైరెక్షన్స్' : 'Tap for directions'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                {[
                  { 
                    name: lang === 'te' ? 'విష్ణు నివాసం' : 'Vishnu Nivasam', 
                    sub: lang === 'te' ? 'రైల్వే స్టేషన్' : 'Opp. Railway', 
                    icon: <Train size={14} color="#2563EB" />,
                    iconBg: '#EFF6FF',
                    q: 'Vishnu Nivasam Tirupati' 
                  },
                  { 
                    name: lang === 'te' ? 'శ్రీనివాసం' : 'Srinivasam', 
                    sub: lang === 'te' ? 'బస్ స్టాండ్' : 'Bus Stand', 
                    icon: <Bus size={14} color="#16A34A" />,
                    iconBg: '#F0FDF4',
                    q: 'Srinivasam Complex Tirupati' 
                  },
                  { 
                    name: lang === 'te' ? 'భూదేవి' : 'Bhudevi', 
                    sub: lang === 'te' ? 'అలిపిరి రోడ్' : 'Alipiri Road', 
                    icon: <Mountain size={14} color="#D97706" />,
                    iconBg: '#FFFBEB',
                    q: 'Bhudevi Complex Tirupati' 
                  },
                ].map(c => (
                  <button
                    key={c.q}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.q)}`, '_blank', 'noopener,noreferrer');
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '10px 4px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease, border-color 0.15s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                      {c.icon}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>{c.name}</span>
                    <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>{c.sub}</span>
                    <span style={{ marginTop: '6px', fontSize: '9px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '2px 6px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      Navigate ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Collection Centre Tiles when open/issuing */
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  {t.collectionCentres}
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F5132' }}>
                  {lang === 'te' ? 'మ్యాప్ డైరెక్షన్స్' : 'Tap for directions'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
                {/* Vishnu Nivasam */}
                <a
                  href="https://www.google.com/maps/place/Vishnu+Nivasam/@13.6281932,79.4205053,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                >
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '8px 3px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Train size={13} />
                    </div>
                    <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'విష్ణు నివాసం' : 'Vishnu Nivasam'}
                    </span>
                    <span className="notranslate" style={{ fontSize: '9px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'రైల్వే స్టేషన్ ఎదురుగా' : 'Opp. Railway'}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1px 5px', borderRadius: '4px', marginTop: '2px' }}>
                      Map ↗
                    </span>
                  </div>
                </a>

                {/* Srinivasam */}
                <a
                  href="https://www.google.com/maps/place/Srinivasam/@13.6311961,79.4266529,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                >
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '8px 3px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bus size={13} />
                    </div>
                    <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'శ్రీనివాసం' : 'Srinivasam'}
                    </span>
                    <span className="notranslate" style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'బస్ స్టాండ్ ఎదురుగా' : 'Opp. Bus Stand'}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1px 5px', borderRadius: '4px', marginTop: '2px' }}>
                      Map ↗
                    </span>
                  </div>
                </a>

                {/* Bhudevi */}
                <a
                  href="https://www.google.com/maps/place/Bhudevi+complex+Padayatra+tickets+counter/@13.6466715,79.4085658,18.14z"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                >
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '8px 3px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mountain size={13} />
                    </div>
                    <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'భూదేవి కాంప్లెక్స్' : 'Bhudevi Complex'}
                    </span>
                    <span className="notranslate" style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                      {lang === 'te' ? 'అలిపిరి వద్ద' : 'Near Alipiri'}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1px 5px', borderRadius: '4px', marginTop: '2px' }}>
                      Map ↗
                    </span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Daily timing guide / Custom Admin Info (Deduplicated) */}
          {liveStatus.ssdTimingsGuide && (() => {
            const rawPoints = cleanTimingsGuide(liveStatus.ssdTimingsGuide);
            // Deduplicate: if suspended, exclude points that repeat the suspension notice
            const points = isSuspended
              ? rawPoints.filter(pt => !/suspend|cancel|brahmotsavam/i.test(pt))
              : rawPoints;

            if (!points.length) return null;

            return (
              <div style={{
                borderTop: '1px solid #F1F5F9',
                paddingTop: '10px',
                marginTop: '8px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                background: '#F8FAFC',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0'
              }}>
                <Clock size={13} color="#64748B" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                  {points.map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      {points.length > 1 && (
                        <span style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#64748B',
                          marginTop: '5px',
                          flexShrink: 0
                        }} />
                      )}
                      <span style={{
                        fontSize: '11px',
                        color: '#475569',
                        lineHeight: 1.4,
                        fontWeight: 500
                      }}>
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}


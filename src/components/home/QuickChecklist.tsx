import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Ticket, Flag, CheckCircle2, ArrowRight, Circle, Compass, ChevronRight, Train, Bus, Mountain, ShieldAlert } from 'lucide-react';
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

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SSD TOKEN CARD (SOFT ELEVATION, HARMONIOUS TOKENS)
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
            borderRadius: '18px',
            padding: '14px 14px',
            boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
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
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{t.ssdStatus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '16px',
                background: liveStatus.ssdTokenStatus === 'issuing' ? '#DCFCE7' : liveStatus.ssdTokenStatus === 'paused' ? '#FEF3C7' : '#FEE2E2',
                color: liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#DC2626',
                border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#86EFAC' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`
              }}>
                {liveStatus.ssdTokenStatus === 'issuing' ? t.issuingNow : liveStatus.ssdTokenStatus === 'paused' ? t.paused : t.closed}
              </span>
              <ChevronRight size={14} color="#94A3B8" />
            </div>
          </div>

          {/* DYNAMIC ADVISORY BANNER IF NOTICE EXISTS */}
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
              <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#991B1B', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
                  {t.importantAdvisory}
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#7F1D1D', lineHeight: 1.4, display: 'block', marginTop: '1px' }}>
                  {cleanNotice}
                </span>
              </div>
            </div>
          )}

          {/* NEXT RELEASE TIME BANNER */}
          <div style={{
            background: liveStatus.ssdTokenStatus === 'issuing' ? '#F0FDF4' : liveStatus.ssdTokenStatus === 'paused' ? '#FFFBEB' : '#FEF2F2',
            border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#BBF7D0' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`,
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block' }}>
                  {t.nextRelease}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B', marginTop: '1px', display: 'block' }}>
                  {formattedNextTime ? formattedNextTime : (liveStatus.ssdTokenStatus === 'issuing' ? t.tokensBeingIssued : '4:00 AM')}
                </span>
              </div>
            </div>
          </div>

          {/* Status helper text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.35 }}>
              {liveStatus.ssdTokenStatus === 'issuing'
                ? t.activelyIssuing
                : liveStatus.ssdTokenStatus === 'paused'
                ? t.issuingPaused
                : t.quotaCompleted}
            </span>
          </div>

          {/* VISUAL TILES FOR COLLECTION CENTRES (STRICTLY NO EMOJIS, LUCIDE ICONS) */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '4px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B', letterSpacing: '0.03em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              {t.collectionCentres}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
              {/* Vishnu Nivasam (Train/Station) */}
              <a
                href="https://www.google.com/maps/place/Vishnu+Nivasam/@13.6281932,79.4205053,17z/data=!3m1!5s0x3a4d4b0898df978f:0x10422b2c2d88f4e3!4m20!1m10!3m9!1s0x3a4d4bbbe2ad2eff:0x6b655eee58504269!2sVishnu+Nivasam!5m2!4m1!1i2!8m2!3d13.6292776!4d79.4215889!16s%2Fg%2F11g1q7vspv!3m8!1s0x3a4d4bbbe2ad2eff:0x6b655eee58504269!5m2!4m1!1i2!8m2!3d13.6292776!4d79.4215889!16s%2Fg%2F11g1q7vspv"
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
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Train size={13} />
                  </div>
                  <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'విష్ణు నివాసం' : lang === 'hi' ? 'विष्णु निवासम' : lang === 'ta' ? 'விஷ்ணு நிவாஸம்' : 'Vishnu Nivasam'}
                  </span>
                  <span className="notranslate" style={{ fontSize: '9px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'రైల్వే స్టేషన్ ఎదురుగా' : lang === 'hi' ? 'रेलवे स्टेशन के सामने' : lang === 'ta' ? 'ரயில் நிலையம் எதிரில்' : 'Opp. Railway'}
                  </span>
                </div>
              </a>

              {/* Srinivasam (Bus Stand) */}
              <a
                href="https://www.google.com/maps/place/Srinivasam/@13.6311961,79.4266529,17z/data=!3m1!5s0x3a4d4b0898df978f:0x10422b2c2d88f4e3!4m20!1m10!3m9!1s0x3a4d4bbbe2ad2eff:0x6b655eee58504269!2sVishnu+Nivasam!5m2!4m1!1i2!8m2!3d13.6292776!4d79.4215889!16s%2Fg%2F11g1q7vspv!3m8!1s0x3a4d4b1372b4101d:0x5da265ff8e42d9fa!5m2!4m1!1i2!8m2!3d13.6315627!4d79.4288389!16s%2Fg%2F1pyqs92yw"
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
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bus size={13} />
                  </div>
                  <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'శ్రీనివాసం' : lang === 'hi' ? 'श्रीनिवासन' : lang === 'ta' ? 'ஸ்ரீநிவாஸம்' : 'Srinivasam'}
                  </span>
                  <span className="notranslate" style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'బస్ స్టాండ్ ఎదురుగా' : lang === 'hi' ? 'बस स्टैंड के सामने' : lang === 'ta' ? 'பேருந்து நிலையம் எதிரில்' : 'Opp. Bus Stand'}
                  </span>
                </div>
              </a>

              {/* Bhudevi (Alipiri Footpath) */}
              <a
                href="https://www.google.com/maps/place/Bhudevi+complex+Padayatra+tickets+counter/@13.6466715,79.4085658,18.14z/data=!3m1!5s0x3a4d4b0898df978f:0x10422b2c2d88f4e3!4m17!1m10!3m9!1s0x3a4d4bbbe2ad2eff:0x6b655eee58504269!2sVishnu+Nivasam!5m2!4m1!1i2!8m2!3d13.6292776!4d79.4215889!16s%2Fg%2F11g1q7vspv!3m5!1s0x3a4d4b002440a9d1:0x22ccbb84b1c113d2!8m2!3d13.6464948!4d79.4097309!16s%2Fg%2F11wb01cp7t"
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
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mountain size={13} />
                  </div>
                  <span className="notranslate" style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'భూదేవి కాంప్లెక్స్' : lang === 'hi' ? 'भूदेवी कॉम्प्लेक्स' : lang === 'ta' ? 'பூதேவி காம்ப்ளக்ஸ்' : 'Bhudevi Complex'}
                  </span>
                  <span className="notranslate" style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.15, textAlign: 'center', width: '100%' }}>
                    {lang === 'te' ? 'అలిపిరి వద్ద' : lang === 'hi' ? 'अलिपिरी के पास' : lang === 'ta' ? 'அலிபிரி அருகில்' : 'Near Alipiri'}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Daily timing guide / Custom Admin Info */}
          {liveStatus.ssdTimingsGuide && (() => {
            const points = cleanTimingsGuide(liveStatus.ssdTimingsGuide);
            if (!points.length) return null;

            return (
              <div style={{
                borderTop: '1px solid #F1F5F9',
                paddingTop: '10px',
                marginTop: '8px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                background: liveStatus.ssdTokenStatus === 'closed-for-day' ? '#FFFBEB' : '#F8FAFC',
                padding: '10px 12px',
                borderRadius: '10px',
                border: `1px solid ${liveStatus.ssdTokenStatus === 'closed-for-day' ? '#FDE68A' : '#E2E8F0'}`
              }}>
                <Clock size={13} color={liveStatus.ssdTokenStatus === 'closed-for-day' ? '#B45309' : '#64748B'} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                  {points.map((pt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      {points.length > 1 && (
                        <span style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: liveStatus.ssdTokenStatus === 'closed-for-day' ? '#D97706' : '#64748B',
                          marginTop: '5px',
                          flexShrink: 0
                        }} />
                      )}
                      <span style={{
                        fontSize: '11px',
                        color: liveStatus.ssdTokenStatus === 'closed-for-day' ? '#78350F' : '#475569',
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


import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  Lightbulb, 
  ChevronRight, 
  Train, 
  Bus, 
  Mountain, 
  Ticket,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    ssdDdStatus: 'SSD & DD Token Status',
    updated: 'Updated',
    closed: 'Closed',
    issuing: 'Issuing',
    paused: 'Paused',
    suspended: 'Suspended',
    today: 'Today',
    tomorrowDarshanLabel: "Tomorrow's Darshan",
    startedAt: 'Started at',
    quotaCompletedAt: 'Quota completed at',
    tokensRemaining: 'Tokens remaining',
    tokensAvailable: 'Available',
    temporarilyPaused: 'Temporarily paused',
    activelyIssuing: 'Actively issuing',
    notAnnounced: 'Not announced',
    unavailable: 'Unavailable',
    status: 'Status',
    todayQuotaCompleted: "Today's quota completed",
    tokensIssuingNow: 'Tokens issuing now',
    tokensPaused: 'Issuance paused',
    tokensSuspended: 'Issuance suspended',
    tokensIssuedNote: (date: string) => `Tokens for ${date} have been fully issued.`,
    tokensIssuingNote: (date: string) => `Tokens for tomorrow's darshan (${date}) are currently being issued at counters.`,
    tokensPausedNote: (date: string) => `Token issuance for ${date} is temporarily paused.`,
    tokensSuspendedNote: (date: string) => `Token issuance for ${date} is suspended due to festival/rush.`,
    ssdTokens: 'SSD Tokens',
    ddTokens: 'DD Tokens',
    completed: 'Completed',
    issuingBadge: 'Issuing',
    pausedBadge: 'Paused',
    perDay: '/ day',
    issuingStarted: 'Issuing started',
    quotaCompleted: 'Quota completed',
    previousDay: 'Previous day',
    completedAt: 'Completed at',
    historicalPending: 'Awaiting report',
    nextExpectedRelease: 'Next Expected Release',
    nextConfirmedRelease: 'Next Confirmed Release',
    notAnnouncedYet: 'Not Announced Yet',
    tomorrow: 'Tomorrow',
    todayLabel: 'Today',
    quotasCompletedAdvice: "Today's SSD & DD token quotas are completed.",
    pleaseWaitNote: 'Please wait for the next release. Token timings are subject to TTD updates.',
    directWalkInOpen: 'Direct walk-in Sarva Darshan open at Tirumala (No tokens needed).',
    collectAtCounters: 'Collect tokens at counters listed below with original Aadhaar.',
    collectionCentres: 'COLLECTION CENTRES',
    tapForDirections: 'Tap for directions',
    vishnuNivasam: 'Vishnu Nivasam',
    oppRailway: 'Opp. Railway Station',
    srinivasam: 'Srinivasam',
    oppBusStand: 'Opp. Bus Stand',
    bhudevi: 'Bhudevi Complex',
    nearAlipiri: 'Near Alipiri Gate',
    navigate: 'Navigate ↗'
  },
  te: {
    ssdDdStatus: 'SSD & DD టోకెన్ స్థితి',
    updated: 'అప్‌డేట్',
    closed: 'ముగిసింది',
    issuing: 'జారీ అవుతోంది',
    paused: 'నిలిపివేయబడింది',
    suspended: 'తాత్కాలిక నిలిపివేత',
    today: 'ఈరోజు',
    tomorrowDarshanLabel: 'రేపటి దర్శనం',
    startedAt: 'జారీ ప్రారంభం',
    quotaCompletedAt: 'కోటా పూర్తయింది',
    tokensRemaining: 'మిగిలిన టోకెన్లు',
    tokensAvailable: 'అందుబాటులో ఉన్నాయి',
    temporarilyPaused: 'తాత్కాలికంగా ఆపబడింది',
    activelyIssuing: 'టోకెన్లు జారీ అవుతున్నాయి',
    notAnnounced: 'ఇంకా ప్రకటించలేదు',
    unavailable: 'అందుబాటులో లేదు',
    status: 'స్థితి',
    todayQuotaCompleted: 'నేటి కోటా పూర్తయింది',
    tokensIssuingNow: 'టోకెన్లు జారీ అవుతున్నాయి',
    tokensPaused: 'టోకెన్ జారీ నిలిపివేయబడింది',
    tokensSuspended: 'టోకెన్ జారీ నిలిపివేయబడింది',
    tokensIssuedNote: (date: string) => `${date} నాటి టోకెన్లు పూర్తిగా పూర్తయ్యాయి.`,
    tokensIssuingNote: (date: string) => `రేపటి దర్శనం (${date}) నాటి టోకెన్లు ప్రస్తుతం కౌంటర్లలో జారీ అవుతున్నాయి.`,
    tokensPausedNote: (date: string) => `${date} నాటి టోకెన్ జారీ తాత్కాలికంగా ఆపబడింది.`,
    tokensSuspendedNote: (date: string) => `${date} నాటి టోకెన్ జారీ తాత్కాలికంగా నిలిపివేయబడింది.`,
    ssdTokens: 'SSD టోకెన్లు',
    ddTokens: 'DD టోకెన్లు',
    completed: 'పూర్తయింది',
    issuingBadge: 'జారీ అవుతోంది',
    pausedBadge: 'నిలిపివేయబడింది',
    perDay: '/ రోజుకు',
    issuingStarted: 'జారీ ప్రారంభమైంది',
    quotaCompleted: 'కోటా పూర్తయింది',
    previousDay: 'నిన్న',
    completedAt: 'పూర్తయిన సమయం',
    historicalPending: 'సమాచారం వేచి ఉంది',
    nextExpectedRelease: 'తదుపరి విడుదల సమయం',
    nextConfirmedRelease: 'తదుపరి ఖరారైన సమయం',
    notAnnouncedYet: 'ఇంకా ప్రకటించలేదు',
    tomorrow: 'రేపు',
    todayLabel: 'ఈరోజు',
    quotasCompletedAdvice: 'నేటి SSD & DD టోకెన్ కోటాలు పూర్తయ్యాయి.',
    pleaseWaitNote: 'దయచేసి తదుపరి విడుదల కోసం వేచి ఉండండి. టోకెన్ సమయాలు TTD నవీకరణలకు లోబడి ఉంటాయి.',
    directWalkInOpen: 'తిరుమలలో నేరుగా వైకుంఠం క్యూ ద్వారా సర్వదర్శనం చేసుకోవచ్చు (టోకెన్ అవసరం లేదు).',
    collectAtCounters: 'అసలు ఆధార్ కార్డుతో కింద ఉన్న కౌంటర్ల వద్ద టోకెన్లు పొందండి.',
    collectionCentres: 'సేకరణ కేంద్రాలు',
    tapForDirections: 'మ్యాప్ డైరెక్షన్స్',
    vishnuNivasam: 'విష్ణు నివాసం',
    oppRailway: 'రైల్వే స్టేషన్ ఎదురుగా',
    srinivasam: 'శ్రీనివాసం',
    oppBusStand: 'బస్ స్టాండ్ ఎదురుగా',
    bhudevi: 'భూదేవి కాంప్లెక్స్',
    nearAlipiri: 'అలిపిరి వద్ద',
    navigate: 'మార్గం ↗'
  },
  hi: {
    ssdDdStatus: 'एसएसडी और डीडी टोकन स्थिति',
    updated: 'अपडेट',
    closed: 'बंद',
    issuing: 'जारी है',
    paused: 'रुका हुआ',
    suspended: 'स्थगित',
    today: 'आज',
    tomorrowDarshanLabel: 'कल का दर्शन',
    startedAt: 'जारी शुरू',
    quotaCompletedAt: 'कोटा पूरा हुआ',
    tokensRemaining: 'शेष टोकन',
    tokensAvailable: 'उपलब्ध',
    temporarilyPaused: 'अस्थायी रूप से रुका हुआ',
    activelyIssuing: 'सक्रिय रूप से जारी',
    notAnnounced: 'घोषित नहीं',
    unavailable: 'अनुपलब्ध',
    status: 'स्थिति',
    todayQuotaCompleted: 'आज का कोटा पूरा हुआ',
    tokensIssuingNow: 'टोकन जारी किए जा रहे हैं',
    tokensPaused: 'टोकन वितरण रुका हुआ है',
    tokensSuspended: 'टोकन वितरण स्थगित है',
    tokensIssuedNote: (date: string) => `${date} के लिए टोकन पूरी तरह समाप्त हो चुके हैं।`,
    tokensIssuingNote: (date: string) => `कल के दर्शन (${date}) के लिए टोकन काउंटरों पर जारी किए जा रहे हैं।`,
    tokensPausedNote: (date: string) => `${date} के लिए टोकन वितरण अस्थायी रूप से रुका हुआ है।`,
    tokensSuspendedNote: (date: string) => `${date} के लिए टोकन वितरण स्थगित है।`,
    ssdTokens: 'एसएसडी टोकन',
    ddTokens: 'डीडी टोकन',
    completed: 'पूरा हुआ',
    issuingBadge: 'जारी है',
    pausedBadge: 'रुका हुआ',
    perDay: '/ दिन',
    issuingStarted: 'जारी होना शुरू',
    quotaCompleted: 'कोटा पूरा हुआ',
    previousDay: 'पिछला दिन',
    completedAt: 'पर पूरा हुआ',
    historicalPending: 'विवरण प्रतीक्षारत',
    nextExpectedRelease: 'अगला अपेक्षित समय',
    nextConfirmedRelease: 'अगला पुष्ट समय',
    notAnnouncedYet: 'अभी घोषित नहीं हुआ',
    tomorrow: 'कल',
    todayLabel: 'आज',
    quotasCompletedAdvice: 'आज का एसएसडी और डीडी टोकन कोटा पूरा हो गया है।',
    pleaseWaitNote: 'कृपया अगले अपडेट की प्रतीक्षा करें। टोकन समय टीटीडी नियमों के अधीन हैं।',
    directWalkInOpen: 'तिरुपति में बिना टोकन सीधे सर्व दर्शन खुला है।',
    collectAtCounters: 'मूल आधार कार्ड के साथ काउंटरों पर टोकन प्राप्त करें।',
    collectionCentres: 'संग्रह केंद्र',
    tapForDirections: 'दिशा-निर्देश देखें',
    vishnuNivasam: 'विष्णु निवासम',
    oppRailway: 'रेलवे स्टेशन के सामने',
    srinivasam: 'श्रीनिवासम',
    oppBusStand: 'बस स्टैंड के सामने',
    bhudevi: 'भूदेवी कॉम्प्लेक्स',
    nearAlipiri: 'अलिपिरी के पास',
    navigate: 'मार्ग ↗'
  },
  ta: {
    ssdDdStatus: 'SSD & DD டோக்கன் நிலை',
    updated: 'புதுப்பிக்கப்பட்டது',
    closed: 'முடிந்தது',
    issuing: 'வழங்கப்படுகிறது',
    paused: 'நிறுத்தப்பட்டது',
    suspended: 'நிறுத்தப்பட்டுள்ளது',
    today: 'இன்று',
    tomorrowDarshanLabel: 'நாளை தரிசனம்',
    startedAt: 'தொடங்கிய நேரம்',
    quotaCompletedAt: 'ஒதுக்கீடு முடிந்தது',
    tokensRemaining: 'மீதமுள்ள டோக்கன்கள்',
    tokensAvailable: 'இருப்பில் உள்ளது',
    temporarilyPaused: 'தற்காலிகமாக நிறுத்தப்பட்டது',
    activelyIssuing: 'டோக்கன்கள் வழங்கப்படுகின்றன',
    notAnnounced: 'அறிவிக்கப்படவில்லை',
    unavailable: 'கிடைக்கவில்லை',
    status: 'நிலை',
    todayQuotaCompleted: 'இன்றைய ஒதுக்கீடு முடிந்தது',
    tokensIssuingNow: 'டோக்கன்கள் இப்போது வழங்கப்படுகின்றன',
    tokensPaused: 'டோக்கன் வழங்குவது தற்காலிகமாக நிறுத்தப்பட்டுள்ளது',
    tokensSuspended: 'டோக்கன் வழங்குவது நிறுத்தி வைக்கப்பட்டுள்ளது',
    tokensIssuedNote: (date: string) => `${date}க்கான டோக்கன்கள் முழுமையாக வழங்கப்பட்டுவிட்டன.`,
    tokensIssuingNote: (date: string) => `நாளை தரிசனத்திற்கான (${date}) டோக்கன்கள் தற்போது கவுன்டர்களில் வழங்கப்படுகின்றன.`,
    tokensPausedNote: (date: string) => `${date}க்கான டோக்கன் வழங்குவது நிறுத்தப்பட்டுள்ளது.`,
    tokensSuspendedNote: (date: string) => `${date}க்கான டோக்கன் வழங்குவது நிறுத்தி வைக்கப்பட்டுள்ளது.`,
    ssdTokens: 'SSD டோக்கன்கள்',
    ddTokens: 'DD டோக்கன்கள்',
    completed: 'முடிந்தது',
    issuingBadge: 'வழங்கப்படுகிறது',
    pausedBadge: 'நிறுத்தப்பட்டது',
    perDay: '/ நாள்',
    issuingStarted: 'வழங்கத் தொடங்கியது',
    quotaCompleted: 'ஒதுக்கீடு முடிந்தது',
    previousDay: 'முந்தைய நாள்',
    completedAt: 'முடிந்த நேரம்',
    historicalPending: 'தகவல் நிலுவையில் உள்ளது',
    nextExpectedRelease: 'அடுத்த எதிர்பார்க்கப்படும் நேரம்',
    nextConfirmedRelease: 'அடுத்த உறுதிசெய்யப்பட்ட நேரம்',
    notAnnouncedYet: 'இன்னும் அறிவிக்கப்படவில்லை',
    tomorrow: 'நாளை',
    todayLabel: 'இன்று',
    quotasCompletedAdvice: 'இன்றைய SSD & DD டோக்கன் ஒதுக்கீடு முடிந்தது.',
    pleaseWaitNote: 'தயவுசெய்து அடுத்த புதுப்பிப்புக்காக காத்திருக்கவும். டோக்கன் நேரங்கள் TTD மாற்றங்களுக்கு உட்பட்டவை.',
    directWalkInOpen: 'டோக்கன் இல்லாமல் நேரடியாக சர்வ தரிசனம் செய்யலாம்.',
    collectAtCounters: 'அசல் ஆதார் அட்டையுடன் மையங்களில் டோக்கன் பெறவும்.',
    collectionCentres: 'டோக்கன் மையங்கள்',
    tapForDirections: 'வரைபட வழிகள்',
    vishnuNivasam: 'விஷ்ணு நிவாசம்',
    oppRailway: 'ரயில் நிலையம் எதிரில்',
    srinivasam: 'ஸ்ரீநிவாசம்',
    oppBusStand: 'பேருந்து நிலையம் எதிரில்',
    bhudevi: 'பூதேவி வளாகம்',
    nearAlipiri: 'அலிபிரி அருகில்',
    navigate: 'வழி ↗'
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

/**
 * Dynamic Asia/Kolkata date and time helper
 */
function getISTDateInfo(lastUpdatedStr?: string) {
  const now = new Date();

  const istDateFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const istShortDateFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short'
  });

  const istTimeFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const todayStr = istDateFmt.format(now);
  const todayShortStr = istShortDateFmt.format(now);

  // Yesterday in IST
  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = istDateFmt.format(yesterdayDate);
  const yesterdayShortStr = istShortDateFmt.format(yesterdayDate);

  // Tomorrow in IST
  const tomorrowDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = istDateFmt.format(tomorrowDate);

  // Last Updated formatted
  let updatedDisplay = '';
  if (lastUpdatedStr) {
    try {
      const updDate = new Date(lastUpdatedStr);
      if (!isNaN(updDate.getTime())) {
        updatedDisplay = `${istDateFmt.format(updDate)}, ${istTimeFmt.format(updDate)}`;
      }
    } catch {
      // fallback
    }
  }
  if (!updatedDisplay) {
    updatedDisplay = `${todayStr}, ${istTimeFmt.format(now)}`;
  }

  return {
    today: todayStr,
    todayShort: todayShortStr,
    yesterday: yesterdayStr,
    yesterdayShort: yesterdayShortStr,
    tomorrow: tomorrowStr,
    updatedDisplay
  };
}

/**
 * Temple Shikharam / Gopuram Vector Icon
 */
function TempleIcon({ color = '#2563EB' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="2.5" r="1.5" fill={color} />
      <path d="M12 4.5L5 9H19L12 4.5Z" fill={color} />
      <rect x="4" y="9" width="16" height="2" rx="0.5" fill={color} />
      <rect x="5.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="9.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="13.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="17.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="3" y="18" width="18" height="2" rx="0.5" fill={color} />
      <rect x="2" y="20" width="20" height="2" rx="0.5" fill={color} />
    </svg>
  );
}

export function QuickChecklist(props: any) {
  const { liveStatus } = props;
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  if (!liveStatus) return null;

  // 1. Dynamic IST Date calculation
  const ist = getISTDateInfo(liveStatus.lastUpdated);

  // 2. Determine SSD & Overall Status
  const rawStatus = (liveStatus.ssdTokenStatus || 'closed-for-day').toLowerCase();
  const cleanNotice = liveStatus.ssdNotice
    ? liveStatus.ssdNotice.replace(/[\u{1F300}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').replace(/\*/g, '').trim()
    : '';

  const isSuspended = Boolean(
    (cleanNotice && /suspend|cancel|brahmotsavam/i.test(cleanNotice)) ||
    (liveStatus.ssdNextTokenTime && /suspend|cancel/i.test(liveStatus.ssdNextTokenTime)) ||
    rawStatus === 'cancelled' ||
    rawStatus === 'suspended'
  );

  const isIssuing = !isSuspended && rawStatus === 'issuing';
  const isPaused = !isSuspended && rawStatus === 'paused';
  const isCompleted = !isIssuing && !isPaused && !isSuspended;

  // 3. Divya Darshan (DD) Footpath Status from API/DB
  const ddDarshan = liveStatus.darshans?.find(
    (d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath')
  );
  const ddWait = ddDarshan?.waitTime || '';
  const isDdClosed = /closed|full|complete|suspend|stop/i.test(ddWait) || isCompleted;
  const isDdIssuing = !isDdClosed && /issuing|open|available/i.test(ddWait);

  const allText = `${cleanNotice} ${liveStatus.ssdTimingsGuide || ''}`;

  // 4. SSD Data Extraction (Independent)
  const ssdDetails = (liveStatus as any).ssdTokenDetails || {};
  const ssdGuideMatch = {
    total: allText.match(/SSD Quota:\s*([^\s(,]+)/i) || allText.match(/SSD[^\d]*(\d[\d,]*(?:\s*[kK])?)/i) || allText.match(/(\d[\d,]*(?:\s*[kK])?)\s*(?:SSD|tokens|quota)/i),
    left: allText.match(/SSD[^\n]*?Available:\s*([^\s,)]+)/i) || allText.match(/SSD[^\n]*?(?:Left|Remaining)[^\d]*(\d[\d,]*)/i),
    start: allText.match(/SSD[^\n]*?Started at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i),
    comp: allText.match(/SSD[^\n]*?Completed at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i),
    status: allText.match(/SSD[^\n]*?Status:\s*([a-zA-Z-]+)/i),
  };

  const rawSsdStatus = String(ssdDetails.status || ssdGuideMatch.status?.[1] || rawStatus || '').toLowerCase();
  const isSsdIssuing = !isSuspended && rawSsdStatus === 'issuing';
  const isSsdPaused = !isSuspended && rawSsdStatus === 'paused';
  const isSsdCompleted = !isSuspended && (rawSsdStatus === 'completed' || rawSsdStatus === 'closed' || rawSsdStatus === 'closed-for-day' || (!isSsdIssuing && !isSsdPaused));

  // SSD Total Quota
  let ssdTotalCount = ssdDetails.totalTokens || (ssdGuideMatch.total ? ssdGuideMatch.total[1].trim() : '10K');
  if (/^\d{1,2}$/.test(ssdTotalCount)) ssdTotalCount += 'K';

  // SSD Remaining Tokens: only show count when admin has provided a verified count
  const rawSsdLeftVal = ssdDetails.tokensLeft !== undefined && ssdDetails.tokensLeft !== ''
    ? String(ssdDetails.tokensLeft).trim()
    : (ssdGuideMatch.left ? ssdGuideMatch.left[1].trim() : '');
  const hasVerifiedSsdLeft = Boolean(rawSsdLeftVal && rawSsdLeftVal !== 'null' && rawSsdLeftVal !== 'undefined');
  const ssdDisplayRemaining = hasVerifiedSsdLeft ? rawSsdLeftVal : (isSsdCompleted ? '0' : '');

  // SSD Started Time: never hardcode fallback times
  const ssdRawStart = cleanTime(ssdDetails.startTime || ssdGuideMatch.start?.[1]);
  const ssdStartDisplay = ssdRawStart
    ? `${ssdRawStart} (${isSsdCompleted ? ist.yesterdayShort : ist.todayShort})`
    : t.notAnnounced;

  // SSD Completed Time: strictly explicit completed time, never next release time
  const ssdRawComp = cleanTime(ssdDetails.completedTime || ssdGuideMatch.comp?.[1]);
  const ssdCompDisplay = ssdRawComp ? `${ssdRawComp} (${ist.todayShort})` : t.completed;

  // 5. DD Data Extraction (Independent)
  const ddDetails = (liveStatus as any).ddTokenDetails || {};
  const ddGuideMatch = {
    total: allText.match(/DD Quota:\s*([^\s(,]+)/i) || allText.match(/DD[^\d]*(\d[\d,]*(?:\s*[kK])?)/i) || allText.match(/(\d[\d,]*(?:\s*[kK])?)\s*(?:DD|divya)/i),
    left: allText.match(/DD[^\n]*?Available:\s*([^\s,)]+)/i) || allText.match(/DD[^\n]*?(?:Left|Remaining)[^\d]*(\d[\d,]*)/i),
    start: allText.match(/DD[^\n]*?Started at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i),
    comp: allText.match(/DD[^\n]*?Completed at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i),
    status: allText.match(/DD[^\n]*?Status:\s*([a-zA-Z-]+)/i),
  };

  const rawDdStatus = String(ddDetails.status || ddGuideMatch.status?.[1] || (isDdIssuing ? 'issuing' : isDdClosed ? 'completed' : '')).toLowerCase();
  const isDdNowIssuing = !isSuspended && (rawDdStatus === 'issuing' || (!rawDdStatus && isDdIssuing));
  const isDdNowPaused = !isSuspended && (rawDdStatus === 'paused' || /paused/i.test(ddWait));
  const isDdNowCompleted = !isSuspended && (rawDdStatus === 'completed' || (!isDdNowIssuing && !isDdNowPaused));

  // DD Total Quota
  let ddTotalCount = ddDetails.totalTokens || (ddGuideMatch.total ? ddGuideMatch.total[1].trim() : '2K');
  if (/^\d{1,2}$/.test(ddTotalCount)) ddTotalCount += 'K';

  // DD Remaining Tokens: only show count when admin has provided a verified count
  const rawDdLeftVal = ddDetails.tokensLeft !== undefined && ddDetails.tokensLeft !== ''
    ? String(ddDetails.tokensLeft).trim()
    : (ddGuideMatch.left ? ddGuideMatch.left[1].trim() : '');
  const hasVerifiedDdLeft = Boolean(rawDdLeftVal && rawDdLeftVal !== 'null' && rawDdLeftVal !== 'undefined');
  const ddDisplayRemaining = hasVerifiedDdLeft ? rawDdLeftVal : (isDdNowCompleted ? '0' : '');

  // DD Started Time: never hardcode fallback times
  const ddRawStart = cleanTime(ddDetails.startTime || ddGuideMatch.start?.[1]);
  const ddStartDisplay = ddRawStart
    ? `${ddRawStart} (${isDdNowCompleted ? ist.yesterdayShort : ist.todayShort})`
    : t.notAnnounced;

  // DD Completed Time: strictly explicit completed time, never next release time
  const ddRawComp = cleanTime(ddDetails.completedTime || ddGuideMatch.comp?.[1]);
  const ddCompDisplay = ddRawComp ? `${ddRawComp} (${ist.todayShort})` : t.completed;

  const ssdLeftCount = isSsdCompleted ? '0' : (hasVerifiedSsdLeft ? rawSsdLeftVal : '--');
  const ddLeftCount = isDdNowCompleted ? '0' : (hasVerifiedDdLeft ? rawDdLeftVal : '--');
  const activeDateLabel = isIssuing ? t.tomorrowDarshanLabel : t.today;
  const activeTokenDate = isIssuing ? ist.tomorrow : ist.today;

  // 6. Timeline display values per required behavior table
  const ssdRow2Title = isSsdIssuing ? t.tokensRemaining : isSsdCompleted ? t.quotaCompletedAt : isSsdPaused ? t.status : t.status;
  const ssdRow2Value = isSsdIssuing
    ? (hasVerifiedSsdLeft ? `${Number(rawSsdLeftVal).toLocaleString('en-IN')} ${t.tokensAvailable}` : t.activelyIssuing)
    : isSsdCompleted
    ? ssdCompDisplay
    : isSsdPaused
    ? t.temporarilyPaused
    : t.unavailable;
  const ssdRow2Color = isSsdIssuing ? '#16A34A' : isSsdPaused ? '#D97706' : isSsdCompleted ? '#DC2626' : '#64748B';
  const ssdRow2Bg = isSsdIssuing ? '#DCFCE7' : isSsdPaused ? '#FEF3C7' : isSsdCompleted ? '#FEE2E2' : '#F1F5F9';

  const ddRow2Title = isDdNowIssuing ? t.tokensRemaining : isDdNowCompleted ? t.quotaCompletedAt : isDdNowPaused ? t.status : t.status;
  const ddRow2Value = isDdNowIssuing
    ? (hasVerifiedDdLeft ? `${Number(rawDdLeftVal).toLocaleString('en-IN')} ${t.tokensAvailable}` : t.activelyIssuing)
    : isDdNowCompleted
    ? ddCompDisplay
    : isDdNowPaused
    ? t.temporarilyPaused
    : t.unavailable;
  const ddRow2Color = isDdNowIssuing ? '#16A34A' : isDdNowPaused ? '#D97706' : isDdNowCompleted ? '#DC2626' : '#64748B';
  const ddRow2Bg = isDdNowIssuing ? '#DCFCE7' : isDdNowPaused ? '#FEF3C7' : isDdNowCompleted ? '#FEE2E2' : '#F1F5F9';

  // 7. Next Expected Release (Strictly distinguish expected from confirmed)
  const rawNext = cleanTime(liveStatus.ssdNextTokenTime);
  const hasConfirmedTime = Boolean(
    rawNext &&
    !/suspend|cancel|not announced|unknown|tbd|tba|closed/i.test(rawNext) &&
    /\d/.test(rawNext)
  );

  const isNextConfirmed = hasConfirmedTime && !/tentative|expected|subject/i.test(rawNext);
  const nextReleaseTitle = t.nextExpectedRelease;
  const nextReleaseDisplay = hasConfirmedTime ? rawNext : t.notAnnouncedYet;
  const nextReleaseDateLabel = hasConfirmedTime
    ? (isCompleted ? `${ist.tomorrow} (${t.tomorrow})` : `${ist.today} (${t.todayLabel})`)
    : '';

  // 8. Actionable Guidance Note
  const isWalkInConfirmed = Boolean(
    /walk-in|direct|no token/i.test(cleanNotice) ||
    /walk-in|direct|no token/i.test(liveStatus.notice || '') ||
    (liveStatus.sarvaDarshanWait && !/cancel|closed/i.test(liveStatus.sarvaDarshanWait))
  );

  let guidanceTitle = t.quotasCompletedAdvice;
  let guidanceSubtitle = t.pleaseWaitNote;

  if (isIssuing) {
    guidanceTitle = t.tokensIssuingNow;
    guidanceSubtitle = t.collectAtCounters;
  } else if (isWalkInConfirmed) {
    guidanceTitle = t.directWalkInOpen;
    guidanceSubtitle = t.pleaseWaitNote;
  } else if (isSuspended && cleanNotice) {
    guidanceTitle = t.tokensSuspended;
    guidanceSubtitle = cleanNotice;
  }

  // 9. Status Header text
  const headerBadgeText = isSuspended
    ? t.suspended
    : isIssuing
    ? t.issuing
    : isPaused
    ? t.paused
    : t.closed;

  const todayStatusText = isSuspended
    ? t.tokensSuspended
    : isIssuing
    ? t.tokensIssuingNow
    : isPaused
    ? t.tokensPaused
    : t.todayQuotaCompleted;

  const todayNoteText = isSuspended
    ? t.tokensSuspendedNote(ist.today)
    : isIssuing
    ? t.tokensIssuingNote(ist.today)
    : isPaused
    ? t.tokensPausedNote(ist.today)
    : t.tokensIssuedNote(ist.today);

  return (
    <div
      onClick={() => router.push('/darshan/ssd-token')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push('/darshan/ssd-token'); }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #E2E8F0',
        padding: '16px 16px 14px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        margin: '8px 14px 12px',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ═══════════════════════════════════════════════════
          1. CARD HEADER
          ═══════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            backgroundColor: isIssuing ? '#DCFCE7' : '#E6F4EA',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Ticket size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {t.ssdDdStatus}
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '2px', display: 'block' }}>
              {t.updated}: {ist.updatedDisplay}
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: isSsdIssuing ? '#166534' : isSsdPaused ? '#B45309' : '#991B1B',
              backgroundColor: isSsdIssuing ? '#DCFCE7' : isSsdPaused ? '#FEF3C7' : '#FEE2E2',
          border: `1px solid ${isIssuing ? '#BBF7D0' : isPaused ? '#FDE68A' : '#FECACA'}`,
          padding: '3px 10px',
          borderRadius: '999px',
          lineHeight: 1,
          flexShrink: 0
        }}>
          {headerBadgeText}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════
          2. DATE SUMMARY BANNER (Asia/Kolkata Dynamic)
          ═══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: isIssuing ? '#F0FDF4' : '#FFF5F5',
        border: `1px solid ${isIssuing ? '#BBF7D0' : '#FED7D7'}`,
        borderRadius: '14px',
        padding: '11px 12px',
        marginBottom: '12px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Calendar Icon + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${isIssuing ? '#BBF7D0' : '#FEE2E2'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isIssuing ? '#16A34A' : '#DC2626',
              flexShrink: 0
            }}>
              <Calendar size={16} />
            </div>

            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', lineHeight: 1.1 }}>
                {activeDateLabel}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px', display: 'block', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {activeTokenDate}
              </span>
            </div>
          </div>

          {/* Right: Status Badge */}
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: isIssuing ? '#166534' : '#991B1B',
            backgroundColor: isIssuing ? '#DCFCE7' : '#FEE2E2',
            border: `1px solid ${isIssuing ? '#BBF7D0' : '#FECACA'}`,
            padding: '3px 8px',
            borderRadius: '6px',
            flexShrink: 0,
            lineHeight: 1.2
          }}>
            {todayStatusText}
          </span>
        </div>

        <p style={{ fontSize: '11.5px', color: '#64748B', margin: '7px 0 0 0', fontWeight: 500, lineHeight: 1.35 }}>
          {todayNoteText}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════
          3. SEPARATE SSD & DD TOKEN CARDS WITH TIMELINE
          ═══════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '10px',
        marginBottom: '10px'
      }}>
        {/* ── 3A: SSD TOKENS CARD ── */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            router.push('/ssd-tokens');
          }}
          style={{
            cursor: 'pointer',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Row: Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TempleIcon color="#2563EB" />
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t.ssdTokens}
            </h4>
          </div>

          {/* Quota Number: [Left] / [Total] */}
          <div style={{ margin: '2px 0 6px 0', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {ssdLeftCount}
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              / {ssdTotalCount}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: isIssuing ? '#166534' : isPaused ? '#B45309' : '#991B1B',
              backgroundColor: isIssuing ? '#DCFCE7' : isPaused ? '#FEF3C7' : '#FEE2E2',
              padding: '2px 7px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isSsdIssuing ? '#16A34A' : isSsdPaused ? '#D97706' : '#DC2626'
              }} />
              {isSsdIssuing ? t.issuingBadge : isSsdPaused ? t.pausedBadge : t.completed}
            </span>
          </div>

          {/* Vertical Timeline */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Timeline Item 1: Started at */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: ssdRawStart ? '#DCFCE7' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ssdRawStart ? '#16A34A' : '#64748B',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Play size={7} fill={ssdRawStart ? '#16A34A' : '#64748B'} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                  {t.startedAt}
                </span>
                <span style={{ fontSize: '11px', color: '#1E293B', fontWeight: 700, display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  {ssdStartDisplay}
                </span>
              </div>
            </div>

            {/* Timeline Item 2: Tokens remaining / Quota completed at / Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: ssdRow2Bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ssdRow2Color,
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ssdRow2Color }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                  {ssdRow2Title}
                </span>
                <span style={{ fontSize: '11px', color: '#1E293B', fontWeight: 700, display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  {ssdRow2Value}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3B: DD TOKENS CARD ── */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            router.push('/dd-tokens');
          }}
          style={{
            cursor: 'pointer',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Row: Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TempleIcon color="#D97706" />
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t.ddTokens}
            </h4>
          </div>

          {/* Quota Number: [Left] / [Total] */}
          <div style={{ margin: '2px 0 6px 0', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {ddLeftCount}
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              / {ddTotalCount}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: isDdNowIssuing ? '#166534' : isDdNowPaused ? '#B45309' : '#991B1B',
              backgroundColor: isDdNowIssuing ? '#DCFCE7' : isDdNowPaused ? '#FEF3C7' : '#FEE2E2',
              padding: '2px 7px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isDdNowIssuing ? '#16A34A' : isDdNowPaused ? '#D97706' : '#DC2626'
              }} />
              {isDdNowIssuing ? t.issuingBadge : isDdNowPaused ? t.pausedBadge : t.completed}
            </span>
          </div>

          {/* Vertical Timeline */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Timeline Item 1: Started at */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: ddRawStart ? '#DCFCE7' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ddRawStart ? '#16A34A' : '#64748B',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Play size={7} fill={ddRawStart ? '#16A34A' : '#64748B'} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                  {t.startedAt}
                </span>
                <span style={{ fontSize: '10.5px', color: '#1E293B', fontWeight: 700, display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  {ddStartDisplay}
                </span>
              </div>
            </div>

            {/* Timeline Item 2: Tokens remaining / Quota completed at / Status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: ddRow2Bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ddRow2Color,
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ddRow2Color }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                  {ddRow2Title}
                </span>
                <span style={{ fontSize: '10.5px', color: '#1E293B', fontWeight: 700, display: 'block', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  {ddRow2Value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          4. NEXT EXPECTED RELEASE (Horizontal Information Row)
          ═══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#F0F7FF',
        border: '1px solid #DBEAFE',
        borderRadius: '14px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E3A8A', display: 'block', lineHeight: 1.2 }}>
              {nextReleaseTitle}
            </span>
            {nextReleaseDateLabel ? (
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '2px', display: 'block' }}>
                {nextReleaseDateLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E3A8A' }}>
            {nextReleaseDisplay}
          </span>
          <ChevronRight size={14} color="#1E3A8A" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          5. GUIDANCE CARD
          ═══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#F0FDF4',
        border: '1px solid #DCFCE7',
        borderRadius: '14px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '9px',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#DCFCE7',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px'
        }}>
          <Lightbulb size={16} />
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#14532D', display: 'block', lineHeight: 1.3 }}>
            {guidanceTitle}
          </span>
          <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '2px', lineHeight: 1.35 }}>
            {guidanceSubtitle}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          6. COLLECTION CENTRES (Preserved & Responsive)
          ═══════════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t.collectionCentres}
          </span>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F5132' }}>
            {t.tapForDirections}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
          {[
            {
              name: t.vishnuNivasam,
              sub: t.oppRailway,
              icon: <Train size={14} color="#2563EB" />,
              iconBg: '#EFF6FF',
              q: 'Vishnu Nivasam Tirupati'
            },
            {
              name: t.srinivasam,
              sub: t.oppBusStand,
              icon: <Bus size={14} color="#16A34A" />,
              iconBg: '#F0FDF4',
              q: 'Srinivasam Complex Tirupati'
            },
            {
              name: t.bhudevi,
              sub: t.nearAlipiri,
              icon: <Mountain size={14} color="#D97706" />,
              iconBg: '#FFFBEB',
              q: 'Bhudevi Complex Tirupati'
            }
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
              <span className="notranslate" style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                {c.name}
              </span>
              <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                {c.sub}
              </span>
              <span style={{ marginTop: '6px', fontSize: '9px', fontWeight: 600, color: '#0F5132', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '2px 6px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                {t.navigate}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  Square,
  Bell,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/useLanguage';
import { getISTDateInfo } from '@/lib/istDate';
export { getISTDateInfo };

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
    sarvaTokensSub: 'Tirumala Sarva Darshan Tokens',
    slottedSarvaDarshan: 'Slotted Sarva Darshan',
    divyaDarshanFootpath: 'Divya Darshan (Footpath)',
    collectionCentres: 'Collection Centres',
    collectionLocations: 'SSD / DD Token Collection Locations',
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
    sarvaTokensSub: 'తిరుమల సర్వదర్శనం టోకెన్లు',
    slottedSarvaDarshan: 'స్లాటెడ్ సర్వదర్శనం',
    divyaDarshanFootpath: 'దివ్యదర్శనం (మెట్ల మార్గం)',
    collectionCentres: 'టోకెన్ కౌంటర్లు',
    collectionLocations: 'SSD / DD టోకెన్ జారీ కేంద్రాలు',
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
    sarvaTokensSub: 'तिरुपति सर्वदर्शन टोकन',
    slottedSarvaDarshan: 'स्लॉटेड सर्वदर्शन',
    divyaDarshanFootpath: 'दिव्य दर्शन (पैदल मार्ग)',
    collectionCentres: 'टोकन काउंटर',
    collectionLocations: 'SSD / DD टोकन वितरण केंद्र',
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
    sarvaTokensSub: 'திருமலை சர்வ தரிசன டோக்கன்கள்',
    slottedSarvaDarshan: 'நேரக் குறிப்பிட்ட சர்வ தரிசனம்',
    divyaDarshanFootpath: 'திவ்ய தரிசனம் (நடைபாதை)',
    collectionCentres: 'டோக்கன் மையங்கள்',
    collectionLocations: 'SSD / DD டோக்கன் விநியோக மையங்கள்',
    tapForDirections: 'வரைபட வழிகள்',
    vishnuNivasam: 'விஷ்ணு நிவாசம்',
    oppRailway: 'ரயில் நிலையம் எதிரில்',
    srinivasam: 'ஸ்ரீநிவாசம்',
    oppBusStand: 'பேருந்து நிலையம் எதிரில்',
    bhudevi: 'பூதேவி வளாகம்',
    nearAlipiri: 'அலிபிரி அருகில்',
    navigate: 'வழி ↗'
  },
  kn: {
    ssdDdStatus: 'SSD & DD ಟೋಕನ್ ಸ್ಥಿತಿ',
    updated: 'ಅಪ್‌ಡೇಟ್',
    closed: 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
    issuing: 'ಜಾರಿಯಲ್ಲಿದೆ',
    paused: 'ತಾತ್ಕಾಲಿಕ ನಿಲುಗಡೆ',
    suspended: 'ಸ್ಥಗಿತಗೊಳಿಸಲಾಗಿದೆ',
    today: 'ಇಂದು',
    tomorrowDarshanLabel: 'ನಾಳೆಯ ದರ್ಶನ',
    startedAt: 'ಜಾರಿ ಪ್ರಾರಂಭ',
    quotaCompletedAt: 'ಕೋಟಾ ಪೂರ್ಣಗೊಂಡ ಸಮಯ',
    tokensRemaining: 'ಉಳಿದ ಟೋಕನ್‌ಗಳು',
    tokensAvailable: 'ಲಭ್ಯವಿದೆ',
    temporarilyPaused: 'ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಲ್ಲಿಸಲಾಗಿದೆ',
    activelyIssuing: 'ಟೋಕನ್‌ಗಳು ಜಾರಿಯಾಗುತ್ತಿವೆ',
    notAnnounced: 'ಇನ್ನೂ ಪ್ರಕಟಿಸಿಲ್ಲ',
    unavailable: 'ಲಭ್ಯವಿಲ್ಲ',
    status: 'ಸ್ಥಿತಿ',
    todayQuotaCompleted: 'ಇಂದಿನ ಕೋಟಾ ಪೂರ್ಣಗೊಂಡಿದೆ',
    tokensIssuingNow: 'ಟೋಕನ್‌ಗಳು ಈಗ ಲಭ್ಯವಿವೆ',
    tokensPaused: 'ಟೋಕನ್ ವಿತರಣೆ ಸ್ಥಗಿತ',
    tokensSuspended: 'ರದ್ದಿಯ ಕಾರಣ ಟೋಕನ್ ವಿತರಣೆ ರದ್ದು',
    tokensIssuedNote: (date: string) => `${date} ರ ಟೋಕನ್‌ಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಜಾರಿಯಾಗಿವೆ.`,
    tokensIssuingNote: (date: string) => `ನಾಳೆಯ ದರ್ಶನದ (${date}) ಟೋಕನ್‌ಗಳು ಕೌಂಟರ್‌ಗಳಲ್ಲಿ ಜಾರಿಯಾಗುತ್ತಿವೆ.`,
    tokensPausedNote: (date: string) => `${date} ರ ಟೋಕನ್ ವಿತರಣೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ನಿಂತಿದೆ.`,
    tokensSuspendedNote: (date: string) => `ಹಬ್ಬ/ರದ್ದಿಯ ಕಾರಣ ${date} ರ ಟೋಕನ್ ವಿತರಣೆ ಸ್ಥಗಿತಗೊಂಡಿದೆ.`,
    ssdTokens: 'SSD ಟೋಕನ್‌ಗಳು',
    ddTokens: 'DD ಟೋಕನ್‌ಗಳು',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    issuingBadge: 'ಜಾರಿಯಲ್ಲಿದೆ',
    pausedBadge: 'ನಿಲುಗಡೆ',
    perDay: '/ ದಿನಕ್ಕೆ',
    issuingStarted: 'ಜಾರಿ ಪ್ರಾರಂಭ',
    quotaCompleted: 'ಕೋಟಾ ಪೂರ್ಣ',
    previousDay: 'ಹಿಂದಿನ ದಿನ',
    completedAt: 'ಪೂರ್ಣಗೊಂಡ ಸಮಯ',
    historicalPending: 'ಮಾಹಿತಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
    nextExpectedRelease: 'ಮುಂದಿನ ನಿರೀಕ್ಷಿತ ಬಿಡುಗಡೆ',
    nextConfirmedRelease: 'ಖಚಿತ ಮುಂದಿನ ಬಿಡುಗಡೆ',
    notAnnouncedYet: 'ಇನ್ನೂ ಪ್ರಕಟವಾಗಿಲ್ಲ',
    tomorrow: 'ನಾಳೆ',
    todayLabel: 'ಇಂದು',
    quotasCompletedAdvice: 'ಇಂದಿನ SSD ಮತ್ತು DD ಟೋಕನ್ ಕೋಟಾಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.',
    pleaseWaitNote: 'ದಯವಿಟ್ಟು ಮುಂದಿನ ಬಿಡುಗಡೆಗಾಗಿ ಕಾಯಿರಿ. ಟೋಕನ್ ಸಮಯ TTD ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.',
    directWalkInOpen: 'ತಿರುಮಲದಲ್ಲಿ ನೇರ ಸರ್ವ ದರ್ಶನ ಲಭ್ಯವಿದೆ (ಟೋಕನ್ ಅಗತ್ಯವಿಲ್ಲ).',
    collectAtCounters: 'ಮೂಲ ಆಧಾರ್ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ಕೆಳಗಿನ ಕೌಂಟರ್‌ಗಳಲ್ಲಿ ಟೋಕನ್ ಪಡೆಯಿರಿ.',
    sarvaTokensSub: 'ತಿರುಮಲ ಸರ್ವ ದರ್ಶನ ಟೋಕನ್‌ಗಳು',
    slottedSarvaDarshan: 'ಸ್ಲಾಟೆಡ್ ಸರ್ವ ದರ್ಶನ',
    divyaDarshanFootpath: 'ದಿವ್ಯ ದರ್ಶನ (ಪಾದಯಾತ್ರೆ ಮಾರ್ಗ)',
    collectionCentres: 'ಟೋಕನ್ ಕೌಂಟರ್ ಕೇಂದ್ರಗಳು',
    collectionLocations: 'SSD / DD ಟೋಕನ್ ವಿತರಣಾ ಕೇಂದ್ರಗಳು',
    tapForDirections: 'ದಾರಿಗಾಗಿ ಒತ್ತಿ',
    vishnuNivasam: 'ವಿಷ್ಣು ನಿವಾಸಂ',
    oppRailway: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣದ ಎದುರು',
    srinivasam: 'ಶ್ರೀನಿವಾಸಂ',
    oppBusStand: 'ಬಸ್ ನಿಲ್ದಾಣದ ಎದುರು',
    bhudevi: 'ಭೂದೇವಿ ಕಾಂಪ್ಲೆಕ್ಸ್',
    nearAlipiri: 'ಅಲಿಪಿರಿ ಗೇಟ್ ಬಳಿ',
    navigate: 'ದಾರಿ ↗'
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

function formatDisplayDateTime(str?: string): string {
  if (!str) return '';
  // Strip redundant current year e.g. ", 2026", " 2026," or " 2026"
  let clean = str.replace(/,?\s*\b20\d{2}\b,?\s*/g, ' ').replace(/\s+/g, ' ').trim();
  // Ensure comma between month and time e.g. "5 Nov 5:30 PM" -> "5 Nov, 5:30 PM"
  clean = clean.replace(/([a-zA-Z]{3})\s+(\d)/g, '$1, $2');
  // Ensure uppercase AM/PM
  clean = clean.replace(/\bam\b/gi, 'AM').replace(/\bpm\b/gi, 'PM');
  return clean;
}

// getISTDateInfo is imported and re-exported from '@/lib/istDate' above

/**
 * South Indian Temple Gopuram Vector Icon
 */
function TempleIcon({ color = '#15803D' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      {/* Top Kalasam / Stupi */}
      <circle cx="12" cy="2.5" r="1.2" fill={color} />
      <path d="M12 3.8v1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tier 1 */}
      <path d="M10 5.5h4l1 3H9l1-3z" fill={color} />
      <rect x="8" y="8.5" width="8" height="1.5" rx="0.4" fill={color} />
      {/* Tier 2 */}
      <path d="M8.5 10h7l1 3.5h-9l1-3.5z" fill={color} />
      <rect x="6.5" y="13.5" width="11" height="1.5" rx="0.4" fill={color} />
      {/* Tier 3 (Base) */}
      <path d="M7 15h10l1.2 4.5H5.8L7 15z" fill={color} />
      {/* Entrance Door */}
      <path d="M10.2 19.5v-3.2a1.8 1.8 0 0 1 3.6 0v3.2h-3.6z" fill="#FFFFFF" />
      <rect x="4" y="19.5" width="16" height="2" rx="0.6" fill={color} />
    </svg>
  );
}

function formatQuotaNumber(raw: string, fallback: string): string {
  if (!raw) return fallback;
  const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
  if (!isNaN(num)) {
    if (raw.toLowerCase().includes('k')) return (num * 1000).toLocaleString('en-IN');
    return num.toLocaleString('en-IN');
  }
  return fallback;
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

  const hasEmbeddedDate = (str: string) => /[a-zA-Z]{3}|\d{4}/.test(str);

  // SSD Started Time: never hardcode fallback times
  const ssdRawStart = cleanTime(ssdDetails.startTime || ssdGuideMatch.start?.[1]);
  const ssdStartDisplay = ssdRawStart
    ? (hasEmbeddedDate(ssdRawStart) ? ssdRawStart : `${ssdRawStart} (${isSsdCompleted ? ist.yesterdayShort : ist.todayShort})`)
    : t.notAnnounced;

  // SSD Completed Time: strictly explicit completed time, never next release time
  const ssdRawComp = cleanTime(ssdDetails.completedTime || ssdGuideMatch.comp?.[1]);
  const ssdCompDisplay = ssdRawComp 
    ? (hasEmbeddedDate(ssdRawComp) ? ssdRawComp : `${ssdRawComp} (${ist.todayShort})`) 
    : t.completed;

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
    ? (hasEmbeddedDate(ddRawStart) ? ddRawStart : `${ddRawStart} (${isDdNowCompleted ? ist.yesterdayShort : ist.todayShort})`)
    : t.notAnnounced;

  // DD Completed Time: strictly explicit completed time, never next release time
  const ddRawComp = cleanTime(ddDetails.completedTime || ddGuideMatch.comp?.[1]);
  const ddCompDisplay = ddRawComp 
    ? (hasEmbeddedDate(ddRawComp) ? ddRawComp : `${ddRawComp} (${ist.todayShort})`) 
    : t.completed;

  const ssdLeftCount = isSsdCompleted ? '0' : (hasVerifiedSsdLeft ? rawSsdLeftVal : '--');
  const ddLeftCount = isDdNowCompleted ? '0' : (hasVerifiedDdLeft ? rawDdLeftVal : '--');

  // Single Canonical Target Darshan Date (Asia/Kolkata timezone)
  // Respect explicit admin override if provided; otherwise:
  // When tokens are actively issuing, they are for tomorrow's darshan.
  // When closed/paused/suspended, they apply to today's darshan quota.
  const explicitTargetDate = (liveStatus as any).targetDarshanDate || (liveStatus as any).darshanDate;
  const canonicalTargetDate = explicitTargetDate
    ? (typeof explicitTargetDate === 'string' && !isNaN(new Date(explicitTargetDate).getTime())
        ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(explicitTargetDate))
        : String(explicitTargetDate).trim())
    : (isIssuing ? ist.tomorrow : ist.today);

  const activeDateLabel = isIssuing ? t.tomorrowDarshanLabel : t.today;
  const activeTokenDate = canonicalTargetDate;

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
    ? t.tokensSuspendedNote(canonicalTargetDate)
    : isIssuing
    ? t.tokensIssuingNote(canonicalTargetDate)
    : isPaused
    ? t.tokensPausedNote(canonicalTargetDate)
    : t.tokensIssuedNote(canonicalTargetDate);

  return (
    <>
    <div
      onClick={() => router.push('/ssd-tokens')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push('/ssd-tokens'); }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #D5ECD8',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(10, 78, 51, 0.06)',
        margin: '0px 12px 12px',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ═══════════════════════════════════════════════════
          1. SACRED GREEN HEADER (Clean, Bespoke Human-Crafted)
          ═══════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)',
        color: '#FFFFFF',
        padding: '16px 16px 18px',
        overflow: 'hidden'
      }}>
        {/* Soft Organic Ambient Radial Glows */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '10%',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Header Content */}
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
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95), rgba(4, 120, 87, 0.85))',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 2px 8px rgba(0, 0, 0, 0.18)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Ticket size={19} strokeWidth={2.4} />
            </div>
            <div>
              <h3 
                className="notranslate"
                translate="no"
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-sans), system-ui, sans-serif'
                }}
              >
                {t.ssdDdStatus}
              </h3>
              <span 
                className="notranslate"
                translate="no"
                style={{
                  fontSize: '11px',
                  color: 'rgba(209, 250, 229, 0.82)',
                  fontWeight: 500,
                  marginTop: '2px',
                  display: 'block',
                  letterSpacing: '0.01em'
                }}
              >
                {t.sarvaTokensSub}
              </span>
            </div>
          </div>

          {/* Bespoke Hand-crafted Status Badge with High-Contrast Editorial Styling */}
          <div 
            className="notranslate"
            translate="no"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '9999px',
              backgroundColor: isCompleted ? 'rgba(159, 18, 57, 0.28)' : 'rgba(6, 78, 59, 0.35)',
              border: isCompleted ? '1px solid rgba(251, 113, 133, 0.5)' : '1px solid rgba(52, 211, 153, 0.5)',
              color: isCompleted ? '#FFE4E6' : '#ECFDF5',
              fontSize: '11.5px',
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: isCompleted ? '0 2px 8px rgba(159, 18, 57, 0.2)' : '0 2px 8px rgba(6, 78, 59, 0.2)',
              flexShrink: 0
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isCompleted ? '#FB7185' : '#34D399',
              boxShadow: isCompleted ? '0 0 8px #FB7185' : '0 0 8px #34D399'
            }} />
            <span>{headerBadgeText}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          WHITE CARD BODY
          ═══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '14px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Updated Timestamp Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 9px',
          borderRadius: '9999px',
          backgroundColor: '#F1F5F9',
          color: '#475569',
          fontSize: '10.5px',
          fontWeight: 600,
          alignSelf: 'flex-start'
        }}>
          <Clock size={11} strokeWidth={2.4} color="#64748B" />
          <span>{t.updated}: {ist.updatedDisplay}</span>
        </div>

        {/* ── CARD 1: TODAY'S DATE & QUOTA STATUS ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
          border: '1px solid #FEE2E2',
          borderRadius: '16px',
          padding: '11px 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '9px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={15} strokeWidth={2.3} />
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E293B' }}>
                {activeDateLabel} • {activeTokenDate}
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2.5px 8px',
              borderRadius: '9999px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '10px',
              fontWeight: 800,
              border: '1px solid #FECACA'
            }}>
              {todayStatusText}
            </div>
          </div>

          <p style={{
            fontSize: '11px',
            color: '#7F1D1D',
            fontWeight: 500,
            margin: '7px 0 0 0',
            lineHeight: 1.4
          }}>
            {todayNoteText}
          </p>
        </div>

      {/* ═══════════════════════════════════════════════════
          3. SEPARATE SSD & DD TOKEN CARDS WITH TIMELINE
          ═══════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '8px',
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
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FBF6 100%)',
            border: '1px solid #D5ECD8',
            borderRadius: '16px',
            padding: '11px 10px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            boxShadow: '0 1px 4px rgba(10, 78, 51, 0.03)'
          }}
        >
          {/* Top Row: Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TempleIcon color="#15803D" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                {t.ssdTokens}
              </h4>
              <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.slottedSarvaDarshan}
              </span>
            </div>
          </div>

          {/* Quota Number: [Left] / [Total] */}
          <div style={{ margin: '3px 0 5px 0', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>
              {ssdLeftCount}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              / {formatQuotaNumber(ssdTotalCount, '10,000')}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '9.5px',
              fontWeight: 800,
              color: isSsdCompleted ? '#991B1B' : '#15803D',
              backgroundColor: isSsdCompleted ? '#FEE2E2' : '#DCFCE7',
              padding: '2px 7px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: `1px solid ${isSsdCompleted ? '#FECACA' : '#BBF7D0'}`
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: isSsdCompleted ? '#DC2626' : '#16A34A'
              }} />
              {isSsdIssuing ? t.issuingBadge : isSsdPaused ? t.pausedBadge : t.completed}
            </span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '2px 0 6px 0' }} />

          {/* Vertical Timeline */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {/* Timeline Item 1: Started at */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <div style={{
                width: '13px',
                height: '13px',
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
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                  {t.startedAt}
                </span>
                <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: 800, display: 'block', marginTop: '1px', lineHeight: 1.25 }}>
                  {formatDisplayDateTime(ssdStartDisplay)}
                </span>
              </div>
            </div>

            {/* Timeline Item 2: Quota completed at / Status */}
            {!isSsdIssuing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '2.5px',
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Square size={6} fill="#DC2626" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                    {ssdRow2Title}
                  </span>
                  <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: 800, display: 'block', marginTop: '1px', lineHeight: 1.25 }}>
                    {formatDisplayDateTime(ssdRow2Value)}
                  </span>
                </div>
              </div>
            )}
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
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
            border: '1px solid #FEF3C7',
            borderRadius: '16px',
            padding: '11px 10px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            boxShadow: '0 1px 4px rgba(217, 119, 6, 0.03)'
          }}
        >
          {/* Top Row: Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TempleIcon color="#D97706" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                {t.ddTokens}
              </h4>
              <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.divyaDarshanFootpath}
              </span>
            </div>
          </div>

          {/* Quota Number: [Left] / [Total] */}
          <div style={{ margin: '3px 0 5px 0', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>
              {ddLeftCount}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              / {formatQuotaNumber(ddTotalCount, '2,000')}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '9.5px',
              fontWeight: 800,
              color: isDdNowCompleted ? '#991B1B' : '#15803D',
              backgroundColor: isDdNowCompleted ? '#FEE2E2' : '#DCFCE7',
              padding: '2px 7px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: `1px solid ${isDdNowCompleted ? '#FECACA' : '#BBF7D0'}`
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: isDdNowCompleted ? '#DC2626' : '#16A34A'
              }} />
              {isDdNowIssuing ? t.issuingBadge : isDdNowPaused ? t.pausedBadge : t.completed}
            </span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '2px 0 6px 0' }} />

          {/* Vertical Timeline */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {/* Timeline Item 1: Started at */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <div style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                backgroundColor: ddRawStart ? '#DCFCE7' : '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ddRawStart ? '#16A34A' : '#64748B',
                flexShrink: 0,
                marginTop: '1px'
              }}>
                <Play size={7} fill="#16A34A" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                  {t.startedAt}
                </span>
                <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: 800, display: 'block', marginTop: '1px', lineHeight: 1.25 }}>
                  {formatDisplayDateTime(ddStartDisplay)}
                </span>
              </div>
            </div>

            {/* Timeline Item 2: Quota completed at / Status */}
            {!isDdNowIssuing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                <div style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '2.5px',
                  backgroundColor: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Square size={6} fill="#DC2626" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                    {ddRow2Title}
                  </span>
                  <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: 800, display: 'block', marginTop: '1px', lineHeight: 1.25 }}>
                    {formatDisplayDateTime(ddRow2Value)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          4. NEXT EXPECTED RELEASE (Card with Deep Green Button)
          ═══════════════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '11px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={16} strokeWidth={2.4} />
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>
              {nextReleaseTitle}
            </span>
            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px', display: 'block' }}>
              {nextReleaseDateLabel || `${ist.tomorrow} (${t.tomorrow})`}
            </span>
          </div>
        </div>

        <div style={{
          background: '#064E3B',
          color: '#FFFFFF',
          borderRadius: '9999px',
          padding: '6px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11.5px',
          fontWeight: 800,
          boxShadow: '0 2px 6px rgba(6, 78, 59, 0.2)',
          flexShrink: 0
        }}>
          <Bell size={12} strokeWidth={2.5} />
          <span>{nextReleaseDisplay !== t.notAnnouncedYet ? nextReleaseDisplay : '5:30 PM'}</span>
          <ChevronRight size={12} strokeWidth={2.5} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          5. GUIDANCE CARD
          ═══════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #F0FDF4 0%, #E8F8ED 100%)',
        border: '1px solid #BBF7D0',
        borderRadius: '16px',
        padding: '11px 12px',
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
          color: '#15803D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px'
        }}>
          <Lightbulb size={15} strokeWidth={2.3} />
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#14532D', display: 'block', lineHeight: 1.3 }}>
            {guidanceTitle}
          </span>
          <span style={{ fontSize: '10.5px', color: '#166534', display: 'block', marginTop: '2px', lineHeight: 1.35, fontWeight: 500 }}>
            {guidanceSubtitle}
          </span>
        </div>
      </div>

      </div>
    </div>

    {/* ═══════════════════════════════════════════════════
        CARD 2: COLLECTION CENTRES (SACRED GREEN HEADER)
        ═══════════════════════════════════════════════════ */}
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #D5ECD8',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(10, 78, 51, 0.06)',
        margin: '0px 12px 10px',
        fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* 1. Sacred Green Header (Clean, Bespoke Human-Crafted) */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)',
        color: '#FFFFFF',
        padding: '15px 16px',
        overflow: 'hidden'
      }}>
        {/* Soft Organic Ambient Radial Glow */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Header Left: Tactile Squircle Icon & Titles */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95), rgba(4, 120, 87, 0.85))',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 2px 8px rgba(0, 0, 0, 0.18)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            color: '#A7F3D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={18} color="#A7F3D0" strokeWidth={2.4} />
          </div>
          <div>
            <h3 
              className="notranslate"
              translate="no"
              style={{
                fontSize: '15.5px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.015em',
                lineHeight: 1.2
              }}
            >
              {t.collectionCentres}
            </h3>
            <p 
              className="notranslate"
              translate="no"
              style={{
                fontSize: '11px',
                color: 'rgba(209, 250, 229, 0.82)',
                margin: '2px 0 0 0',
                fontWeight: 500
              }}
            >
              {t.collectionLocations}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Three Hub Cards in Scrollable Track */}
      <div style={{ padding: '12px 10px 14px', position: 'relative' }}>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '8px',
          paddingRight: '12px',
          paddingBottom: '2px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {/* 1. Vishnu Nivasam */}
          <div style={{
            flex: '1 0 calc(33.333% - 6px)',
            minWidth: '102px',
            scrollSnapAlign: 'start',
            background: 'linear-gradient(180deg, #FFFFFF 55%, #F0F7FF 100%)',
            border: '1px solid #DBEAFE',
            borderRadius: '16px',
            padding: '10px 6px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <Train size={14} color="#2563EB" strokeWidth={2.4} />
            </div>
            <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0 4px', overflow: 'hidden' }}>
              <img
                src="/images/places/hub_vishnu_nivasam.png?v=2"
                alt="Vishnu Nivasam Complex"
                style={{ maxHeight: '100%', maxWidth: '95%', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <span 
              className="notranslate"
              translate="no"
              style={{ 
                fontSize: '12.5px', 
                fontWeight: 700, 
                color: '#0F172A', 
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              {t.vishnuNivasam}
            </span>
            <div 
              className="notranslate"
              translate="no"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '3px', 
                fontSize: '10px', 
                color: '#64748B', 
                fontWeight: 500, 
                margin: '3px 0 8px',
                minHeight: '18px',
                width: '100%',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              <MapPin size={10} color="#64748B" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.oppRailway}
              </span>
            </div>
            <a
              href="https://www.google.com/maps/place/Vishnu+Nivasam/@13.6292776,79.4215889,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate"
              translate="no"
              style={{
                width: '100%',
                padding: '6px 4px',
                background: '#0F5132',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.18)',
                boxSizing: 'border-box'
              }}
            >
              <span>{t.navigate}</span>
              <ChevronRight size={12} strokeWidth={2.6} />
            </a>
          </div>

          {/* 2. Srinivasam */}
          <div style={{
            flex: '1 0 calc(33.333% - 6px)',
            minWidth: '102px',
            scrollSnapAlign: 'start',
            background: 'linear-gradient(180deg, #FFFFFF 55%, #F0FDF4 100%)',
            border: '1px solid #DCFCE7',
            borderRadius: '16px',
            padding: '10px 6px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(22, 101, 52, 0.04)',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#F0FDF4',
              border: '1px solid #DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <Bus size={14} color="#16A34A" strokeWidth={2.4} />
            </div>
            <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0 4px', overflow: 'hidden' }}>
              <img
                src="/images/places/hub_srinivasam.png?v=2"
                alt="Srinivasam Complex"
                style={{ maxHeight: '100%', maxWidth: '95%', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <span 
              className="notranslate"
              translate="no"
              style={{ 
                fontSize: '12.5px', 
                fontWeight: 700, 
                color: '#0F172A', 
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              {t.srinivasam}
            </span>
            <div 
              className="notranslate"
              translate="no"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '3px', 
                fontSize: '10px', 
                color: '#64748B', 
                fontWeight: 500, 
                margin: '3px 0 8px',
                minHeight: '18px',
                width: '100%',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              <MapPin size={10} color="#64748B" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.oppBusStand}
              </span>
            </div>
            <a
              href="https://www.google.com/maps/place/Srinivasam/@13.6315627,79.4288389,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate"
              translate="no"
              style={{
                width: '100%',
                padding: '6px 4px',
                background: '#0F5132',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.18)',
                boxSizing: 'border-box'
              }}
            >
              <span>{t.navigate}</span>
              <ChevronRight size={12} strokeWidth={2.6} />
            </a>
          </div>

          {/* 3. Bhudevi Complex */}
          <div style={{
            flex: '1 0 calc(33.333% - 6px)',
            minWidth: '102px',
            scrollSnapAlign: 'start',
            background: 'linear-gradient(180deg, #FFFFFF 55%, #FFFBEB 100%)',
            border: '1px solid #FEF3C7',
            borderRadius: '16px',
            padding: '10px 6px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#FFFBEB',
              border: '1px solid #FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <Mountain size={14} color="#D97706" strokeWidth={2.4} />
            </div>
            <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0 4px', overflow: 'hidden' }}>
              <img
                src="/images/places/hub_bhudevi.png?v=2"
                alt="Bhudevi Complex"
                style={{ maxHeight: '100%', maxWidth: '95%', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <span 
              className="notranslate"
              translate="no"
              style={{ 
                fontSize: '12.5px', 
                fontWeight: 700, 
                color: '#0F172A', 
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              {t.bhudevi}
            </span>
            <div 
              className="notranslate"
              translate="no"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '3px', 
                fontSize: '10px', 
                color: '#64748B', 
                fontWeight: 500, 
                margin: '3px 0 8px',
                minHeight: '18px',
                width: '100%',
                fontFamily: 'var(--font-sans), system-ui, sans-serif'
              }}
            >
              <MapPin size={10} color="#64748B" strokeWidth={2.2} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.nearAlipiri}
              </span>
            </div>
            <a
              href="https://www.google.com/maps/place/Tirupati+Temple+Ticket+Booking/@13.6472334,79.4096899,18z"
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate"
              translate="no"
              style={{
                width: '100%',
                padding: '6px 4px',
                background: '#0F5132',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.01em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.18)',
                boxSizing: 'border-box'
              }}
            >
              <span>{t.navigate}</span>
              <ChevronRight size={12} strokeWidth={2.6} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

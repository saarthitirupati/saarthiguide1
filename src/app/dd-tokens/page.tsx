'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Ticket, Clock, ShieldAlert, CheckCircle2, 
  MapPin, Mountain, Footprints, RefreshCw, Share2, Check, 
  ExternalLink, Sparkles, ChevronRight, Navigation, 
  Luggage, ShieldCheck, Play, Lightbulb, AlertTriangle, Zap
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';

interface DdCollectionCentre {
  id: string;
  nameEn: string;
  nameTe: string;
  pathwayEn: string;
  pathwayTe: string;
  badgeEn: string;
  badgeTe: string;
  targetAudienceEn: string;
  targetAudienceTe: string;
  stepsCount: string;
  distance: string;
  duration: string;
  counterHours: string;
  descriptionEn: string;
  descriptionTe: string;
  mapsUrl: string;
}

interface DdLocalizedCounter {
  id: string;
  names: Record<string, string>;
  pathways: Record<string, string>;
  badges: Record<string, string>;
  targetAudiences: Record<string, string>;
  stepsCount: string;
  distance: string;
  duration: string;
  counterHours: string;
  descriptions: Record<string, string>;
  mapsUrl: string;
}

const DD_COUNTERS: DdLocalizedCounter[] = [
  {
    id: 'srivari-mettu',
    names: {
      en: 'Srivari Mettu Footpath Counter',
      te: 'శ్రీవారి మెట్టు నడకదారి కౌంటర్',
      kn: 'ಶ್ರೀವಾರಿ ಮೆಟ್ಟು ಕಾಲ್ನಡಿಗೆ ಕೌಂಟರ್',
      ta: 'ஸ்ரீவாரி மெட்டு நடைபாதை கவுண்டர்',
      hi: 'श्रीवारी मेट्टू पैदल मार्ग काउंटर'
    },
    pathways: {
      en: 'Srivari Mettu Trail (via Srinivasa Mangapuram)',
      te: 'శ్రీనివాస మంగాపురం మీదుగా శ్రీవారి మెట్టు మార్గం',
      kn: 'ಶ್ರೀನಿವಾಸ ಮಂಗಾಪುರಂ ಮಾರ್ಗವಾಗಿ ಶ್ರೀವಾರಿ ಮೆಟ್ಟು',
      ta: 'சீனிவாச மங்காபுரம் வழியாக ஸ்ரீவாரி மெட்டு பாதை',
      hi: 'श्रीनिवास मंगपुरम होते हुए श्रीवारी मेट्टू मार्ग'
    },
    badges: {
      en: 'Best for Speed • Fastest Ascent',
      te: 'వేగవంతమైన మార్గం • తక్కువ సమయం',
      kn: 'ವೇಗದ ಮಾರ್ಗ • ಕಡಿಮೆ ಸಮಯ',
      ta: 'விரைவான பாதை • குறைந்த நேரம்',
      hi: 'सबसे तेज़ मार्ग • कम समय'
    },
    targetAudiences: {
      en: 'Short & steep • Ideal for fit pilgrims (~2 hrs)',
      te: 'నిటారైన మెట్లు • త్వరగా చేరుకోవాలనుకునే భక్తులకు అనుకూలం',
      kn: 'ಕಡಿದಾದ ಮೆಟ್ಟಿಲುಗಳು • ಶೀಘ್ರವಾಗಿ ತಲುಪಲು ಸೂಕ್ತ (~2 ಗಂಟೆ)',
      ta: 'செங்குத்தான படிகள் • விரைவாக செல்ல விரும்புவோருக்கு ஏற்றது (~2 மணி)',
      hi: 'खड़ी सीढ़ियां • जल्दी पहुंचने के इच्छुक भक्तों के लिए उपयुक्त (~2 घंटे)'
    },
    stepsCount: '2,388 Steps',
    distance: '2.1 km',
    duration: '1.5 – 2.5 Hours',
    counterHours: 'Opens 6:00 AM daily (or evening release)',
    descriptions: {
      en: 'Shortest and steepest historic trail. Tokens issued at the 1,200th step checkpoint. Highest quota allocation.',
      te: 'అతి తక్కువ దూరం (2.1 కి.మీ). 1,200వ మెట్టు వద్ద బయోమెట్రిక్ కౌంటర్ ఉంటుంది.',
      kn: 'ಅತ್ಯಂತ ಕಡಿಮೆ ದೂರ (2.1 ಕಿ.ಮೀ). 1,200ನೇ ಮೆಟ್ಟಿಲಿನಲ್ಲಿ ಬಯೋಮೆಟ್ರಿಕ್ ಕೌಂಟರ್ ಇರುತ್ತದೆ.',
      ta: 'மிகக் குறைந்த தூரம் (2.1 கி.மீ). 1,200வது படியில் பயோமெட்ரிக் கவுண்டர் உள்ளது.',
      hi: 'सबसे छोटी दूरी (2.1 किमी)। 1,200वीं सीढ़ी पर बायोमेट्रिक काउंटर स्थित है।'
    },
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6264,79.3242'
  },
  {
    id: 'alipiri-mettu',
    names: {
      en: 'Alipiri Mettu (Galigopuram Counter)',
      te: 'అలిపిరి మెట్టు (గాలిగోపురం కౌంటర్)',
      kn: 'ಅಲಿಪಿರಿ ಮೆಟ್ಟು (ಗಾಳಿಗೋಪುರ ಕೌಂಟರ್)',
      ta: 'அலிபிரி மெட்டு (காளிகோபுரம் கவுண்டர்)',
      hi: 'अलिपिरी मेट्टू (गालीगोपुरम काउंटर)'
    },
    pathways: {
      en: 'Alipiri Mettu Footpath (Tirupati Base to Tirumala)',
      te: 'అలిపిరి మెట్ల మార్గం (తిరుపతి నుండి తిరుమల)',
      kn: 'ಅಲಿಪಿರಿ ಮೆಟ್ಟಿಲುಗಳ ಮಾರ್ಗ (ತಿರುಪತಿಯಿಂದ ತಿರುಮಲ)',
      ta: 'அலிபிரி நடைபாதை (திருப்பதி அடிவாரம் முதல் திருமலை வரை)',
      hi: 'अलिपिरी पैदल मार्ग (तिरुपति तलहटी से तिरुमाला)'
    },
    badges: {
      en: 'Best Amenities • Covered & 24/7 Lit',
      te: 'పూర్తి సౌకర్యాలు • రక్షణ, షెడ్లు & వెలుతురు',
      kn: 'ಉತ್ತಮ ಸೌಲಭ್ಯಗಳು • ಆಶ್ರಯ ಛಾವಣಿ & 24/7 ಬೆಳಕು',
      ta: 'சிறந்த வசதிகள் • மேற்கூரை & 24/7 விளக்குகள்',
      hi: 'पूर्ण सुविधाएं • ढका हुआ मार्ग व 24/7 रोशनी'
    },
    targetAudiences: {
      en: 'Covered path, drinking water & medical stations • Ideal for families & night treks',
      te: 'పూర్తిగా షెడ్లు, ఉచిత తాగునీరు & వైద్య కేంద్రాలు • కుటుంబాలు, రాత్రి నడకకు అనుకూలం',
      kn: 'ಸಂಪೂರ್ಣ ಛಾವಣಿ, ಕುಡಿಯುವ ನೀರು & ವೈದ್ಯಕೀಯ ಕೇಂದ್ರಗಳು • ಕುಟುಂಬಗಳಿಗೆ ಸೂಕ್ತ',
      ta: 'மேற்கூரை, குடிநீர் & மருத்துவ வசதிகள் • குடும்பங்கள் மற்றும் இரவு பயணத்திற்கு ஏற்றது',
      hi: 'ढका मार्ग, पीने का पानी व चिकित्सा केंद्र • परिवारों व रात्रि यात्रा के लिए उत्तम'
    },
    stepsCount: '3,550 Steps',
    distance: '9.0 km',
    duration: '3.5 – 5.0 Hours',
    counterHours: 'Open 3:00 AM – 10:00 PM for trekking',
    descriptions: {
      en: 'Historic covered pathway with night lighting, continuous drinking water, and medical support. Biometric token verification at Galigopuram (Step ~2,083).',
      te: 'చారిత్రాత్మక మార్గం. 24 గంటల భద్రత, ఉచిత తాగునీరు. గాలిగోపురం వద్ద తనిఖీ మరియు టోకెన్ ధృవీకరణ.',
      kn: 'ಐತಿಹಾಸಿಕ ಮಾರ್ಗ. 24 ಗಂಟೆಗಳ ಬೆಳಕು, ಕುಡಿಯುವ ನೀರು. ಗಾಳಿಗೋಪುರದಲ್ಲಿ ಟೋಕನ್ ಪರಿಶೀಲನೆ.',
      ta: 'வரலாற்றுச் சிறப்புமிக்க பாதை. இரவு விளக்குகள், குடிநீர் மற்றும் மருத்துவ வசதிகள். காளிகோபுரத்தில் டோக்கன் சரிபார்ப்பு.',
      hi: 'ऐतिहासिक ढका हुआ मार्ग। रात की रोशनी, निरंतर पेयजल व चिकित्सा सुविधा। गालीगोपुरम पर टोकन सत्यापन।'
    },
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6548,79.3976'
  }
];

const DD_TEXTS = {
  en: {
    headerTitle: 'DD Tokens (Divya Darshan) • Live Status',
    tokensCardTitle: 'Divya Darshan (DD) Tokens',
    trekQuotaBadge: 'Footpath Trek Quota',
    issuingNow: 'Issuing Now',
    completed: 'Completed',
    started: 'Issuing Started',
    quotaCompleted: 'Quota Completed',
    nextReleaseTitle: 'Next Expected Token Release',
    advisoryCompletedTitle: 'DD Quota Completed: You can still trek!',
    advisoryActiveTitle: 'Trekking with Divya Darshan Token',
    advisoryPillFree: '100% Free Walk-in Open',
    advisoryDescCompleted: 'Even when DD tokens are filled, Sarva Darshan queues are 100% open for all footpath pilgrims. You will simply report directly to the VQC complex.',
    advisoryDescActive: 'Collect your token at Galigopuram (Alipiri) or 1,200th step (Srivari Mettu). Keep your token safe for fast-track entry at Tirumala.',
    ssdAltPrompt: 'Prefer a timed slot token from city counters?',
    ssdAltBtn: 'View Sarva Darshan (SSD) Alternative',
    countersHeader: 'DD Footpath Counters & Trail Checkpoints',
    rulesHeader: 'Mandatory Rules for Divya Darshan',
    strictRuleBadge: 'Biometric Enforced',
    gateRuleBadge: 'Strict Gate Rule',
    bioBlockBadge: 'Biometric Block',
    r1Title: 'Original Physical Aadhaar Card Mandatory',
    r1Desc: 'Every individual pilgrim (including children 5+ years) MUST carry their original physical Aadhaar card. Digital photocopies or phone images are strictly rejected at the biometric checkpoint.',
    r2Title: '30-Day Biometric Limitation',
    r2Desc: 'A pilgrim is eligible for a Divya Darshan token only once every 30 days per Aadhaar. TTD biometric servers automatically flag and deny tokens if a darshan occurred within the past month.',
    r3Title: 'Physical Climb Verification',
    r3Desc: 'Tokens are verified midway and stamped/scanned again near the hilltop to ensure genuine completion of the footpath climb.',
    r4Title: 'Free Luggage Transit Service',
    r4Desc: 'Hand over baggage at Alipiri or Srivari Mettu base luggage counter for free transit to Tirumala PAC centers.',
    r5Title: 'Traditional Dress Code at VQC',
    r5Desc: 'Traditional attire (Dhoti/Kurta for men, Saree/Chudidar with dupatta for women) is strictly mandatory for temple entry.',
    roadmapTitle: 'Divya Darshan Trek & Entry Roadmap',
    steps: [
      { step: 1, title: 'Deposit Luggage & Begin Climb', desc: 'Hand over baggage at Alipiri or Srivari Mettu base luggage counter for free transit to Tirumala.' },
      { step: 2, title: 'Biometric Scan at Intermediate Checkpoint', desc: 'Scan Aadhaar, take facial photo, and collect printed token slip along the pathway.' },
      { step: 3, title: 'Reach Tirumala Hilltop & Refresh', desc: 'Arrive at Tirumala, collect deposited luggage at PAC centers, and refresh with hot water bath.' },
      { step: 4, title: 'Wear Traditional Dress & Report to VQC', desc: 'Change into approved traditional attire and report at the designated Divya Darshan queue line.' },
      { step: 5, title: 'Fast-Track Darshan & Free Prasadam', desc: 'Pass through holding compartments to sanctum sanctorum for Srivari Darshan and receive free blessed Laddu.' }
    ],
    ssdTokensLink: '{t.ssdTokensLink}',
    footpathsLink: '{t.footpathsLink}'
  },
  te: {
    headerTitle: 'దివ్య దర్శనం (DD) టోకెన్ సమాచారం',
    tokensCardTitle: 'దివ్య దర్శనం టోకెన్లు (నడకదారి)',
    trekQuotaBadge: 'మెట్ల మార్గం కోటా',
    issuingNow: 'జారీ అవుతున్నాయి',
    completed: 'పూర్తయింది',
    started: 'జారీ ప్రారంభం',
    quotaCompleted: 'కోటా పూర్తయిన సమయం',
    nextReleaseTitle: 'మరుసటి రోజు టోకెన్ జారీ సమయం',
    advisoryCompletedTitle: 'నేటి డిడి టోకెన్లు పూర్తయినా దర్శనం ఎలా?',
    advisoryActiveTitle: 'దివ్య దర్శనం పొందడానికి సలహా',
    advisoryPillFree: 'ఉచిత ప్రవేశం అందుబాటులో ఉంది',
    advisoryDescCompleted: 'డిడి టోకెన్లు పూర్తయినా నడకదారి భక్తులకు సర్వదర్శనం ఎల్లప్పుడూ తెరిచి ఉంటుంది. కొండపైకి చేరుకుని నేరుగా వైకుಂಠం క్యూ కాంప్లెక్స్ ద్వారా దర్శనానికి వెళ్ళవచ్చు.',
    advisoryDescActive: 'గాలిగోపురం (అలిపిరి) లేదా 1,200వ మెట్టు (శ్రీవారి మెట్టు) వద్ద టోకెన్ పొందండి. తిరుమలలో వేగవంతమైన దర్శనం కోసం టోకెన్ భద్రపరుచుకోండి.',
    ssdAltPrompt: 'తిరుపతిలోని ఇతర కౌంటర్ల వద్ద సర్వదర్శనం టోకెన్లు లభిస్తాయి:',
    ssdAltBtn: 'సర్వ దర్శనం (SSD) ప్రత్యామ్నాయం చూడండి',
    countersHeader: 'దివ్య దర్శనం కౌంటర్లు & నడకమార్గాలు',
    rulesHeader: 'దివ్య దర్శనం నియమాలు',
    strictRuleBadge: 'కఠిన తనిఖీ',
    gateRuleBadge: 'గేట్ రూల్',
    bioBlockBadge: 'ఆటోమేటిక్ తిరస్కరణ',
    r1Title: 'ఒరిజినల్ భౌతిక ఆధార్ కార్డు తప్పనిసరి',
    r1Desc: 'ప్రతి ఒక్క భక్తుడు (5 ఏళ్లు పైబడిన పిల్లలతో సహా) తమ అసలు ఆధార్ కార్డును తప్పనిసರಿగా వెంట ఉంచుకోవాలి. మొబైల్ ఫోన్ లేదా ఫోటోకాపీలు అంగీకరించబడవు.',
    r2Title: '30 రోజుల బయోమెట్రిక్ పరిమితి',
    r2Desc: 'ఒక ఆధార్ కార్డుపై 30 రోజుల్లో ఒక్కసారి మాత్రమే దివ్య దర్శనం టోకెన్ లభిస్తుంది. సర్వర్లలో నమోదు చేయబడిన వివరాల ఆధారంగా తనిಖీ జరుగుతుంది.',
    r3Title: 'నడకదారి ధృవీకరణ',
    r3Desc: 'నడక మార్గంలో మధ్యలో మరియు పైకి చేరుకున్న తర్వాత టోకెన్ స్కానిಂಗ್ ద్వారా నిజమైన నడకదారి భక్తులను ధృవీకరిస్తారు.',
    r4Title: 'ఉచిత లగేజ్ రవాణా సదుపాయం',
    r4Desc: 'అలిపిరి లేదా శ్రీవారి మెట్టు వద్ద భక్తుల లగేజ్ ఉచితంగా తిరుమల పిಎసి కేంద్రాలకు రవాణా చేయబడుతుంది.',
    r5Title: 'సంప్రదాయ వస్త్రధారణ నిబంధన',
    r5Desc: 'పురుషులు ధోవతి/కుర్తా, స్త్రీలు చీర లేదా చుడీదార్ దుపట్టాతో సంప్రదాయ వస్త్రాలు మాత్రమే ధరించాలి.',
    roadmapTitle: 'దివ్య దర్శనం ప్రయాణ విధానం',
    steps: [
      { step: 1, title: 'లగేజ్ డిపాజిట్ & నడక ప్రారంభం', desc: 'అలిపిరి లేదా శ్రీవారి మెట్టు వద్ద ఉచిత లగేజ్ కౌంటర్‌లో మీ బ్యాగులు అప్పగించి నడక ప్రారంభించండి.' },
      { step: 2, title: 'మధ్యలో బయోమెట్రిక్ స్కాన్', desc: 'మార్గంలో ఆధార్ కార్డు స్కాన్ చేసి, లైవ్ ఫోటోతో ప్రింటెడ్ టోకెన్ స్లిప్ పొందండి.' },
      { step: 3, title: 'తిరుమల చేరడం & విశ్రాంతి', desc: 'కొండపైకి చేరుకుని, పీఏసీ కేంద్రాలలో మీ లగేజ్ తీసుకుని వేడినీటి స్నಾನంతో సేదతీరండి.' },
      { step: 4, title: 'సంప్రదాయ వస్త్రధారణ & విక్యూసి రిపోర్టింగ్', desc: 'నియమిత సంప్రదాయ దుస్తులు ధరించి దివ్యదర్శనం ప్రత్యేక క్యూ లైనుకు చేరుకోండి.' },
      { step: 5, title: 'శ్రీవారి దర్శనం & లడ్డూ ప్రసాదం', desc: 'కంపార్ట్‌మెంట్ల ద్వారా ఆనంద నిలయంలో శ్రీవారి దివ్య దర్శనం మరియు ఉచిత లడ్డూ ప్రసాదం పొందండి.' }
    ],
    ssdTokensLink: 'SSD టోకెన్లు (10K/రోజు) →',
    footpathsLink: 'నడకదారి సమయాలు & గైడ్ →'
  },
  kn: {
    headerTitle: 'ದಿವ್ಯ ದರ್ಶನ (DD) ಟೋಕನ್ ಲೈವ್ ಮಾಹಿತಿ',
    tokensCardTitle: 'ದಿವ್ಯ ದರ್ಶನ ಟೋಕನ್‌ಗಳು (ಕಾಲ್ನಡಿಗೆ)',
    trekQuotaBadge: 'ಮೆಟ್ಟಿಲು ಮಾರ್ಗದ ಕೋಟಾ',
    issuingNow: 'ವಿತರಿಸಲಾಗುತ್ತಿದೆ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    started: 'ವಿತರಣೆ ಪ್ರಾರಂಭ',
    quotaCompleted: 'ಕೋಟಾ ಮುಕ್ತಾಯವಾದ ಸಮಯ',
    nextReleaseTitle: 'ಮುಂದಿನ ದಿನದ ಟೋಕನ್ ಬಿಡುಗಡೆ ಸಮಯ',
    advisoryCompletedTitle: 'DD ಟೋಕನ್ ಮುಗಿದಿದ್ದರೂ ಕಾಲ್ನಡಿಗೆ ದರ್ಶನ ಸಾಧ್ಯ!',
    advisoryActiveTitle: 'ದಿವ್ಯ ದರ್ಶನ ಪಡೆಯಲು ಸಲಹೆ',
    advisoryPillFree: 'ಉಚಿತ ಪ್ರವೇಶ ಲಭ್ಯವಿದೆ',
    advisoryDescCompleted: 'DD ಟೋಕನ್ ಮುಗಿದಿದ್ದರೂ ಕಾಲ್ನಡಿಗೆ ಯಾತ್ರಿಕರಿಗೆ ಸರ್ವದರ್ಶನ ಮುಕ್ತವಾಗಿರುತ್ತದೆ. ನೀವು ನೇರವಾಗಿ ತಿರುಮಲ VQC ಕಾಂಪ್ಲೆಕ್ಸ್‌ಗೆ ತೆರಳಬಹುದು.',
    advisoryDescActive: 'ಗಾಳಿಗೋಪುರ (ಅಲಿಪಿರಿ) ಅಥವಾ 1,200ನೇ ಮೆಟ್ಟಿಲಿನಲ್ಲಿ (ಶ್ರೀವಾರಿ ಮೆಟ್ಟು) ಟೋಕನ್ ಪಡೆಯಿರಿ. ತಿರುಮಲದಲ್ಲಿ ಶೀಘ್ರ ದರ್ಶನಕ್ಕಾಗಿ ಟೋಕನ್ ಜೋಪಾನವಾಗಿಡಿ.',
    ssdAltPrompt: 'ತಿರುಪತಿಯಲ್ಲಿ ಸಮಯ ನಿಗದಿತ ಟೋಕನ್ ಬಯಸುವಿರಾ?',
    ssdAltBtn: 'ಸರ್ವ ದರ್ಶನ (SSD) ಪರ್ಯಾಯ ನೋಡಿ',
    countersHeader: 'ದಿವ್ಯ ದರ್ಶನ ಕೌಂಟರ್‌ಗಳು & ಕಾಲ್ನಡಿಗೆ ಮಾರ್ಗಗಳು',
    rulesHeader: 'ದಿವ್ಯ ದರ್ಶನ ಕಡ್ಡಾಯ ನಿಯಮಗಳು',
    strictRuleBadge: 'ಕಠಿಣ ತಪಾಸಣೆ',
    gateRuleBadge: 'ಗೇಟ್ ನಿಯಮ',
    bioBlockBadge: 'ಸ್ವಯಂಚಾಲಿತ ತಿರಸ್ಕಾರ',
    r1Title: 'ಅಸಲಿ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್ ಕಡ್ಡಾಯ',
    r1Desc: 'ಪ್ರತಿಯೊಬ್ಬ ಭಕ್ತರೂ (5 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಮಕ್ಕಳು ಸೇರಿದಂತೆ) ಅಸಲಿ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್ ತರಬೇಕು. ಮೊಬೈಲ್ ಫೋಟೋ ಮಾನ್ಯವಲ್ಲ.',
    r2Title: '30 ದಿನಗಳ ಮಿತಿ ನಿಯಮ',
    r2Desc: 'ಒಂದು ಆಧಾರ್ ಸಂಖ್ಯೆಗೆ 30 ದಿನಗಳಲ್ಲಿ ಒಮ್ಮೆ ಮಾತ್ರ ದಿವ್ಯ ದರ್ಶನ ಟೋಕನ್ ಪಡೆಯಲು ಸಾಧ್ಯ. TTD ಸರ್ವರ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.',
    r3Title: 'ಕಾಲ್ನಡಿಗೆ ದೃಢೀಕರಣ',
    r3Desc: 'ಮಾರ್ಗಮಧ್ಯದಲ್ಲಿ ಮತ್ತು ಬೆಟ್ಟದ ಮೇಲೆ ಟೋಕನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮೂಲಕ ನೈಜ ಕಾಲ್ನಡಿಗೆ ಯಾತ್ರಿಕರನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.',
    r4Title: 'ಉಚಿತ ಲಗೇಜ್ ಸಾರಿಗೆ ಸೌಲಭ್ಯ',
    r4Desc: 'ಅಲಿಪಿರಿ ಅಥವಾ ಶ್ರೀವಾರಿ ಮೆಟ್ಟು ಕೌಂಟರ್‌ನಲ್ಲಿ ಲಗೇಜ್ ನೀಡಿದರೆ ಅದನ್ನು ಉಚಿತವಾಗಿ ತಿರುಮಲ PAC ಕೇಂದ್ರಕ್ಕೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.',
    r5Title: 'ಸಂಪ್ರದಾಯಿಕ ಉಡುಪು ಕಡ್ಡಾಯ',
    r5Desc: 'ಪುರುಷರಿಗೆ ಧೋತಿ/ಕುರ್ತಾ, ಮಹಿಳೆಯರಿಗೆ ಸೀರೆ ಅಥವಾ ಚೂಡಿದಾರ್ ದುಪಟ್ಟಾದೊಂದಿಗೆ ಧರಿಸುವುದು ಕಡ್ಡಾಯ.',
    roadmapTitle: 'ದಿವ್ಯ ದರ್ಶನ ಪ್ರವಾಸ ಮಾರ್ಗಸೂಚಿ',
    steps: [
      { step: 1, title: 'ಲಗೇಜ್ ನೀಡಿ ನಡಿಗೆ ಪ್ರಾರಂಭಿಸಿ', desc: 'ಅಲಿಪಿರಿ ಅಥವಾ ಶ್ರೀವಾರಿ ಮೆಟ್ಟು ಕೌಂಟರ್‌ನಲ್ಲಿ ಉಚಿತವಾಗಿ ಲಗೇಜ್ ನೀಡಿ ಬೆಟ್ಟ ಹತ್ತಲು ಪ್ರಾರಂಭಿಸಿ.' },
      { step: 2, title: 'ಮಾರ್ಗಮಧ್ಯದಲ್ಲಿ ಬಯೋಮೆಟ್ರಿಕ್ ಸ್ಕ್ಯಾನ್', desc: 'ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಫೋಟೋ ನೀಡಿ ಮುದ್ರಿತ ಟೋಕನ್ ಸ್ಲಿಪ್ ಪಡೆಯಿರಿ.' },
      { step: 3, title: 'ತಿರುಮಲ ತಲುಪಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ', desc: 'ಬೆಟ್ಟದ ಮೇಲೆ ತಲುಪಿ, PAC ಕೇಂದ್ರದಲ್ಲಿ ಲಗೇಜ್ ಪಡೆದು ಬಿಸಿನೀರಿನ ಸ್ನಾನದೊಂದಿಗೆ ವಿಶ್ರಮಿಸಿ.' },
      { step: 4, title: 'ಸಂಪ್ರದಾಯಿಕ ಉಡುಪು ಧರಿಸಿ VQC ಗೆ ತೆರಳಿ', desc: 'ನಿಗದಿತ ಸಂಪ್ರದಾಯಿಕ ಉಡುಪಿನಲ್ಲಿ ದಿವ್ಯ ದರ್ಶನ ಸರತಿ ಸಾಲಿಗೆ ಹಾಜರಾಗಿ.' },
      { step: 5, title: 'ಶ್ರೀವಾರಿ ದರ್ಶನ ಮತ್ತು ಲಡ್ಡು ಪ್ರಸಾದ', desc: 'ಆನಂದ ನಿಲಯದಲ್ಲಿ ಶ್ರೀವಾರಿ ದರ್ಶನ ಪಡೆದು ಉಚಿತ ಲಡ್ಡು ಪ್ರಸಾದ ಸ್ವೀಕರಿಸಿ.' }
    ],
    ssdTokensLink: 'SSD ಟೋಕನ್‌ಗಳು (10K/ದಿನ) →',
    footpathsLink: 'ಮೆಟ್ಟಿಲು ಮಾರ್ಗದ ಸಮಯ & ವಿವರ →'
  },
  ta: {
    headerTitle: 'திவ்ய தர்சனம் (DD) டோக்கன் நேரலை நிலை',
    tokensCardTitle: 'திவ்ய தர்சன டோக்கன்கள் (நடைபாதை)',
    trekQuotaBadge: 'நடைபாதை ஒதுக்கீடு',
    issuingNow: 'வழங்கப்படுகிறது',
    completed: 'நிறைவடைந்தது',
    started: 'தொடங்கிய நேரம்',
    quotaCompleted: 'ஒதுக்கீடு முடிந்த நேரம்',
    nextReleaseTitle: 'அடுத்த நாள் டோக்கன் வெளியீட்டு நேரம்',
    advisoryCompletedTitle: 'DD டோக்கன் முடிந்தாலும் நடைபயணம் செய்யலாம்!',
    advisoryActiveTitle: 'திவ்ய தர்சனம் பெறுவதற்கான வழிகாட்டல்',
    advisoryPillFree: 'இலவச அனுமதி உள்ளது',
    advisoryDescCompleted: 'DD டோக்கன் முடிந்தாலும் நடைபாதை பக்தர்களுக்கு சர்வ தர்சனம் எப்போதும் திறந்திருக்கும். நேரடியாக VQC வரிசைக்கு செல்லலாம்.',
    advisoryDescActive: 'காளிகோபுரம் (அலிபிரி) அல்லது 1,200வது படியில் (ஸ்ரீவாரி மெட்டு) டோக்கன் பெறவும். விரைவு தர்சனத்திற்கு டோக்கனை பத்திரமாக வைக்கவும்.',
    ssdAltPrompt: 'திருப்பதி நகரில் நேரடி டோக்கன் பெற விரும்புகிறீர்களா?',
    ssdAltBtn: 'சர்வ தர்சனம் (SSD) மாற்று வழியைப் பார்க்கவும்',
    countersHeader: 'திவ்ய தர்சன கவுண்டர்கள் & நடைபாதைகள்',
    rulesHeader: 'திவ்ய தர்சன கட்டாய விதிகள்',
    strictRuleBadge: 'கட்டாய சோதனை',
    gateRuleBadge: 'நுழைவு விதி',
    bioBlockBadge: 'தானியங்கி நிராகரிப்பு',
    r1Title: 'அசல் ஆதார் அட்டை கட்டாயம்',
    r1Desc: 'ஒவ்வொரு பக்தரும் (5 வயதுக்கு மேற்பட்ட குழந்தைகள் உட்பட) அசல் ஆதார் அட்டை வைத்திருக்க வேண்டும். மொபைல் நகல் ஏற்கப்படாது.',
    r2Title: '30 நாட்கள் இடைவெளி விதி',
    r2Desc: 'ஒரு ஆதார் எண்ணுக்கு 30 நாட்களுக்கு ஒருமுறை மட்டுமே திவ்ய தர்சன டோக்கன் கிடைக்கும். TTD சர்வரில் சரிபார்க்கப்படும்.',
    r3Title: 'நடைபாதை சரிபார்ப்பு',
    r3Desc: 'பாதையின் நடுவிலும் மலை உச்சியிலும் டோக்கன் ஸ்கேன் செய்யப்பட்டு நடைபயண பக்தர்கள் உறுதி செய்யப்படுவர்.',
    r4Title: 'இலவச லக்கேஜ் சேவை',
    r4Desc: 'அலிபிரி அல்லது ஸ்ரீவாரி மெட்டு கவுண்டரில் லக்கேஜ் கொடுத்தால் திருமலை PAC மையத்திற்கு இலவசமாக கொண்டு செல்லப்படும்.',
    r5Title: 'பாரம்பரிய உடை கட்டாயம்',
    r5Desc: 'ஆண்களுக்கு வேஷ்டி/குர்தா, பெண்களுக்கு புடவை அல்லது துப்பட்டாவுடன் சுடிதார் கட்டாயம்.',
    roadmapTitle: 'திவ்ய தர்சன பயண வழிமுறைகள்',
    steps: [
      { step: 1, title: 'லக்கேஜ் கொடுத்து பயணத்தை தொடங்குதல்', desc: 'அலிபிரி அல்லது ஸ்ரீவாரி மெட்டு கவுண்டரில் லக்கேஜ் கொடுத்து நடைபயணத்தை தொடங்கவும்.' },
      { step: 2, title: 'நடுவழியில் பயோமெட்ரிக் டோக்கன்', desc: 'ஆதார் ஸ்கேன் செய்து நேரடி புகைப்படத்துடன் டோக்கன் சீட்டு பெறவும்.' },
      { step: 3, title: 'திருமலை அடைந்து ஓய்வெடுத்தல்', desc: 'திருமலை அடைந்து PAC மையத்தில் லக்கேஜ் பெற்று குளித்து தயாராகுங்கள்.' },
      { step: 4, title: 'பாரம்பரிய உடையுடன் VQC செல்லுதல்', desc: 'பாரம்பரிய உடையில் திவ்ய தர்சன வரிசைக்கு செல்லவும்.' },
      { step: 5, title: 'ஸ்ரீவாரி தரிசனம் & லட்டு பிரசாதம்', desc: 'ஆனந்த நிலையத்தில் ஸ்ரீவாரி தரிசனம் பெற்று இலவச லட்டு பிரசாதம் பெறவும்.' }
    ],
    ssdTokensLink: 'SSD டோக்கன்கள் (10K/நாள்) →',
    footpathsLink: 'நடைபாதை நேரம் & வழிகாட்டி →'
  },
  hi: {
    headerTitle: 'दिव्य दर्शन (DD) टोकन लाइव स्थिति',
    tokensCardTitle: 'दिव्य दर्शन टोकन (पैदल मार्ग)',
    trekQuotaBadge: 'पैदल मार्ग कोटा',
    issuingNow: 'जारी हैं',
    completed: 'पूर्ण',
    started: 'शुरू होने का समय',
    quotaCompleted: 'कोटा पूरा होने का समय',
    nextReleaseTitle: 'अगले दिन टोकन जारी होने का समय',
    advisoryCompletedTitle: 'DD टोकन समाप्त होने पर भी पैदल दर्शन संभव!',
    advisoryActiveTitle: 'दिव्य दर्शन प्राप्त करने की सलाह',
    advisoryPillFree: 'निःशुल्क प्रवेश खुला है',
    advisoryDescCompleted: 'DD टोकन समाप्त होने के बाद भी पैदल चलने वाले तीर्थयात्रियों के लिए सर्वदर्शन खुला रहता है। आप सीधे VQC कतार में शामिल हो सकते हैं।',
    advisoryDescActive: 'गालीगोपुरम (अलिपिरी) या 1,200वीं सीढ़ी (श्रीवारी मेट्टू) पर टोकन प्राप्त करें। त्वरित दर्शन के लिए टोकन सुरक्षित रखें।',
    ssdAltPrompt: 'शहर के काउंटरों से समय-स्लॉट टोकन चाहते हैं?',
    ssdAltBtn: 'सर्वदर्शन (SSD) विकल्प देखें',
    countersHeader: 'दिव्य दर्शन काउंटर व पैदल मार्ग',
    rulesHeader: 'दिव्य दर्शन के अनिवार्य नियम',
    strictRuleBadge: 'सख्त जांच',
    gateRuleBadge: 'गेट नियम',
    bioBlockBadge: 'बायोमेट्रिक रोक',
    r1Title: 'मूल आधार कार्ड अनिवार्य',
    r1Desc: 'प्रत्येक तीर्थयात्री (5 वर्ष से अधिक उम्र के बच्चों सहित) के पास मूल भौतिक आधार कार्ड होना अनिवार्य है। फोटोकॉपी मान्य नहीं है।',
    r2Title: '30-दिवसीय सीमा नियम',
    r2Desc: 'प्रति आधार नंबर पर 30 दिनों में केवल एक बार ही दिव्य दर्शन टोकन मिलता है। TTD सर्वर पर इसकी जांच होती है।',
    r3Title: 'पैदल यात्रा सत्यापन',
    r3Desc: 'मार्ग के मध्य और पहाड़ी पर टोकन स्कैन कर वास्तविक पैदल यात्रियों का सत्यापन किया जाता है।',
    r4Title: 'निःशुल्क सामान परिवहन सेवा',
    r4Desc: 'अलिपिरी या श्रीवारी मेट्टू काउंटर पर सामान जमा करने पर उसे निःशुल्क तिरुमाला PAC केंद्र पहुंचा दिया जाता है।',
    r5Title: 'पारंपरिक वस्त्र अनिवार्य',
    r5Desc: 'पुरुषों के लिए धोती/कुर्ता और महिलाओं के लिए साड़ी या दुपट्टे के साथ सलवार-कुर्ता अनिवार्य है।',
    roadmapTitle: 'दिव्य दर्शन यात्रा के चरण',
    steps: [
      { step: 1, title: 'सामान जमा करें व चढ़ाई शुरू करें', desc: 'अलिपिरी या श्रीवारी मेट्टू पर सामान काउंटर में जमा करें और पैदल यात्रा शुरू करें।' },
      { step: 2, title: 'मध्य मार्ग पर बायोमेट्रिक टोकन', desc: 'आधार स्कैन व फोटो खिंचवाकर मुद्रित टोकन पर्ची प्राप्त करें।' },
      { step: 3, title: 'तिरुमाला पहुंचें व विश्राम करें', desc: 'पहाड़ी पर पहुंचकर PAC में सामान लें और स्नान कर तैयार हों।' },
      { step: 4, title: 'पारंपरिक वस्त्र पहनकर VQC पहुंचें', desc: 'पारंपरिक पोशाक में दिव्य दर्शन कतार में रिपोर्ट करें।' },
      { step: 5, title: 'श्रीवारी दर्शन व निःशुल्क प्रसादम', desc: 'आनंद निलयम में श्रीवारी दर्शन प्राप्त करें और पवित्र लड्डू प्रसादम लें।' }
    ],
    ssdTokensLink: 'SSD टोकन (10K/दिन) →',
    footpathsLink: 'पैदल मार्ग समय व गाइड →'
  }
};

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
  const t = DD_TEXTS[lang] || DD_TEXTS.en;

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
            {t.headerTitle}
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
                  {t.tokensCardTitle}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
                    2,000 (2K) / day
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    {t.trekQuotaBadge}
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
              {isIssuing ? t.issuingNow : t.completed}
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
                <span>{t.started}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {ddStartTimestamp}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isCompleted ? '#DC2626' : '#16A34A', fontSize: '11px', fontWeight: 700 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isCompleted ? '#DC2626' : '#16A34A' }} />
                <span>{t.quotaCompleted}</span>
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
                  {t.nextReleaseTitle}
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
          border: '1px solid #BBF7D0',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(22, 101, 52, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7',
              border: '1px solid #BBF7D0',
              color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Lightbulb size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#14532D', margin: 0 }}>
                  {isCompleted ? t.advisoryCompletedTitle : t.advisoryActiveTitle}
                </h3>
                {isCompleted && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#166534',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.01em'
                  }}>
                    {t.advisoryPillFree}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12.5px', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                {isCompleted ? t.advisoryDescCompleted : t.advisoryDescActive}
              </p>
            </div>
          </div>

          {/* Quick Pivot CTA to SSD Alternative */}
          {isCompleted && (
            <div style={{
              borderTop: '1px solid #DCFCE7',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontSize: '11.5px', color: '#15803D', fontWeight: 600 }}>
                {t.ssdAltPrompt}
              </span>
              <Link
                href="/ssd-tokens"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0F5132',
                  color: '#FFFFFF',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(15, 81, 50, 0.25)'
                }}
              >
                <span>{t.ssdAltBtn}</span>
                <ChevronRight size={13} strokeWidth={2.8} />
              </Link>
            </div>
          )}
        </section>

        {/* ── 3. FOOTPATH TOKEN COLLECTION COUNTERS ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#D97706" />
              <span>{t.countersHeader}</span>
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>2 Pathways</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DD_COUNTERS.map((counter) => (
              <div key={counter.id} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      backgroundColor: counter.id === 'srivari-mettu' ? '#DCFCE7' : '#EFF6FF',
                      border: `1px solid ${counter.id === 'srivari-mettu' ? '#BBF7D0' : '#DBEAFE'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Footprints size={20} color={counter.id === 'srivari-mettu' ? '#16A34A' : '#1D4ED8'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {(counter.names as Record<string, string>)[lang] || counter.names.en}
                        </h4>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          backgroundColor: counter.id === 'srivari-mettu' ? '#DCFCE7' : '#EFF6FF',
                          color: counter.id === 'srivari-mettu' ? '#14532D' : '#1E40AF',
                          border: `1px solid ${counter.id === 'srivari-mettu' ? '#BBF7D0' : '#DBEAFE'}`
                        }}>
                          {(counter.badges as Record<string, string>)[lang] || counter.badges.en}
                        </span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 4px 0', fontWeight: 500 }}>
                        {(counter.pathways as Record<string, string>)[lang] || counter.pathways.en}
                      </p>

                      {/* Helper Audience Line */}
                      <p style={{
                        fontSize: '11px',
                        color: counter.id === 'srivari-mettu' ? '#166534' : '#1E40AF',
                        margin: '0 0 8px 0',
                        fontWeight: 600
                      }}>
                        {(counter.targetAudiences as Record<string, string>)[lang] || counter.targetAudiences.en}
                      </p>

                      {/* Vector Badges Row (No Emojis) */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{
                          fontSize: '10.5px', fontWeight: 700, color: '#0F172A', backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Mountain size={11} color="#64748B" />
                          <span>{counter.stepsCount}</span>
                        </span>
                        <span style={{
                          fontSize: '10.5px', fontWeight: 700, color: '#0F172A', backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <MapPin size={11} color="#64748B" />
                          <span>{counter.distance}</span>
                        </span>
                        <span style={{
                          fontSize: '10.5px', fontWeight: 700, color: '#166534', backgroundColor: '#F0FDF4',
                          border: '1px solid #DCFCE7', padding: '3px 8px', borderRadius: '6px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Clock size={11} color="#16A34A" />
                          <span>~{counter.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={counter.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534',
                      padding: '6px 12px', borderRadius: '10px', fontSize: '11.5px', fontWeight: 700,
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0
                    }}
                    title="Get turn-by-turn directions"
                  >
                    <Navigation size={13} strokeWidth={2.4} /> Directions
                  </a>
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  marginTop: '12px',
                  paddingTop: '8px',
                  fontSize: '11.5px',
                  color: '#475569',
                  lineHeight: 1.45
                }}>
                  {(counter.descriptions as Record<string, string>)[lang] || counter.descriptions.en}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>{t.rulesHeader}</span>
            </h3>
            <span style={{ fontSize: '10.5px', color: '#DC2626', fontWeight: 700, backgroundColor: '#FEE2E2', padding: '2px 7px', borderRadius: '6px' }}>
              {t.strictRuleBadge}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* SHOWSTOPPER 1: PHYSICAL AADHAAR */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderLeft: '4px solid #DC2626',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '13px', color: '#991B1B' }}>
                    {t.r1Title}
                  </strong>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {t.gateRuleBadge}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#7F1D1D', margin: 0, lineHeight: 1.45 }}>
                  {t.r1Desc}
                </p>
              </div>
            </div>

            {/* SHOWSTOPPER 2: 30-DAY LIMITATION */}
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderLeft: '4px solid #D97706',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldAlert size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '13px', color: '#92400E' }}>
                    {t.r2Title}
                  </strong>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {t.bioBlockBadge}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#78350F', margin: 0, lineHeight: 1.45 }}>
                  {t.r2Desc}
                </p>
              </div>
            </div>

            {/* STANDARD CHECK 1: PHYSICAL CLIMB */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #F1F5F9',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>
                  {t.r3Title}
                </strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                  {t.r3Desc}
                </p>
              </div>
            </div>

            {/* STANDARD CHECK 2: FREE LUGGAGE TRANSIT */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #F1F5F9',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>
                  {t.r4Title}
                </strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                  {t.r4Desc}
                </p>
              </div>
            </div>

            {/* STANDARD CHECK 3: DRESS CODE */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #F1F5F9',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>
                  {t.r5Title}
                </strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                  {t.r5Desc}
                </p>
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
            <span>{t.roadmapTitle}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {t.steps.map((st) => (
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


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
import { TirumalaStatus, TokenBatchDetails } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';

const COLLECTION_CENTRES = [
  {
    id: 'vishnu-nivasam',
    names: {
      en: 'Vishnu Nivasam Complex',
      te: 'విష్ణు నివాసం కాంప్లెక్స్',
      kn: 'ವಿಷ್ಣು ನಿವಾಸ ಕಾಂಪ್ಲೆಕ್ಸ್',
      ta: 'விஷ்ணு நிவாசம் வளாகம்',
      hi: 'विष्णु निवासम कॉम्प्लेक्स'
    },
    landmarks: {
      en: 'Directly opposite Tirupati Main Railway Station (Platform 1 Exit)',
      te: 'తిరుపతి రైల్వే స్టేషన్ ప్లాట్‌ఫారమ్ 1 ఎదురుగా',
      kn: 'ತಿರುಪತಿ ರೈಲ್ವೆ ನಿಲ್ದಾಣದ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1 ಎದುರು',
      ta: 'திருப்பதி ரயில் நிலைய பிளாட்பாரம் 1 எதிரில்',
      hi: 'तिरुपति रेलवे स्टेशन प्लेटफॉर्म 1 के ठीक सामने'
    },
    counterHours: 'Opens early morning daily (subject to live quota)',
    iconType: 'train',
    mapsUrl: 'https://www.google.com/maps/place/Tirupathi+in+vishnu+nivasam+rest+house/@13.6291509,79.4159267,16.57z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4bead70ef80b:0x67019ead37155b82!8m2!3d13.6291294!4d79.421782!16s%2Fg%2F11ssb0tp1j'
  },
  {
    id: 'srinivasam',
    names: {
      en: 'Srinivasam Complex',
      te: 'శ్రీనివాసం కాంప్లెక్స్',
      kn: 'ಶ್ರೀನಿವಾಸಂ ಕಾಂಪ್ಲೆಕ್ಸ್',
      ta: 'சீனிவாசம் வளாகம்',
      hi: 'श्रीनिवासम कॉम्प्लेक्स'
    },
    landmarks: {
      en: 'Opposite Tirupati Central RTC Bus Station',
      te: 'తిరుపతి సెంట్రల్ ఆర్టీసీ బస్టాండ్ ఎదురుగా',
      kn: 'ತಿರುಪತಿ ಸೆಂಟ್ರಲ್ ಆರ್ಟಿಸಿ ಬಸ್ ನಿಲ್ದಾಣದ ಎದುರು',
      ta: 'திருப்பதி மத்திய RTC பேருந்து நிலையம் எதிரில்',
      hi: 'तिरुपति सेंट्रल आरटीसी बस स्टैंड के सामने'
    },
    counterHours: 'Opens early morning daily (subject to live quota)',
    iconType: 'bus',
    mapsUrl: 'https://www.google.com/maps/place/Srinivasam+Complex,+SH+61,+Kothapalli,+Tirupati,+Andhra+Pradesh+517501/@13.6322127,79.4275624,18.77z/data=!4m10!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m6!1s0x3a4d4ba8fb3a7c87:0xbb1d8612f380be25!8m2!3d13.6324562!4d79.4288488!15sChtTcmluaXZhc2FtIENvbXBsZXggVGlydXBhdGmSAQpzdWJwcmVtaXNl4AEA!16s%2Fg%2F11zhwd46nj'
  },
  {
    id: 'bhudevi',
    names: {
      en: 'Bhudevi Complex',
      te: 'భూదేవి కాంప్లెక్స్',
      kn: 'ಭೂದೇವಿ ಕಾಂಪ್ಲೆಕ್ಸ್',
      ta: 'பூதேவி வளாகம்',
      hi: 'भूदेवी कॉम्प्लेक्स'
    },
    landmarks: {
      en: 'Alipiri Foot of the Hills (Alipiri Bypass Bus Stop)',
      te: 'అలిపిరి మెట్ల మార్గం ప్రారంభం వద్ద',
      kn: 'ಅಲಿಪಿರಿ ಮೆಟ್ಟಿಲುಗಳ ಮಾರ್ಗದ ಆರಂಭದಲ್ಲಿ',
      ta: 'அலிபிரி மலையடிவாரம் (அலிபிரி பைபாஸ்)',
      hi: 'अलिपिरी पहाड़ी की तलहटी (अलिपिरी बाईपास बस स्टॉप)'
    },
    counterHours: 'Opens early morning daily (subject to live quota)',
    iconType: 'mountain',
    mapsUrl: 'https://www.google.com/maps/place/Sri+Bhudevi+pilgrimage+Ttd+Dharshan%E2%80%99s+free+tickets/@13.6455158,79.4054241,17z/data=!4m9!1m2!2m1!1sSrinivasam+Complex+Tirupati!3m5!1s0x3a4d4b38f66460f1:0x73e082c2b7f1b30!8m2!3d13.6473239!4d79.4095922!16s%2Fg%2F11j8lvd91q'
  }
];

const SSD_TEXTS = {
  en: {
    headerTitle: 'SSD & DD Token Status',
    subtitle: 'Tirumala Sarva Darshan Tokens',
    issuing: 'Issuing',
    paused: 'Paused',
    closed: 'Closed',
    completed: 'Completed',
    copied: 'Link copied to clipboard',
    todayPrefix: 'Today •',
    quotaIssuingPill: 'Tokens actively issuing',
    quotaPausedPill: 'Quota paused',
    quotaCompletedPill: "Today's quota completed",
    noticeIssuing: 'Counters are currently open and issuing biometric tokens.',
    noticePaused: 'Token issuance is temporarily paused. Please wait for next announcement.',
    noticeCompleted: (d: string) => `Tokens for ${d} have been fully issued.`,
    ssdTitle: 'SSD Tokens',
    ssdSub: 'Slotted Sarva Darshan',
    ddTitle: 'DD Tokens',
    ddSub: 'Divya Darshan (Footpath)',
    startedAt: 'Started at',
    quotaCompletedAt: 'Quota completed at',
    currentStatus: 'Current Status',
    countersActive: 'Counters Active',
    nextReleaseTitle: 'Next Expected Release',
    notifAlert: 'Notification alert set for next release!',
    advisoryOpenTitle: 'SSD & DD token counters are currently OPEN.',
    advisoryOpenDesc: 'Physical original Aadhaar card mandatory. Report directly to Vishnu Nivasam, Srinivasam, or Bhudevi complex.',
    advisoryClosedTitle: "Today's SSD & DD token quotas are completed.",
    advisoryClosedDesc: 'Please wait for the next release. Token timings are subject to TTD updates.',
    counterLocationsTitle: 'Tirupati Token Counter Locations',
    centersCount: '3 Centers',
    rulesTitle: 'Mandatory Rules & Requirements',
    rules: [
      {
        title: 'Original Aadhaar Card Mandatory',
        desc: 'Every individual pilgrim (including children 5+ years) MUST carry their physical original Aadhaar card.'
      },
      {
        title: 'In-Person Physical Presence Required',
        desc: 'Live biometric facial photo and fingerprint scan is taken at the counter. One person cannot collect for others.'
      },
      {
        title: '30-Day Frequency Limit Rule',
        desc: 'A pilgrim can obtain an SSD biometric token only once every 30 days per Aadhaar number.'
      }
    ],
    journeyTitle: 'SSD Token Journey Steps',
    steps: [
      { step: 1, title: 'Reach Token Counter in Tirupati', desc: 'Visit Vishnu Nivasam, Srinivasam, or Bhudevi complex early morning.' },
      { step: 2, title: 'Aadhaar Biometric Scan & Token Slip', desc: 'Scan Aadhaar & take live photo. Receive printed slip with assigned time slot.' },
      { step: 3, title: 'Ascend to Tirumala', desc: 'Travel to Tirumala via ghat road or footpath 2 hours ahead of your allotted time.' },
      { step: 4, title: 'Report at Slotted Queue Gate', desc: 'Arrive at designated SSD entry gate at the exact slot printed on your token.' },
      { step: 5, title: 'Biometric Verification & Darshan', desc: 'Fingerprint re-scan matches counter data, leading smoothly to Srivari Darshan & Laddu.' }
    ],
    guideLink: '{t.guideLink}',
    sedLink: '{t.sedLink}'
  },
  te: {
    headerTitle: 'SSD & DD టోకెన్ స్థితి',
    subtitle: 'తిరుమల సర్వదర్శనం టోకెన్లు',
    issuing: 'జారీ అవుతున్నాయి',
    paused: 'నిలిపివేయబడింది',
    closed: 'ముగిసింది',
    completed: 'పూర్తయింది',
    copied: 'లింక్ కాపీ చేయబడింది',
    todayPrefix: 'ఈ రోజు •',
    quotaIssuingPill: 'టోకెన్లు జారీ అవుతున్నాయి',
    quotaPausedPill: 'కోటా నిలిపివేయబడింది',
    quotaCompletedPill: 'నేటి కోటా పూర్తయింది',
    noticeIssuing: 'కౌంటర్లు ప్రస్తుతం తెరిచి ఉన్నాయి మరియు బయోమెట్రిక్ టోకెన్లు జారీ చేస్తున్నాయి.',
    noticePaused: 'టోకెన్ జారీ తాత్కాలికంగా నిలిపివేయబడింది. తదుపరి ప్రకటన కోసం వేచి ఉండండి.',
    noticeCompleted: (d: string) => `${d} నాటి టోకెన్లు పూర్తిగా జారీ చేయబడ్డాయి.`,
    ssdTitle: 'SSD టోకెన్లు',
    ssdSub: 'స్లాటెడ్ సర్వదర్శనం',
    ddTitle: 'DD టోకెన్లు',
    ddSub: 'దివ్యదర్శనం (మెట్ల మార్గం)',
    startedAt: 'ప్రారంభం',
    quotaCompletedAt: 'కోటా పూర్తయిన సమయం',
    currentStatus: 'ప్రస్తుత స్థితి',
    countersActive: 'కౌంటర్లు తెరిచి ఉన్నాయి',
    nextReleaseTitle: 'తదుపరి విడుదల సమయం',
    notifAlert: 'నోటిఫికేషన్ అలర్ట్ సెట్ చేయబడింది!',
    advisoryOpenTitle: 'ఎస్‌ఎస్‌డి & డిడి టోకెన్ కౌంటర్లు ప్రస్తుతం తెరిచి ఉన్నాయి.',
    advisoryOpenDesc: 'మీ అసలు భౌతిక ఆధార్ కార్డు తప్పనిసరి. విష్ణు నివాసం, శ్రీనివాసం లేదా భూదేవి కాంప్లెక్స్ వద్దకు వెంటనే చేరుకోండి.',
    advisoryClosedTitle: 'నేటి ఎస్‌ఎస్‌డి & డిడి టోకెన్ కోటా పూర్తయింది.',
    advisoryClosedDesc: 'దయచేసి తదుపరి విడుదల కోసం వేచి ఉండండి. టోకెన్ సమయాలు టీటీడీ అప్‌డేట్‌లకు లోబడి ఉంటాయి.',
    counterLocationsTitle: 'తిరుపతి ఎస్‌ఎస్‌డి టోకెన్ కౌంటర్లు',
    centersCount: '3 కేంద్రాలు',
    rulesTitle: 'టోకెన్ పొందడానికి తప్పనిసరి నియమాలు',
    rules: [
      {
        title: 'ఒరిజినల్ భౌతిక ఆధార్ కార్డు తప్పనిసరి',
        desc: 'ప్రతి ఒక్క భక్తుడు (5 ఏళ్లు పైబడిన పిల్లలతో సహా) తమ అసలు ఆధార్ కార్డును తప్పనిసరిగా వెంట ఉంచుకోవాలి.'
      },
      {
        title: 'వ్యక్తిగతంగా స్వయంగా హాజరుకావాలి',
        desc: 'కౌంటర్ వద్ద లైవ్ ఫోటో మరియు వేలిముద్రల బయోమెట్రిక్ స్కాన్ తీసుకుంటారు. ఒకరు ఇతరుల కోసం టోకెన్లు తీసుకోలేరు.'
      },
      {
        title: '30 రోజుల బయోమెట్రిక్ పరిమితి నిబంధన',
        desc: 'ఒక ఆధార్ నంబర్‌పై ప్రతి 30 రోజులకు ఒక్కసారి మాత్రమే ఎస్‌ఎస్‌డి టోకెన్ లభిస్తుంది.'
      }
    ],
    journeyTitle: 'ఎస్‌ఎస్‌డి టోకెన్ దర్శన విధానం',
    steps: [
      { step: 1, title: 'తిరుపతిలోని టోకెన్ కౌంటర్‌కు చేరుకోండి', desc: 'ఉదయాన్నే విష్ణు నివాసం, శ్రీనివాసం లేదా భూదేవి కాంప్లెక్స్‌కు చేరుకోండి.' },
      { step: 2, title: 'ఆధార్ బయోమెట్రిక్ స్కాన్ & టోకెన్ స్లిప్', desc: 'ఆధార్ స్కాన్ చేసి ప్రత్యక్ష ఫోటో దిగండి. దర్శనం సమయ స్లాట్ ఉన్న స్లిప్ పొందండి.' },
      { step: 3, title: 'తిరుమలకు ప్రయాణం', desc: 'మీకు కేటాయించిన సమయానికి 2 గంటల ముందు ఘాట్ రోడ్ లేదా నడకదారి ద్వారా తిరుమల చేరుకోండి.' },
      { step: 4, title: 'స్లాటెడ్ క్యూ గేట్ వద్దకు రిపోర్ట్ చేయండి', desc: 'టోకెన్‌లో ముద్రించిన నిర్దిష్ట సమయానికి ఎస్‌ఎస్‌డి ప్రవేశ ద్వారం వద్దకు చేరుకోండి.' },
      { step: 5, title: 'బయోమెట్రిక్ ధృవీకరణ & శ్రీవారి దర్శనం', desc: 'వేలిముద్రల ధృవీకరణ తర్వాత ఆనంద నిలయంలో శ్రీవారి దర్శనం & లడ్డూ ప్రసాదం పొందండి.' }
    ],
    guideLink: 'సర్వదర్శనం మార్గదర్శి →',
    sedLink: '₹300 ప్రత్యేక ప్రవేశం →'
  },
  kn: {
    headerTitle: 'SSD & DD ಟೋಕನ್ ಸ್ಥಿತಿ',
    subtitle: 'ತಿರುಮಲ ಸರ್ವದರ್ಶನ ಟೋಕನ್‌ಗಳು',
    issuing: 'ವಿತರಿಸಲಾಗುತ್ತಿದೆ',
    paused: 'ಸ್ಥಗಿತಗೊಂಡಿದೆ',
    closed: 'ಮುಕ್ತಾಯವಾಗಿದೆ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    copied: 'ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ',
    todayPrefix: 'ಇಂದು •',
    quotaIssuingPill: 'ಟೋಕನ್‌ಗಳು ವಿತರಿಸಲಾಗುತ್ತಿವೆ',
    quotaPausedPill: 'ಕೋಟಾ ಸ್ಥಗಿತಗೊಂಡಿದೆ',
    quotaCompletedPill: 'ಇಂದಿನ ಕೋಟಾ ಪೂರ್ಣಗೊಂಡಿದೆ',
    noticeIssuing: 'ಕೌಂಟರ್‌ಗಳು ಪ್ರಸ್ತುತ ತೆರೆದಿದ್ದು ಬಯೋಮೆಟ್ರಿಕ್ ಟೋಕನ್‌ಗಳನ್ನು ವಿತರಿಸುತ್ತಿವೆ.',
    noticePaused: 'ಟೋಕನ್ ವಿತರಣೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಸ್ಥಗಿತಗೊಂಡಿದೆ. ಮುಂದಿನ ಪ್ರಕಟಣೆಗಾಗಿ ಕಾಯಿರಿ.',
    noticeCompleted: (d: string) => `${d} ದಿನಾಂಕದ ಟೋಕನ್‌ಗಳು ಪೂರ್ಣವಾಗಿ ವಿತರಿಸಲ್ಪಟ್ಟಿವೆ.`,
    ssdTitle: 'SSD ಟೋಕನ್‌ಗಳು',
    ssdSub: 'ಸ್ಲಾಟೆಡ್ ಸರ್ವದರ್ಶನ',
    ddTitle: 'DD ಟೋಕನ್‌ಗಳು',
    ddSub: 'ದಿವ್ಯದರ್ಶನ (ಮೆಟ್ಟಿಲುಗಳ ಮಾರ್ಗ)',
    startedAt: 'ಪ್ರಾರಂಭವಾದ ಸಮಯ',
    quotaCompletedAt: 'ಕೋಟಾ ಮುಕ್ತಾಯವಾದ ಸಮಯ',
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    countersActive: 'ಕೌಂಟರ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ',
    nextReleaseTitle: 'ಮುಂದಿನ ಬಿಡುಗಡೆ ಸಮಯ',
    notifAlert: 'ಮುಂದಿನ ಬಿಡುಗಡೆಗಾಗಿ ಅಧಿಸೂಚನೆ ಹೊಂದಿಸಲಾಗಿದೆ!',
    advisoryOpenTitle: 'SSD & DD ಟೋಕನ್ ಕೌಂಟರ್‌ಗಳು ಪ್ರಸ್ತುತ ತೆರೆದಿವೆ.',
    advisoryOpenDesc: 'ಅಸಲಿ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್ ಕಡ್ಡಾಯ. ವಿಷ್ಣು ನಿವಾಸ, ಶ್ರೀನಿವಾಸ ಅಥವಾ ಭೂದೇವಿ ಕಾಂಪ್ಲೆಕ್ಸ್‌ಗೆ ನೇರವಾಗಿ ತೆರಳಿ.',
    advisoryClosedTitle: 'ಇಂದಿನ SSD & DD ಟೋಕನ್ ಕೋಟಾ ಪೂರ್ಣಗೊಂಡಿದೆ.',
    advisoryClosedDesc: 'ದಯವಿಟ್ಟು ಮುಂದಿನ ಬಿಡುಗಡೆಗಾಗಿ ಕಾಯಿರಿ. ಟೋಕನ್ ಸಮಯಗಳು TTD ಅಪ್‌ಡೇಟ್‌ಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ.',
    counterLocationsTitle: 'ತಿರುಪತಿ ಟೋಕನ್ ಕೌಂಟರ್‌ಗಳ ಸ್ಥಳಗಳು',
    centersCount: '3 ಕೇಂದ್ರಗಳು',
    rulesTitle: 'ಟೋಕನ್ ಪಡೆಯಲು ಕಡ್ಡಾಯ ನಿಯಮಗಳು',
    rules: [
      {
        title: 'ಅಸಲಿ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್ ಕಡ್ಡಾಯ',
        desc: 'ಪ್ರತಿಯೊಬ್ಬ ಭಕ್ತರೂ (5 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಮಕ್ಕಳು ಸೇರಿದಂತೆ) ತಮ್ಮ ಅಸಲಿ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್ ತರಬೇಕು.'
      },
      {
        title: 'ಸ್ವತಃ ಪ್ರತ್ಯಕ್ಷವಾಗಿ ಹಾಜರಿರಬೇಕು',
        desc: 'ಕೌಂಟರ್‌ನಲ್ಲಿ ನೇರ ಮುಖದ ಫೋಟೋ ಮತ್ತು ಬೆರಳಚ್ಚು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತದೆ. ಒಬ್ಬರು ಇತರರಿಗಾಗಿ ಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.'
      },
      {
        title: '30 ದಿನಗಳ ಮಿತಿ ನಿಯಮ',
        desc: 'ಒಂದು ಆಧಾರ್ ಸಂಖ್ಯೆಗೆ 30 ದಿನಗಳಲ್ಲಿ ಒಮ್ಮೆ ಮಾತ್ರ SSD ಬಯೋಮೆಟ್ರಿಕ್ ಟೋಕನ್ ಪಡೆಯಲು ಸಾಧ್ಯ.'
      }
    ],
    journeyTitle: 'SSD ಟೋಕನ್ ದರ್ಶನ ಹಂತಗಳು',
    steps: [
      { step: 1, title: 'ತಿರುಪತಿಯ ಟೋಕನ್ ಕೌಂಟರ್‌ಗೆ ತೆರಳಿ', desc: 'ಬೆಳಗ್ಗೆ ವಿಷ್ಣು ನಿವಾಸ, ಶ್ರೀನಿವಾಸ ಅಥವಾ ಭೂದೇವಿ ಕಾಂಪ್ಲೆಕ್ಸ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.' },
      { step: 2, title: 'ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಟೋಕನ್ ಸ್ಲಿಪ್', desc: 'ಆಧಾರ್ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಲೈವ್ ಫೋಟೋ ನೀಡಿ ನಿಗದಿತ ಸಮಯ ಸ್ಲಾಟ್ ಇರುವ ಸ್ಲಿಪ್ ಪಡೆಯಿರಿ.' },
      { step: 3, title: 'ತಿರುಮಲಕ್ಕೆ ಪ್ರಯಾಣ', desc: 'ನಿಮ್ಮ ಸಮಯ ಸ್ಲಾಟ್‌ಗಿಂತ 2 ಗಂಟೆ ಮುಂಚಿತವಾಗಿ ಘಾಟ್ ರಸ್ತೆ ಅಥವಾ ಕಾಲ್ನಡಿಗೆ ಮೂಲಕ ತಿರುಮಲ ತಲುಪಿ.' },
      { step: 4, title: 'ಸ್ಲಾಟೆಡ್ ಕ್ಯೂ ಗೇಟ್‌ಗೆ ವರದಿ ಮಾಡಿ', desc: 'ಟೋಕನ್‌ನಲ್ಲಿ ನಮೂದಿಸಲಾದ ನಿಖರ ಸಮಯಕ್ಕೆ SSD ಪ್ರವೇಶ ದ್ವಾರಕ್ಕೆ ಹಾಜರಾಗಿ.' },
      { step: 5, title: 'ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ & ಶ್ರೀವಾರಿ ದರ್ಶನ', desc: 'ಬೆರಳಚ್ಚು ಪರಿಶೀಲನೆಯ ನಂತರ ಆನಂದ ನಿಲಯದಲ್ಲಿ ಶ್ರೀವಾರಿ ದರ್ಶನ ಮತ್ತು ಲಡ್ಡು ಪ್ರಸಾದ ಪಡೆಯಿರಿ.' }
    ],
    guideLink: 'ಸರ್ವದರ್ಶನ ಮಾರ್ಗದರ್ಶಿ →',
    sedLink: '₹300 ವಿಶೇಷ ಪ್ರವೇಶ →'
  },
  ta: {
    headerTitle: 'SSD & DD டோக்கன் நிலை',
    subtitle: 'திருமலை சர்வ தர்சன டோக்கன்கள்',
    issuing: 'வழங்கப்படுகிறது',
    paused: 'இடைநிறுத்தப்பட்டுள்ளது',
    closed: 'முடிந்தது',
    completed: 'நிறைவடைந்தது',
    copied: 'இணைப்பு நகலெடுக்கப்பட்டது',
    todayPrefix: 'இன்று •',
    quotaIssuingPill: 'டோக்கன்கள் வழங்கப்படுகின்றன',
    quotaPausedPill: 'ஒதுக்கீடு இடைநிறுத்தப்பட்டது',
    quotaCompletedPill: 'இன்றைய ஒதுக்கீடு நிறைவடைந்தது',
    noticeIssuing: 'கவுண்டர்கள் தற்போது திறந்து பயோமெட்ரிக் டோக்கன்கள் வழங்கப்படுகின்றன.',
    noticePaused: 'டோக்கன் வழங்குவது தற்காலிகமாக நிறுத்தப்பட்டுள்ளது. அடுத்த அறிவிப்புக்கு காத்திருக்கவும்.',
    noticeCompleted: (d: string) => `${d} தேதிக்கான டோக்கன்கள் முழுமையாக வழங்கப்பட்டுவிட்டன.`,
    ssdTitle: 'SSD டோக்கன்கள்',
    ssdSub: 'குறிப்பிட்ட நேர சர்வ தர்சனம்',
    ddTitle: 'DD டோக்கன்கள்',
    ddSub: 'திவ்ய தர்சனம் (நடைபாதை)',
    startedAt: 'தொடங்கிய நேரம்',
    quotaCompletedAt: 'ஒதுக்கீடு முடிந்த நேரம்',
    currentStatus: 'தற்போதைய நிலை',
    countersActive: 'கவுண்டர்கள் செயல்படுகின்றன',
    nextReleaseTitle: 'அடுத்த டோக்கன் வெளியீடு',
    notifAlert: 'அடுத்த வெளியீட்டிற்கு அறிவிப்பு அமைக்கப்பட்டது!',
    advisoryOpenTitle: 'SSD & DD டோக்கன் கவுண்டர்கள் தற்போது திறந்துள்ளன.',
    advisoryOpenDesc: 'அசல் ஆதார் அட்டை கட்டாயம். விஷ்ணு நிவாசம், சீனிவாசம் அல்லது பூதேவி வளாகத்திற்கு உடனடியாக செல்லவும்.',
    advisoryClosedTitle: 'இன்றைய SSD & DD டோக்கன் ஒதுக்கீடு நிறைவடைந்தது.',
    advisoryClosedDesc: 'அடுத்த வெளியீட்டிற்கு காத்திருக்கவும். டோக்கன் நேரங்கள் TTD முடிவுகளுக்கு உட்பட்டவை.',
    counterLocationsTitle: 'திருப்பதி டோக்கன் கவுண்டர் அமைவிடங்கள்',
    centersCount: '3 மையங்கள்',
    rulesTitle: 'டோக்கன் பெறுவதற்கான கட்டாய விதிகள்',
    rules: [
      {
        title: 'அசல் ஆதார் அட்டை கட்டாயம்',
        desc: 'ஒவ்வொரு பக்தரும் (5 வயதுக்கு மேற்பட்ட குழந்தைகள் உட்பட) அசல் ஆதார் அட்டையை வைத்திருக்க வேண்டும்.'
      },
      {
        title: 'நேரில் ஆஜராக வேண்டும்',
        desc: 'கவுண்டரில் நேரடி முக புகைப்படம் மற்றும் கைரேகை ஸ்கேன் எடுக்கப்படும். ஒருவர் மற்றவருக்காக பெற முடியாது.'
      },
      {
        title: '30 நாட்கள் இடைவெளி விதி',
        desc: 'ஒரு ஆதார் எண்ணுக்கு 30 நாட்களுக்கு ஒருமுறை மட்டுமே SSD டோக்கன் கிடைக்கும்.'
      }
    ],
    journeyTitle: 'SSD டோக்கன் தரிசன வழிமுறைகள்',
    steps: [
      { step: 1, title: 'திருப்பதி டோக்கன் கவுண்டருக்கு செல்லவும்', desc: 'காலை விஷ்ணு நிவாசம், சீனிவாசம் அல்லது பூதேவி வளாகத்திற்கு செல்லவும்.' },
      { step: 2, title: 'பயோமெட்ரிக் ஸ்கேன் மற்றும் டோக்கன் பெறுதல்', desc: 'ஆதார் ஸ்கேன் செய்து நேரடி புகைப்படம் எடுத்து நேரக் குறிப்புடன் டோக்கன் சீட்டு பெறவும்.' },
      { step: 3, title: 'திருமலைக்கு செல்லுதல்', desc: 'ஒதுக்கப்பட்ட நேரத்திற்கு 2 மணி நேரத்திற்கு முன்னதாக மலைப்பாதை வழியாக திருமலை அடையவும்.' },
      { step: 4, title: 'குறிப்பிட்ட வரிசை வாயிலுக்கு செல்லவும்', desc: 'டோக்கனில் அச்சிடப்பட்ட குறிப்பிட்ட நேரத்தில் SSD நுழைவு வாயிலுக்கு செல்லவும்.' },
      { step: 5, title: 'கைரேகை சரிபார்ப்பு & ஸ்ரீவாரி தரிசனம்', desc: 'கைரேகை சரிபார்ப்புக்குப் பின் ஆனந்த நிலையத்தில் ஸ்ரீவாரி தரிசனம் மற்றும் லட்டு பெறவும்.' }
    ],
    guideLink: 'சர்வ தர்சன வழிகாட்டி →',
    sedLink: '₹300 சிறப்பு தரிசனம் →'
  },
  hi: {
    headerTitle: 'SSD व DD टोकन स्थिति',
    subtitle: 'तिरुमाला सर्वदर्शन टोकन',
    issuing: 'जारी हैं',
    paused: 'रुका हुआ',
    closed: 'समाप्त',
    completed: 'पूर्ण',
    copied: 'लिंक कॉपी हो गया',
    todayPrefix: 'आज •',
    quotaIssuingPill: 'टोकन सक्रिय रूप से जारी हैं',
    quotaPausedPill: 'कोटा रुका हुआ है',
    quotaCompletedPill: 'आज का कोटा समाप्त हो गया',
    noticeIssuing: 'काउंटर वर्तमान में खुले हैं और बायोमेट्रिक टोकन जारी कर रहे हैं।',
    noticePaused: 'टोकन जारी करना अस्थायी रूप से रुका हुआ है। अगली घोषणा की प्रतीक्षा करें।',
    noticeCompleted: (d: string) => `${d} के लिए टोकन पूरी तरह से जारी किए जा चुके हैं।`,
    ssdTitle: 'SSD टोकन',
    ssdSub: 'स्लॉटेड सर्वदर्शन',
    ddTitle: 'DD टोकन',
    ddSub: 'दिव्य दर्शन (पैदल मार्ग)',
    startedAt: 'शुरू होने का समय',
    quotaCompletedAt: 'कोटा पूरा होने का समय',
    currentStatus: 'वर्तमान स्थिति',
    countersActive: 'काउंटर सक्रिय हैं',
    nextReleaseTitle: 'अगला अपेक्षित जारी समय',
    notifAlert: 'अगली रिलीज के लिए नोटिफिकेशन सेट किया गया!',
    advisoryOpenTitle: 'SSD और DD टोकन काउंटर वर्तमान में खुले हैं।',
    advisoryOpenDesc: 'मूल भौतिक आधार कार्ड अनिवार्य है। सीधे विष्णु निवासम, श्रीनिवासम या भूदेवी कॉम्प्लेक्स पहुंचें।',
    advisoryClosedTitle: 'आज का SSD और DD टोकन कोटा समाप्त हो चुका है।',
    advisoryClosedDesc: 'कृपया अगले रिलीज की प्रतीक्षा करें। टोकन का समय TTD अपडेट पर निर्भर करता है।',
    counterLocationsTitle: 'तिरुपति टोकन काउंटर स्थल',
    centersCount: '3 केंद्र',
    rulesTitle: 'टोकन प्राप्त करने के अनिवार्य नियम',
    rules: [
      {
        title: 'मूल आधार कार्ड अनिवार्य',
        desc: 'प्रत्येक तीर्थयात्री (5 वर्ष से अधिक उम्र के बच्चों सहित) के पास मूल आधार कार्ड होना अनिवार्य है।'
      },
      {
        title: 'व्यक्तिगत रूप से उपस्थित होना अनिवार्य',
        desc: 'काउंटर पर लाइव फोटो और फिंगरप्रिंट स्कैन लिया जाता है। एक व्यक्ति दूसरों के लिए टोकन नहीं ले सकता।'
      },
      {
        title: '30-दिवसीय आवृत्ति सीमा नियम',
        desc: 'एक आधार नंबर पर 30 दिनों में केवल एक बार ही SSD बायोमेट्रिक टोकन प्राप्त किया जा सकता है।'
      }
    ],
    journeyTitle: 'SSD टोकन दर्शन यात्रा के चरण',
    steps: [
      { step: 1, title: 'तिरुपति टोकन काउंटर पर पहुंचें', desc: 'सुबह-सुबह विष्णु निवासम, श्रीनिवासम या भूदेवी कॉम्प्लेक्स जाएं।' },
      { step: 2, title: 'आधार बायोमेट्रिक स्कैन व टोकन पर्ची', desc: 'आधार स्कैन कराएं व फोटो खिंचवाएं। समय स्लॉट वाली पर्ची प्राप्त करें।' },
      { step: 3, title: 'तिरुमाला की ओर प्रस्थान', desc: 'अपने स्लॉट समय से 2 घंटे पहले घाट रोड या पैदल मार्ग से तिरुमाला पहुंचें।' },
      { step: 4, title: 'स्लॉटेड कतार द्वार पर रिपोर्ट करें', desc: 'टोकन पर मुद्रित समय पर ही निर्दिष्ट SSD प्रवेश द्वार पर पहुंचें।' },
      { step: 5, title: 'बायोमेट्रिक सत्यापन व श्रीवारी दर्शन', desc: 'फिंगरप्रिंट मिलान के बाद आनंद निलयम में श्रीवारी दर्शन व लड्डू प्रसादम प्राप्त करें।' }
    ],
    guideLink: 'सर्वदर्शन मार्गदर्शिका →',
    sedLink: '₹300 विशेष प्रवेश →'
  }
};

export default function SsdTokensStandalonePage() {
  const router = useRouter();
  const lang = useLanguage();

  const [ssdStatus, setSsdStatus] = useState<'issuing' | 'paused' | 'closed-for-day' | 'suspended'>('closed-for-day');
  const [nextTokenTime, setNextTokenTime] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [ssdTokenDetails, setSsdTokenDetails] = useState<TokenBatchDetails | null>(null);
  const [ddTokenDetails, setDdTokenDetails] = useState<TokenBatchDetails | null>(null);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Updating...');
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
        if (data.ssdTokenDetails) setSsdTokenDetails(data.ssdTokenDetails);
        if (data.ddTokenDetails) setDdTokenDetails(data.ddTokenDetails);

        const updateDate = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
        const dateStr = updateDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = updateDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
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

  const isIssuing = ssdStatus === 'issuing' || ssdTokenDetails?.status === 'issuing' || ddTokenDetails?.status === 'issuing';
  const isPaused = (ssdStatus === 'paused' || ssdTokenDetails?.status === 'paused') && !isIssuing;
  const isClosed = !isIssuing && !isPaused;

  const t = SSD_TEXTS[lang] || SSD_TEXTS.en;

  const now = new Date();
  const MONTHS: Record<string, string[]> = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    te: ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'],
    kn: ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'],
    ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
    hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
  };
  const activeMonths = MONTHS[lang] || MONTHS.en;
  const todayFormatted = `${now.getDate()} ${activeMonths[now.getMonth()]} ${now.getFullYear()}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowSuffix: Record<string, string> = {
    en: '(Tomorrow)',
    te: '(రేపు)',
    kn: '(ನಾಳೆ)',
    ta: '(நாளை)',
    hi: '(कल)'
  };
  const tomorrowFormatted = `${tomorrow.getDate()} ${activeMonths[tomorrow.getMonth()]} ${tomorrow.getFullYear()} ${tomorrowSuffix[lang] || tomorrowSuffix.en}`;

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
                {t.headerTitle}
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#D1FAE5',
                fontWeight: 500,
                margin: '2px 0 0 0',
                opacity: 0.95
              }}>
                {t.subtitle}
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
            backgroundColor: isIssuing ? '#DCFCE7' : isPaused ? '#FEF3C7' : '#FEE2E2',
            color: isIssuing ? '#15803D' : isPaused ? '#B45309' : '#B91C1C',
            fontSize: '11.5px',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            flexShrink: 0
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isIssuing ? '#16A34A' : isPaused ? '#D97706' : '#DC2626'
            }} />
            <span>
              {isIssuing
                ? t.issuing
                : isPaused
                  ? t.paused
                  : t.closed}
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
          <CheckCircle2 size={14} color="#4ADE80" /> {t.copied}
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
          background: isIssuing
            ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
            : isPaused
              ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'
              : 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
          border: `1px solid ${isIssuing ? '#BBF7D0' : isPaused ? '#FDE68A' : '#FEE2E2'}`,
          borderRadius: '18px',
          padding: '12px 14px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: isIssuing ? '#DCFCE7' : isPaused ? '#FEF3C7' : '#FEE2E2',
                color: isIssuing ? '#15803D' : isPaused ? '#D97706' : '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={16} strokeWidth={2.3} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>
                {`${t.todayPrefix} ${todayFormatted}`}
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 9px',
              borderRadius: '9999px',
              backgroundColor: isIssuing ? '#DCFCE7' : isPaused ? '#FEF3C7' : '#FEE2E2',
              color: isIssuing ? '#166534' : isPaused ? '#92400E' : '#991B1B',
              fontSize: '10.5px',
              fontWeight: 800,
              border: `1px solid ${isIssuing ? '#BBF7D0' : isPaused ? '#FDE68A' : '#FECACA'}`
            }}>
              {isIssuing
                ? t.quotaIssuingPill
                : isPaused
                  ? t.quotaPausedPill
                  : t.quotaCompletedPill}
            </div>
          </div>

          <p style={{
            fontSize: '11.5px',
            color: isIssuing ? '#166534' : isPaused ? '#92400E' : '#7F1D1D',
            fontWeight: 500,
            margin: '8px 0 0 0',
            lineHeight: 1.4
          }}>
            {notice || (isIssuing
              ? t.noticeIssuing
              : isPaused
                ? t.noticePaused
                : t.noticeCompleted(todayFormatted))}
          </p>
        </section>

        {/* ── 2-COLUMN GRID: SSD TOKENS & DD TOKENS ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '10px'
        }}>
          {/* LEFT: SSD TOKENS */}
          {(() => {
            const ssdStatusStr = (ssdTokenDetails?.status || (isIssuing ? 'issuing' : isPaused ? 'paused' : 'completed')).toLowerCase();
            const isSsdIssuing = ssdStatusStr === 'issuing' || ssdStatusStr === 'available';
            const isSsdPaused = ssdStatusStr === 'paused';
            const isSsdDone = !isSsdIssuing && !isSsdPaused;

            return (
              <div style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F5FBF6 100%)',
                border: `1px solid ${isSsdIssuing ? '#BBF7D0' : isSsdPaused ? '#FDE68A' : '#D5ECD8'}`,
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
                    backgroundColor: isSsdIssuing ? '#DCFCE7' : isSsdPaused ? '#FEF3C7' : '#F1F5F9',
                    color: isSsdIssuing ? '#15803D' : isSsdPaused ? '#B45309' : '#0A4E33',
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
                      {t.ssdTitle}
                    </h3>
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.ssdSub}
                    </span>
                  </div>
                </div>

                {/* Big Numbers Counter */}
                <div style={{ margin: '4px 0 6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>
                      {ssdTokenDetails?.tokensLeft ?? (isClosed ? '0' : 'Available')}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                      / {ssdTokenDetails?.totalTokens ?? '10,000'}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2.5px 8px',
                  borderRadius: '9999px',
                  backgroundColor: isSsdIssuing ? '#DCFCE7' : isSsdPaused ? '#FEF3C7' : '#FEE2E2',
                  color: isSsdIssuing ? '#166534' : isSsdPaused ? '#92400E' : '#991B1B',
                  fontSize: '10px',
                  fontWeight: 800,
                  alignSelf: 'flex-start',
                  marginBottom: '10px',
                  border: `1px solid ${isSsdIssuing ? '#BBF7D0' : isSsdPaused ? '#FDE68A' : '#FECACA'}`
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isSsdIssuing ? '#16A34A' : isSsdPaused ? '#D97706' : '#DC2626' }} />
                  <span>
                    {isSsdIssuing
                      ? t.issuing
                      : isSsdPaused
                        ? t.paused
                        : t.completed}
                  </span>
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
                        {t.startedAt}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                        {ssdTokenDetails?.startTime || 'Morning Batch'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '3px',
                      backgroundColor: isSsdDone ? '#FEE2E2' : '#EFF6FF',
                      color: isSsdDone ? '#DC2626' : '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px'
                    }}>
                      <Square size={7} fill={isSsdDone ? '#DC2626' : '#2563EB'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                        {isSsdDone ? t.quotaCompletedAt : t.currentStatus}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                        {isSsdDone ? (ssdTokenDetails?.completedTime || t.completed) : t.countersActive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* RIGHT: DD TOKENS */}
          {(() => {
            const ddStatusStr = (ddTokenDetails?.status || (isIssuing ? 'issuing' : isPaused ? 'paused' : 'completed')).toLowerCase();
            const isDdIssuing = ddStatusStr === 'issuing' || ddStatusStr === 'available';
            const isDdPaused = ddStatusStr === 'paused';
            const isDdDone = !isDdIssuing && !isDdPaused;

            return (
              <div style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
                border: `1px solid ${isDdIssuing ? '#BBF7D0' : isDdPaused ? '#FDE68A' : '#FEF3C7'}`,
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
                    backgroundColor: isDdIssuing ? '#DCFCE7' : isDdPaused ? '#FEF3C7' : '#FEF3C7',
                    color: isDdIssuing ? '#15803D' : '#D97706',
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
                      {t.ddTitle}
                    </h3>
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.ddSub}
                    </span>
                  </div>
                </div>

                {/* Big Numbers Counter */}
                <div style={{ margin: '4px 0 6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#0A4E33', lineHeight: 1 }}>
                      {ddTokenDetails?.tokensLeft ?? (isClosed ? '0' : 'Available')}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                      / {ddTokenDetails?.totalTokens ?? '2,000'}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2.5px 8px',
                  borderRadius: '9999px',
                  backgroundColor: isDdIssuing ? '#DCFCE7' : isDdPaused ? '#FEF3C7' : '#FEE2E2',
                  color: isDdIssuing ? '#166534' : isDdPaused ? '#92400E' : '#991B1B',
                  fontSize: '10px',
                  fontWeight: 800,
                  alignSelf: 'flex-start',
                  marginBottom: '10px',
                  border: `1px solid ${isDdIssuing ? '#BBF7D0' : isDdPaused ? '#FDE68A' : '#FECACA'}`
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isDdIssuing ? '#16A34A' : isDdPaused ? '#D97706' : '#DC2626' }} />
                  <span>
                    {isDdIssuing
                      ? t.issuing
                      : isDdPaused
                        ? t.paused
                        : t.completed}
                  </span>
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
                        {t.startedAt}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                        {ddTokenDetails?.startTime || 'Morning Batch'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '3px',
                      backgroundColor: isDdDone ? '#FEE2E2' : '#EFF6FF',
                      color: isDdDone ? '#DC2626' : '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px'
                    }}>
                      <Square size={7} fill={isDdDone ? '#DC2626' : '#2563EB'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                        {isDdDone ? t.quotaCompletedAt : t.currentStatus}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#0F172A', fontWeight: 800 }}>
                        {isDdDone ? (ddTokenDetails?.completedTime || t.completed) : t.countersActive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
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
                {t.nextReleaseTitle}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {tomorrowFormatted}
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(t.notifAlert)}
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
            <span>{nextTokenTime || '5:00 AM'}</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </section>

        {/* ── CARD 4: ADVISORY / GREEN TIP CARD ── */}
        <section style={{
          background: isIssuing
            ? 'linear-gradient(135deg, #F0FDF4 0%, #E8F8ED 100%)'
            : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
          border: `1px solid ${isIssuing ? '#BBF7D0' : '#E2E8F0'}`,
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
            backgroundColor: isIssuing ? '#DCFCE7' : '#E2E8F0',
            color: isIssuing ? '#15803D' : '#475569',
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
              color: isIssuing ? '#14532D' : '#0F172A',
              margin: '0 0 2px 0'
            }}>
              {isIssuing ? t.advisoryOpenTitle : t.advisoryClosedTitle}
            </h4>
            <p style={{
              fontSize: '11px',
              color: isIssuing ? '#166534' : '#475569',
              margin: 0,
              lineHeight: 1.4,
              fontWeight: 500
            }}>
              {isIssuing ? t.advisoryOpenDesc : t.advisoryClosedDesc}
            </p>
          </div>
        </section>

        {/* ── CARD 5: TIRUPATI PHYSICAL TOKEN COUNTERS ── */}
        <section style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#059669" />
              <span>{t.counterLocationsTitle}</span>
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>{t.centersCount}</span>
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
                          {(center.names as Record<string, string>)[lang] || center.names.en}
                        </h4>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                          {(center.landmarks as Record<string, string>)[lang] || center.landmarks.en}
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
            <span>{t.rulesTitle}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {t.rules.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '12px', color: '#0F172A' }}>{rule.title}</strong>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '1px 0 0 0' }}>{rule.desc}</p>
                </div>
              </div>
            ))}
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
            <span>{t.journeyTitle}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {t.steps.map((st) => (
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

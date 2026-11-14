import React from 'react';
import Link from 'next/link';
import { Sparkles, Navigation, Users, Info } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { getISTDate } from '@/utils/location';

const TEXTS = {
  en: {
    recommended: 'RECOMMENDED',
    recommendedNow: 'RECOMMENDED RIGHT NOW',
    whyRecommended: 'Why Recommended:',
    viewDetails: 'View Details',
    startNavigation: 'Start Navigation →',
    crowdWait: 'Overall Crowd Wait:',
    quietNight: 'Quiet · Night Hours',
    lowCrowd: 'Low Crowd · Quick Entry',
    modCrowd: 'Moderate · ~30 Min Wait',
    highCrowd: 'High Crowd · Plan Ahead',
    peakCrowd: 'Peak Crowd · Long Wait',
    checkLive: 'Check Live Status',
    coveredIndoor: 'Covered & Indoor',
  },
  te: {
    recommended: 'సారథి సూచన',
    recommendedNow: 'ప్రస్తుత సారథి సూచన',
    whyRecommended: 'సారథి సూచన:',
    viewDetails: 'వివరాలు చూడండి',
    startNavigation: 'నావిగేషన్ ప్రారంభించండి →',
    crowdWait: 'మొత్తం వేచి ఉండే సమయం:',
    quietNight: 'ప్రశాంతం · రాత్రి సమయం',
    lowCrowd: 'తక్కువ రద్దీ · వేగ ప్రవేశం',
    modCrowd: 'మోస్తరు రద్దీ · ~30 ని. వేచి',
    highCrowd: 'అధిక రద్దీ · ముందుగా ప్లాన్ చేయండి',
    peakCrowd: 'గరిష్ట రద్దీ · ఎక్కువ వేచి',
    checkLive: 'లైవ్ స్థితి చూడండి',
    coveredIndoor: 'వాతావరణం అనుకూలంగా ఉంది · ఇండోర్',
  },
  kn: {
    recommended: 'ಸಾರಥಿ ಶಿಫಾರಸು',
    recommendedNow: 'ಪ್ರಸ್ತುತ ಸಾರಥಿ ಶಿಫಾರಸು',
    whyRecommended: 'ಶಿಫಾರಸಿನ ಕಾರಣ:',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    startNavigation: 'ನ್ಯಾವಿಗೇಷನ್ ಪ್ರಾರಂಭಿಸಿ →',
    crowdWait: 'ಒಟ್ಟು ಕಾಯುವ ಸಮಯ:',
    quietNight: 'ಪ್ರಶಾಂತ · ರಾತ್ರಿ ಸಮಯ',
    lowCrowd: 'ಕಡಿಮೆ ಜನದಟ್ಟಣೆ · ಶೀಘ್ರ ಪ್ರವೇಶ',
    modCrowd: 'ಸಾಧಾರಣ · ~30 ನಿಮಿ ಕಾಯುವಿಕೆ',
    highCrowd: 'ಅಧಿಕ ದಟ್ಟಣೆ · ಮುಂಚಿತವಾಗಿ ಯೋಜಿಸಿ',
    peakCrowd: 'ಗರಿಷ್ಠ ದಟ್ಟಣೆ · ದೀರ್ಘ ಕಾಯುವಿಕೆ',
    checkLive: 'ಲೈವ್ ಸ್ಥಿತಿ ನೋಡಿ',
    coveredIndoor: 'ಸಂಪೂರ್ಣ ಆವೃತ · ಇನ್‌ಡೋರ್',
  },
  hi: {
    recommended: 'सारथी अनुशंसा',
    recommendedNow: 'अभी की सारथी अनुशंसा',
    whyRecommended: 'अनुशंसा का कारण:',
    viewDetails: 'विवरण देखें',
    startNavigation: 'नेविगेशन शुरू करें →',
    crowdWait: 'कुल प्रतीक्षा समय:',
    quietNight: 'शांत · रात्रि समय',
    lowCrowd: 'कम भीड़ · त्वरित प्रवेश',
    modCrowd: 'सामान्य · ~30 मिनट प्रतीक्षा',
    highCrowd: 'भारी भीड़ · योजना बनाएं',
    peakCrowd: 'अत्यधिक भीड़ · लंबी प्रतीक्षा',
    checkLive: 'लाइव स्थिति देखें',
    coveredIndoor: 'कवर्ड एवं इंडोर',
  },
  ta: {
    recommended: 'சாரதி பரிந்துரை',
    recommendedNow: 'தற்போதைய பரிந்துரை',
    whyRecommended: 'பரிந்துரைக்கப்பட்ட காரணம்:',
    viewDetails: 'விவரங்கள் காண்க',
    startNavigation: 'வழிகாட்டலைத் தொடங்கவும் →',
    crowdWait: 'மொத்த காத்திருப்பு நேரம்:',
    quietNight: 'அமைதியானது · இரவு நேரம்',
    lowCrowd: 'குறைந்த கூட்டம் · வேக நுழைவு',
    modCrowd: 'மிதமான கூட்டம் · ~30 நிமி காத்திருப்பு',
    highCrowd: 'அதிக கூட்டம் · திட்டமிடுங்கள்',
    peakCrowd: 'அதிகபட்ச கூட்டம் · நீண்ட காத்திருப்பு',
    checkLive: 'நேரலை நிலை காண்க',
    coveredIndoor: 'உட்புற தங்குமிடம்',
  }
};

export function RecommendationCard({ 
  liveStatus, 
  todayFestival,
  variant = 'mobile'
}: { 
  liveStatus: any; 
  todayFestival?: any;
  variant?: 'mobile' | 'desktop';
}) {
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  const status = liveStatus || {};

  const date = getISTDate();
  const dayOfWeek = date.getDay();
  const hr = date.getHours();
  const isNight = hr >= 21 || hr < 5;
  const crowd = (status.crowdLevel || 'moderate').toLowerCase();
  const weatherStr = (status.weather || '').toLowerCase();
  const isRainy = weatherStr.includes('rain') || weatherStr.includes('shower') || weatherStr.includes('storm');

  // Dynamic crowd status derived from live data
  const getDynamicCrowdStatus = (): string => {
    if (isNight) return t.quietNight;
    if (crowd === 'low')       return t.lowCrowd;
    if (crowd === 'moderate')  return t.modCrowd;
    if (crowd === 'high')      return t.highCrowd;
    if (crowd === 'very-high') return t.peakCrowd;
    return t.checkLive;
  };

  const dynamicCrowd = getDynamicCrowdStatus();

  // Multi-lingual dictionary for recommendations
  const pick = (recObj: Record<string, string>) => recObj[lang] || recObj.en;

  // Default (Sunday fallback)
  let rec = {
    title: pick({
      en: 'Kapila Theertham',
      te: 'కపిల తీర్థం',
      kn: 'ಕಪಿಲ ತೀರ್ಥಂ',
      hi: 'कपिला तीर्थम',
      ta: 'கபில தீர்த்தம்'
    }),
    distance: pick({
      en: '12 min drive',
      te: '12 ని. ప్రయాణం',
      kn: '12 ನಿಮಿ ಪ್ರಯಾಣ',
      hi: '12 मिनट की दूरी',
      ta: '12 நிமி பயணம்'
    }),
    crowdStatus: dynamicCrowd,
    link: '/place/kapila-theertham',
    image: '/assets/temples/kapila-theertham.png',
    priorityTag: pick({
      en: 'Priority 3: Weekday Theme',
      te: 'ప్రాధాన్యత 3: వారపు థీమ్',
      kn: 'ಆದ್ಯತೆ 3: ವಾರದ ವಿಶೇಷ',
      hi: 'प्राथमिकता 3: साप्ताहिक थीम',
      ta: 'முன்னுரிமை 3: வாராந்திர கருப்பொருள்'
    }),
    reason: pick({
      en: 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills',
      te: 'శివుని సోమవారం · ఏడు కొండల వద్ద పవిత్ర జలపాతం గుహాలయం',
      kn: 'ಶಿವನ ಸೋಮವಾರ · ಸಪ್ತಗಿರಿ ತಪ್ಪಲಿನ ಪವಿತ್ರ ಜಲಪಾತ ಗುಹಾಲಯ',
      hi: 'शिव सोमवार · सात पहाड़ियों की तलहटी में स्थित पवित्र जलप्रपात गुफा मंदिर',
      ta: 'சிவ சோமவாரம் · ஏழுமலையின் அடிவாரத்தில் அமைந்த புனித நீர்வீழ்ச்சி குகைக்கோவில்'
    })
  };

  // PRIORITY 1: Festival Calendar Override
  if (todayFestival && (todayFestival.isToday || todayFestival.isLive)) {
    const festiveLabel = pick({ en: 'Festive', te: 'పండుగ', kn: 'ಉತ್ಸವ', hi: 'त्योहार', ta: 'திருவிழா' });
    const officialVenue = pick({ en: 'Official venue for', te: 'అధికారిక వేదిక:', kn: 'ಅಧಿಕೃತ ತಾಣ:', hi: 'का आधिकारिक आयोजन स्थल:', ta: 'அதிகாரப்பூர்வ தலம்:' });
    rec = {
      title: todayFestival.location || pick({
        en: 'Sri Venkateswara Swamy Temple',
        te: 'శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం',
        kn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री वेंकटेश्वर स्वामी मंदिर',
        ta: 'ஸ்ரீ வெங்கடேஸ்வர சுவாமி கோவில்'
      }),
      distance: pick({
        en: '20 min · Ghat Road',
        te: '20 ని. · ఘాట్ రోడ్',
        kn: '20 ನಿಮಿ · ಘಾಟ್ ರಸ್ತೆ',
        hi: '20 मिनट · घाट रोड',
        ta: '20 நிமி · காட் ரோடு'
      }),
      crowdStatus: `${festiveLabel} · ${dynamicCrowd}`,
      link: todayFestival.placeId ? `/place/${todayFestival.placeId}` : '/festivals',
      image: todayFestival.coverImage || '/assets/temples/venkateswara.png',
      priorityTag: pick({
        en: 'Priority 1: Festival Calendar',
        te: 'ప్రాధాన్యత 1: పండుగ క్యాలెండర్',
        kn: 'ಆದ್ಯತೆ 1: ಉತ್ಸವ ಕ್ಯಾಲೆಂಡರ್',
        hi: 'प्राथमिकता 1: उत्सव कैलेंडर',
        ta: 'முன்னுரிமை 1: திருவிழா நாட்காட்டி'
      }),
      reason: `${officialVenue} ${todayFestival.name || todayFestival.title}`
    };
  }
  // PRIORITY 2: Important Temple Day
  else if (dayOfWeek === 6) { // Saturday — Venkateswara (Tirumala)
    rec = {
      title: pick({
        en: 'Sri Venkateswara Swamy Temple',
        te: 'శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం',
        kn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री वेंकटेश्वर स्वामी मंदिर',
        ta: 'ஸ்ரீ வெங்கடேஸ்வர சுவாமி கோவில்'
      }),
      distance: pick({
        en: '20 min · Ghat Road',
        te: '20 ని. · ఘాట్ రోడ్',
        kn: '20 ನಿಮಿ · ಘಾಟ್ ರಸ್ತೆ',
        hi: '20 मिनट · घाट रोड',
        ta: '20 நிமி · காட் ரோடு'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/venkateswara',
      image: '/assets/temples/venkateswara.png',
      priorityTag: pick({
        en: 'Priority 2: Important Temple Day',
        te: 'ప్రాధాన్యత 2: ముఖ్యమైన ఆలయ దినం',
        kn: 'ಆದ್ಯತೆ 2: ಮುಖ್ಯ ದೇವಾಲಯ ದಿನ',
        hi: 'प्राथमिकता 2: मुख्य मंदिर दिवस',
        ta: 'முன்னுரிமை 2: முக்கிய கோவில் நாள்'
      }),
      reason: pick({
        en: 'Holy Saturday · Primary Tirumala Seven Hills temple',
        te: 'పవిత్ర శనివారం · ప్రధాన తిరుమల ఏడు కొండల ఆలయం',
        kn: 'ಪವಿತ್ರ ಶನಿವಾರ · ಪ್ರಧಾನ ತಿರುಮಲ ಸಪ್ತಗಿರಿ ದೇವಾಲಯ',
        hi: 'पवित्र शनिवार · मुख्य तिरुमला सप्तगिरि मंदिर',
        ta: 'புனித சனிக்கிழமை · முதன்மை திருமலை ஏழுமலை ஆலயம்'
      })
    };
  } else if (dayOfWeek === 5) { // Friday — Padmavathi (Tiruchanoor, 5 km)
    rec = {
      title: pick({
        en: 'Sri Padmavathi Ammavari Temple',
        te: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం',
        kn: 'ಶ್ರೀ ಪದ್ಮಾವತಿ ಅಮ್ಮನವರ ದೇವಾಲಯ',
        hi: 'श्री पद्मावती अम्मावारी मंदिर',
        ta: 'ஸ்ரீ பத்மாவதி தாயார் கோவில்'
      }),
      distance: pick({
        en: '10 min drive',
        te: '10 ని. ప్రయాణం',
        kn: '10 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '10 मिनट की दूरी',
        ta: '10 நிமி பயணம்'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/padmavathi',
      image: '/assets/temples/padmavathi.png',
      priorityTag: pick({
        en: 'Priority 2: Important Temple Day',
        te: 'ప్రాధాన్యత 2: ముఖ్యమైన ఆలయ దినం',
        kn: 'ಆದ್ಯತೆ 2: ಮುಖ್ಯ ದೇವಾಲಯ ದಿನ',
        hi: 'प्राथमिकता 2: मुख्य मंदिर दिवस',
        ta: 'முன்னுரிமை 2: முக்கிய கோவில் நாள்'
      }),
      reason: pick({
        en: 'Goddess Lakshmi Friday · Official Tiruchanoor divine consort shrine',
        te: 'లక్ష్మీదేవి శుక్రవారం · అధికారిక తిరుచానూరు అమ్మవారి ఆలయం',
        kn: 'ಲಕ್ಷ್ಮೀದೇವಿ ಶುಕ್ರವಾರ · ಅಧಿಕೃತ ತಿರುಚಾನೂರು ಅಮ್ಮನವರ ಸನ್ನಿಧಿ',
        hi: 'महालक्ष्मी शुक्रवार · तिरुचानूर स्थित श्री पद्मावती माता का पावन मंदिर',
        ta: 'மகாலட்சுமி வெள்ளிக்கிழமை · திருச்சானூர் தாயாரின் திவ்ய சன்னதி'
      })
    };
  }
  // PRIORITY 3: Weekday Spiritual Calendar
  else if (dayOfWeek === 1) { // Monday — Kapila Theertham (6 km from town)
    rec = {
      title: pick({
        en: 'Kapila Theertham',
        te: 'కపిల తీర్థం',
        kn: 'ಕಪಿಲ ತೀರ್ಥಂ',
        hi: 'कपिला तीर्थम',
        ta: 'கபில தீர்த்தம்'
      }),
      distance: pick({
        en: '12 min drive',
        te: '12 ని. ప్రయాణం',
        kn: '12 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '12 मिनट की दूरी',
        ta: '12 நிமி பயணம்'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/kapila-theertham',
      image: '/assets/temples/kapila-theertham.png',
      priorityTag: pick({
        en: 'Priority 3: Lord Shiva Monday',
        te: 'ప్రాధాన్యత 3: శివుని సోమవారం',
        kn: 'ಆದ್ಯತೆ 3: ಶಿವನ ಸೋಮವಾರ',
        hi: 'प्राथमिकता 3: शिव सोमवार',
        ta: 'முன்னுரிமை 3: சிவ சோமவாரம்'
      }),
      reason: pick({
        en: 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills',
        te: 'శివుని సోమవారం · ఏడు కొండల వద్ద పవిత్ర జలపాతం గుహాలయం',
        kn: 'ಶಿವನ ಸೋಮವಾರ · ಸಪ್ತಗಿರಿ ತಪ್ಪಲಿನ ಪವಿತ್ರ ಜಲಪಾತ ಗುಹಾಲಯ',
        hi: 'शिव सोमवार · सात पहाड़ियों की तलहटी में स्थित पवित्र जलप्रपात गुफा मंदिर',
        ta: 'சிவ சோமவாரம் · ஏழுமலையின் அடிவாரத்தில் அமைந்த புனித நீர்வீழ்ச்சி குகைக்கோவில்'
      })
    };
  } else if (dayOfWeek === 2) { // Tuesday — Japali Hanuman (Tirumala, 20 km)
    rec = {
      title: pick({
        en: 'Japali Hanuman Temple',
        te: 'జాపాలి హనుమాన్ ఆలయం',
        kn: 'ಜಾಪಾಲಿ ಹನುಮಾನ್ ದೇವಾಲಯ',
        hi: 'जापाली हनुमान मंदिर',
        ta: 'ஜாபாலி அனுமன் கோவில்'
      }),
      distance: pick({
        en: '20 min · Ghat Road',
        te: '20 ని. · ఘాట్ రోడ్',
        kn: '20 ನಿಮಿ · ಘಾಟ್ ರಸ್ತೆ',
        hi: '20 मिनट · घाट रोड',
        ta: '20 நிமி · காட் ரோடு'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/japali-hanuman',
      image: '/assets/temples/bedi-anjaneya.png',
      priorityTag: pick({
        en: 'Priority 3: Hanuman Tuesday',
        te: 'ప్రాధాన్యత 3: హనుమాన్ మంగళవారం',
        kn: 'ಆದ್ಯತೆ 3: ಹನುಮಾನ್ ಮಂಗಳವಾರ',
        hi: 'प्राथमिकता 3: हनुमान मंगलवार',
        ta: 'முன்னுரிமை 3: அனுமன் செவ்வாய்க்கிழமை'
      }),
      reason: pick({
        en: 'Hanuman Tuesday · Sacred Hanuman shrine on the Seven Hills',
        te: 'హనుమాన్ మంగళవారం · ఏడు కొండలపై పవిత్ర హనుమాన్ ఆలయం',
        kn: 'ಹನುಮಾನ್ ಮಂಗಳವಾರ · ಸಪ್ತಗಿರಿಯ ಮೇಲಿರುವ ಪವಿತ್ರ ಆಂಜನೇಯ ಸನ್ನಿಧಿ',
        hi: 'हनुमान मंगलवार · तिरुमला की पहाड़ियों पर स्थित सिद्ध हनुमान मंदिर',
        ta: 'அனுமன் செவ்வாய் · திருமலை ஏழுமலையில் அமைந்துள்ள புனித ஆஞ்சநேயர் ஆலயம்'
      })
    };
  } else if (dayOfWeek === 3) { // Wednesday — Kodandarama (1.5 km, town center)
    rec = {
      title: pick({
        en: 'Sri Kodandarama Swamy Temple',
        te: 'శ్రీ కోదండరామ స్వామి ఆలయం',
        kn: 'ಶ್ರೀ ಕೋದಂಡರಾಮ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री कोदंडराम स्वामी मंदिर',
        ta: 'ஸ்ரீ கோதண்டராம சுவாமி கோவில்'
      }),
      distance: pick({
        en: '1.5 km · 5 min drive',
        te: '1.5 కి.మీ · 5 ని. ప్రయాణం',
        kn: '1.5 ಕಿ.ಮೀ · 5 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '1.5 किमी · 5 मिनट की दूरी',
        ta: '1.5 கி.மீ · 5 நிமி பயணம்'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/kodandarama-temple',
      image: '/assets/temples/padmavathi.png',
      priorityTag: pick({
        en: 'Priority 3: Lord Rama Wednesday',
        te: 'ప్రాధాన్యత 3: శ్రీరామ బుధవారం',
        kn: 'ಆದ್ಯತೆ 3: ಶ್ರೀರಾಮ ಬುಧವಾರ',
        hi: 'प्राथमिकता 3: श्रीराम बुधवार',
        ta: 'முன்னுரிமை 3: ஸ்ரீராமர் புதன்கிழமை'
      }),
      reason: pick({
        en: 'Lord Rama Wednesday · 1,000-year historic Vijayanagara shrine',
        te: 'శ్రీరామ బుధవారం · 1,000 సంవత్సరాల చారిత్రక విజయనగర ఆలయం',
        kn: 'ಶ್ರೀರಾಮ ಬುಧವಾರ · 1,000 ವರ್ಷಗಳ ಐತಿಹಾಸಿಕ ವಿಜಯನಗರ ದೇವಾಲಯ',
        hi: 'श्रीराम बुधवार · 1,000 वर्ष पुराना ऐतिहासिक विजयनगर कालीन मंदिर',
        ta: 'ஸ்ரீராமர் புதன் · 1,000 ஆண்டுகள் பழமையான விஜயநகர கால வரலாற்றுத் திருத்தலம்'
      })
    };
  } else if (dayOfWeek === 4) { // Thursday — Govindaraja (3 km, town center)
    rec = {
      title: pick({
        en: 'Sri Govindaraja Swamy Temple',
        te: 'శ్రీ గోవిందరాజ స్వామి ఆలయం',
        kn: 'ಶ್ರೀ ಗೋವಿಂದರಾಜ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री गोविंदराज स्वामी मंदिर',
        ta: 'ஸ்ரீ கோவிந்தராஜ சுவாமி கோவில்'
      }),
      distance: pick({
        en: '6 min drive',
        te: '6 ని. ప్రయాణం',
        kn: '6 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '6 मिनट की दूरी',
        ta: '6 நிமி பயணம்'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/govindaraja',
      image: '/assets/temples/govindaraja.png',
      priorityTag: pick({
        en: 'Priority 3: Guru Thursday',
        te: 'ప్రాధాన్యత 3: గురు గురువారం',
        kn: 'ಆದ್ಯತೆ 3: ಗುರು ಗುರುವಾರ',
        hi: 'प्राथमिकता 3: गुरु गुरुवार',
        ta: 'முன்னுரிமை 3: குரு வியாழக்கிழமை'
      }),
      reason: pick({
        en: 'Guru & Annamayya Thursday · Ancient heritage shrine in Tirupati town',
        te: 'గురు & అన్నమయ్య గురువారం · తిరుపతి పట్టణంలోని ప్రాచీన ఆలయం',
        kn: 'ಗುರು & ಅನ್ನಮಯ್ಯ ಗುರುವಾರ · ತಿರುಪತಿ ಪಟ್ಟಣದ ಪ್ರಾಚೀನ ಐತಿಹಾಸಿಕ ದೇವಾಲಯ',
        hi: 'गुरु व अन्नमय्या गुरुवार · तिरुपति नगर में स्थित प्राचीन दिव्य धरोहर',
        ta: 'குரு வியாழன் · திருப்பதி நகர மத்தியில் அமைந்துள்ள புராதன திவ்ய திருத்தலம்'
      })
    };
  } else if (dayOfWeek === 0) { // Sunday — Bhu Varaha (Tirumala)
    rec = {
      title: pick({
        en: 'Sri Bhu Varaha Swamy Temple',
        te: 'శ్రీ భూ వరాహ స్వామి ఆలయం',
        kn: 'ಶ್ರೀ ಭೂ ವರಾಹ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री भू वराह स्वामी मंदिर',
        ta: 'ஸ்ரீ பூ வராக சுவாமி கோவில்'
      }),
      distance: pick({
        en: '20 min · Ghat Road',
        te: '20 ని. · ఘాట్ రోడ్',
        kn: '20 ನಿಮಿ · ಘಾಟ್ ರಸ್ತೆ',
        hi: '20 मिनट · घाट रोड',
        ta: '20 நிமி · காட் ரோடு'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/bhu-varaha',
      image: '/assets/temples/venkateswara.png',
      priorityTag: pick({
        en: 'Priority 3: Surya Narayana Sunday',
        te: 'ప్రాధాన్యత 3: సూర్యనారాయణ ఆదివారం',
        kn: 'ಆದ್ಯತೆ 3: ಸೂರ್ಯನಾರಾಯಣ ಭಾನುವಾರ',
        hi: 'प्राथमिकता 3: सूर्यनारायण रविवार',
        ta: 'முன்னுரிமை 3: சூரிய நாராயண ஞாயிறு'
      }),
      reason: pick({
        en: 'Surya Narayana Sunday · Ancient shrine to be visited before main darshan',
        te: 'సూర్యనారాయణ ఆదివారం · ప్రధాన దర్శనానికి ముందు సందర్శించాల్సిన ప్రాచీన ఆలయం',
        kn: 'ಸೂರ್ಯನಾರಾಯಣ ಭಾನುವಾರ · ಮುಖ್ಯ ದರ್ಶನಕ್ಕೆ ಮುನ್ನ ಭೇಟಿ ನೀಡಬೇಕಾದ ಆದಿ ಕ್ಷೇತ್ರ',
        hi: 'सूर्यनारायण रविवार · मुख्य दर्शन से पहले दर्शन किया जाने वाला आदिक्षेत्र',
        ta: 'சூரிய நாராயண ஞாயிறு · மூலவர் தரிசனத்திற்கு முன் தரிசிக்க வேண்டிய ஆதி க்ஷேத்திரம்'
      })
    };
  }

  // PRIORITY 4: Live condition override
  if (isRainy) {
    rec = {
      title: pick({
        en: 'ISKCON Tirupati',
        te: 'ఇస్కాన్ తిరుపతి',
        kn: 'ಇಸ್ಕಾನ್ ತಿರುಪತಿ',
        hi: 'इस्कॉन तिरुपति',
        ta: 'இஸ்கான் திருப்பதி'
      }),
      distance: pick({
        en: '4 min drive',
        te: '4 ని. ప్రయాణం',
        kn: '4 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '4 मिनट की दूरी',
        ta: '4 நிமி பயணம்'
      }),
      crowdStatus: t.coveredIndoor,
      link: '/place/iskcon-tirupati',
      image: '/images/places/img_11_iskcon-temple-tirupati_wl7dd2.jpg',
      priorityTag: pick({
        en: 'Weather Context: Rain Friendly',
        te: 'వాతావరణం: వర్షం అనుకూలం',
        kn: 'ಹವಾಮಾನ: ಮಳೆಗೆ ಸೂಕ್ತ',
        hi: 'मौसम: बारिश के अनुकूल',
        ta: 'வானிலை: மழைக்கு ஏற்றது'
      }),
      reason: pick({
        en: 'Rainy Weather · Covered indoor temple and comfortable seating',
        te: 'వర్షపు వాతావరణం · కవర్డ్ ఇండోర్ ఆలయం మరియు సౌకర్యవంతమైన సీటింగ్',
        kn: 'ಮಳೆಯ ವಾತಾವರಣ · ಸಂಪೂರ್ಣ ಆವೃತ ಇನ್‌ಡೋರ್ ದೇವಾಲಯ ಮತ್ತು ವಿಶ್ರಾಂತಿ ಆಸನ ವ್ಯವಸ್ಥೆ',
        hi: 'बारिश का मौसम · कवर्ड इंडोर मंदिर एवं आरामदायक बैठक व्यवस्था',
        ta: 'மழைக்காலம் · கூரையமைந்த உட்புற கோவில் மற்றும் வசதியான இருக்கை வசதி'
      })
    };
  } else if (crowd === 'high' || crowd === 'very-high') {
    rec = {
      title: pick({
        en: 'Sri Govindaraja Swamy Temple',
        te: 'శ్రీ గోవిందరాజ స్వామి ఆలయం',
        kn: 'ಶ್ರೀ ಗೋವಿಂದರಾಜ ಸ್ವಾಮಿ ದೇವಾಲಯ',
        hi: 'श्री गोविंदराज स्वामी मंदिर',
        ta: 'ஸ்ரீ கோவிந்தராஜ சுவாமி கோவில்'
      }),
      distance: pick({
        en: '6 min drive',
        te: '6 ని. ప్రయాణం',
        kn: '6 ನಿಮಿ ಪ್ರಯಾಣ',
        hi: '6 मिनट की दूरी',
        ta: '6 நிமி பயணம்'
      }),
      crowdStatus: dynamicCrowd,
      link: '/place/govindaraja',
      image: '/images/places/img_12_960px-Tirupathi__286337140675_29.jpg_hez2ha.jpg',
      priorityTag: pick({
        en: 'Queue Context: High Crowd Alternate',
        te: 'క్యూ: అధిక రద్దీ ప్రత్యామ్నాయం',
        kn: 'ಸರತಿ: ಅಧಿಕ ದಟ್ಟಣೆಗೆ ಪರ್ಯಾಯ',
        hi: 'कतार: भारी भीड़ का उत्तम विकल्प',
        ta: 'வரிசை: அதிக கூட்டத்திற்கு மாற்று'
      }),
      reason: pick({
        en: 'High Crowd in Tirumala · Fast entry alternate shrine in Tirupati town',
        te: 'తిరుమలలో అధిక రద్దీ · తిరుపతి పట్టణంలో వేగవంతమైన ప్రవేశ ప్రత్యామ్నాయ ఆలయం',
        kn: 'ತಿರುಮಲದಲ್ಲಿ ಭಾರಿ ದಟ್ಟಣೆ · ತಿರುಪತಿ ನಗರದಲ್ಲಿ ಶೀಘ್ರ ದರ್ಶನಕ್ಕೆ ಸೂಕ್ತ ಪರ್ಯಾಯ ದೇವಾಲಯ',
        hi: 'तिरुमला में भारी भीड़ · तिरुपति शहर में त्वरित दर्शन का सर्वोत्तम विकल्प',
        ta: 'திருமலையில் அதிக கூட்டம் · திருப்பதி நகரத்தில் விரைவு தரிசனத்திற்கான மாற்று ஆலயம்'
      })
    };
  }

  const isDesktop = variant === 'desktop';

  return (
    <div style={{ padding: isDesktop ? '0' : '0 16px 16px 16px', height: 'auto' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: isDesktop ? '24px' : '18px 20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: isDesktop ? '100%' : 'auto',
        boxSizing: 'border-box'
      }}>
        
          {/* RECOMMENDED BADGE WITH PRIORITY TAG */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#0F5132" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {t.recommendedNow}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#064E3B', backgroundColor: '#DCFCE7', border: '1px solid rgba(15, 81, 50, 0.15)', padding: '3px 9px', borderRadius: '8px' }}>
                {rec.priorityTag}
              </span>
            </div>

            {/* MAIN CONTENT ROW: LEFT DETAILS + RIGHT IMAGE THUMBNAIL */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: isDesktop ? '22px' : '18px', fontWeight: 700, color: 'var(--color-text-primary, #1B1F2A)', margin: '0 0 10px 0', letterSpacing: '-0.015em', lineHeight: '1.3' }}>
                  {rec.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--color-text-secondary, #57534E)', fontWeight: 500 }}>
                    <Navigation size={15} color="#0F5132" />
                    <span>{rec.distance}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#0369A1', fontWeight: 600 }}>
                    <Users size={15} color="#0284C7" />
                    <span>{t.crowdWait} {rec.crowdStatus}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT IMAGE THUMBNAIL */}
              <div style={{
                width: isDesktop ? '110px' : '84px',
                height: isDesktop ? '88px' : '72px',
                borderRadius: '14px',
                backgroundImage: `url(${rec.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#F6F3EE',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                flexShrink: 0
              }} />
            </div>

            {/* MANDATORY EXPLAINABLE REASON BADGE */}
            <div style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: '#064E3B',
              backgroundColor: '#F0FDF4',
              border: '1px solid rgba(15, 81, 50, 0.15)',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              lineHeight: '1.45'
            }}>
              <Info size={16} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong style={{ fontWeight: 600 }}>{t.whyRecommended}</strong> {rec.reason}</span>
            </div>
          </div>

          {/* PRIMARY CTA BUTTON */}
          <Link href={rec.link} prefetch={false} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F5132',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(15, 81, 50, 0.16)',
            transition: 'background 0.2s ease, transform 0.15s ease'
          }}>
            {isDesktop ? t.startNavigation : t.viewDetails}
          </Link>

      </div>
    </div>
  );
}

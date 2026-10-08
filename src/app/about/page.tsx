'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Sparkles, Target, Compass, Heart, ShieldCheck, 
  MapPin, Award, CheckCircle2, Mail, Globe, Users, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const PASSPORT_PHOTO_URL = 'https://res.cloudinary.com/kniegqlj/image/upload/v1791044338/passportsize_f7dyq3.jpg';

const TEXTS = {
  en: {
    back: 'Back to Home',
    title: 'About Saarthi',
    subtitle: 'From Free Time to Meaningful Memories',
    intro: 'Saarthi is a digital guide for people visiting Tirupati and Tirumala. It provides useful information about temples, darshan, tokens, travel, places to visit, and local experiences. Our goal is simple: to help visitors plan their time and make their visit more convenient and meaningful.',
    
    // Meet the Founder
    meetFounder: 'Meet the Founder',
    founderName: 'Sunil Thatra',
    founderRole: 'Founder & Lead Creator, Saarthi Guide',
    founderBio1: 'Sunil Thatra is the Founder of Saarthi (Saarthi Guide). He started Saarthi with the vision of creating a reliable, modern, and simple digital guide for millions of visitors traveling to Tirupati and Tirumala.',
    founderBio2: 'Sunil Thatra conceived, designed, and built Saarthi from scratch — overseeing product architecture, user experience design, real-time data integration, full-stack technology development, and ground verification.',
    
    areasTitle: 'Areas of Work',
    areas: [
      'Product Planning',
      'Product Design',
      'Technology & Development',
      'Data Research',
      'Testing and Verification'
    ],

    // Mission & Vision
    missionTitle: 'Our Mission',
    missionDesc: 'Our mission is to make useful information about Tirupati and Tirumala easy to access and understand. Saarthi aims to help visitors find information they need during their journey.',
    
    visionTitle: 'Our Vision',
    visionDesc: 'Our vision is to build a useful digital platform for visitors to discover places, access information, and plan their time in Tirupati.',

    // Why Saarthi?
    whyTitle: 'Why Saarthi?',
    whyDesc1: 'Visitors to Tirupati may need information from different sources. This can include temple information, darshan details, token information, travel information, and places to visit.',
    whyDesc2: 'Saarthi brings useful information together in one platform. This helps visitors find information more easily and plan their visit according to their available time.',

    // Our Story
    storyTitle: 'Our Story',
    storyQ: '“How can we help visitors make better use of their time in Tirupati?”',
    storyP1: 'The idea behind Saarthi started with this simple question. This idea led to the creation of Saarthi.',
    storyP2: 'Saarthi is designed not only to provide information about the pilgrimage experience, but also to help visitors discover places and experiences around Tirupati.',
    storyMeaning: 'The name Saarthi (సారథి) means a guide who helps someone on their journey.',

    // Get in Touch
    contactTitle: 'Get in Touch',
    contactDesc: 'Have a suggestion, correction, or feedback? We would be happy to hear from you.',
    emailLabel: 'Email:'
  },
  te: {
    back: 'హోమ్‌కు తిరిగి వెళ్ళండి',
    title: 'సారథి గురించి (About Saarthi)',
    subtitle: 'మీ యాత్రను సులభం మరియు అర్థవంతం చేసే డిజిటల్ గైడ్',
    intro: 'సారథి అనేది తిరుపతి మరియు తిరుమల దర్శించే భక్తుల కోసం రూపొందించబడిన డిజిటల్ గైడ్. ఇది ఆలయాలు, దర్శనం, ఉచిత టోకెన్లు, రవాణా, చూడదగిన ప్రదేశాలు మరియు స్థానిక అనుభవాల గురించిన ఉపయోగకరమైన సమాచారాన్ని అందిస్తుంది. భక్తులు తమ సమయాన్ని సరైన రీతిలో ప్లాన్ చేసుకుని, యాత్రను సౌకర్యవంతంగా పూర్తి చేయడంలో సహాయపడటమే మా లక్ష్యం.',

    // Meet the Founder
    meetFounder: 'వ్యవస్థాపకుని పరిచయం (Meet the Founder)',
    founderName: 'సునీల్ తాత్రా (Sunil Thatra)',
    founderRole: 'వ్యవస్థాపకుడు & లీడ్ క్రియేటర్, సారథి',
    founderBio1: 'తిరుపతి మరియు తిరుమల దర్శించే భక్తుల కోసం ఒక సరళమైన మరియు ఉపయోగకరమైన డిజిటల్ గైడ్‌ను అందించాలనే ఆలోచనతో సునీల్ తాత్రా గారు "సారథి" ని ప్రారంభించారు.',
    founderBio2: 'సారథి ఆలోచన నుండి నేటి రూపం వరకు ప్రొడక్ట్ రూపకల్పనలో సునీల్ నిరంతరం పనిచేసారు. ప్రొడక్ట్ ప్లానింగ్, డిజైన్, టెక్నాలజీ, డెవలప్‌మెంట్, డేటా రీసెర్చ్ మరియు టెస్టింగ్ వంటి అంశాలను ఆయన స్వయంగా నిర్వహించారు.',

    areasTitle: 'నిర్వహించిన విభాగాలు (Areas of Work)',
    areas: [
      'ప్రొడక్ట్ ప్లానింగ్ (Product Planning)',
      'ప్రొడక్ట్ డిజైన్ (Product Design)',
      'టెక్నాలజీ & డెవలప్‌మెంట్ (Technology & Development)',
      'డేటా రీసెర్చ్ (Data Research)',
      'టెస్టింగ్ & వెరిఫికేషన్ (Testing and Verification)'
    ],

    // Mission & Vision
    missionTitle: 'మా లక్ష్యం (Our Mission)',
    missionDesc: 'తిరుపతి మరియు తిరుమల గురించి ఉపయోగకరమైన సమాచారాన్ని సులభంగా పొందేందుకు మరియు అర్థం చేసుకునేందుకు అందుబాటులో ఉంచడం మా లక్ష్యం. భక్తులు తమ యాత్రలో అవసరమైన సమాచారాన్ని త్వరగా కనుగొనడంలో సారథి సహాయపడుతుంది.',
    
    visionTitle: 'మా దృష్టి (Our Vision)',
    visionDesc: 'భక్తులు ప్రదేశాలను అన్వేషించడానికి, సమాచారాన్ని పొందడానికి మరియు తిరుపతిలో తమ సమయాన్ని చక్కగా ప్లాన్ చేసుకోవడానికి ఒక ఉపయోగకరమైన డిజిటల్ ప్లాట్‌ఫారమ్‌ను నిర్మించడం మా దృష్టి.',

    // Why Saarthi?
    whyTitle: 'ఎందుకు సారథి? (Why Saarthi?)',
    whyDesc1: 'తిరుపతికి వచ్చే భక్తులకు వివిధ మూలాల నుండి సమాచారం అవసరం కావచ్చు. ఇందులో ఆలయ సమాచారం, దర్శన వివరాలు, టోకెన్ వివరాలు, ప్రయాణ సమాచారం మరియు చూడదగిన ప్రదేశాలు ఉంటాయి.',
    whyDesc2: 'సారథి ఈ ఉపయోగకరమైన సమాచారాన్ని ఒకే ప్లాట్‌ఫారమ్‌లోకి తీసుకువస్తుంది. ఇది భక్తులు సమాచారాన్ని సులభంగా కనుగొనడానికి మరియు లభ్యమయ్యే సమయాన్ని బట్టి తమ యాత్రను ప్లాన్ చేసుకోవడానికి సహాయపడుతుంది.',

    // Our Story
    storyTitle: 'మా కథ (Our Story)',
    storyQ: '“తిరుపతిలో భక్తులు తమ సమయాన్ని మరింత ఉపయోగకరంగా ఎలా గడపవచ్చు?”',
    storyP1: 'సారథి వెనుక ఉన్న ఆలోచన ఈ చిన్న ప్రశ్నతోనే ప్రారంభమైంది. ఈ ఆలోచనే సారథి నిర్మాణానికి దారితీసింది.',
    storyP2: 'కేవలం పుణ్యక్షేత్ర దర్శన సమాచారం అందించడమే కాకుండా, తిరుపతి చుట్టుపక్కల ఉన్న ప్రదేశాలు మరియు అనుభవాలను పరిచయం చేసేలా సారథి డిజైన్ చేయబడింది.',
    storyMeaning: 'సారథి (Saarthi) అనే పేరుకు అర్థం — ప్రయాణంలో సహాయపడే ఒక మార్గదర్శి (Guide).',

    // Get in Touch
    contactTitle: 'మమ్మల్ని సంప్రదించండి (Get in Touch)',
    contactDesc: 'మీ వద్ద ఏవైనా సూచనలు, సవరణలు లేదా అభిప్రాయాలు ఉన్నాయా? మీ నుండి వినడానికి మేము సంతోషిస్తాము.',
    emailLabel: 'ఇమెయిల్:'
  },
  hi: {
    back: 'मुख्य पृष्ठ पर लौटें',
    title: 'सारथी के बारे में (About Saarthi)',
    subtitle: 'आपकी यात्रा को सरल और अर्थपूर्ण बनाने वाला डिजिटल गाइड',
    intro: 'सारथी तिरुपति और तिरुमाला आने वाले तीर्थयात्रियों के लिए एक डिजिटल गाइड है। यह मंदिरों, दर्शन, टोकन, यात्रा और स्थानीय अनुभवों के बारे में जानकारी प्रदान करता है।',

    // Meet the Founder
    meetFounder: 'संस्थापक परिचय (Meet the Founder)',
    founderName: 'सुनील तात्रा (Sunil Thatra)',
    founderRole: 'संस्थापक एवं मुख्य निर्माता, सारथी गाइड',
    founderBio1: 'सुनील तात्रा (Sunil Thatra) सारथी (Saarthi Guide) के संस्थापक हैं। उन्होंने तिरुपति और तिरुमाला आने वाले लाखों तीर्थयात्रियों के लिए एक सरल और उपयोगी डिजिटल गाइड बनाने के विचार से सारथी की शुरुआत की।',
    founderBio2: 'सुनील तात्रा ने सारथी की पूरी परिकल्पना, उत्पाद योजना, डिज़ाइन, तकनीक और विकास कार्य को स्वयं संभाला है।',

    areasTitle: 'कार्य क्षेत्र (Areas of Work)',
    areas: [
      'उत्पाद योजना (Product Planning)',
      'उत्पाद डिज़ाइन (Product Design)',
      'तकनीक एवं विकास (Technology & Development)',
      'डेटा अनुसंधान (Data Research)',
      'परीक्षण एवं सत्यापन (Testing & Verification)'
    ],

    // Mission & Vision
    missionTitle: 'हमारा उद्देश्य (Our Mission)',
    missionDesc: 'तिरुपति और तिरुमाला के बारे में जानकारी को सभी के लिए आसान बनाना हमारा उद्देश्य है।',

    visionTitle: 'हमारी दृष्टि (Our Vision)',
    visionDesc: 'तीर्थयात्रियों के लिए एक उपयोगी डिजिटल प्लेटफॉर्म बनाना हमारी दृष्टि है।',

    // Why Saarthi?
    whyTitle: 'सारथी क्यों? (Why Saarthi?)',
    whyDesc1: 'तिरुपति आने वाले यात्रियों को विभिन्न प्रकार की जानकारी की आवश्यकता होती है।',
    whyDesc2: 'सारथी सभी उपयोगी जानकारी को एक ही स्थान पर लाता है।',

    // Our Story
    storyTitle: 'हमारी कहानी (Our Story)',
    storyQ: '“हम तीर्थयात्रियों के समय का बेहतर उपयोग करने में कैसे मदद कर सकते हैं?”',
    storyP1: 'सारथी की शुरुआत इसी छोटे से प्रश्न के साथ हुई थी।',
    storyP2: 'यह न केवल दर्शन की जानकारी देता है, बल्कि तिरुपति के आसपास के स्थानों की भी जानकारी देता है।',
    storyMeaning: 'सारथी का अर्थ है — यात्रा में मदद करने वाला मार्गदर्शक (Guide)।',

    // Get in Touch
    contactTitle: 'संपर्क करें (Get in Touch)',
    contactDesc: 'क्या आपके पास कोई सुझाव या विचार है? हम आपसे सुनना पसंद करेंगे।',
    emailLabel: 'ईमेल:'
  },
  ta: {
    back: 'முகப்பிற்குத் திரும்பு',
    title: 'சாரதி பற்றி (About Saarthi)',
    subtitle: 'உங்கள் பயணத்தை எளிதாக்கும் டிஜிட்டல் வழிகாட்டி',
    intro: 'சாரதி என்பது திருப்பதி மற்றும் திருமலைக்கு வரும் பக்தர்களுக்கான டிஜிட்டல் வழிகாட்டிகளாகும்.',

    // Meet the Founder
    meetFounder: 'நிறுவனர் அறிமுகம் (Meet the Founder)',
    founderName: 'சுனில் தாதிரா (Sunil Thatra)',
    founderRole: 'நிறுவனர் மற்றும் முதன்மை உருவாக்குநர், சாரதி கைடு',
    founderBio1: 'சுனில் தாதிரா (Sunil Thatra) சாரதி (Saarthi Guide) இன் நிறுவனர் ஆவார். திருப்பதி மற்றும் திருமலைக்கு வரும் லட்சக்கணக்கான பக்தர்களுக்கு உதவ சாரதியை தொடங்கினார்.',
    founderBio2: 'சுனில் தாதிரா சாரதியின் வடிவமைப்பு, தொழில்நுட்பம் மற்றும் தரவு ஆராய்ச்சியை நேரடியாக உருவாக்கியுள்ளார்.',

    areasTitle: 'பணி பகுதிகள் (Areas of Work)',
    areas: [
      'தயாரிப்பு திட்டமிடல் (Product Planning)',
      'வடிவமைப்பு (Product Design)',
      'தொழில்நுட்பம் (Technology & Development)',
      'தரவு ஆராய்ச்சி (Data Research)',
      'சோதனை (Testing and Verification)'
    ],

    // Mission & Vision
    missionTitle: 'எங்கள் நோக்கம் (Our Mission)',
    missionDesc: 'திருப்பதி பற்றிய தகவல்களை அனைவரும் எளிதாகப் பெறச் செய்வதே எங்கள் நோக்கம்.',

    visionTitle: 'எங்கள் பார்வை (Our Vision)',
    visionDesc: 'பக்தர்களுக்கு ஒரு சிறந்த டிஜிட்டல் தளத்தை உருவாக்குவதே எங்கள் பார்வை.',

    // Why Saarthi?
    whyTitle: 'ஏன் சாரதி? (Why Saarthi?)',
    whyDesc1: 'திருப்பதிக்கு வரும் பக்தர்களுக்கு பல தகவல்கள் தேவைப்படுகின்றன.',
    whyDesc2: 'சாரதி அனைத்து தகவல்களையும் ஒரே இடத்தில் வழங்குகிறது.',

    // Our Story
    storyTitle: 'எங்கள் கதை (Our Story)',
    storyQ: '“பக்தர்களின் நேரத்தை எவ்வாறு சிறப்பாக்க முடியும்?”',
    storyP1: 'சாரதியின் தொடக்கம் இந்த கேள்வியுடன் தொடங்கியது.',
    storyP2: 'இது தரிசனம் மட்டுமல்லாமல் திருப்பதியை சுற்றியுள்ள இடங்களையும் வழிகாட்டுகிறது.',
    storyMeaning: 'சாரதி என்பதன் பொருள் — பயணத்தில் உதவும் வழிகாட்டி (Guide).',

    // Get in Touch
    contactTitle: 'தொடர்பு கொள்ளவும் (Get in Touch)',
    contactDesc: 'உங்களிடம் ஏதேனும் கருத்துக்கள் உள்ளதா? எங்களைத் தொடர்பு கொள்ளவும்.',
    emailLabel: 'மின்னஞ்சல்:'
  }
};

export default function AboutPage() {
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* ── HEADER ── */}
      <header style={{ 
        padding: '18px 20px', 
        background: '#FFFFFF', 
        borderBottom: '1px solid #ECE9E3',
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link 
              href="/" 
              style={{ 
                background: '#F0FDF4', 
                border: '1px solid #BBF7D0', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={19} color="#0F5132" />
            </Link>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F5132', margin: 0, letterSpacing: '-0.01em', fontFamily: 'Georgia, serif' }}>
                {t.title}
              </h1>
              <p style={{ fontSize: '11.5px', color: '#C89B3C', margin: '1px 0 0 0', fontWeight: 700 }}>
                {t.subtitle}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF9C3', border: '1px solid #FDE047', padding: '4px 10px', borderRadius: '20px' }}>
            <Sparkles size={13} color="#CA8A04" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#854D0E' }}>Official Guide</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* HERO INTRO CARD */}
        <div style={{
          background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
          borderRadius: '28px',
          padding: '32px 24px',
          color: '#FFFFFF',
          boxShadow: '0 12px 32px -4px rgba(15, 81, 50, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#FDE047', 
              backgroundColor: 'rgba(253, 224, 71, 0.15)', 
              border: '1px solid rgba(253, 224, 71, 0.3)', 
              padding: '4px 12px', 
              borderRadius: '20px',
              marginBottom: '14px'
            }}>
              <Compass size={13} />
              <span>Saarthi • Your Digital Guide</span>
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
              {t.subtitle}
            </h2>
            <p style={{ fontSize: '14.5px', color: '#D1FAE5', margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
              {t.intro}
            </p>
          </div>
        </div>

        {/* ── MEET THE FOUNDER SECTION ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #ECE9E3',
          boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEF9C3', border: '1px solid #FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} color="#CA8A04" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t.meetFounder}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {/* Founder Photo */}
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '24px', overflow: 'hidden', border: '3px solid #C89B3C', boxShadow: '0 8px 20px rgba(200, 155, 60, 0.25)', flexShrink: 0 }}>
                <Image 
                  src={PASSPORT_PHOTO_URL} 
                  alt="Sunil Thatra - Founder of Saarthi"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>

              <div>
                <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#0F5132', margin: '0 0 4px 0', fontFamily: 'Georgia, serif' }}>
                  {t.founderName}
                </h4>
                <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#C89B3C', margin: '0 0 8px 0' }}>
                  {t.founderRole}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155', lineHeight: 1.65 }}>
              <p style={{ margin: 0 }}>{t.founderBio1}</p>
              <p style={{ margin: 0 }}>{t.founderBio2}</p>
            </div>

            {/* Areas of Work */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px 20px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
              <h5 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>
                {t.areasTitle}
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {t.areas.map((area, idx) => (
                  <span key={idx} style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    backgroundColor: '#FFFFFF', 
                    color: '#0F5132', 
                    border: '1px solid #BBF7D0', 
                    padding: '4px 12px', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Mission */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #ECE9E3',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Target size={20} color="#0F5132" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.missionTitle}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.65 }}>
              {t.missionDesc}
            </p>
          </div>

          {/* Vision */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #ECE9E3',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sparkles size={20} color="#CA8A04" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.visionTitle}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.65 }}>
              {t.visionDesc}
            </p>
          </div>

        </div>

        {/* ── WHY SAARTHI? ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #ECE9E3',
          boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              {t.whyTitle}
            </h3>
          </div>

          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0 }}>{t.whyDesc1}</p>
            <p style={{ margin: 0, fontWeight: 600, color: '#0F5132' }}>{t.whyDesc2}</p>
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section style={{
          backgroundColor: '#FFFDF7',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #FDE68A',
          boxShadow: '0 6px 20px -4px rgba(200, 155, 60, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Heart size={18} color="#D97706" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#78350F', margin: 0 }}>
              {t.storyTitle}
            </h3>
          </div>

          <blockquote style={{
            fontSize: '14.5px',
            fontWeight: 700,
            color: '#9A3412',
            margin: '0 0 14px 0',
            lineHeight: 1.5,
            fontStyle: 'italic',
            borderLeft: '4px solid #F59E0B',
            paddingLeft: '12px'
          }}>
            {t.storyQ}
          </blockquote>

          <div style={{ fontSize: '13.5px', color: '#854D0E', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>{t.storyP1}</p>
            <p style={{ margin: 0 }}>{t.storyP2}</p>
            <div style={{ 
              marginTop: '6px', 
              padding: '10px 14px', 
              backgroundColor: '#FEF3C7', 
              borderRadius: '12px', 
              border: '1px solid #FDE68A',
              fontWeight: 700,
              color: '#78350F',
              fontSize: '13px'
            }}>
              💡 {t.storyMeaning}
            </div>
          </div>
        </section>

        {/* ── CONTACT & FOOTER ── */}
        <footer style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #ECE9E3',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {t.contactTitle}
          </h4>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            {t.contactDesc}
          </p>
          <a 
            href="mailto:saarthiguide0@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0F5132',
              color: '#FFFFFF',
              padding: '10px 22px',
              borderRadius: '20px',
              fontSize: '13.5px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(15, 81, 50, 0.2)'
            }}
          >
            <Mail size={16} />
            <span>{t.emailLabel} saarthiguide0@gmail.com</span>
          </a>
        </footer>

      </main>
    </div>
  );
}

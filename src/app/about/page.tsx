'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Sparkles, Target, Compass, Heart, ShieldCheck, 
  MapPin, Award, CheckCircle2, Mail, Globe, Users, ExternalLink,
  BookOpen, Wrench, Search, User
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const PASSPORT_PHOTO_URL = '/images/places/img_1_passportsize_f7dyq3.jpg';

const TEXTS = {
  en: {
    back: 'Back to Home',
    title: 'About Saarthi Guide',
    subtitle: "The Pilgrim's Offline Companion for Tirumala & Tirupati",
    intro: 'Saarthi Guide is an independent, offline-first pilgrimage companion platform founded by Sunil Thatra. It provides verified information about hilltop accommodations, mutts, direct cabs, live darshan wait times, and offline maps.',
    
    // Founder & Research
    founderHeader: 'Founder & Lead Creator',
    founderName: 'Sunil Thatra',
    founderRole: 'Founder & Lead Creator, Saarthi Guide',
    founderBio1: 'Sunil Thatra conceived, architected, and built Saarthi Guide as an independent digital companion for millions of pilgrims visiting Tirupati and Tirumala.',
    founderBio2: 'The project started after experiencing how scattered, outdated, and commission-heavy essential pilgrimage information was — from finding vacant hilltop rooms to navigating cab fares and dealing with cellular blackouts on the hills.',
    
    researchTitle: 'Key Friction Points Documented from 100+ Pilgrims:',
    findings: [
      'Lack of verified direct room contacts and mutt stays',
      'Middlemen charging inflated commissions for local cabs',
      'Total loss of navigation when mobile networks dropped on the hills',
      'Confusion between Sarva Darshan (SSD), Divya Darshan (DD), and Special Entry'
    ],

    initiativeTitle: 'Core Architecture & Principles',
    principles: [
      '100% Offline Architecture: Maps and directories work without internet on the hills',
      'Direct & Zero-Commission: Verified contacts with no middleman margins',
      'Independent & Devotee-First: Built solely to guide and assist pilgrims. Not affiliated with TTD.'
    ],

    // Mission & Vision
    missionTitle: 'Our Mission',
    missionDesc: 'Our mission is to eliminate pilgrimage anxiety in Tirupati and Tirumala through verified, reliable, offline-ready technology built with pure public-service intent.',
    
    visionTitle: 'Our Vision',
    visionDesc: 'Our vision is to build India\'s most trusted, non-commercial pilgrim guidance ecosystem, empowering devotees with authentic local data and zero middlemen.',

    // Why Saarthi?
    whyTitle: 'Why Saarthi Guide?',
    whyDesc1: 'Pilgrims visiting Tirumala often face commercial middlemen, misleading room brokers, and network blackouts on the hills. Traditional websites fail when connectivity drops.',
    whyDesc2: 'Saarthi brings together verified accommodations, direct driver contacts, and live queue tracking into a lightweight, offline-first app that runs everywhere.',

    // Our Story
    storyTitle: 'Our Story',
    storyQ: '“Can technology eliminate exploitation and confusion for every visiting devotee?”',
    storyP1: 'This question drove months of field research and devotee interviews at Tirupati Railway Station, RTC Bus Stand, and Alipiri into a working, high-performance offline app.',
    storyP2: 'Saarthi Guide was built as an independent, bootstrapped initiative to ensure every devotee reaches the Lord with peace of mind.',
    storyMeaning: 'The name Saarthi (సారథి) means a trusted charioteer and guide who leads someone safely on their sacred journey.',

    // Get in Touch
    contactTitle: 'Get in Touch with the Founder',
    contactDesc: 'Have feedback, ground updates, or suggestions? We would be delighted to hear from you.',
    emailLabel: 'Email:',
    footerNote: 'Saarthi Guide is an independent pilgrimage guide founded by Sunil Thatra. Not affiliated with Tirumala Tirupati Devasthanams (TTD).'
  },
  te: {
    back: 'హోమ్‌కు తిరిగి వెళ్ళండి',
    title: 'సారథి గైడ్ గురించి (About Saarthi Guide)',
    subtitle: 'తిరుమల & తిరుపతి భక్తుల కోసం ఆఫ్‌లైన్ డిజిటల్ గైడ్',
    intro: 'సారథి గైడ్ అనేది సునీల్ తాత్రా గారు స్థాపించిన స్వతంత్ర, ఆఫ్‌లైన్ పుణ్యక్షేత్ర మార్గదర్శి. ఇది వసతి గదులు, మఠాలు, ప్రత్యక్ష క్యాబ్‌లు, దర్శన వేచి ఉండే సమయాలు మరియు ఆఫ్‌లైన్ మ్యాప్‌ల గురించిన ఖచ్చితమైన సమాచారాన్ని అందిస్తుంది.',

    // Founder & Research
    founderHeader: 'వ్యవస్థాపకుడు & రూపకర్త (Founder & Lead Creator)',
    founderName: 'సునీల్ తాత్రా (Sunil Thatra)',
    founderRole: 'వ్యవస్థాపకుడు & లీడ్ క్రియేటర్, సారథి గైడ్',
    founderBio1: 'తిరుపతి మరియు తిరుమల దర్శించే భక్తుల కోసం ఒక సరళమైన మరియు అత్యంత ఉపయోగకరమైన డిజిటల్ గైడ్‌ను అందించాలనే సంకల్పంతో సునీల్ తాత్రా సారథిని ప్రారంభించారు.',
    founderBio2: 'సమస్యల తీవ్రతను లోతుగా అర్థం చేసుకోవడానికి తిరుపతి రైల్వే స్టేషన్, RTC బస్ స్టాండ్ మరియు అలిపిరి వద్ద 100 మందికి పైగా భక్తులను స్వయంగా కలిసి క్షేత్రస్థాయి పరిశోధన చేసారు.',

    researchTitle: '100+ భక్తుల నుండి సేకరించిన ప్రధాన సమస్యలు:',
    findings: [
      'వసతి గదులు మరియు మఠాల ప్రత్యక్ష కాంటాక్ట్ నంబర్లు లేకపోవడం',
      'క్యాబ్‌లకు దళారులు ఎక్కువ కమీషన్లు వసూలు చేయడం',
      'కొండపై నెట్‌వర్క్ లేనప్పుడు మ్యాప్‌లు పనిచేయకపోవడం',
      'సర్వదర్శనం (SSD), దివ్యదర్శనం మరియు ప్రత్యేక ప్రవేశ దర్శనాల మధ్య గందరగోళం'
    ],

    initiativeTitle: 'ముఖ్య లక్షణాలు & సూత్రాలు:',
    principles: [
      '100% ఆఫ్‌లైన్ నిర్మాణం: ఇంటర్నెట్ లేకపోయినా మ్యాప్‌లు మరియు సమాచారం పనిచేస్తాయి',
      'ప్రత్యక్ష & జీరో-కమీషన్: దళారుల ప్రమేయం లేకుండా డ్రైవర్లు మరియు రూమ్స్ వివరాలు',
      'స్వతంత్ర & భక్తుల హితం: భక్తులకు మార్గదర్శనం చేయడమే లక్ష్యం. TTDతో ఎటువంటి అనుబంధం లేదు.'
    ],

    // Mission & Vision
    missionTitle: 'మా లక్ష్యం (Our Mission)',
    missionDesc: 'ధృవీకరించబడిన, విశ్వసనీయమైన, ఆఫ్‌లైన్ సాంకేతికత ద్వారా తిరుపతి మరియు తిరుమలలో భక్తుల ఆందోళనలను తొలగించడమే మా లక్ష్యం.',
    
    visionTitle: 'మా దృష్టి (Our Vision)',
    visionDesc: 'దళారులు లేని, పారదర్శకమైన మరియు అత్యంత విశ్వసనీయమైన భక్త సహాయక వ్యవస్థను నిర్మించడమే మా దృష్టి.',

    // Why Saarthi?
    whyTitle: 'ఎందుకు సారథి గైడ్? (Why Saarthi Guide?)',
    whyDesc1: 'తిరుపతికి వచ్చే భక్తులకు సరైన సమాచారం లేకపోవడం వల్ల ఇబ్బందులు పడుతున్నారు. కొండపై మొబైల్ సిగ్నల్స్ సరిగ్గా ఉండవు.',
    whyDesc2: 'సారథి గైడ్ అన్ని ముఖ్యమైన సమాచారాన్ని, మ్యాప్‌లను ఆఫ్‌లైన్‌లో కూడా భక్తులకు నిరంతరం అందుబాటులో ఉంచుతుంది.',

    // Our Story
    storyTitle: 'మా కథ (Our Story)',
    storyQ: '“సాంకేతికత ద్వారా భక్తుల కష్టాలను మరియు దళారుల దోపిడీని నివారించవచ్చా?”',
    storyP1: 'ఈ ఆలోచనతోనే క్షేత్రస్థాయి అనుభవాలను మరియు భక్తుల పరిశోధనలను ఆధారంగా చేసుకుని ఈ యాప్‌ను నిర్మించడం జరిగింది.',
    storyP2: 'ప్రతి భక్తుడు ప్రశాంతంగా, ఎటువంటి ఆందోళన లేకుండా శ్రీవారి దర్శనం చేసుకోవాలనే సదుద్దేశంతో సారథి రూపొందించబడింది.',
    storyMeaning: 'సారథి (Saarthi) అనే పేరుకు అర్థం — ప్రయాణంలో క్షేమంగా నడిపించే ఒక విశ్వసనీయ మార్గదర్శి.',

    // Get in Touch
    contactTitle: 'సంప్రదించండి (Get in Touch)',
    contactDesc: 'మీ వద్ద ఏవైనా సూచనలు, సవరణలు లేదా అభిప్రాయాలు ఉంటే మాకు తెలియజేయండి.',
    emailLabel: 'ఇమెయిల్:',
    footerNote: 'సారథి గైడ్ అనేది సునీల్ తాత్రా స్థాపించిన స్వతంత్ర గైడ్. తిరుమల తిరుపతి దేవస్థానము (TTD) తో ఎటువంటి అనుబంధం లేదు.'
  },
  hi: {
    back: 'मुख्य पृष्ठ पर लौटें',
    title: 'सारथी गाइड के बारे में (About Saarthi Guide)',
    subtitle: 'तिरुमाला एवं तिरुपति तीर्थयात्रियों का ऑफ़लाइन डिजिटल साथी',
    intro: 'सारथी गाइड सुनील तात्रा द्वारा स्थापित एक स्वतंत्र, ऑफ़लाइन तीर्थयात्रा साथी प्लेटफॉर्म है। यह आवास, मठ, सीधी कैब और लाइव कतार समय की सटीक जानकारी प्रदान करता है।',

    // Founder & Research
    founderHeader: 'संस्थापक एवं मुख्य निर्माता (Founder & Lead Creator)',
    founderName: 'सुनील तात्रा (Sunil Thatra)',
    founderRole: 'संस्थापक एवं मुख्य निर्माता, सारथी गाइड',
    founderBio1: 'सुनील तात्रा ने तिरुपति और तिरुमाला आने वाले लाखों तीर्थयात्रियों के लिए एक सरल और उपयोगी डिजिटल गाइड बनाने के उद्देश्य से सारथी की शुरुआत की।',
    founderBio2: 'वास्तविक समस्याओं को समझने के लिए उन्होंने तिरुपति रेलवे स्टेशन, बस स्टैंड और अलीपिरी पर 100 से अधिक श्रद्धालुओं से मिलकर गहन शोध किया।',

    researchTitle: '100+ श्रद्धालुओं से एकत्रित मुख्य समस्याएं:',
    findings: [
      'मठों और आवासों के सीधे संपर्क नंबरों का अभाव',
      'स्थानीय कैब के लिए बिचौलियों द्वारा अधिक किराया वसूलना',
      'पहाड़ी पर मोबाइल नेटवर्क न होने पर नेविगेशन बंद होना',
      'सर्व दर्शन (SSD), दिव्य दर्शन और विशेष दर्शन के बीच भ्रम'
    ],

    initiativeTitle: 'मुख्य वास्तुकला एवं सिद्धांत:',
    principles: [
      '100% ऑफ़लाइन आर्किटेक्चर: पहाड़ी पर बिना इंटरनेट के भी सभी मैप और डायरेक्टरी काम करते हैं',
      'सीधा एवं ज़ीरो-कमीशन: बिना किसी बिचौलिए के सीधे सत्यापित नंबर',
      'स्वतंत्र एवं सेवा-समर्पित: तीर्थयात्रियों की सुविधा के लिए निर्मित। TTD से कोई संबद्धता नहीं है।'
    ],

    // Mission & Vision
    missionTitle: 'हमारा उद्देश्य (Our Mission)',
    missionDesc: 'सत्यापित, ऑफ़लाइन-सक्षम तकनीक के माध्यम से तिरुपति और तिरुमाला में श्रद्धालुओं की यात्रा को सरल बनाना।',

    visionTitle: 'हमारी दृष्टि (Our Vision)',
    visionDesc: 'भारत का सबसे विश्वसनीय, बिचौलिया-मुक्त तीर्थयात्री सूचना तंत्र तैयार करना।',

    // Why Saarthi?
    whyTitle: 'सारथी गाइड क्यों? (Why Saarthi Guide?)',
    whyDesc1: 'तिरुमाला आने वाले श्रद्धालुओं को अक्सर नेटवर्क की कमी और बिचौलियों की वजह से दिक्कतों का सामना करना पड़ता है।',
    whyDesc2: 'सारथी सभी आवश्यक जानकारी और मैप को सीधे ऑफ़लाइन उपलब्ध कराता है।',

    // Our Story
    storyTitle: 'हमारी कहानी (Our Story)',
    storyQ: '“क्या तकनीक के माध्यम से हर श्रद्धालु की यात्रा को परेशानी-मुक्त बनाया जा सकता है?”',
    storyP1: 'इसी विचार ने 100+ श्रद्धालुओं के अनुभवों को एक सशक्त ऑफ़लाइन ऐप में बदलने के लिए प्रेरित किया।',
    storyP2: 'सारथी गाइड को एक स्वतंत्र, विश्वसनीय पहल के रूप में बनाया गया है।',
    storyMeaning: 'सारथी (Saarthi) का अर्थ है — यात्रा में सुरक्षित राह दिखाने वाला सच्चा मार्गदर्शक।',

    // Get in Touch
    contactTitle: 'संस्थापक से संपर्क करें (Get in Touch)',
    contactDesc: 'किसी भी सुझाव या प्रतिक्रिया के लिए हमसे संपर्क करें।',
    emailLabel: 'ईमेल:',
    footerNote: 'सारथी गाइड सुनील तात्रा द्वारा स्थापित एक स्वतंत्र गाइड है। TTD से इसका कोई संबंध नहीं है।'
  }
};

export default function AboutPage() {
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#1E293B', paddingBottom: '60px' }}>
      
      {/* ── HEADER NAVIGATION ── */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(250, 248, 245, 0.95)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ECE9E3',
        padding: '12px 16px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              aria-label={t.back}
            >
              <ArrowLeft size={19} color="#0F5132" />
            </Link>
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#0F5132', margin: 0, letterSpacing: '-0.01em', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
                {t.title}
              </h1>
              <p style={{ fontSize: '11.5px', color: '#C89B3C', margin: '1px 0 0 0', fontWeight: 700 }}>
                {t.subtitle}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: '20px' }}>
            <Sparkles size={13} color="#16A34A" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>Independent Guide</span>
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
              fontWeight: 700, 
              color: '#FDE047', 
              backgroundColor: 'rgba(253, 224, 71, 0.15)', 
              border: '1px solid rgba(253, 224, 71, 0.3)', 
              padding: '4px 12px', 
              borderRadius: '20px',
              marginBottom: '14px'
            }}>
              <Compass size={13} />
              <span>Saarthi • Founded by Sunil Thatra</span>
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
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
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {t.founderHeader}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              {/* Founder Photo */}
              <div style={{ 
                position: 'relative', 
                width: '92px', 
                height: '92px', 
                borderRadius: '22px', 
                overflow: 'hidden', 
                border: '3px solid #C89B3C', 
                boxShadow: '0 8px 20px rgba(200, 155, 60, 0.25)', 
                flexShrink: 0 
              }}>
                <Image 
                  src={PASSPORT_PHOTO_URL} 
                  alt="Sunil Thatra - Founder & Lead Creator, Saarthi Guide"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>

              <div>
                <h4 style={{ fontSize: '21px', fontWeight: 800, color: '#0F5132', margin: '0 0 4px 0', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
                  {t.founderName}
                </h4>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#B45309', margin: '0 0 8px 0' }}>
                  {t.founderRole}
                </p>
                <a
                  href="https://www.linkedin.com/in/sunil-t-39a905315/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#0A66C2',
                    textDecoration: 'none',
                    background: '#F0F7FF',
                    border: '1px solid #BAE6FD',
                    padding: '3px 10px',
                    borderRadius: '999px'
                  }}
                >
                  <span>Sunil Thatra on LinkedIn</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155', lineHeight: 1.65 }}>
              <p style={{ margin: 0 }}>{t.founderBio1}</p>
              <p style={{ margin: 0 }}>{t.founderBio2}</p>
            </div>

            {/* Research Findings */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '18px', padding: '18px 20px', border: '1px solid #E2E8F0', marginTop: '4px' }}>
              <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={15} color="#0F5132" />
                <span>{t.researchTitle}</span>
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {t.findings.map((item, idx) => (
                  <div key={idx} style={{ 
                    fontSize: '12.5px', 
                    fontWeight: 600, 
                    backgroundColor: '#FFFFFF', 
                    color: '#334155', 
                    border: '1px solid #CBD5E1', 
                    padding: '8px 12px', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.45
                  }}>
                    <span style={{ color: '#D97706', fontWeight: 800 }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Principles */}
            <div style={{ backgroundColor: '#F0FDF4', borderRadius: '18px', padding: '18px 20px', border: '1px solid #BBF7D0' }}>
              <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: '#166534', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench size={15} color="#15803D" />
                <span>{t.initiativeTitle}</span>
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.principles.map((principle, idx) => (
                  <div key={idx} style={{ 
                    fontSize: '12.5px', 
                    fontWeight: 600, 
                    backgroundColor: '#FFFFFF', 
                    color: '#0F5132', 
                    border: '1px solid #86EFAC', 
                    padding: '8px 12px', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{principle}</span>
                  </div>
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
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
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
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
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
            <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              {t.whyTitle}
            </h3>
          </div>

          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0 }}>{t.whyDesc1}</p>
            <p style={{ margin: 0, fontWeight: 700, color: '#0F5132' }}>{t.whyDesc2}</p>
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
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#78350F', margin: 0 }}>
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
          <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
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
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(15, 81, 50, 0.2)'
            }}
          >
            <Mail size={16} />
            <span>{t.emailLabel} saarthiguide0@gmail.com</span>
          </a>
          <p style={{ marginTop: '14px', fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, margin: 0 }}>
            {t.footerNote}
          </p>
        </footer>

      </main>
    </div>
  );
}

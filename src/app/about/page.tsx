'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Sparkles, Target, Compass, Heart, ShieldCheck,
  MapPin, Award, CheckCircle2, Mail, Globe, Users, ExternalLink,
  BookOpen, Wrench, Search, WifiOff, PhoneCall, Shield, Check,
  BadgeCheck, MessageSquare, Coffee, Home, Car, Ticket
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const PASSPORT_PHOTO_URL = '/images/places/img_1_passportsize_f7dyq3.jpg';
const FOUNDER_LINKEDIN = 'https://www.linkedin.com/in/sunil-t-39a905315/';
const FOUNDER_EMAIL = 'saarthiguide9@gmail.com';

const TEXTS = {
  en: {
    back: 'Back to Home',
    badge: 'Verified Independent Guide',
    heroTag: 'Public Pilgrimage Initiative',
    heroTitle: "The Pilgrim's Offline Companion for Tirumala & Tirupati",
    heroDesc: 'Saarthi Guide was conceived, designed, and built by Sunil Thatra to remove anxiety, confusion, and middleman exploitation for every visiting devotee. 100% offline-ready, verified ground contacts, and live queue intelligence.',

    // Quick Stat Counters
    stats: [
      { num: '100+', label: 'Pilgrims Interviewed' },
      { num: '100%', label: 'Offline Coverage' },
      { num: '₹0', label: 'Zero Commissions' },
      { num: '24/7', label: 'Hilltop Assistance' },
    ],

    // Founder Section
    founderTag: 'Meet the Creator',
    founderHeader: 'Founder & Lead Creator',
    founderName: 'Sunil Thatra',
    founderRole: 'Founder & Lead Creator, Saarthi Guide',
    founderLocation: 'Tirupati, Andhra Pradesh',
    badgeLocal: 'Tirupati Ground-Surveyed',
    badgeCommission: '100% Zero-Commission',
    badgeOffline: 'Built For Zero Signal',
    founderBio1: 'Sunil Thatra conceived, architected, and built Saarthi Guide from the ground up as an independent, public-service digital guide for millions of devotees visiting Tirupati and Tirumala.',
    founderBio2: 'The mission began after observing firsthand how commercial brokers, misleading room middlemen, and mountain network blackouts caused first-time pilgrims to lose their valuable darshan slots and hard-earned savings.',
    founderPledgeQuote: 'A sacred yatra should be anchored in peace and spiritual focus, not stress and exploitation. Saarthi was built from a single personal vow: every family stepping onto the holy soil of Tirupati deserves truthful guidance, verified direct contacts, and complete freedom from middlemen.',
    founderPledgeRole: "Founder's Personal Ground Vow",
    vowsTitle: "Why I Built Saarthi: Three Ground Vows",
    vows: [
      {
        title: 'Protect Devotees from Middlemen',
        desc: 'Pilgrims arriving late at night often fall prey to fake room brokers. We mapped every verified mutt and lodge with direct phone numbers and zero kickbacks.'
      },
      {
        title: 'Curb Inflated Travel Fares',
        desc: 'Ghat road taxis shouldn\'t charge extortionate rates during peak festival rush. We provide official rate cards and verified driver numbers with zero commission.'
      },
      {
        title: 'Devotee Seva Above Commercial Profit',
        desc: 'Saarthi is not an ad-supported commercial app. It is built as an independent, transparent digital offering for Lord Venkateswara\'s visiting devotees.'
      }
    ],
    linkedinBtn: 'Connect on LinkedIn',

    // Research Section
    researchTag: 'Field Research',
    researchTitle: 'What 100+ Devotee Interviews Revealed',
    researchDesc: 'Before writing a single line of code, Sunil conducted extensive on-ground field interviews across Tirupati Central Railway Station, RTC Central Bus Stand, and the Alipiri footpath entrance. Here are the 4 critical friction points pilgrims face every day:',

    frictionPoints: [
      {
        title: 'Unverified Stays & Broker Scams',
        problem: 'Devotees arriving late at night are misled by agents claiming all rooms are full.',
        solution: 'Direct phone numbers & walk-in guides for mutts (Ahobila, Rayar, Kanchi) & verified lodges.'
      },
      {
        title: 'Inflated Taxi & Ghat Fares',
        problem: 'Private drivers often charge 2x to 3x standard rates during peak festival rush.',
        solution: 'Standardized rate cards and direct zero-commission driver contact numbers.'
      },
      {
        title: 'Mountain Cellular Blackouts',
        problem: 'Cellular signals drop drastically across Tirumala hills and queue compartments.',
        solution: '100% offline-first architecture — all essential guides, maps, and numbers work without internet.'
      },
      {
        title: 'Queue & Token Confusion',
        problem: 'First-time pilgrims confuse Sarva Darshan (Free), SSD tokens, and Divya Darshan.',
        solution: 'Live counter status, time estimates, and step-by-step queue entry maps.'
      }
    ],

    // Core Principles
    principlesTag: 'Design Philosophy',
    principlesTitle: 'Three Sacred Principles of Saarthi',
    principles: [
      {
        title: '100% Offline Resilience',
        desc: 'Everything works on hilltop flights of stairs, deep inside queue complexes, or during network outages.'
      },
      {
        title: 'Zero-Commission Integrity',
        desc: 'No hotel booking commissions, no cab driver cuts, and no sponsored recommendations. Pure authentic guidance.'
      },
      {
        title: 'Devotee-First Independence',
        desc: 'Built solely to serve visiting pilgrims with empathy and accuracy. Not affiliated with TTD.'
      }
    ],

    // Mission & Vision
    missionTitle: 'Our Mission',
    missionDesc: 'To eliminate anxiety, commercial exploitation, and confusion for every pilgrim traveling to Tirupati and Tirumala through verified, honest, and offline-ready technology.',
    visionTitle: 'Our Vision',
    visionDesc: 'To build India\'s most trusted, non-commercial pilgrimage companion ecosystem, setting the benchmark for ethical, devotee-first digital public infrastructure.',

    // Contact Card
    contactHeader: 'Get in Touch Directly',
    contactDesc: 'Have ground updates, a correction, or feedback? Sunil Thatra personally reviews every message from devotees.',
    emailBtn: 'Email Founder: saarthiguide9@gmail.com',
    footerNotice: 'Saarthi Guide is an independent digital guide platform founded by Sunil Thatra. Not affiliated with Tirumala Tirupati Devasthanams (TTD).'
  },
  te: {
    back: 'హోమ్‌కు తిరిగి వెళ్ళండి',
    badge: 'ధృవీకరించబడిన స్వతంత్ర గైడ్',
    heroTag: 'భక్తుల సేవా ప్రాజెక్ట్',
    heroTitle: 'తిరుమల & తిరుపతి భక్తుల కోసం ఆఫ్‌లైన్ డిజిటల్ తోడు',
    heroDesc: 'తిరుమల వచ్చే ప్రతి భక్తుడికి దళారుల దోపిడీ లేకుండా, ఆందోళన లేని ప్రశాంత యాత్రను అందించడానికి సునీల్ తాత్రా గారు సారథి గైడ్‌ను రూపొందించారు. 100% ఆఫ్‌లైన్ గైడ్, ధృవీకరించబడిన నంబర్లు, మరియు లైవ్ క్యూ వివరాలు.',

    stats: [
      { num: '100+', label: 'భక్తుల పరిశోధన' },
      { num: '100%', label: 'ఆఫ్‌లైన్ సదుపాయం' },
      { num: '₹0', label: 'జీరో కమీషన్' },
      { num: '24/7', label: 'కొండపై మార్గదర్శి' },
    ],

    founderTag: 'వ్యవస్థాపకుని పరిచయం',
    founderHeader: 'వ్యవస్థాపకుడు & రూపకర్త',
    founderName: 'సునీల్ తాత్రా (Sunil Thatra)',
    founderRole: 'వ్యవస్థాపకుడు & లీడ్ క్రియేటర్, సారథి గైడ్',
    founderLocation: 'తిరుపతి, ఆంధ్రప్రదేశ్',
    badgeLocal: 'తిరుపతి క్షేత్ర పరిశోధన',
    badgeCommission: '100% జీరో-కమీషన్',
    badgeOffline: 'ఆఫ్‌లైన్ ఆర్కిటెక్చర్',
    founderBio1: 'తిరుపతి మరియు తిరుమల దర్శించే లక్షలాది మంది భక్తులకు ఒక నిజాయితీ గల డిజిటల్ సహాయకుడిని అందించేందుకు సునీల్ తాత్రా సారథి గైడ్‌ను స్వయంగా రూపొందించారు.',
    founderBio2: 'కొండపై నెట్‌వర్క్ లేకపోవడం, దళారుల దోపిడీ మరియు వసతి గదుల కోసం భక్తులు పడే కష్టాలను చూసి, ఒక పటిష్టమైన సాంకేతిక పరిష్కారాన్ని అందించడమే లక్ష్యంగా సారథిని ప్రారంభించారు.',
    founderPledgeQuote: 'తిరుమల యాత్ర అనేది భక్తి మరియు ప్రశాంతతతో సాగాలి గానీ, దళారుల దోపిడీ మరియు అయోమయంతో కాదు. తిరుపతిలో అడుగుపెట్టే ప్రతి భక్తుడి కుటుంబానికి నిజాయితీ గల మార్గదర్శకత్వం, ధృవీకరించబడిన ఫోన్ నంబర్లు మరియు దళారుల రహిత సమాచారం అందించడమే నా సంకల్పం.',
    founderPledgeRole: 'వ్యవస్థాపకుని పవిత్ర ప్రతిజ్ఞ',
    vowsTitle: 'సారథి ఎందుకు ప్రారంభించబడింది: నా 3 ప్రతిజ్ఞలు',
    vows: [
      {
        title: 'దళారుల దోపిడీకి ముగింపు',
        desc: 'రాత్రి సమయాల్లో వచ్చే భక్తులను గదుల కోసం మోసం చేయకుండా, ప్రముఖ మఠాలు మరియు ధృవీకరించిన లాడ్జిల ప్రత్యక్ష నంబర్లను అందించాము.'
      },
      {
        title: 'పారదర్శక క్యాబ్ చార్జీలు',
        desc: 'రద్దీ సమయాల్లో ప్రైవేట్ క్యాబ్‌లు 2-3 రెట్లు ఎక్కువ వసూలు చేయకుండా, పారదర్శక రేట్ కార్డులు మరియు డ్రైవర్ల ప్రత్యక్ష నంబర్లు చేర్చాము.'
      },
      {
        title: 'వాణిజ్య లాభం కాదు, భక్తుల సేవే ముఖ్యం',
        desc: 'సారథి అనేది లాభాపేక్ష కోసం రూపొందించిన యాప్ కాదు. శ్రీవారి భక్తులకు నిస్వార్థ సేవ అందించడమే దీని పరమ లక్ష్యం.'
      }
    ],
    linkedinBtn: 'లింక్డ్‌ఇన్‌లో కనెక్ట్ అవ్వండి',

    researchTag: 'క్షేత్రస్థాయి పరిశోధన',
    researchTitle: '100+ భక్తులతో ముఖాముఖి ద్వారా వెలుగుచూసిన సమస్యలు',
    researchDesc: 'తిరుపతి రైల్వే స్టేషన్, RTC బస్ స్టాండ్ మరియు అలిపిరి వద్ద భక్తులను కలిసి సునీల్ గారు స్వయంగా సేకరించిన ప్రధాన సమస్యలు:',

    frictionPoints: [
      {
        title: 'గదుల కోసం దళారుల దోపిడీ',
        problem: 'రాత్రి సమయాల్లో వచ్చే భక్తులకు గదులు లేవని చెప్పి ఎక్కువ మొత్తాలు వసూలు చేస్తారు.',
        solution: 'ప్రముఖ మఠాలు (అహోబిల, రాయర, కంచి) మరియు ధృవీకరించబడిన లాడ్జిల ప్రత్యక్ష నంబర్లు.'
      },
      {
        title: 'క్యాబ్‌ల అధిక ధరలు',
        problem: 'రద్దీ సమయాల్లో సాధారణ చార్జీల కంటే 2 నుండి 3 రెట్లు ఎక్కువ వసూలు చేయడం.',
        solution: 'పారదర్శక ధరలు మరియు జీరో-కమీషన్ క్యాబ్ డ్రైవర్ల ప్రత్యక్ష నంబర్లు.'
      },
      {
        title: 'కొండపై సిగ్నల్ సమస్యలు',
        problem: 'తిరుమల కొండపై మరియు కంపార్ట్‌మెంట్లలో మొబైల్ నెట్‌వర్క్ సరిగ్గా పనిచేయదు.',
        solution: '100% ఆఫ్‌లైన్ ఆర్కిటెక్చర్ — ఇంటర్నెట్ లేకపోయినా మ్యాప్‌లు, నంబర్లు పనిచేస్తాయి.'
      },
      {
        title: 'టోకెన్ల గందరగోళం',
        problem: 'సర్వదర్శనం, SSD టోకెన్లు మరియు దివ్యదర్శనాల మధ్య అవగాహన లోపం.',
        solution: 'లైవ్ టోకెన్ కౌంటర్ వివరాలు, వేచి ఉండే సమయాలు మరియు స్పష్టమైన మార్గదర్శకాలు.'
      }
    ],

    principlesTag: 'నిర్మాణ సూత్రాలు',
    principlesTitle: 'సారథి పాటించే 3 పవిత్ర సూత్రాలు',
    principles: [
      {
        title: '100% ఆఫ్‌లైన్ పటిష్టత',
        desc: 'నెట్‌వర్క్ లేని ప్రదేశాల్లో మరియు క్యూ కంపార్ట్‌మెంట్లలో సైతం అన్ని వివరాలు అందుబాటులో ఉంటాయి.'
      },
      {
        title: 'జీరో-కమీషన్ నిబద్ధత',
        desc: 'హోటళ్ళు లేదా క్యాబ్ డ్రైవర్ల వద్ద ఎటువంటి కమీషన్లు తీసుకోము. స్వచ్ఛమైన సమాచారం మాత్రమే.'
      },
      {
        title: 'భక్తుల సేవే ప్రథమం',
        desc: 'భక్తుల ప్రయాణాన్ని సులభతరం చేయడమే ఏకైక లక్ష్యం. TTD తో ఎలాంటి అనుబంధం లేదు.'
      }
    ],

    missionTitle: 'మా లక్ష్యం',
    missionDesc: 'ధృవీకరించబడిన, నిజాయితీతో కూడిన ఆఫ్‌లైన్ సాంకేతికత ద్వారా తిరుపతి భక్తుల ఆందోళనలను తొలగించడం.',
    visionTitle: 'మా దృష్టి',
    visionDesc: 'భారతదేశంలోనే అత్యంత విశ్వసనీయమైన, కమీషన్లు లేని పుణ్యక్షేత్ర డిజిటల్ తోడుగా నిలవడం.',

    contactHeader: 'వ్యవస్థాపకుడిని నేరుగా సంప్రదించండి',
    contactDesc: 'మీ వద్ద ఏవైనా సూచనలు, సవరణలు ఉన్నాయా? సునీల్ తాత్రా ప్రతి సందేశాన్ని స్వయంగా పరిశీలిస్తారు.',
    emailBtn: 'ఇమెయిల్ చేయండి: saarthiguide9@gmail.com',
    footerNotice: 'సారథి గైడ్ అనేది సునీల్ తాత్రా స్థాపించిన స్వతంత్ర డిజిటల్ గైడ్. తిరుమల తిరుపతి దేవస్థానము (TTD) తో ఎటువంటి అనుబంధం లేదు.'
  },
  hi: {
    back: 'मुख्य पृष्ठ पर लौटें',
    badge: 'सत्यापित स्वतंत्र गाइड',
    heroTag: 'तीर्थयात्री सेवा पहल',
    heroTitle: 'तिरुमाला एवं तिरुपति तीर्थयात्रियों का ऑफ़लाइन डिजिटल साथी',
    heroDesc: 'सुनील तात्रा द्वारा विकसित सारथी गाइड श्रद्धालुओं को बिचौलियों के शोषण और नेटवर्क की कमी से मुक्त एक सहज यात्रा अनुभव प्रदान करता है। 100% ऑफ़लाइन गाइड और सत्यापित नंबर।',

    stats: [
      { num: '100+', label: 'श्रद्धालुओं से संवाद' },
      { num: '100%', label: 'ऑफ़लाइन कवरेज' },
      { num: '₹0', label: 'ज़ीरो कमीशन' },
      { num: '24/7', label: 'मार्गदर्शन' },
    ],

    founderTag: 'संस्थापक परिचय',
    founderHeader: 'संस्थापक एवं मुख्य निर्माता',
    founderName: 'सुनील तात्रा (Sunil Thatra)',
    founderRole: 'संस्थापक एवं मुख्य निर्माता, सारथी गाइड',
    founderLocation: 'तिरुपति, आंध्र प्रदेश',
    badgeLocal: 'तिरुपति जमीनी शोध',
    badgeCommission: '100% ज़ीरो कमीशन',
    badgeOffline: 'बिना इंटरनेट कार्यरत',
    founderBio1: 'सुनील तात्रा ने लाखों तीर्थयात्रियों की सुविधा के लिए सारथी गाइड का निर्माण किया ताकि हर श्रद्धालु बिना किसी परेशानी के श्रीवारी दर्शन कर सके।',
    founderBio2: 'रेलवे स्टेशन, बस स्टैंड और अलीपिरी पर 100 से अधिक श्रद्धालुओं से मिलकर उनकी वास्तविक समस्याओं को समझा और इस ऑफ़लाइन ऐप का निर्माण किया।',
    founderPledgeQuote: 'तीर्थयात्रा शांति और भक्ति से परिपूर्ण होनी चाहिए, न कि शोषण और चिंता से। तिरुपति की पावन भूमि पर आने वाले प्रत्येक श्रद्धालु परिवार को पारदर्शी मार्गदर्शन, सत्यापित नंबर और बिचौलियों से पूर्ण मुक्ति दिलाना ही सारथी का संकल्प है।',
    founderPledgeRole: 'संस्थापक का पावन संकल्प',
    vowsTitle: 'सारथी के निर्माण का कारण: 3 जमीनी संकल्प',
    vows: [
      {
        title: 'बिचौलियों के शोषण पर रोक',
        desc: 'देर रात आने वाले श्रद्धालुओं को कमरों के नाम पर ठगा न जाए, इसलिए सभी मठों व लॉज के सीधे संपर्क नंबर उपलब्ध कराए हैं।'
      },
      {
        title: 'उचित एवं पारदर्शी किराया',
        desc: 'त्योहारों में टैक्सी चालकों द्वारा मनमाना किराया वसूलने से बचाने के लिए आधिकारिक रेट कार्ड और सीधे चालकों के नंबर दिए गए हैं।'
      },
      {
        title: 'व्यापार नहीं, निष्काम सेवा',
        desc: 'सारथी कोई व्यावसायिक ऐप नहीं है, बल्कि भगवान वेंकटेश्वर के श्रद्धालुओं के लिए एक समर्पित एवं पारदर्शी डिजिटल सेवा है।'
      }
    ],
    linkedinBtn: 'लिंक्डइन पर जुड़ें',

    researchTag: 'जमीनी शोध',
    researchTitle: '100+ श्रद्धालुओं से बातचीत से सामने आई मुख्य चुनौतियां',
    researchDesc: 'तिरुपति में श्रद्धालुओं द्वारा सामना की जाने वाली 4 प्रमुख समस्याएं और उनका समाधान:',

    frictionPoints: [
      {
        title: 'कमरों के लिए बिचौलियों का शोषण',
        problem: 'देर रात आने वाले श्रद्धालुओं से कमरों के लिए मनमाना किराया वसूला जाता है।',
        solution: 'पारंपरिक मठों (अहोबिला, रायर, कांची) और लॉज के सीधे संपर्क नंबर।'
      },
      {
        title: 'टैक्सी का अत्यधिक किराया',
        problem: 'भीड़ के समय 2 से 3 गुना अधिक किराया लिया जाता है।',
        solution: 'मानकीकृत दरें और सीधे ड्राइवरों के ज़ीरो-कमीशन नंबर।'
      },
      {
        title: 'पहाड़ी पर नेटवर्क समस्या',
        problem: 'तिरुमाला पहाड़ी और कतार परिसरों में मोबाइल सिग्नल नहीं मिलते।',
        solution: '100% ऑफ़लाइन आर्किटेक्चर — इंटरनेट के बिना भी सभी मैप और नंबर काम करते हैं।'
      },
      {
        title: 'टोकन और कतार में भ्रम',
        problem: 'सर्व दर्शन, SSD टोकन और दिव्य दर्शन के नियमों में भ्रम।',
        solution: 'लाइव काउंटर स्थिति, अनुमानित समय और प्रवेश मार्गदर्शक।'
      }
    ],

    principlesTag: 'मुख्य सिद्धांत',
    principlesTitle: 'सारथी के 3 आधारभूत सिद्धांत',
    principles: [
      {
        title: '100% ऑफ़लाइन कार्यप्रणाली',
        desc: 'कतार परिसरों और नेटवर्क-मुक्त क्षेत्रों में भी सभी सुविधाएं काम करती हैं।'
      },
      {
        title: 'ज़ीरो कमीशन निष्पक्षता',
        desc: 'होटलों या कैब ड्राइवरों से कोई कमीशन नहीं। पूर्णतः निष्पक्ष जानकारी।'
      },
      {
        title: 'श्रद्धालु-समर्पित स्वतंत्रता',
        desc: 'तीर्थयात्रियों की निस्वार्थ सेवा ही मुख्य उद्देश्य है। TTD से कोई संबद्धता नहीं है।'
      }
    ],

    missionTitle: 'हमारा उद्देश्य',
    missionDesc: 'सत्यापित और ऑफ़लाइन तकनीक के माध्यम से तिरुपति आने वाले श्रद्धालुओं की यात्रा को सरल बनाना।',
    visionTitle: 'हमारी दृष्टि',
    visionDesc: 'भारत का सबसे प्रामाणिक, गैर-व्यावसायिक तीर्थयात्रा डिजिटल साथी बनना।',

    contactHeader: 'संस्थापक से सीधा संपर्क करें',
    contactDesc: 'किसी भी सुझाव या प्रतिक्रिया के लिए सुनील तात्रा से सीधे संपर्क करें।',
    emailBtn: 'ईमेल करें: saarthiguide9@gmail.com',
    footerNotice: 'सारथी गाइड सुनील तात्रा द्वारा स्थापित एक स्वतंत्र डिजिटल गाइड है। TTD से कोई संबद्धता नहीं है।'
  },
  kn: {
    back: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    badge: 'ಪರಿಶೀಲಿಸಿದ ಸ್ವತಂತ್ರ ಮಾರ್ಗದರ್ಶಿ',
    heroTag: 'ಯಾತ್ರಿಕರ ಸಾರ್ವಜನಿಕ ಸೇವಾ ಯೋಜನೆ',
    heroTitle: 'ತಿರುಮಲ ಮತ್ತು ತಿರುಪತಿ ಯಾತ್ರಿಕರ ಆಫ್‌ಲೈನ್ ಡಿಜಿಟಲ್ ಒಡನಾಡಿ',
    heroDesc: 'ತಿರುಪತಿಗೆ ಬರುವ ಪ್ರತಿಯೊಬ್ಬ ಭಕ್ತರಿಗೂ ದಲ್ಲಾಳಿಗಳ ಶೋಷಣೆ ಮತ್ತು ಆತಂಕವಿಲ್ಲದ ಶಾಂತಿಯುತ ಯಾತ್ರೆಗಾಗಿ ಸುನೀಲ್ ತಾತ್ರಾ ಅವರು ಸಾರಥಿ ಗೈಡ್ ಅನ್ನು ನಿರ್ಮಿಸಿದ್ದಾರೆ. 100% ಆಫ್‌ಲೈನ್ ಗೈಡ್, ಅಧಿಕೃತ ನೇರ ಸಂಪರ್ಕಗಳು ಮತ್ತು ಲೈವ್ ಸರತಿ ಸಾಲಿನ ಮಾಹಿತಿ.',

    stats: [
      { num: '100+', label: 'ಭಕ್ತರ ಮುಖಾಮುಖಿ ಸಂಶೋಧನೆ' },
      { num: '100%', label: 'ಆಫ್‌ಲೈನ್ ಲಭ್ಯತೆ' },
      { num: '₹0', label: 'ಶೂನ್ಯ ಕಮಿಷನ್' },
      { num: '24/7', label: 'ಬೆಟ್ಟದ ಮೇಲಿನ ಮಾರ್ಗದರ್ಶಿ' },
    ],

    founderTag: 'ಸಂಸ್ಥಾಪಕರ ಪರಿಚಯ',
    founderHeader: 'ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಮುಖ್ಯ ರೂವಾರಿ',
    founderName: 'ಸುನೀಲ್ ತಾತ್ರಾ (Sunil Thatra)',
    founderRole: 'ಸಂಸ್ಥಾಪಕರು & ಲೀಡ್ ಕ್ರಿಯೇಟರ್, ಸಾರಥಿ ಗೈಡ್',
    founderLocation: 'ತಿರುಪತಿ, ಆಂಧ್ರಪ್ರದೇಶ',
    badgeLocal: 'ತಿರುಪತಿ ಸ್ಥಳೀಯ ಸಂಶೋಧನೆ',
    badgeCommission: '100% ಶೂನ್ಯ ಕಮಿಷನ್',
    badgeOffline: 'ಆಫ್‌ಲೈನ್ ಆರ್ಕಿಟೆಕ್ಚರ್',
    founderBio1: 'ತಿರುಪತಿ ಮತ್ತು ತಿರುಮಲ ದರ್ಶನಕ್ಕೆ ಬರುವ ಲಕ್ಷಾಂತರ ಭಕ್ತರಿಗೆ ಒಂದು ನಿಸ್ವಾರ್ಥ, ಪ್ರಾಮಾಣಿಕ ಡಿಜಿಟಲ್ ಒಡನಾಡಿ ನೀಡಲು ಸುನೀಲ್ ತಾತ್ರಾ ಸಾರಥಿ ಗೈಡ್ ಅನ್ನು ರೂಪಿಸಿದ್ದಾರೆ.',
    founderBio2: 'ಕೊಟ್ಟಡಿ ದಲ್ಲಾಳಿಗಳ ಶೋಷಣೆ, ಅಧಿಕ ಟ್ಯಾಕ್ಸಿ ದರಗಳು ಮತ್ತು ಬೆಟ್ಟದ ಮೇಲಿನ ಸಿಗ್ನಲ್ ಕಡಿತದಿಂದ ಯಾತ್ರಿಕರು ಅನುಭವಿಸುವ ಸಂಕಷ್ಟಗಳನ್ನು ಕಣ್ಣಾರೆ ಕಂಡು, ಪ್ರತಿಯೊಂದು ಕುಟುಂಬಕ್ಕೂ ಆಫ್‌ಲೈನ್-ಸಿದ್ಧ ರಕ್ಷಾಕವಚ ನೀಡಲು ಮುಂದಾದರು.',
    founderPledgeQuote: 'ತಿರುಮಲ ಯಾತ್ರೆಯು ಪ್ರಶಾಂತತೆ ಮತ್ತು ಭಕ್ತಿಯಿಂದ ಕೂಡಿರಬೇಕೇ ಹೊರತು, ಶೋಷಣೆ ಮತ್ತು ಗೊಂದಲಗಳಿಂದಲ್ಲ. ತಿರುಪತಿಯ ಪವಿತ್ರ ಮಣ್ಣಿನಲ್ಲಿ ಕಾಲಿಡುವ ಪ್ರತಿಯೊಂದು ಕುಟುಂಬಕ್ಕೂ ಪ್ರಾಮಾಣಿಕ ಮಾರ್ಗದರ್ಶನ, ಅಧಿಕೃತ ನೇರ ಸಂಪರ್ಕಗಳು ಮತ್ತು ದಲ್ಲಾಳಿಗಳಿಂದ ಮುಕ್ತಿ ದೊರೆಯಬೇಕೆಂಬುದೇ ನನ್ನ ದೃಢ ಸಂಕಲ್ಪ.',
    founderPledgeRole: 'ಸಂಸ್ಥಾಪಕರ ಪವಿತ್ರ ಸಂಕಲ್ಪ',
    vowsTitle: 'ಸಾರಥಿ ನಿರ್ಮಾಣದ ಹಿಂದಿನ 3 ಮೂಲ ಪ್ರತಿಜ್ಞೆಗಳು',
    vows: [
      {
        title: 'ದಲ್ಲಾಳಿಗಳ ಶೋಷಣೆಗೆ ಸಂಪೂರ್ಣ ಮುಕ್ತಿ',
        desc: 'ರಾತ್ರಿ ವೇಳೆ ಬರುವ ಭಕ್ತರಿಗೆ ಕೊಟ್ಟಡಿಗಳಿಲ್ಲವೆಂದು ನಂಬಿಸಿ ವಂಚಿಸುವುದನ್ನು ತಡೆಯಲು, ಅಧಿಕೃತ ಮಠಗಳು ಮತ್ತು ಲಾಡ್ಜ್‌ಗಳ ನೇರ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳನ್ನು ನೀಡಲಾಗಿದೆ.'
      },
      {
        title: 'ಪಾರದರ್ಶಕ ಹಾಗೂ ನ್ಯಾಯಯುತ ದರಗಳು',
        desc: 'ಹಬ್ಬದ ರದ್ದಿ ವೇಳೆ ಖಾಸಗಿ ವಾಹನಗಳು ಅಧಿಕ ದರ ವಸೂಲಿ ಮಾಡುವುದನ್ನು ತಡೆಯಲು, ಅಧಿಕೃತ ದರಪಟ್ಟಿ ಮತ್ತು ಚಾಲಕರ ನೇರ ಸಂಖ್ಯೆಗಳನ್ನು ಒದಗಿಸಲಾಗಿದೆ.'
      },
      {
        title: 'ವ್ಯಾಪಾರವಲ್ಲ, ಭಕ್ತರ ನಿಸ್ವಾರ್ಥ ಸೇವೆ',
        desc: 'ಸಾರಥಿಯು ಲಾಭದ ಉದ್ದೇಶದ ವಾಣಿಜ್ಯ ಅಪ್ಲಿಕೇಶನ್ ಅಲ್ಲ. ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಸ್ವಾಮಿಯ ಭಕ್ತರಿಗಾಗಿ ಸಮರ್ಪಿತವಾದ ಮುಕ್ತ ಹಾಗೂ ಪ್ರಾಮಾಣಿಕ ಡಿಜಿಟಲ್ ಸೇವೆ.'
      }
    ],
    linkedinBtn: 'ಲಿಂಕ್ಡ್ಇನ್‌ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ',

    researchTag: 'ಕ್ಷೇತ್ರ ಸಮೀಕ್ಷೆ',
    researchTitle: '100+ ಭಕ್ತರ ಸಂಭಾಷಣೆಯಿಂದ ಹೊರಬಂದ ಪ್ರಮುಖ ಸವಾಲುಗಳು',
    researchDesc: 'ತಿರುಪತಿ ರೈಲ್ವೆ ನಿಲ್ದಾಣ, RTC ಬಸ್ ನಿಲ್ದಾಣ ಮತ್ತು ಅಲಿಪಿರಿಯಲ್ಲಿ ಸುನೀಲ್ ಅವರು ಖುದ್ದಾಗಿ ಭಕ್ತರನ್ನು ಭೇಟಿ ಮಾಡಿ ದಾಖಲಿಸಿದ 4 ಪ್ರಮುಖ ಸಮಸ್ಯೆಗಳು:',

    frictionPoints: [
      {
        title: 'ಕೊಟ್ಟಡಿಗಳಿಗಾಗಿ ದಲ್ಲಾಳಿಗಳ ವಂಚನೆ',
        problem: 'ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ಬರುವ ಯಾತ್ರಿಕರಿಗೆ ಕೊಠಡಿಗಳಿಲ್ಲವೆಂದು ಹೇಳಿ ದುಬಾರಿ ಹಣ ವಸೂಲಿ ಮಾಡುವುದು.',
        solution: 'ಪ್ರಮುಖ ಮಠಗಳು (ಅಹೋಬಿಲ, ರಾಯರ, ಕಂಚಿ) ಮತ್ತು ಪರಿಶೀಲಿತ ಲಾಡ್ಜ್‌ಗಳ ನೇರ ಫೋನ್ ಸಂಖ್ಯೆಗಳು.'
      },
      {
        title: 'ಟ್ಯಾಕ್ಸಿಗಳ ಅತಿಯಾದ ದರಗಳು',
        problem: 'ರದ್ದಿ ಸಮಯದಲ್ಲಿ ಸಾಮಾನ್ಯ ದರಕ್ಕಿಂತ 2 ರಿಂದ 3 ಪಟ್ಟು ಹೆಚ್ಚು ವಸೂಲಿ ಮಾಡುವುದು.',
        solution: 'ಮಾನಕ ದರಪಟ್ಟಿಗಳು ಮತ್ತು ಶೂನ್ಯ-ಕಮಿಷನ್ ಚಾಲಕರ ನೇರ ಫೋನ್ ಸಂಖ್ಯೆಗಳು.'
      },
      {
        title: 'ಬೆಟ್ಟದ ಮೇಲೆ ಸಿಗ್ನಲ್ ಕೊರತೆ',
        problem: 'ತಿರುಮಲ ಬೆಟ್ಟದಲ್ಲಿ ಮತ್ತು ಕ್ಯೂ ಕಾಂಪ್ಲೆಕ್ಸ್‌ಗಳಲ್ಲಿ ಮೊಬೈಲ್ ನೆಟ್‌ವರ್ಕ್ ಕಡಿತಗೊಳ್ಳುವುದು.',
        solution: '100% ಆಫ್‌ಲೈನ್ ತಂತ್ರಜ್ಞಾನ — ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಎಲ್ಲಾ ನಕ್ಷೆಗಳು ಮತ್ತು ಸಂಖ್ಯೆಗಳು ಲಭ್ಯ.'
      },
      {
        title: 'ಟೋಕನ್ ಹಾಗೂ ಕ್ಯೂ ಗೊಂದಲ',
        problem: 'ಸರ್ವ ದರ್ಶನ, SSD ಟೋಕನ್ ಮತ್ತು ದಿವ್ಯ ದರ್ಶನಗಳ ನಡುವಿನ ನಿಯಮಗಳ ಅಸ್ಪಷ್ಟತೆ.',
        solution: 'ಲೈವ್ ಕೌಂಟರ್ ಮಾಹಿತಿ, ಅಂದಾಜು ಸಮಯ ಮತ್ತು ಹಂತ-ಹಂತದ ಪ್ರವೇಶ ಮಾರ್ಗದರ್ಶಿ.'
      }
    ],

    principlesTag: 'ಮೂಲ ತತ್ವಗಳು',
    principlesTitle: 'ಸಾರಥಿಯ 3 ಪವಿತ್ರ ತತ್ವಗಳು',
    principles: [
      {
        title: '100% ಆಫ್‌ಲೈನ್ ಲಭ್ಯತೆ',
        desc: 'ನೆಟ್‌ವರ್ಕ್ ಇಲ್ಲದ ಬೆಟ್ಟದ ಮೆಟ್ಟಿಲುಗಳು ಹಾಗೂ ಕ್ಯೂ ಕಾಂಪ್ಲೆಕ್ಸ್ ಒಳಭಾಗದಲ್ಲೂ ಸುಲಭವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.'
      },
      {
        title: 'ಶೂನ್ಯ-ಕಮಿಷನ್ ಪ್ರಾಮಾಣಿಕತೆ',
        desc: 'ಹೋಟೆಲ್‌ಗಳಿಂದಾಗಲೀ ಅಥವಾ ಚಾಲಕರಿಂದಾಗಲೀ ಯಾವುದೇ ಕಮಿಷನ್ ಪಡೆಯುವುದಿಲ್ಲ. ನಿಷ್ಪಕ್ಷಪಾತ ಮಾಹಿತಿ ಮಾತ್ರ.'
      },
      {
        title: 'ಭಕ್ತರ ಸೇವೆಯೇ ಪ್ರಥಮ ಆದ್ಯತೆ',
        desc: 'ಯಾತ್ರಿಕರ ಕ್ಷೇಮಕ್ಕಾಗಿ ಮಾತ್ರ ನಿರ್ಮಿಸಲಾಗಿದೆ. TTD ಯೊಂದಿಗೆ ಯಾವುದೇ ವಾಣಿಜ್ಯ ಸಂಬಂಧವಿಲ್ಲ.'
      }
    ],

    missionTitle: 'ನಮ್ಮ ಧ್ಯೇಯ',
    missionDesc: 'ಪ್ರಾಮಾಣಿಕ ಹಾಗೂ ಆಫ್‌ಲೈನ್ ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ತಿರುಪತಿ ಭಕ್ತರ ಆತಂಕ ಹಾಗೂ ದಲ್ಲಾಳಿಗಳ ಕಿರುಕುಳವನ್ನು ಶಾಶ್ವತವಾಗಿ ನಿವಾರಿಸುವುದು.',
    visionTitle: 'ನಮ್ಮ ದೃಷ್ಟಿಕೋನ',
    visionDesc: 'ಭಾರತದಲ್ಲೇ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ, ವಾಣಿಜ್ಯ ಮುಕ್ತ ಧಾರ್ಮಿಕ ಯಾತ್ರಾ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿಯಾಗಿ ಮುನ್ನಡೆಯುವುದು.',

    contactHeader: 'ಸಂಸ್ಥಾಪಕರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ',
    contactDesc: 'ಯಾವುದೇ ಸಲಹೆಗಳು, ತಿದ್ದುಪಡಿಗಳು ಅಥವಾ ಪ್ರತಿಕ್ರಿಯೆಗಳಿದ್ದಲ್ಲಿ ಸುನೀಲ್ ತಾತ್ರಾ ಅವರಿಗೆ ನೇರವಾಗಿ ತಿಳಿಸಿ.',
    emailBtn: 'ಇಮೇಲ್ ಮಾಡಿ: saarthiguide9@gmail.com',
    footerNotice: 'ಸಾರಥಿ ಗೈಡ್ ಸುನೀಲ್ ತಾತ್ರಾ ಅವರಿಂದ ಸ್ಥಾಪಿಸಲ್ಪಟ್ಟ ಸ್ವತಂತ್ರ ಡಿಜಿಟಲ್ ವೇದಿಕೆಯಾಗಿದೆ. ತಿರುಮಲ ತಿರುಪತಿ ದೇವಸ್ಥಾನ (TTD) ದೊಂದಿಗೆ ಯಾವುದೇ ವಾಣಿಜ್ಯ ಸಂಬಂಧವಿಲ್ಲ.'
  },
  ta: {
    back: 'முகப்புக்குத் திரும்பு',
    badge: 'சரிபார்க்கப்பட்ட சுயாதீன வழிகாட்டி',
    heroTag: 'பக்தர்கள் மக்கள் சேவைத் திட்டம்',
    heroTitle: 'திருமலை & திருப்பதி பக்தர்களுக்கான ஆஃப்லைன் டிஜிட்டல் துணை',
    heroDesc: 'திருப்பதிக்கு வரும் ஒவ்வொரு பக்தரும் இடைத்தரகர்களின் சுரண்டல் மற்றும் கவலையின்றி ஆன்மீக அமைதியுடன் தரிசிக்க சுனில் தாத்ரா அவர்களால் உருவாக்கப்பட்டது. 100% ஆஃப்லைன் வழிகாட்டி, சரிபார்க்கப்பட்ட நேரடி எண்கள் மற்றும் நேரலை வரிசைத் தகவல்.',

    stats: [
      { num: '100+', label: 'பக்தர்கள் கள ஆய்வு' },
      { num: '100%', label: 'ஆஃப்லைன் செயல்பாடு' },
      { num: '₹0', label: 'பூஜ்ஜிய கமிஷன்' },
      { num: '24/7', label: 'மலைப்பாதை வழிகாட்டி' },
    ],

    founderTag: 'நிறுவனர் அறிமுகம்',
    founderHeader: 'நிறுவனர் மற்றும் முதன்மை வடிவமைப்பாளர்',
    founderName: 'சுனில் தாத்ரா (Sunil Thatra)',
    founderRole: 'நிறுவனர் & தலைமை வடிவமைப்பாளர், சாரதி வழிகாட்டி',
    founderLocation: 'திருப்பதி, ஆந்திரப் பிரதேசம்',
    badgeLocal: 'திருப்பதி கள ஆய்வு',
    badgeCommission: '100% பூஜ்ஜிய கமிஷன்',
    badgeOffline: 'ஆஃப்லைன் தொழில்நுட்பம்',
    founderBio1: 'திருப்பதி மற்றும் திருமலைக்கு வரும் லட்சக்கணக்கான பக்தர்களுக்கு ஒரு உண்மையான, நேர்மையான டிஜிட்டல் உதவியாளரை வழங்க சுனில் தாத்ரா சாரதி வழிகாட்டியை சுயமாக வடிவமைத்தார்.',
    founderBio2: 'அறை இடைத்தரகர்களின் ஏமாற்றுவேலை, கூடுதல் வாடகை மற்றும் மலைப்பாதையில் நெட்வொர்க் துண்டிப்பால் பக்தர்கள் படும் துயரங்களை நேரில் கண்டு, ஒவ்வொரு குடும்பத்திற்கும் ஒரு ஆஃப்லைன் துணையை உருவாக்கினார்.',
    founderPledgeQuote: 'திருமலை யாத்திரை என்பது பக்தி மற்றும் அமைதியுடன் நிகழ வேண்டுமே தவிர, சுரண்டல் மற்றும் மன உளைச்சலுடன் அல்ல. திருப்பதியின் புனித மண்ணில் அடியெடுத்து வைக்கும் ஒவ்வொரு குடும்பத்திற்கும் உண்மையான வழிகாட்டுதல், சரிபார்க்கப்பட்ட எண்கள் மற்றும் இடைத்தரகர்களற்ற சுதந்திரம் கிடைக்க வேண்டும் என்பதே எனது உறுதிமொழி.',
    founderPledgeRole: 'நிறுவனரின் புனித உறுதிமொழி',
    vowsTitle: 'சாரதி உருவானதற்கான 3 முக்கிய உறுதிமொழிகள்',
    vows: [
      {
        title: 'இடைத்தரகர்கள் சுரண்டலுக்கு முடிவு',
        desc: 'இரவு நேரத்தில் வரும் பக்தர்களை அறைகள் இல்லை என்று ஏமாற்றுவதைத் தடுக்க, புகழ்பெற்ற மடங்கள் மற்றும் விடுதிகளின் நேரடி எண்கள் வழங்கப்பட்டுள்ளன.'
      },
      {
        title: 'நியாயமான கட்டணங்கள்',
        desc: 'கூட்ட நெரிசலின் போது வாடகை கார்கள் 3 மடங்கு வசூலிப்பதைத் தடுக்க, நிலையான கட்டண விவரங்கள் மற்றும் ஓட்டுநர்களின் நேரடி எண்கள் இணைக்கப்பட்டுள்ளன.'
      },
      {
        title: 'வியாபாரமல்ல, பக்தர்களின் நிஷ்காமிய சேவை',
        desc: 'சாரதி ஒரு வணிகரீதியான செயலி அல்ல. எம்பெருமான் ஸ்ரீ வேங்கடேஸ்வரரின் பக்தர்களுக்காக அர்ப்பணிக்கப்பட்ட தூய மற்றும் சுதந்திரமான டிஜிட்டல் சேவை.'
      }
    ],
    linkedinBtn: 'லிங்க்ட்இனில் இணையுங்கள்',

    researchTag: 'கள ஆய்வு',
    researchTitle: '100+ பக்தர்களுடனான நேரடி உரையாடலில் வெளிவந்த சவால்கள்',
    researchDesc: 'திருப்பதி ரயில் நிலையம், மத்திய பேருந்து நிலையம் மற்றும் அலிபிரி நுழைவாயிலில் சுனில் அவர்கள் பக்தர்களை நேரில் சந்தித்து ஆவணப்படுத்திய 4 முக்கிய பிரச்சினைகள்:',

    frictionPoints: [
      {
        title: 'அறைகளுக்கான இடைத்தரகர்களின் சுரண்டல்',
        problem: 'இரவு நேரத்தில் வரும் பக்தர்களிடம் அறைகள் இல்லை என்று கூறி அதிக கட்டணம் வசூலிப்பது.',
        solution: 'முக்கிய மடங்கள் (அஹோபில, ராயர், காஞ்சி) மற்றும் விடுதிகளின் நேரடி எண்கள்.'
      },
      {
        title: 'அதிகப்படியான டாக்ஸி கட்டணம்',
        problem: 'விழாக்கால நெரிசலில் வழக்கமான கட்டணத்தை விட 2 முதல் 3 மடங்கு அதிகமாக வசூலிப்பது.',
        solution: 'நிலையான கட்டண அட்டை மற்றும் இடைத்தரகர்கள் இல்லாத ஓட்டுநர் நேரடி எண்கள்.'
      },
      {
        title: 'மலையில் நெட்வொர்க் துண்டிப்பு',
        problem: 'திருமலை மலைப்பாதையிலும் வரிசை வளாகங்களிலும் செல்போன் சிக்னல் கிடைக்காமல் போவது.',
        solution: '100% ஆஃப்லைன் தொழில்நுட்பம் — இணையம் இன்றியே அனைத்து வரைபடங்களும் எண்களும் இயங்கும்.'
      },
      {
        title: 'டோக்கன் மற்றும் வரிசை குழப்பம்',
        problem: 'சர்வ தரிசனம், SSD டோக்கன் மற்றும் திவ்ய தரிசன விதிகளில் தெளிவின்மை.',
        solution: 'நேரலை கவுண்டர் தகவல், காத்திருப்பு நேரங்கள் மற்றும் வழிகாட்டி வரைபடங்கள்.'
      }
    ],

    principlesTag: 'கோட்பாடுகள்',
    principlesTitle: 'சாரதியின் 3 புனிதக் கோட்பாடுகள்',
    principles: [
      {
        title: '100% ஆஃப்லைன் நம்பகத்தன்மை',
        desc: 'நெட்வொர்க் இல்லாத மலைப்பாதை மற்றும் வரிசை வளாகங்களின் ஆழத்திலும் முழுமையாக இயங்கும்.'
      },
      {
        title: 'பூஜ்ஜிய கமிஷன் நேர்மை',
        desc: 'விடுதிகள் அல்லது ஓட்டுநர்களிடமிருந்து எந்த கமிஷனும் பெறப்படுவதில்லை. தூய மற்றும் நடுநிலையான தகவல் மட்டுமே.'
      },
      {
        title: 'பக்தர் சேவையே முதன்மை',
        desc: 'யாத்ரீகர்களின் நல்வாழ்விற்காக மட்டுமே உருவாக்கப்பட்டது. TTD உடன் எந்த வணிகத் தொடர்பும் இல்லை.'
      }
    ],

    missionTitle: 'எங்கள் நோக்கம்',
    missionDesc: 'சரிபார்க்கப்பட்ட மற்றும் ஆஃப்லைன் தொழில்நுட்பத்தின் மூலம் திருப்பதி பக்தர்களின் கவலை மற்றும் ஏமாற்றங்களைத் துடைத்தெறிதல்.',
    visionTitle: 'எங்கள் பார்வை',
    visionDesc: 'இந்தியாவின் மிகவும் நம்பகமான, வணிகரீதியற்ற புனித யாத்திரை டிஜிட்டல் துணையாக விளங்குவது.',

    contactHeader: 'நிறுவனரை நேரடியாகத் தொடர்பு கொள்ளுங்கள்',
    contactDesc: 'ஏதேனும் ஆலோசனைகள் அல்லது கருத்துகள் இருந்தால், சுனில் தாத்ராவிடம் நேரடியாகப் பகிருங்கள்.',
    emailBtn: 'மின்னஞ்சல்: saarthiguide9@gmail.com',
    footerNotice: 'சாரதி வழிகாட்டி என்பது சுனில் தாத்ராவால் நிறுவப்பட்ட ஒரு சுயாதீன டிஜிட்டல் தளம். திருமலை திருப்பதி தேவஸ்தானத்துடன் (TTD) வணிக தொடர்பு இல்லை.'
  }
};

export default function AboutPage() {
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', color: '#0F172A', paddingBottom: '70px', fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif' }}>

      {/* ── STICKY ELEGANT TOP BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 248, 245, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #ECE7DE',
        padding: '12px 16px'
      }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2DCD2',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#0F172A',
                boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
              }}
              aria-label={t.back}
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#0F5132', margin: 0, letterSpacing: '-0.01em' }}>
                Saarthi Guide
              </h1>
              <p style={{ fontSize: '11px', color: '#92400E', margin: '1px 0 0 0', fontWeight: 700, letterSpacing: '0.2px' }}>
                {t.founderName} • {t.founderRole.split(',')[0]}
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '5px 12px',
            borderRadius: '999px',
            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.08)'
          }}>
            <BadgeCheck size={14} color="#059669" />
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#065F46' }}>{t.badge}</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          background: 'linear-gradient(145deg, #093722 0%, #0F5132 50%, #166534 100%)',
          borderRadius: '28px',
          padding: '36px 28px',
          color: '#FFFFFF',
          boxShadow: '0 16px 40px -8px rgba(15, 81, 50, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Subtle Ambient Radial Highlights */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, rgba(250, 204, 21, 0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '840px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#FEF08A',
              backgroundColor: 'rgba(254, 240, 138, 0.15)',
              border: '1px solid rgba(254, 240, 138, 0.3)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '16px',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>
              <Compass size={13} />
              <span>{t.heroTag}</span>
            </span>

            <h2 style={{
              fontSize: 'clamp(24px, 4.8vw, 34px)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 14px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.025em'
            }}>
              {t.heroTitle}
            </h2>

            <p style={{ fontSize: '15px', color: '#D1FAE5', margin: '0 0 24px 0', lineHeight: 1.7, fontWeight: 500 }}>
              {t.heroDesc}
            </p>

            {/* Micro Stats Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              {t.stats.map((st, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#FDE047', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {st.num}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#A7F3D0', fontWeight: 600, marginTop: '2px' }}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MEET THE FOUNDER CARD ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          padding: '32px 28px',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 10px 34px -4px rgba(217, 119, 6, 0.08), 0 2px 10px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Golden Corner Glow */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(254, 240, 138, 0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                border: '1px solid #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)'
              }}>
                <Award size={18} color="#B45309" />
              </div>
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>
                  {t.founderTag}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                  {t.founderHeader}
                </h3>
              </div>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#047857',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MapPin size={11} />
              {t.founderLocation}
            </span>
          </div>

          {/* Profile Card Body */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            padding: '22px',
            backgroundColor: '#FBF9F5',
            borderRadius: '20px',
            border: '1px solid #EFEAE1',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Portrait Image with Double-Ring Halo Glow */}
            <div style={{
              position: 'relative',
              width: '112px',
              height: '112px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '3px solid #D97706',
              boxShadow: '0 12px 30px rgba(217, 119, 6, 0.22), 0 4px 12px rgba(15, 81, 50, 0.12)',
              flexShrink: 0,
              backgroundColor: '#ECE7DE'
            }}>
              <Image
                src={PASSPORT_PHOTO_URL}
                alt="Sunil Thatra - Founder & Lead Creator, Saarthi Guide"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '24px', fontWeight: 800, color: '#0F5132', margin: 0, letterSpacing: '-0.02em' }}>
                  {t.founderName}
                </h4>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#065F46',
                  backgroundColor: '#D1FAE5',
                  border: '1px solid #A7F3D0',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <BadgeCheck size={12} color="#059669" />
                  Founder & Architect
                </span>
              </div>

              <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#92400E', margin: '4px 0 10px 0' }}>
                {t.founderRole}
              </p>

              {/* Verified Credential Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0F5132',
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #C8E6C9',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={11} color="#0F5132" />
                  {t.badgeLocal}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#92400E',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={11} color="#B45309" />
                  {t.badgeCommission}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1E40AF',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <WifiOff size={11} color="#2563EB" />
                  {t.badgeOffline}
                </span>
              </div>

              {/* Action Buttons: LinkedIn + Direct Mail */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={FOUNDER_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0A66C2',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #BAE6FD',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(10, 102, 194, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Globe size={14} />
                  <span>{t.linkedinBtn}</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href={`mailto:${FOUNDER_EMAIL}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0F5132',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #BBF7D0',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(15, 81, 50, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Mail size={14} color="#15803D" />
                  <span>{FOUNDER_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Narrative paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: '#334155', lineHeight: 1.75 }}>
            <p style={{ margin: 0 }}>{t.founderBio1}</p>
            <p style={{ margin: 0 }}>{t.founderBio2}</p>
          </div>

          {/* ── FOUNDER'S PERSONAL DEVOTIONAL PLEDGE QUOTE BLOCK ── */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFDF7 0%, #FEF9C3 60%, #FEF08A 100%)',
            border: '1.5px solid #FDE68A',
            borderLeft: '5px solid #D97706',
            borderRadius: '18px',
            padding: '20px 22px',
            boxShadow: '0 4px 18px rgba(217, 119, 6, 0.08)',
            position: 'relative'
          }}>
            <p style={{
              fontSize: '14.5px',
              lineHeight: 1.7,
              fontWeight: 600,
              color: '#1E232D',
              fontStyle: 'italic',
              margin: '0 0 12px 0'
            }}>
              "{t.founderPledgeQuote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                ~ {t.founderName}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#047857',
                backgroundColor: '#ECFDF5',
                padding: '2px 9px',
                borderRadius: '6px',
                border: '1px solid #A7F3D0'
              }}>
                {t.founderPledgeRole}
              </span>
            </div>
          </div>

          {/* ── WHY I BUILT SAARTHI: 3 GROUND VOWS ── */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#059669" />
              <span>{t.vowsTitle}</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {t.vows.map((vow, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#E2E8F0',
                      color: '#0F172A',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0F5132', margin: 0 }}>
                      {vow.title}
                    </h5>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6, paddingLeft: '30px' }}>
                    {vow.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 100+ PILGRIMS FIELD RESEARCH SECTION ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          padding: '32px 28px',
          border: '1px solid #EAE5DC',
          boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#B45309',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              padding: '4px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              {t.researchTag}
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.015em' }}>
              {t.researchTitle}
            </h3>
            <p style={{ fontSize: '14.5px', color: '#475569', margin: 0, lineHeight: 1.65 }}>
              {t.researchDesc}
            </p>
          </div>

          {/* 4 Friction Points Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {t.frictionPoints.map((pt, i) => (
              <div key={i} style={{
                backgroundColor: '#FBF9F5',
                borderRadius: '18px',
                padding: '20px',
                border: '1px solid #EFEAE1',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '11px',
                    backgroundColor: '#E8F5E9',
                    border: '1px solid #C8E6C9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {i === 0 && <Home size={19} color="#0F5132" />}
                    {i === 1 && <Car size={19} color="#0F5132" />}
                    {i === 2 && <WifiOff size={19} color="#0F5132" />}
                    {i === 3 && <Ticket size={19} color="#0F5132" />}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {pt.title}
                  </h4>
                </div>

                <div style={{ fontSize: '13px', lineHeight: 1.55 }}>
                  <div style={{ color: '#991B1B', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800 }}>Problem:</span> {pt.problem}
                  </div>
                  <div style={{ color: '#166534', fontWeight: 600 }}>
                    <span style={{ fontWeight: 800 }}>Saarthi Solution:</span> {pt.solution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THREE PRINCIPLES SECTION ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          padding: '32px 28px',
          border: '1px solid #EAE5DC',
          boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#065F46',
              backgroundColor: '#D1FAE5',
              border: '1px solid #A7F3D0',
              padding: '4px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              {t.principlesTag}
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '10px 0 0 0', letterSpacing: '-0.015em' }}>
              {t.principlesTitle}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {t.principles.map((pr, i) => (
              <div key={i} style={{
                backgroundColor: '#F0FDF4',
                borderRadius: '18px',
                padding: '20px',
                border: '1px solid #BBF7D0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F5132', margin: 0 }}>
                    {pr.title}
                  </h4>
                </div>
                <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  {pr.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MISSION & VISION CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px 24px',
            border: '1px solid #EAE5DC',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Target size={20} color="#059669" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.missionTitle}
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.65 }}>
              {t.missionDesc}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px 24px',
            border: '1px solid #EAE5DC',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Sparkles size={20} color="#D97706" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.visionTitle}
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.65 }}>
              {t.visionDesc}
            </p>
          </div>

        </div>

        {/* ── CONTACT & DIRECT FOUNDER ACCESS ── */}
        <footer style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          padding: '36px 28px',
          border: '1px solid #EAE5DC',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 6px 24px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={22} color="#059669" />
          </div>

          <div style={{ maxWidth: '600px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.contactHeader}
            </h4>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              {t.contactDesc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={`mailto:${FOUNDER_EMAIL}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0F5132',
                color: '#FFFFFF',
                padding: '12px 26px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
                transition: 'transform 0.15s ease'
              }}
            >
              <Mail size={16} />
              <span>{t.emailBtn}</span>
            </a>

            <a
              href={FOUNDER_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#0A66C2',
                border: '1px solid #BAE6FD',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(10, 102, 194, 0.08)'
              }}
            >
              <Globe size={16} />
              <span>{t.linkedinBtn}</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#94A3B8', fontWeight: 500, margin: 0, maxWidth: '600px' }}>
            {t.footerNotice}
          </p>
        </footer>

      </main>
    </div>
  );
}

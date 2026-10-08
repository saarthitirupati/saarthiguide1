'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Compass, Calendar, Award, Info, ChevronRight, Languages } from 'lucide-react';
import Link from 'next/link';
import styles from './SideMenu.module.css';
import { useLanguage, setAppLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    menu: 'Menu',
    home: 'Home',
    explore: 'Explore Places',
    offlineMaps: 'Offline Precinct Maps',
    tripEstimator: 'Trip Estimator & Fares',
    smartPlanner: 'Smart Trip Planner',
    liveUpdates: 'Live Tirumala Updates',
    festivals: 'Festivals & Events',
    liveAlerts: 'Live Alerts & Advisories',
    aboutUs: 'About Saarthi',
    adminDashboard: 'Admin Dashboard',
    darshanTip: 'Darshan Tip',
    darshanTipDesc: 'Morning slots are usually less crowded. Visit Kapila Theertham first for a traditional start.'
  },
  te: {
    menu: 'మెనూ',
    home: 'హోమ్',
    explore: 'ప్రదేశాలు అన్వేషించండి',
    offlineMaps: 'ఆఫ్‌లైన్ ఆలయ మ్యాప్‌లు',
    tripEstimator: 'యాత్ర అంచనా & ఛార్జీలు',
    smartPlanner: 'స్మార్ట్ యాత్ర ప్లానర్',
    liveUpdates: 'తిరుమల లైవ్ అప్డేట్స్',
    festivals: 'పండుగలు & ఈవెంట్స్',
    liveAlerts: 'లైవ్ అలర్ట్స్ & సూచనలు',
    aboutUs: 'సారథి గురించి (About Us)',
    adminDashboard: 'అడ్మిన్ డాష్బోర్డ్',
    darshanTip: 'దర్శన సూచన',
    darshanTipDesc: 'ఉదయపు స్లాట్లలో సాధారణంగా తక్కువ రద్దీ ఉంటుంది. సాంప్రదాయ ప్రారంభం కోసం ముందు కపిల తీర్థం సందర్శించండి.'
  },
  hi: {
    menu: 'मेनू',
    home: 'होम',
    explore: 'स्थान देखें',
    offlineMaps: 'ऑफलाइन मानचित्र',
    tripEstimator: 'यात्रा अनुमान और किराया',
    smartPlanner: 'स्मार्ट यात्रा योजनाकार',
    liveUpdates: 'तिरुपति लाइव अपडेट्स',
    festivals: 'त्यौहार और कार्यक्रम',
    liveAlerts: 'लाइव अलर्ट और सलाह',
    aboutUs: 'सारथी के बारे में',
    adminDashboard: 'एडमिन डैशबोर्ड',
    darshanTip: 'दर्शन टिप',
    darshanTipDesc: 'सुबह के स्लॉट में आमतौर पर कम भीड़ होती है। पारंपरिक शुरुआत के लिए पहले कपिला तीर्थम जाएं।'
  },
  ta: {
    menu: 'மெனு',
    home: 'முகப்பு',
    explore: 'இடங்களை ஆராய்க',
    offlineMaps: 'ஆஃப்லைன் வரைபடங்கள்',
    tripEstimator: 'பயணக் கட்டணக் கணிப்பு',
    smartPlanner: 'ஸ்மார்ட் பயண திட்டமிடுபவர்',
    liveUpdates: 'திருமலை நேரலை தகவல்கள்',
    festivals: 'விழாக்கள் & நிகழ்வுகள்',
    liveAlerts: 'நேரலை எச்சரிக்கைகள்',
    aboutUs: 'சாரதி பற்றி',
    adminDashboard: 'நிர்வாகி டாஷ்போர்டு',
    darshanTip: 'தரிசன உதவிக்குறிப்பு',
    darshanTipDesc: 'காலை நேரங்களில் கூட்டம் குறைவாக இருக்கும். பாரம்பரிய தொடக்கத்திற்கு முதலில் கபில தீர்த்தத்தை பார்வையிடவும்.'
  }
};

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const lang = useLanguage();
  const langKey = (lang && TEXTS[lang as keyof typeof TEXTS]) ? lang as keyof typeof TEXTS : 'en';
  const currentDict = TEXTS[langKey] || TEXTS.en;
  const t = (key: keyof typeof TEXTS.en) => currentDict[key] || TEXTS.en[key] || '';
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/wv|Android.*Version\/[0-9.]+|SaarthiApp/i.test(ua) || (window as any).AndroidInterface !== undefined) {
      setIsWebView(true);
    }
  }, []);

  const menuItems = [
    { name: t('home'), icon: Home, href: '/' },
    { name: t('explore'), icon: Compass, href: '/explore' },
    { name: t('offlineMaps'), icon: Compass, href: '/offline-maps' },
    { name: t('tripEstimator'), icon: Compass, href: '/trip-estimator' },
    { name: t('smartPlanner'), icon: Compass, href: '/planner' },
    { name: t('festivals'), icon: Calendar, href: '/festivals' },
    { name: t('liveAlerts'), icon: Info, href: '/alerts' },
    { name: t('aboutUs'), icon: Info, href: '/about' },
    { name: t('adminDashboard'), icon: Award, href: '/saarthiadmin' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>{t('menu')}</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <nav className={styles.nav}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} className={styles.navLink} onClick={onClose}>
                    <div className={styles.linkLeft}>
                      <item.icon size={20} className={styles.icon} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={16} className={styles.chevron} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Language Selection Row */}
            <div style={{
              margin: '12px 16px 4px 16px',
              padding: '10px 14px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '13px', fontWeight: 600 }}>
                <Languages size={17} color="#0F5132" />
                <span>{lang === 'te' ? 'భాష' : lang === 'hi' ? 'भाषा' : lang === 'ta' ? 'மொழி' : 'Language'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'ta', label: 'தமிழ்' }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => { setAppLanguage(item.code as any); onClose(); }}
                    style={{
                      padding: '6px 4px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: lang === item.code ? '#0F5132' : '#FFFFFF',
                      color: lang === item.code ? '#FFFFFF' : '#64748B',
                      boxShadow: lang === item.code ? '0 1px 3px rgba(15,81,50,0.25)' : 'none',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.footer}>
              {!isWebView && (
                <a
                  href="https://play.google.com/store/apps/details?id=in.saarthiguide.travel"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
                    color: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(15,81,50,0.2)'
                  }}
                >
                  <span>{lang === 'te' ? '📲 ఆండ్రాయిడ్ యాప్ డౌన్‌లోడ్ చేయండి' : '📲 Download Android App'}</span>
                </a>
              )}

              <div className={styles.spiritualTip}>
                <div className={styles.tipHeader}>
                  <Info size={16} />
                  <span>{t('darshanTip')}</span>
                </div>
                <p>{t('darshanTipDesc')}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



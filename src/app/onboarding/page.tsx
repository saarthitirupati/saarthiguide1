'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, ArrowLeft, Compass, 
  Sparkles, Globe, ChevronRight, Lock, 
  BookOpen, Activity 
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import styles from './Onboarding.module.css';

interface LanguageOption {
  code: 'en' | 'te' | 'hi' | 'ta';
  badge: string;
  nativeName: string;
  englishLabel: string;
  subText: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', badge: 'Aa', nativeName: 'English', englishLabel: 'English', subText: 'Default App Language' },
  { code: 'te', badge: 'అ', nativeName: 'తెలుగు', englishLabel: 'Telugu', subText: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
  { code: 'hi', badge: 'अ', nativeName: 'हिंदी', englishLabel: 'Hindi', subText: 'भारत की राजभाषा' },
  { code: 'ta', badge: 'அ', nativeName: 'தமிழ்', englishLabel: 'Tamil', subText: 'தமிழ்நாடு & புதுச்சேரி' }
];

const TRANSLATIONS = {
  en: {
    selectLanguage: 'Choose Your Language',
    selectLanguageSub: 'మీ భాషను ఎంచుకోండి',
    welcomeTitle: 'Welcome to Saarthi',
    welcomeSub: 'Your trusted companion for a smooth & meaningful journey in Tirupati.',
    cards: [
      { title: 'Live Updates', desc: 'Real-time darshan, crowd levels, and instant alerts.', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'Curated Places', desc: 'Detailed guides for temples, nature, and hidden gems.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'Travel Essentials', desc: 'Official rules, transport options, and helpful checklists.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'What should we call you?',
    nameDesc: "We'll personalize your dashboard & recommendations.",
    namePlaceholder: 'Enter your name',
    nameExamples: 'e.g. Raghav, Sreeja, Mahesh',
    privacyNote: 'Your privacy is our priority. We never share your details; they are stored strictly on this device.',
    btnContinue: 'Continue',
    btnLetsGo: "Let's Go!",
    loadingTagline: 'Getting your guide ready...',
    blessing: 'OM SRI VENKATESHAYA NAMAHA',
    skip: 'Skip'
  },
  te: {
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    selectLanguageSub: 'Choose Your Language',
    welcomeTitle: 'సారథికి స్వాగతం',
    welcomeSub: 'తిరుపతి యాత్రను సులభంగా, ఆధ్యాత్మికంగా అనుభవించేందుకు మీ విశ్వసనీయ సహచరి.',
    cards: [
      { title: 'లైవ్ సమాచారం', desc: 'దర్శనం లైవ్ సమయాలు, రద్దీ వివరాలు, తక్షణ హెచ్చరికలు.', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'దర్శనీయ స్థలాలు', desc: 'ఆలయాలు, ప్రకృతి అందాలు, ఆధ్యాత్మిక క్షేత్రాల సమగ్ర మార్గదర్శిని.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'యాత్రా సదుపాయాలు', desc: 'అధికారిక నిబంధనలు, రవాణా వివరాలు, సులువైన పరిశీలనల జాబితా.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'మిమ్మల్ని ఏమని పిలవాలి?',
    nameDesc: 'మీ తిరుమల యాత్ర వివరాలను మీ కోసం ప్రత్యేకంగా తీర్చిదిద్దుతాం.',
    namePlaceholder: 'మీ పేరు నమోదు చేయండి',
    nameExamples: 'ఉదా: రాఘవ్, శ్రీజ, మహేష్',
    privacyNote: 'మీ గోప్యత మా బాధ్యత. మీ వివరాలు సురక్షితంగా కేవలం మీ ఫోన్‌లోనే ఉంటాయి.',
    btnContinue: 'కొనసాగండి',
    btnLetsGo: 'ప్రారంభిద్దాం',
    loadingTagline: 'మీ యాత్ర మార్గదర్శిని సిద్ధం అవుతోంది...',
    blessing: 'ఓం శ్రీ వెంకటేశాయ నమః',
    skip: 'దాటవేయి'
  },
  hi: {
    selectLanguage: 'अपनी भाषा चुनें',
    selectLanguageSub: 'Choose Your Language',
    welcomeTitle: 'सारथी में आपका स्वागत है',
    welcomeSub: 'तिरुपति और तिरुमाला की आपकी दिव्य यात्रा का विश्वसनीय साथी।',
    cards: [
      { title: 'लाइव अपडेट', desc: 'वास्तविक समय दर्शन प्रतीक्षा समय और लाइव सूचनाएं।', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'दर्शन स्थल', desc: 'मंदिरों और दर्शनीय स्थलों का विस्तृत विवरण।', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'यात्रा की आवश्यकताएं', desc: 'सरकारी नियम, परिवहन और आवश्यक चेकलिस्ट।', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'हम आपको किस नाम से बुलाएं?',
    nameDesc: 'हम आपकी यात्रा के अनुसार जानकारी प्रदर्शित करेंगे।',
    namePlaceholder: 'अपना नाम दर्ज करें',
    nameExamples: 'जैसे: राहुल, प्रिया, सुमित',
    privacyNote: 'आपकी निजता हमारी प्राथमिकता है। आपकी जानकारी आपके डिवाइस पर सुरक्षित रहती है।',
    btnContinue: 'जारी रखें',
    btnLetsGo: 'शुरू करें',
    loadingTagline: 'आपकी मार्गदर्शिका तैयार की जा रही है...',
    blessing: 'ॐ श्री वेंकटेशाय नमः',
    skip: 'छोड़ें'
  },
  ta: {
    selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    selectLanguageSub: 'Choose Your Language',
    welcomeTitle: 'சாரதிக்கு நல்வரவு',
    welcomeSub: 'திருப்பதி திருமலை ஆன்மீகப் பயணத்தின் நம்பிக்கைக்குரிய துணைவன்.',
    cards: [
      { title: 'லைவ் தகவல்கள்', desc: 'நேரலை தரிசன காத்திருப்பு நேரம் மற்றும் அறிவிப்புகள்.', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'ஆன்மீக இடங்கள்', desc: 'கோயில்கள் மற்றும் புனித இடங்களின் விரிவான வழிகாட்டி.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'பயண வசதிகள்', desc: 'அதிகாரப்பூர்வ விதிகள் மற்றும் பயண சரிபார்ப்புப் பட்டியல்.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'உங்களை என்னவென்று அழைக்கலாம்?',
    nameDesc: 'உங்கள் பயணத்திற்கு ஏற்ப தகவல்களை அமைப்போம்.',
    namePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
    nameExamples: 'எ.கா: கார்த்திக், பிரியா, சுரேஷ்',
    privacyNote: 'உங்கள் தனியுரிமை பாதுகாப்பானது. தகவல்கள் உங்கள் போனில் மட்டுமே சேமிக்கப்படும்.',
    btnContinue: 'தொடரவும்',
    btnLetsGo: 'தொடங்குவோம்',
    loadingTagline: 'உங்கள் வழிகாட்டி தயாராகிறது...',
    blessing: 'ஓம் ஸ்ரீ வேங்கடேசாய நமஹ',
    skip: 'தவிர்க்க'
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'te' | 'hi' | 'ta'>('en');
  const [isMounted, setIsMounted] = useState(false);

  const [locationPerm] = useState(true);
  const [notifPerm] = useState(true);

  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem('saarthi_user_name');
    if (savedName) setName(savedName);

    const savedLanguage = localStorage.getItem('saarthi_user_language') as 'en' | 'te';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'te')) {
      setSelectedLanguage(savedLanguage);
    }
    router.prefetch('/');
  }, [router]);

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setLoadingTick(t => {
          if (t >= 4) {
            clearInterval(interval);
            finish();
            return 4;
          }
          return t + 1;
        });
      }, 140);
      return () => clearInterval(interval);
    }
  }, [step]);

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const nextStep = () => {
    if (step === 3 && !name.trim()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const finish = () => {
    const defaultName = selectedLanguage === 'te' ? 'యాత్రికులు' : 'Traveler';
    const finalName = name.trim() || defaultName;
    const isApp = window.matchMedia('(display-mode: standalone)').matches;
    localStorage.setItem(isApp ? 'hasSeenOnboarding_app' : 'hasSeenOnboarding', 'true');
    localStorage.setItem(isApp ? 'saarthi_user_name_app' : 'saarthi_user_name', finalName);
    // Also set the base keys so home page greeting works everywhere
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('saarthi_user_name', finalName);
    localStorage.setItem('saarthi_user_language', selectedLanguage);
    
    // Prevent splash screen from stalling user on next landing
    sessionStorage.setItem('splashShown', 'true');
    localStorage.setItem('saarthi_splash_seen', 'true');
    
    localStorage.setItem('saarthi_location_enabled', locationPerm ? 'true' : 'false');
    localStorage.setItem('saarthi_notif_enabled', notifPerm ? 'true' : 'false');

    const existingStateStr = localStorage.getItem('jeevapath_trip_state');
    let existingState = {};
    if (existingStateStr) {
      try { existingState = JSON.parse(existingStateStr); } catch {}
    }
    const updatedState = {
      ...existingState,
      plannerInput: {
        ...(existingState as any).plannerInput,
        interests: []
      }
    };
    localStorage.setItem('jeevapath_trip_state', JSON.stringify(updatedState));

    // Notify listeners and perform instantaneous client-side navigation (no full page reload)
    window.dispatchEvent(new Event('storage'));
    router.replace('/');
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF7' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #0F5132',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const progressPct = (step / 3) * 100;

  return (
    <div className={styles.container} style={{ background: step === 4 ? '#0A2518' : 'radial-gradient(circle at top, #FFFFFF 0%, #FAFAF7 100%)' }}>
      
      {step < 4 && (
        <div className={styles.rotatingMandala} />
      )}

      {step < 4 && (
        <header className={styles.header}>
          {step > 1 ? (
            <motion.button 
              className={styles.backButton} 
              onClick={prevStep} 
              aria-label="Back"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} style={{ color: '#0F172A' }} />
            </motion.button>
          ) : (
            <div style={{ width: 42 }} />
          )}
          {step < 3 ? (
            <motion.button 
              className={styles.skipButton} 
              onClick={() => setStep(4)}
              whileHover={{ x: 2 }}
            >
              {t.skip}
            </motion.button>
          ) : (
            <div style={{ width: 42 }} />
          )}
        </header>
      )}

      {step < 4 && (
        <div className={styles.progressContainer}>
          <motion.div 
            className={styles.progressBar}
            initial={{ width: 0 }}
            animate={{ width: progressPct + '%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      )}

      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.stepBody}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <Logo size={42} />
                </div>

                <h1 className={styles.stepTitle}>
                  <Globe size={20} style={{ color: '#0F5132' }} /> {t.selectLanguage}
                </h1>
                <p className={styles.stepSubtitle}>
                  {t.selectLanguageSub}
                </p>

                <div className={styles.languageGrid}>
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          localStorage.setItem('saarthi_user_language', lang.code);
                          if (isSelected) {
                            nextStep();
                          }
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${styles.languageCard} ${isSelected ? styles.languageCardActive : ''}`}
                      >
                        <div className={styles.languageCardContent}>
                          <div className={styles.languageAvatar}>
                            <span>{lang.badge}</span>
                          </div>
                          <div className={styles.languageTextContainer}>
                            <div className={styles.languageTitleRow}>
                              <span className={styles.languageNativeName}>{lang.nativeName}</span>
                              {lang.code !== 'en' && (
                                <span className={styles.languageEnglishLabel}>({lang.englishLabel})</span>
                              )}
                            </div>
                            <div className={styles.languageSubText}>
                              {isSelected ? (
                                lang.code === 'te' ? 'తెలుగులో కొనసాగండి →' :
                                lang.code === 'hi' ? 'हिंदी में जारी रखें →' :
                                lang.code === 'ta' ? 'தமிழில் தொடரவும் →' :
                                'Continue in English →'
                              ) : lang.subText}
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.radioIndicator} ${isSelected ? styles.radioIndicatorActive : ''}`}>
                          {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
                    />
                  ))}
                </div>

                <motion.button
                  className={styles.nextButton}
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.btnContinue} <ChevronRight size={18} />
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.stepBody} style={{ maxWidth: '1000px' }}>
                <div className={styles.showcaseGrid}>
                  {/* Visual Left Column */}
                  <div className={styles.templeVisualContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/onboarding-tirumala.jpg" 
                      alt="Tirumala Temple" 
                      className={styles.templeImage}
                    />
                  </div>

                  {/* Text & Features Right Column */}
                  <div className={styles.showcaseTextCol}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #FFFDF7 0%, #FEF3C7 100%)',
                      border: '1.5px solid #FDE68A',
                      marginBottom: '12px'
                    }}>
                      <Logo size={20} />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F5132' }}>Saarthi</span>
                    </div>

                    <h1 className={styles.stepTitle}>
                      <span className="notranslate">{t.welcomeTitle}</span>
                    </h1>
                    <p className={styles.stepSubtitle}>
                      {t.welcomeSub}
                    </p>

                    <div className={styles.featuresStack}>
                      {t.cards.map((card, idx) => {
                        const IconComp = card.icon;
                        return (
                          <div key={idx} className={styles.featureCard}>
                            <div 
                              className={styles.featureIconWrapper}
                              style={{ backgroundColor: card.bg, color: card.color }}
                            >
                              <IconComp size={20} />
                            </div>
                            <div>
                              <div className={styles.featureTitle}>{card.title}</div>
                              <div className={styles.featureDesc}>{card.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
                    />
                  ))}
                </div>

                <motion.button
                  className={styles.nextButton}
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.btnContinue} <ChevronRight size={18} />
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.stepBody}>
                <motion.div className={styles.nameCardWrapper} variants={cardVariants}>
                  <div className={styles.avatarBadge}>
                    <User size={32} style={{ color: '#C89B3C' }} />
                  </div>

                  <h1 className={styles.stepTitle}>{t.nameTitle}</h1>
                  <p className={styles.stepSubtitle}>{t.nameDesc}</p>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                      type="text"
                      className={styles.nameInput}
                      placeholder={t.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                      autoFocus
                    />
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px', textAlign: 'center', fontWeight: 600 }}>
                      {t.nameExamples}
                    </p>
                  </div>

                  <div className={styles.privacyBadge}>
                    <div style={{ color: '#0F5132', flexShrink: 0 }}><Lock size={15} /></div>
                    <span style={{ color: '#0F5132', fontSize: '11.5px', fontWeight: 600, lineHeight: 1.35 }}>
                      {t.privacyNote}
                    </span>
                  </div>
                </motion.div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
                    />
                  ))}
                </div>

                <motion.button
                  className={styles.nextButton}
                  onClick={nextStep}
                  disabled={!name.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles size={18} /> {t.btnLetsGo}
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              className={styles.slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                justifyContent: 'center',
                background: '#071C12',
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ marginBottom: '24px' }}
              >
                <Logo size={88} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  color: '#F4EFE6',
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, Georgia, serif',
                  margin: '0 0 10px 0',
                  letterSpacing: '0.01em'
                }}
              >
                {selectedLanguage === 'te' ? 'సారథి' : 'Saarthi'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  color: '#8A9A90',
                  fontSize: '14px',
                  fontWeight: 400,
                  margin: '0 0 48px 0',
                  letterSpacing: '0.01em',
                  textAlign: 'center'
                }}
              >
                {t.loadingTagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ width: '180px', height: '3px', background: 'rgba(255,255,255,0.16)', borderRadius: '3px', overflow: 'hidden' }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: ((loadingTick / 4) * 100) + '%' }}
                  transition={{ ease: 'easeInOut', duration: 0.6 }}
                  style={{ height: '100%', background: '#C89B3C', borderRadius: '3px' }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  color: '#C89B3C',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '52px 0 0 0',
                  textAlign: 'center'
                }}
              >
                {t.blessing}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ClipboardCheck, Check, 
  ChevronRight, HelpCircle, ChevronDown, ChevronUp, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, ShieldAlert, Phone, AlertTriangle, Bell, Info
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS } from '@/content/knowledge';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useLanguage } from '@/lib/useLanguage';
import { SrivariNamamVector } from '@/components/common/DevotionalSvgIcons';

const TEXTS: Record<string, Record<string, string>> = {
  en: {
    headerTitle: 'Pilgrim Essentials',
    searchTitle: 'What are you looking for?',
    searchPlaceholder: 'Search lockers, food, rooms, tonsure...',
    todaysNotice: "Today's Notice",
    readinessTitle: 'Pre-Darshan Readiness',
    hideChecklist: 'Hide Checklist',
    searchResults: 'Search Results',
    noFacilitiesFound: 'No facilities found matching',
    trySearching: 'Try searching for "Phone", "Locker", "Food", "Room", or "Hair"',
    viewDetails: 'View Details →',
    whatDoYouNeed: 'What do you need right now?',
    instantGuidance: 'Instant guidance before entering the temple',
    secureBelongingsTitle: 'Secure Belongings & Free Lockers',
    secureBelongingsSub: 'Deposit mobile phones, backpacks & shoes safely before entering queue scanners. 100% free with exit pickup.',
    findLocker: 'Find a locker →',
    freeMealsTitle: 'Free Meals',
    freeMealsSub: 'Annaprasadam Complex',
    findMeals: 'Find meal locations →',
    hairOfferingTitle: 'Hair Offering',
    hairOfferingSub: 'Kalyana Katta 24/7',
    findHair: 'Find Kalyanakatta →',
    accommodationTitle: 'Accommodation',
    accommodationSub: 'PAC Halls & Rooms',
    findRooms: 'Find rooms & PAC →',
    shoppingTitle: 'Official Shopping',
    shoppingSub: 'TTD Books & Laddus',
    viewStores: 'View stores →',
    supportEmergency: 'Support & Emergency',
    helpdeskTitle: 'TTD Helpdesk',
    helpdeskSub: 'Official 24/7 Pilgrim Enquiry',
    callHelpdesk: 'Call 155257 →',
    emergencyTitle: 'Emergency Help',
    emergencySub: 'Police & Medical Services',
    callEmergency: 'Call 108 →',
    faqTitle: 'Frequently Asked Questions'
  },
  te: {
    headerTitle: 'యాత్రా అవసరాలు',
    searchTitle: 'మీరు దేనికోసం వెతుకుతున్నారు?',
    searchPlaceholder: 'లాకర్లు, అన్నప్రసాదం, గదులు, కళ్యాణకట్ట శోధించండి...',
    todaysNotice: 'నేటి ముఖ్యాంశం',
    readinessTitle: 'దర్శన సూచిక సరిచూసుకోండి',
    hideChecklist: 'జాబితా దాచు',
    searchResults: 'శోధన ఫలితాలు',
    noFacilitiesFound: 'సరిపోలే సదుపాయాలు లభించలేదు:',
    trySearching: '"ఫోన్", "లాకర్", "ఆహారం", "గది" వంటి పదాలతో శోధించండి',
    viewDetails: 'వివరాలు చూడండి →',
    whatDoYouNeed: 'మీకు ఇప్పుడు ఏమి కావాలో ఎంచుకోండి',
    instantGuidance: 'ఆలయంలోనికి వెళ్లేముందు అత్యవసర సమాచారం',
    secureBelongingsTitle: 'వస్తువుల భద్రత & ఉచిత లాకర్లు',
    secureBelongingsSub: 'క్యూ కాంప్లెక్స్ వెళ్లేముందు ఫోన్లు, లగేజీ, చెప్పులు భద్రపరచండి. 100% ఉచిత సర్వీస్.',
    findLocker: 'లాకర్ కేంద్రాలు →',
    freeMealsTitle: 'ఉచిత అన్నప్రసాదం',
    freeMealsSub: 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాద భవనం',
    findMeals: 'అన్నప్రసాదం వివరాలు →',
    hairOfferingTitle: 'తలనీలాలు సమర్పణ',
    hairOfferingSub: 'కళ్యాణకట్ట (24/7 ఉచిత సేవ)',
    findHair: 'కళ్యాణకట్ట వివరాలు →',
    accommodationTitle: 'వసతి & గదులు',
    accommodationSub: 'పిఎసి హాల్స్ మరియు కాటేజీలు',
    findRooms: 'వసతి కేంద్రాలు →',
    shoppingTitle: 'అధికారిక షాపింగ్',
    shoppingSub: 'టిటిడి పుస్తకాలు మరియు లడ్డూ కౌంటర్లు',
    viewStores: 'అంగళ్ళు చూడండి →',
    supportEmergency: 'సహాయం & అత్యవసరం',
    helpdeskTitle: 'టిటిడి హెల్ప్‌డెస్క్',
    helpdeskSub: '24/7 భక్తుల విచారణ కేంద్రం',
    callHelpdesk: 'కాల్ చేయండి 155257 →',
    emergencyTitle: 'అత్యవసర సహాయం',
    emergencySub: 'పోలీస్ & వైద్యాధికారులు',
    callEmergency: 'కాల్ చేయండి 108 →',
    faqTitle: 'తరచూ అడిగే ప్రశ్నలు'
  },
  hi: {
    headerTitle: 'तीर्थयात्री आवश्यकताएं',
    searchTitle: 'आप क्या खोज रहे हैं?',
    searchPlaceholder: 'लॉकर, भोजन, कमरे, मुंडन खोजें...',
    todaysNotice: 'आज का नोटिस',
    readinessTitle: 'दर्शन तैयारी चेकलिस्ट',
    hideChecklist: 'सूची छिपाएं',
    searchResults: 'खोज परिणाम',
    noFacilitiesFound: 'कोई सुविधा नहीं मिली:',
    trySearching: '"फोन", "लॉकर", "भोजन", "कमरा" खोज कर देखें',
    viewDetails: 'विवरण देखें →',
    whatDoYouNeed: 'आपको अभी क्या चाहिए?',
    instantGuidance: 'मंदिर में प्रवेश करने से पहले त्वरित मार्गदर्शन',
    secureBelongingsTitle: 'सामान सुरक्षा और मुफ्त लॉकर',
    secureBelongingsSub: 'क्यू कॉम्प्लेक्स में प्रवेश से पहले फोन, बैग और जूते सुरक्षित जमा करें। 100% मुफ्त।',
    findLocker: 'लॉकर खोजें →',
    freeMealsTitle: 'मुफ्त भोजन',
    freeMealsSub: 'अन्नप्रसादम कॉम्प्लेक्स',
    findMeals: 'भोजन स्थल खोजें →',
    hairOfferingTitle: 'मुंडन सेवा',
    hairOfferingSub: 'कल्याण कट्टा 24/7',
    findHair: 'कल्याण कट्टा खोजें →',
    accommodationTitle: 'आवास और कमरे',
    accommodationSub: 'पीएसी हॉल और कमरे',
    findRooms: 'कमरे और पीएसी खोजें →',
    shoppingTitle: 'आधिकारिक खरीदारी',
    shoppingSub: 'टीटीडी पुस्तकें और लड्डू काउंटर',
    viewStores: 'दुकानें देखें →',
    supportEmergency: 'सहायता और आपातकालीन',
    helpdeskTitle: 'टीटीडी हेल्पडेस्क',
    helpdeskSub: 'आधिकारिक 24/7 पूछताछ',
    callHelpdesk: 'कॉल करें 155257 →',
    emergencyTitle: 'आपातकालीन सहायता',
    emergencySub: 'पुलिस और चिकित्सा सेवाएं',
    callEmergency: 'कॉल करें 108 →',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न'
  },
  ta: {
    headerTitle: 'பயணத் தேவைகள்',
    searchTitle: 'நீங்கள் எதைத் தேடுகிறீர்கள்?',
    searchPlaceholder: 'லாக்கர், உணவு, அறைகள், மொட்டை தேடுக...',
    todaysNotice: 'இன்றைய அறிவிப்பு',
    readinessTitle: 'தரிசன தயாரிப்பு பட்டியல்',
    hideChecklist: 'பட்டியலை மறைக்க',
    searchResults: 'தேடல் முடிவுகள்',
    noFacilitiesFound: 'பொருந்தும் வசதிகள் இல்லை:',
    trySearching: '"போன்", "லாக்கர்", "உணவு", "அறை" எனத் தேடவும்',
    viewDetails: 'விவரங்களை காண்க →',
    whatDoYouNeed: 'உங்களுக்கு இப்போது என்ன தேவை?',
    instantGuidance: 'கோவிலுக்குள் நுழைவதற்கு முன் உடனடி வழிகாட்டுதல்',
    secureBelongingsTitle: 'பொருட்கள் பாதுகாப்பு & இலவச லாக்கர்கள்',
    secureBelongingsSub: 'க்யூவில் நுழைவதற்கு முன் போன், பேக் மற்றும் காலணிகளை பாதுகாப்பாக வைக்கவும். 100% இலவசம்.',
    findLocker: 'லாக்கரை காண்க →',
    freeMealsTitle: 'இலவச உணவு',
    freeMealsSub: 'அன்னப்ரசாதம் மையம்',
    findMeals: 'உணவு இடங்கள் →',
    hairOfferingTitle: 'முடி காணிக்கை',
    hairOfferingSub: 'கல்யாண கட்டா 24/7',
    findHair: 'கல்யாண கட்டா காண்க →',
    accommodationTitle: 'தங்கும் இடம்',
    accommodationSub: 'பிஏசி ஹால் & அறைகள்',
    findRooms: 'அறைகள் காண்க →',
    shoppingTitle: 'அதிகாரப்பூர்வ ஷாப்பிங்',
    shoppingSub: 'டிடிடி புத்தகங்கள் & லட்டு',
    viewStores: 'கடைகளை காண்க →',
    supportEmergency: 'உதவி & அவசரம்',
    helpdeskTitle: 'டிடிடி உதவி மையம்',
    helpdeskSub: '24/7 பக்தர்கள் உதவி மையம்',
    callHelpdesk: 'அழைக்க 155257 →',
    emergencyTitle: 'அவசர உதவி',
    emergencySub: 'போலீஸ் & மருத்துவ சேவைகள்',
    callEmergency: 'அழைக்க 108 →',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்'
  }
};

export default function PilgrimEssentialsPage() {
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;
  const { status } = useRealtimeStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);

  const noticeText = status?.notice || 'Ghat Road traffic is normal. Luggage Locker Complexes open 24/7 at PAC-1 to PAC-5.';

  const noticeTimeStr = useMemo(() => {
    if (!status?.lastUpdated) return 'Updated 1h ago';
    const diffMins = Math.max(1, Math.round((Date.now() - new Date(status.lastUpdated).getTime()) / 60000));
    if (diffMins < 60) return `Updated ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Updated ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }, [status?.lastUpdated]);

  // Initialize client states
  useEffect(() => {
    setIsMounted(true);
    
    // Load checklist state from localStorage
    const savedState: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      const val = localStorage.getItem(item.localStorageKey);
      savedState[item.id] = val === 'true';
    });
    setChecklistState(savedState);
  }, []);

  // Update checklist item
  const handleToggleCheck = (itemId: string, storageKey: string) => {
    const newState = !checklistState[itemId];
    setChecklistState(prev => ({ ...prev, [itemId]: newState }));
    localStorage.setItem(storageKey, String(newState));
  };

  // Calculate checklist progress
  const checklistStats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = Object.values(checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, pct };
  }, [checklistState]);

  // Filter items by search query & natural language aliases
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    
    return KNOWLEDGE_ITEMS.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const aliasMatch = item.searchAliases?.some(alias => alias.includes(query) || query.includes(alias));
      return nameMatch || descMatch || aliasMatch;
    });
  }, [searchQuery]);

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS.slice(0, 4);
    const query = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter(faq => {
      const qMatch = faq.question.toLowerCase().includes(query);
      const aMatch = faq.answer.toLowerCase().includes(query);
      const aliasMatch = faq.searchAliases?.some(alias => alias.includes(query));
      return qMatch || aMatch || aliasMatch;
    });
  }, [searchQuery]);

  if (!isMounted) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #0F5132',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleCardClick = (id: string) => {
    router.push(`/essentials/${id}`);
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerTitleContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <SrivariNamamVector size={24} />
          <h1 style={{ margin: 0, fontFamily: "var(--font-sacred-serif), 'Cinzel', Georgia, serif" }}>
            {t.headerTitle}
          </h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/alerts" aria-label="Notifications" className={styles.iconButton}>
            <Bell size={18} />
          </Link>
          <button 
            className={styles.iconButton} 
            onClick={() => setShowChecklist(p => !p)} 
            aria-label="Checklist"
          >
            <ClipboardCheck size={18} color={showChecklist ? '#0F5132' : '#0F172A'} />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className={styles.scrollArea} style={{ paddingBottom: '32px', gap: '20px' }}>
        
        {/* Search Bar ("What are you looking for?") */}
        <div className={styles.searchContainer}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            {t.searchTitle}
          </div>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748B" />
            <input 
              type="text"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                aria-label="Clear search"
              >
                <X size={16} color="#64748B" />
              </button>
            )}
          </div>
        </div>

        {/* Today's Notice (Clean Amber Container) */}
        {!dismissedNotice && !searchQuery && noticeText && (
          <motion.div 
            className={styles.noticeBanner}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ flex: 1 }}>
              <div className={styles.noticeHeader}>
                <AlertTriangle size={14} color="#D97706" />
                <span>{t.todaysNotice}</span>
              </div>
              <p className={styles.noticeContent}>
                {noticeText}
              </p>
              <div className={styles.noticeTime}>{noticeTimeStr}</div>
            </div>
            <button 
              onClick={() => setDismissedNotice(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', padding: '2px' }}
              aria-label="Dismiss notice"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Stateful Darshan Checklist Drawer */}
        <AnimatePresence>
          {showChecklist && (
            <motion.section 
              className={styles.checklistCard}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.checklistHeader}>
                <h3 className={styles.checklistTitle}>
                  <ClipboardCheck size={18} color="#0F5132" />
                  {t.readinessTitle}
                </h3>
                <span className={styles.checklistProgress}>{checklistStats.checked} / {checklistStats.total} ({checklistStats.pct}%)</span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${checklistStats.pct}%` }} />
              </div>

              <div className={styles.checklistItems}>
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checklistState[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={styles.checkItem}
                      onClick={() => handleToggleCheck(item.id, item.localStorageKey)}
                    >
                      <div className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                        {isChecked && <Check size={14} color="#FFFFFF" />}
                      </div>
                      <span className={`${styles.checkItemText} ${isChecked ? styles.checkItemChecked : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className={styles.minimizeBtn} onClick={() => setShowChecklist(false)}>
                {t.hideChecklist}
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SEARCH RESULTS VIEW (IF USER IS SEARCHING) */}
        {searchResults ? (
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '17px' }}>
                {t.searchResults} ({searchResults.length})
              </h2>
            </div>
            {searchResults.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                <HelpCircle size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>{t.noFacilitiesFound} "{searchQuery}"</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>{t.trySearching}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.utilityDecisionCard}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <div className={styles.utilityDecisionTop}>
                      <h4 className={styles.utilityDecisionName}>{item.name}</h4>
                      <span className={styles.utilityDecisionBadge}>{item.status}</span>
                    </div>
                    <p className={styles.utilityDecisionLoc}>{item.shortDescription}</p>
                    <div className={styles.utilityDecisionActionRow}>
                      <span className={styles.secondaryCardAction}>
                        {t.viewDetails}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* WHAT DO YOU NEED RIGHT NOW? (1 PRIMARY FEATURED + COMPACT SECONDARY CARDS) */
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ fontSize: '18px', margin: 0 }}>
                {t.whatDoYouNeed}
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                {t.instantGuidance}
              </p>
            </div>

            {/* PRIMARY FEATURED CARD: SECURE BELONGINGS */}
            <div 
              className={styles.featuredServiceCard}
              onClick={() => handleCardClick('secure-belongings')}
            >
              <div 
                className={styles.featuredBanner}
                style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968161/IMG_6992_cq6gls.jpg')` }}
              >
                <div className={styles.featuredBadge}>
                  <span className={styles.pulseDot} />
                  <span>6 Locations Open · 24/7</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div>
                  <h3 className={styles.featuredTitle}>{t.secureBelongingsTitle}</h3>
                  <p className={styles.featuredSub}>
                    {t.secureBelongingsSub}
                  </p>
                </div>
                <button className={styles.featuredActionBtn}>
                  <Lock size={15} />
                  <span>{t.findLocker}</span>
                </button>
              </div>
            </div>

            {/* COMPACT 2x2 SECONDARY CARDS WITH IMAGES */}
            <div className={styles.secondaryCategoryGrid}>
              {/* 1. Food */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('free-meals')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968272/Annaprasadam-4-copy_lyo86v.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.freeMealsTitle}</h4>
                    <p className={styles.secondarySub}>{t.freeMealsSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findMeals}</span>
                  </div>
                </div>
              </div>

              {/* 2. Hair Offering */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('hair-offering')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968353/painted-sign-board-of-kalyanakatta-balaji-temple-tirupati-andhra-pradesh-F5M0J1_p7hkr5.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.hairOfferingTitle}</h4>
                    <p className={styles.secondarySub}>{t.hairOfferingSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findHair}</span>
                  </div>
                </div>
              </div>

              {/* 3. Accommodation */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('accommodation')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968555/maxresdefault_fwmwke.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.accommodationTitle}</h4>
                    <p className={styles.secondarySub}>{t.accommodationSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findRooms}</span>
                  </div>
                </div>
              </div>

              {/* 4. Official Shopping */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('shopping')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/assets/leisure/tirupati-market.png')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.shoppingTitle}</h4>
                    <p className={styles.secondarySub}>{t.shoppingSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.viewStores}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT & EMERGENCY SECTION (CLEAN CARDS, SUBTLE RED) */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                {t.supportEmergency}
              </h3>
              <div className={styles.supportEmergencyGrid}>
                {/* Official Shopping / Helpdesk */}
                <div 
                  className={styles.supportCard}
                  onClick={() => window.location.href = 'tel:155257'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="#0F5132" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{t.helpdeskTitle}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                    {t.helpdeskSub}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132' }}>
                    {t.callHelpdesk}
                  </span>
                </div>

                {/* Emergency Assistance */}
                <div 
                  className={styles.emergencySubtleCard}
                  onClick={() => window.location.href = 'tel:108'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} color="#DC2626" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#991B1B' }}>{t.emergencyTitle}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#991B1B', margin: 0 }}>
                    {t.emergencySub}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
                    {t.callEmergency}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS (CLEAN PROGRESSIVE DISCLOSURE) */}
        <section className={styles.faqSection} style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HelpCircle size={17} color="#475569" />
            <h2 className={styles.sectionTitle} style={{ fontSize: '16px' }}>{t.faqTitle}</h2>
          </div>
          
          <div className={styles.faqList}>
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <div 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span style={{ fontSize: '13.5px' }}>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#64748B" />}
                  </div>
                  {isExpanded && (
                    <div className={styles.faqAnswer} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

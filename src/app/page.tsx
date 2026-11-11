'use client';

import Link from 'next/link';
import { MapPin, Lock, Utensils, Scissors, Bed, ChevronRight, Sparkles, BookOpen, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Landmark, Compass, Mountain } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { useTrip } from '@/components/TripContext';
import { LoadingState } from '@/components/common/LoadingState';
import { calculateDrivingDistance, TIRUPATI_CENTER, isWithinTirupatiRegion, formatDistance } from '@/lib/location';
import { getISTDate } from '@/utils/location';
import { useLanguage } from '@/lib/useLanguage';
import {
  HomeHero,
  RecommendationCard,
  DailyContent,
  QuickChecklist,
  VaikuntaEkadasiBanner,
  KarthikaAdvisoryCard,
  FootpathTimingsCard,
  YatraChecklist,
  DesktopSidebarWidget,
  HomeSkeleton
} from '@/components/home';
import styles from './Home.module.css';

const TEXTS = {
  en: {
    loading: 'Loading your Saarthi...',
    primaryServices: 'What You Need Right Now',
    servicesSub: 'Essential pilgrim facilities',
    nearbyPlaces: 'Explore Around You',
    seeAll: 'See all →',
    navigate: 'Navigate →',
    openDrawer: 'More for your pilgrimage',
    closeDrawer: 'Close',
    lockers: 'Lockers & Luggage',
    lockersSub: 'Deposit phones & bags',
    lockersStatus: '6 Locations Open',
    meals: 'Free Annaprasadam',
    mealsSub: 'Free hot meals at Vengamamba',
    mealsStatus: 'Serving Continuously',
    tonsure: 'Kalyana Katta (Tonsure)',
    tonsureSub: 'Sacred hair offering before darshan',
    tonsureStatus: 'Open 24/7',
    stay: 'Stay & PAC Halls',
    staySub: 'Free resting & hot water halls',
    stayStatus: 'Halls Available'
  },
  te: {
    loading: 'మీ సారథి లోడ్ అవుతోంది...',
    primaryServices: 'మీకు ఇప్పుడు అవసరమైనవి',
    servicesSub: 'ముఖ్యమైన యాత్రా సదుపాయాలు',
    nearbyPlaces: 'మీ చుట్టూ ఉన్న ప్రదేశాలు',
    seeAll: 'అన్నీ చూడండి →',
    navigate: 'మార్గం →',
    openDrawer: 'మరిన్ని వివరాలు & సమాచారం',
    closeDrawer: 'మూసివేయి',
    lockers: 'లాకర్లు & లగేజీ',
    lockersSub: 'ఫోన్లు & లగేజీ డిపాజిట్',
    lockersStatus: '6 కేంద్రాలు ఓపెన్',
    meals: 'ఉచిత అన్నప్రసాదం',
    mealsSub: 'వెంగమాంబ సముదాయంలో ఉచిత భోజనం',
    mealsStatus: 'అందుబాటులో ఉంది',
    tonsure: 'కళ్యాణకట్ట (తలనీలాలు)',
    tonsureSub: 'దర్శనానికి ముందు ఉచిత తలనీలాల సమర్పణ',
    tonsureStatus: '24/7 అందుబాటులో ఉంది',
    stay: 'వసతి & PAC హాళ్ళు',
    staySub: 'ఉచిత విశ్రాంతి హాళ్ళు & వేడి నీటి స్నానాలు',
    stayStatus: 'హాళ్ళు అందుబాటులో ఉన్నాయి'
  }
};

export default function HomePage() {
  const home = useHomeData();
  const { userLocation } = useTrip();
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;
  const [showLoreDrawer, setShowLoreDrawer] = useState(false);

  const origin = userLocation || TIRUPATI_CENTER;

  const nearbyPlaces = useMemo(() => {
    if (!home.places?.allPlaces?.length) return [];
    return [...home.places.allPlaces]
      .filter(p => p.coordinates && p.placeType !== 'food')
      .map(p => ({
        ...p,
        _dist: calculateDrivingDistance(
          origin.lat, origin.lng,
          p.coordinates.lat, p.coordinates.lng,
          p.category === 'Tirumala Spot'
        )
      }))
      .sort((a, b) => a._dist - b._dist)
      .slice(0, 6);
  }, [home.places?.allPlaces, origin.lat, origin.lng]);

  if (home.loading) {
    return <HomeSkeleton />;
  }

  const PRIMARY_SERVICES = [
    {
      id: 'lockers',
      title: t.lockers,
      subtitle: t.lockersSub,
      status: t.lockersStatus,
      statusColor: '#16A34A',
      icon: Lock,
      image: '/images/places/img_2_IMG_6992_cq6gls.jpg',
      link: '/essentials/secure-belongings'
    },
    {
      id: 'meals',
      title: t.meals,
      subtitle: t.mealsSub,
      status: t.mealsStatus,
      statusColor: '#16A34A',
      icon: Utensils,
      image: '/images/places/img_3_Annaprasadam-4-copy_lyo86v.jpg',
      link: '/essentials/free-meals'
    },
    {
      id: 'tonsure',
      title: t.tonsure,
      subtitle: t.tonsureSub,
      status: t.tonsureStatus,
      statusColor: '#16A34A',
      icon: Scissors,
      image: '/images/places/img_4_painted-sign-board-of-kalyanakatta-balaji-temple-t.jpg',
      link: '/essentials/hair-offering'
    },
    {
      id: 'stay',
      title: t.stay,
      subtitle: t.staySub,
      status: t.stayStatus,
      statusColor: '#D97706',
      icon: Bed,
      image: '/images/places/img_5_maxresdefault_fwmwke.jpg',
      link: '/rooms'
    }
  ];

  return (
    <div className={styles.homeWrapper} style={{ backgroundColor: 'var(--bg-canvas, #FAF8F5)', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      
      {/* 📱 MOBILE VIEW (<768px): 3-Layer Information Architecture */}
      <div className={styles.mobileOnly}>
        <div className={styles.mobileStack}>
          
          {/* LAYER 1: HERO DECISION ENGINE & GUIDANCE */}
          <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={false} />

          {/* LAYER 2: SSD TOKEN STATUS & COLLECTION CENTRES (IMMEDIATELY AFTER CROWD DETAILS) */}
          <div style={{ marginTop: '0px', marginBottom: '4px' }}>
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
          </div>

          {/* LAYER 2.05: FOOTPATH TREK TIMINGS & RESTRICTIONS (SRIVARI METTU & ALIPIRI) */}
          <FootpathTimingsCard />

          {/* LAYER 2.1: VAIKUNTA DWARA DARSHAN & EKADASI COUNTDOWN BANNER */}
          <VaikuntaEkadasiBanner />

          {/* LAYER 2.2: KARTHIKA MASAM SEASONAL ADVISORY */}
          <KarthikaAdvisoryCard />

          {/* LAYER 2.5: YATRA ESSENTIALS COMPLIANCE CHECKLIST */}
          <YatraChecklist />

          {/* LAYER 3: PRIMARY PILGRIM SERVICES (ACT) */}
          <div style={{ padding: '0 14px', marginTop: '2px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary, #1E232D)', margin: 0, letterSpacing: '-0.015em' }}>
                  {t.primaryServices}
                </h2>
                <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary, #5A6270)', margin: '1px 0 0 0', fontWeight: 500 }}>
                  {t.servicesSub}
                </p>
              </div>
              <Link href="/essentials" prefetch={false} style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'See all'}</span>
                <ChevronRight size={13} strokeWidth={2.6} />
              </Link>
            </div>

            {/* 2x2 Action Grid with Soft Elevation & Responsive Auto-Fit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
              {PRIMARY_SERVICES.map(srv => {
                const IconComp = srv.icon;
                const isAmber = srv.id === 'stay';
                return (
                  <Link
                    key={srv.id}
                    href={srv.link}
                    prefetch={false}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    {/* Image Container with Floating Badges */}
                    <div style={{
                      height: '86px',
                      width: '100%',
                      backgroundColor: '#EAE6DF',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={srv.image}
                        alt={srv.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.40) 100%)'
                      }} />

                      {/* Top-Left Frosted Vector Icon Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '7px',
                        left: '7px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(15, 23, 42, 0.55)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)'
                      }}>
                        <IconComp size={12} color="#FFFFFF" strokeWidth={2.4} />
                      </div>

                      {/* Top-Right Floating Live Status Pill */}
                      <div style={{
                        position: 'absolute',
                        top: '7px',
                        right: '7px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2.5px 7px',
                        borderRadius: '9999px',
                        backgroundColor: isAmber ? 'rgba(180, 83, 9, 0.92)' : 'rgba(22, 101, 52, 0.92)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.30)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.20)',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                        lineHeight: 1.2
                      }}>
                        <span style={{
                          width: '4.5px',
                          height: '4.5px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 4px #FFFFFF',
                          flexShrink: 0
                        }} />
                        <span style={{ whiteSpace: 'nowrap' }}>{srv.status}</span>
                      </div>
                    </div>

                    {/* Card Content with Subtitle & Interactive Chevron */}
                    <div style={{
                      padding: '8px 10px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0,
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em'
                      }}>
                        {srv.title}
                      </h3>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                        gap: '6px'
                      }}>
                        <span style={{
                          fontSize: '10px',
                          color: '#64748B',
                          fontWeight: 500,
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1
                        }}>
                          {srv.subtitle}
                        </span>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <ChevronRight size={11} color="#0F5132" strokeWidth={2.8} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* EXPLORE TIRUPATI REGION (BENTO CATEGORY CARDS) */}
          <div className="notranslate" translate="no" style={{ padding: '0 14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 className="notranslate" translate="no" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-primary, #1E232D)', margin: 0, letterSpacing: '-0.015em' }}>
                {lang === 'te' ? 'తిరుపతి ప్రాంతాన్ని అన్వేషించండి' : 'Explore Tirupati Region'}
              </h2>
              <Link href="/explore" prefetch={false} style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Primary Bento Hero: Temples */}
              <Link
                href="/explore?category=Temples"
                prefetch={false}
                style={{
                  textDecoration: 'none',
                  height: '124px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                  border: '1px solid rgba(15, 23, 42, 0.08)'
                }}
              >
                <img
                  src="/images/places/img_11_iskcon-temple-tirupati_wl7dd2.jpg"
                  alt="Temples"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.92) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 2, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(15, 23, 42, 0.72)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    <Landmark size={13} color="#FDE047" strokeWidth={2.4} />
                    <span className="notranslate" translate="no" style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                      {lang === 'te' ? 'దేవాలయాలు' : 'Temples'}
                    </span>
                  </div>
                  <span className="notranslate" translate="no" style={{ 
                    fontSize: '10.5px', 
                    color: '#ECFDF5', 
                    fontWeight: 700, 
                    background: 'rgba(6, 78, 59, 0.85)', 
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                    padding: '3px 10px', 
                    borderRadius: '9999px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                  }}>
                    {lang === 'te' ? 'ప్రధాన క్షేత్రాలు' : 'Sacred Shrines'}
                  </span>
                </div>
              </Link>

              {/* Secondary 3-Card Row: Nature, Heritage, Viewpoints */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                {/* Nature */}
                <Link
                  href="/explore?category=Nature"
                  prefetch={false}
                  style={{
                    textDecoration: 'none',
                    height: '92px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.07)',
                    border: '1px solid rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <img
                    src="/images/places/img_38_kailasakona-waterfalls_g3yvzv.jpg"
                    alt="Nature"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.88) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(15, 23, 42, 0.70)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
                    }}>
                      <Compass size={10} color="#6EE7B7" strokeWidth={2.4} />
                      <span className="notranslate" translate="no" style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                        {lang === 'te' ? 'ప్రకృతి' : 'Nature'}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Heritage */}
                <Link
                  href="/explore?category=Heritage"
                  prefetch={false}
                  style={{
                    textDecoration: 'none',
                    height: '92px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.07)',
                    border: '1px solid rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <img
                    src="/images/places/img_17_Natural_stone_arch_in_tirumala.JPG_dmf29w.jpg"
                    alt="Heritage"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.88) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(15, 23, 42, 0.70)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
                    }}>
                      <Landmark size={10} color="#FDE68A" strokeWidth={2.4} />
                      <span className="notranslate" translate="no" style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                        {lang === 'te' ? 'వారసత్వం' : 'Heritage'}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Viewpoints */}
                <Link
                  href="/explore?category=Viewpoints"
                  prefetch={false}
                  style={{
                    textDecoration: 'none',
                    height: '92px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.07)',
                    border: '1px solid rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <img
                    src="/images/places/img_51_GOGARBHA-DAM-04_tvbyh0.jpg"
                    alt="Viewpoints"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(15, 23, 42, 0.88) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(15, 23, 42, 0.70)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
                    }}>
                      <Mountain size={10} color="#93C5FD" strokeWidth={2.4} />
                      <span className="notranslate" translate="no" style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                        {lang === 'te' ? 'దృశ్యాలు' : 'Viewpoints'}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

          </div>

          {/* LAYER 4: EXPLORE AROUND YOU (SNAP-SCROLL CAROUSEL WITH DISTINCT PHOTOS) */}
          {nearbyPlaces.length > 0 && (
            <div style={{ padding: '0 0 16px' }}>
              <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary, #1E232D)', margin: 0, letterSpacing: '-0.015em' }}>
                  {t.nearbyPlaces}
                </h2>
                <Link href="/explore" prefetch={false} style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>{lang === 'te' ? 'అన్నీ చూడండి' : 'See all'}</span>
                  <ChevronRight size={13} strokeWidth={2.6} />
                </Link>
              </div>
              <div
                className="noScrollbar"
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  padding: '0 14px 6px',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none' as any
                }}
              >
                {(() => {
                  const fallbackUniqueImages = [
                    '/images/places/img_23_srikalahasti_P2533_i9a7zu.webp',
                    '/images/places/img_25_IMG-20180106-WA0026_amybm5.jpg',
                    '/images/places/img_34_Kanipakam-Temple_bz4lzw.jpg',
                    '/images/places/img_40_appalayagunta2_ybksjq.jpg',
                    '/images/places/img_49_mallimadugu-dam-karakambadi-tirupati-tourist-attra.jpg',
                    '/images/places/img_18_tirupati-Sri-Vari-Museum_k6h8yz.jpg'
                  ];

                  return nearbyPlaces.map((p, idx) => {
                    const placeImg = p.image || p.images?.[0] || fallbackUniqueImages[idx % fallbackUniqueImages.length];

                    return (
                      <Link 
                        key={p.id} 
                        href={`/place/${p.id}`} 
                        prefetch={false}
                        style={{ 
                          textDecoration: 'none', 
                          flexShrink: 0, 
                          width: '154px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '18px',
                          overflow: 'hidden',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                          scrollSnapAlign: 'start',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* DISTINCT PHOTO BANNER */}
                        <div style={{
                          width: '100%', 
                          height: '92px', 
                          backgroundImage: `url(${placeImg})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          backgroundColor: '#E2E8F0',
                          position: 'relative'
                        }}>
                          {/* Elevated Floating Top-Right Distance Pill */}
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(6, 78, 59, 0.92)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                          }}>
                            <MapPin size={9.5} strokeWidth={2.4} />
                            <span>{p._dist} km</span>
                          </div>
                        </div>

                        {/* CARD BODY WITH CATEGORY & TIME */}
                        <div style={{ padding: '8px 10px 10px' }}>
                          <p style={{
                            fontSize: '12px', 
                            fontWeight: 700, 
                            color: '#0F172A', 
                            margin: '0 0 6px', 
                            lineHeight: 1.35,
                            minHeight: '2.7em',
                            maxHeight: '2.7em',
                            overflow: 'hidden', 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical' as const,
                            wordBreak: 'break-word'
                          }}>
                            {p.name}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                            {(() => {
                              const cat = (p.category || 'Spot').toLowerCase();
                              let bg = '#F1F5F9';
                              let color = '#475569';
                              let border = '1px solid #E2E8F0';

                              if (cat.includes('temple') || cat.includes('sacred') || cat.includes('దేవాలయ')) {
                                bg = '#FEF3C7';
                                color = '#92400E';
                                border = '1px solid #FDE68A';
                              } else if (cat.includes('water') || cat.includes('nature') || cat.includes('fall') || cat.includes('lake') || cat.includes('ప్రకృతి')) {
                                bg = '#E0F2FE';
                                color = '#0369A1';
                                border = '1px solid #BAE6FD';
                              } else if (cat.includes('heritage') || cat.includes('museum') || cat.includes('fort') || cat.includes('వారసత్వ')) {
                                bg = '#F3E8FF';
                                color = '#6B21A8';
                                border = '1px solid #E9D5FF';
                              } else if (cat.includes('city') || cat.includes('leisure') || cat.includes('park') || cat.includes('నగరం')) {
                                bg = '#ECFDF5';
                                color = '#065F46';
                                border = '1px solid #A7F3D0';
                              }

                              return (
                                <span style={{
                                  fontSize: '9.5px',
                                  fontWeight: 700,
                                  padding: '2.5px 6.5px',
                                  borderRadius: '6px',
                                  backgroundColor: bg,
                                  color: color,
                                  border: border,
                                  letterSpacing: '0.01em',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {p.category || 'Spot'}
                                </span>
                              );
                            })()}
                            <span style={{ fontSize: '10px', color: '#166534', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {p._dist ? `${Math.max(4, Math.round(Number(p._dist) * 3))} min` : 'Nearby'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* LAYER 5: DEVOTIONAL TRADITIONS & SACRED LORE (Single Consolidated Drawer) */}
          <div className="notranslate" translate="no" style={{ padding: '0 14px 6px' }}>
            <button
              onClick={() => setShowLoreDrawer(!showLoreDrawer)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(200, 155, 60, 0.3)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 6px 20px -4px rgba(200, 155, 60, 0.08), 0 2px 6px rgba(15, 23, 42, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF9C3', border: '1px solid #FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={13} color="#CA8A04" />
                </div>
                <div className="notranslate" translate="no" style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>
                    {lang === 'te' ? 'స్వామివారి విశేషాలు & ఆధ్యాత్మిక విశేషాలు' : 'Sacred Lore, Chants & Traditions'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#854D0E', fontWeight: 600 }}>
                    {lang === 'te' ? 'నేటి సుప్రభాతం, శ్లోకాలు, ప్రసాద విశేషాలు' : 'Daily Shloka, Suprabhatam & Tirumala lore'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#0F5132' }}>
                <span>{showLoreDrawer ? (lang === 'te' ? 'దాచు' : 'Hide') : (lang === 'te' ? 'చూడు' : 'View')}</span>
                {showLoreDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showLoreDrawer && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="mobile" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 💻 DESKTOP & TABLET VIEW (>=768px): Multi-Column Command Center */}
      <div className={styles.desktopOnly}>
        <div style={{ marginBottom: '20px', padding: '8px 0' }}>
          <h1 suppressHydrationWarning style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {(() => {
              const hr = getISTDate().getHours();
              if (hr >= 5 && hr < 12) return lang === 'te' ? 'శుభోదయం' : 'Good Morning';
              if (hr >= 12 && hr < 17) return lang === 'te' ? 'శుభ మధ్యాహ్నం' : 'Good Afternoon';
              if (hr >= 17 && hr < 21) return lang === 'te' ? 'శుభ సాయంత్రం' : 'Good Evening';
              return lang === 'te' ? 'శుభ రాత్రి' : 'Good Night';
            })()}, <span style={{ color: '#0F5132' }}>{home.hero.userName}</span>
          </h1>
          <p style={{ fontSize: '14.5px', color: '#0F5132', margin: 0, fontWeight: 700 }}>
            {lang === 'te' ? 'తిరుమల, తిరుపతి ప్రత్యక్ష యాత్రా సహచరి.' : 'Live pilgrimage companion for Tirumala and Tirupati.'}
          </p>
        </div>

        {/* ROW 1: 2-COLUMN DASHBOARD GRID */}
        <div className={styles.dashboardGrid}>
          {/* COLUMN 1: LIVE DECISION ENGINE & DEVOTIONAL WISDOM & EXPLORE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={true} />
            <YatraChecklist />
            <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="desktop" />

            {/* Explore Around You (Desktop Balanced Grid) */}
            {nearbyPlaces.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                    {t.nearbyPlaces}
                  </h2>
                  <Link href="/explore" style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F5132', textDecoration: 'none' }}>
                    {t.seeAll}
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                  {nearbyPlaces.slice(0, 6).map(p => (
                    <Link
                      key={p.id}
                      href={`/place/${p.id}`}
                      prefetch={false}
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0
                      }}
                    >
                      <div style={{
                        height: '70px',
                        width: '100%',
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#FFFFFF',
                          fontSize: '9.5px',
                          fontWeight: 700
                        }}>
                          <MapPin size={8} />
                          <span>{formatDistance(p._dist, lang)}</span>
                        </div>
                      </div>
                      <div style={{ padding: '6px 8px' }}>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {p.name}
                        </p>
                        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                          {p._dist ? `${Math.max(4, Math.round(Number(p._dist) * 3))} min away` : 'Nearby'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: PRIMARY SERVICES + SSD TOKEN RADAR + DESKTOP SIDEBAR DECK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Pilgrim Services */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                    {t.primaryServices}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
                    {t.servicesSub}
                  </p>
                </div>
                <Link href="/essentials" style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F5132', textDecoration: 'none' }}>
                  {t.seeAll}
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {PRIMARY_SERVICES.map(srv => {
                  const IconComp = srv.icon;
                  return (
                    <Link
                      key={srv.id}
                      href={srv.link}
                      prefetch={false}
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        border: '1px solid rgba(15, 23, 42, 0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div style={{
                        height: '76px',
                        width: '100%',
                        backgroundImage: `url(${srv.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '7px',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <IconComp size={14} color="#FFFFFF" />
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: srv.statusColor, display: 'block', marginBottom: '2px' }}>
                          ● {srv.status}
                        </span>
                        <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                          {srv.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Real-time SSD Free Token Quota, Slots & Counters Checklist */}
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />

            {/* Vaikunta Dwara Darshan & Ekadasi Countdown */}
            <VaikuntaEkadasiBanner />

            {/* Desktop Column 2 Fill: Annaprasadam, Helpline Deck & Trek Radar */}
            <DesktopSidebarWidget />
          </div>
        </div>
      </div>



      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Saarthi Guide same as Saarthi?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Saarthi Guide is the complete app. Pilgrims and travelers frequently search for it simply as Saarthi. Saarthi is your offline Tirumala companion founded by Sunil Thatra."
                }
              },
              {
                "@type": "Question",
                "name": "Who is the founder of Saarthi?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sunil Thatra is the founder of Saarthi (Saarthi Guide). He built Saarthi to help Tirupati and Tirumala pilgrims with verified offline maps, darshan wait times, and spiritual essentials."
                }
              },
              {
                "@type": "Question",
                "name": "Does Saarthi work offline in Tirumala?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Saarthi by Sunil Thatra works offline. Temple precinct maps, essentials guides, and japa mala work without internet connectivity across the Tirumala hills."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}

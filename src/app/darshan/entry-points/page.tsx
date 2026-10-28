'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Map, Navigation, MapPin, Lightbulb, HelpCircle, 
  PhoneCall, ExternalLink, Share2, Check, ChevronDown, ChevronUp,
  Landmark, Compass, X, Search, Users, Shirt, AlertCircle, CheckCircle2,
  Sparkles, ShieldCheck, Baby, Accessibility, CreditCard, Copy, Info
} from 'lucide-react';
import { 
  DARSHAN_ENTRY_POINTS, 
  GOOD_TO_KNOW_TIPS, 
  COMMON_QUESTIONS, 
  TTD_HELPLINE,
  DarshanEntryPoint
} from '@/data/darshanEntryPoints';
import { useLanguage } from '@/lib/useLanguage';
import styles from './page.module.css';

// ── Quick Gate Finder Options ──
interface QuickFinderOption {
  id: string;
  gateId: string;
  gateNum: number;
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  category: 'free' | 'paid' | 'vip' | 'special' | 'rush';
  bg: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}

const QUICK_FINDER_OPTIONS: QuickFinderOption[] = [
  {
    id: 'sed-300',
    gateId: 'sed-300-shankar-road',
    gateNum: 3,
    titleEn: '₹300 Special Entry',
    titleTe: '₹300 ప్రవేశం',
    descEn: 'Shankar Road',
    descTe: 'శంకర్ రోడ్',
    category: 'paid',
    bg: '#FEF3C7',
    color: '#B45309',
    icon: CreditCard
  },
  {
    id: 'free-sarva',
    gateId: 'vqc2-main',
    gateNum: 1,
    titleEn: 'Free Sarva Darshan',
    titleTe: 'ఉచిత సర్వదర్శనం',
    descEn: 'VQC-2 Main Gate',
    descTe: 'వీక్యూసీ-2',
    category: 'free',
    bg: '#DCFCE7',
    color: '#166534',
    icon: Users
  },
  {
    id: 'infant-nri',
    gateId: 'nri-infant-shankar-road',
    gateNum: 4,
    titleEn: 'Infant & NRI',
    titleTe: 'చంటిపిల్లలు & NRI',
    descEn: 'Supatham Steps',
    descTe: 'సుపథం మెట్లు',
    category: 'special',
    bg: '#E0F2FE',
    color: '#0369A1',
    icon: Baby
  },
  {
    id: 'senior-divyang',
    gateId: 'senior-differently-abled',
    gateNum: 9,
    titleEn: 'Seniors (65+) & Divyang',
    titleTe: 'వృద్ధులు & దివ్యాంగులు',
    descEn: 'South Mada St',
    descTe: 'దక్షిణ మాడ వీధి',
    category: 'special',
    bg: '#CCFBF1',
    color: '#0F766E',
    icon: Accessibility
  },
  {
    id: 'arjitha-seva',
    gateId: 'sd-seva-supadham',
    gateNum: 10,
    titleEn: 'Arjitha Seva',
    titleTe: 'ఆర్జిత సేవ',
    descEn: 'Supadham Gate',
    descTe: 'సుపథం ద్వారం',
    category: 'vip',
    bg: '#EDE9FE',
    color: '#6D28D9',
    icon: Sparkles
  },
  {
    id: 'srivani-trust',
    gateId: 'srivani-vqc1',
    gateNum: 8,
    titleEn: 'Srivani Trust',
    titleTe: 'శ్రీవాణి ట్రస్ట్',
    descEn: 'Near VQC-1',
    descTe: 'వీక్యూసీ-1',
    category: 'paid',
    bg: '#FEF3C7',
    color: '#D97706',
    icon: Landmark
  },
  {
    id: 'vip-protocol',
    gateId: 'vip-break-atc',
    gateNum: 5,
    titleEn: 'VIP Break Pass',
    titleTe: 'వీఐపీ బ్రేక్',
    descEn: 'ATC Circle',
    descTe: 'ఏటీసీ సర్కిల్',
    category: 'vip',
    bg: '#FEE2E2',
    color: '#B91C1C',
    icon: ShieldCheck
  },
  {
    id: 'rush-outer',
    gateId: 'gogarbham-circle-rush',
    gateNum: 12,
    titleEn: 'Peak Rush Queue',
    titleTe: 'రద్దీ లైన్లు',
    descEn: 'Gogarbham Circle',
    descTe: 'గోగర్భం సర్కిల్',
    category: 'rush',
    bg: '#FFEDD5',
    color: '#C2410C',
    icon: AlertCircle
  }
];

// ── TTD Devotee Guidelines Data ──
const DEVOTEE_GUIDELINES = [
  {
    icon: Shirt,
    titleEn: 'Dress Code Mandatory',
    titleTe: 'సాంప్రదాయ దుస్తులు',
    descEn: 'Men: Dhoti/Kurta. Women: Saree/Chudidar. Jeans and western wear disallowed.',
    descTe: 'పురుషులు: ధోవతి, కుర్తా. స్త్రీలు: చీర, చుడీదార్. జీన్స్ నిషేధం.',
    bg: '#FEF3C7',
    color: '#B45309'
  },
  {
    icon: ShieldCheck,
    titleEn: 'Original Photo ID Required',
    titleTe: 'అసలైన గుర్తింపు కార్డు',
    descEn: 'Original Aadhaar or Passport mandatory. Digital copies not accepted.',
    descTe: 'ఒరిజినల్ ఆధార్ లేదా పాస్‌పోర్ట్ తప్పనిసరి. ఫోటోకాపీలు చెల్లవు.',
    bg: '#DCFCE7',
    color: '#166534'
  },
  {
    icon: CheckCircle2,
    titleEn: 'Free Cloakrooms & Phone Deposit',
    titleTe: 'ఉచిత లాకర్లు & ఫోన్ డిపాజిట్',
    descEn: 'Phones and bags prohibited inside temple. Free deposit counters at VQC & ATC.',
    descTe: 'ఫోన్లు, బ్యాగులు ఆలయంలో నిషేధం. ఉచిత లాకర్లలో భద్రపరచండి.',
    bg: '#E0F2FE',
    color: '#0369A1'
  },
  {
    icon: HelpCircle,
    titleEn: 'Free Footwear Stands',
    titleTe: 'ఉచిత పాదరక్షల స్టాండ్లు',
    descEn: 'Leave shoes at numbered free stands outside gate before joining queue.',
    descTe: 'గేట్ బయట ఉచిత చెప్పుల స్టాండ్లలో టోకెన్ తీసుకుని భద్రపరచండి.',
    bg: '#EDE9FE',
    color: '#6D28D9'
  }
];

export default function DarshanEntryPointsPage() {
  const lang = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free' | 'paid' | 'vip' | 'special' | 'rush'>('all');
  const [expandedGates, setExpandedGates] = useState<Record<string, boolean>>({});
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [highlightedGateId, setHighlightedGateId] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCoordsId, setCopiedCoordsId] = useState<string | null>(null);

  const toggleGateExpand = (id: string) => {
    setExpandedGates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFaqExpand = (idx: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleShareGate = (gate: DarshanEntryPoint) => {
    const text = `${gate.name} (${gate.subtitle}) in Tirumala. Navigation: ${gate.navigationUrl}`;
    if (navigator.share) {
      navigator.share({
        title: gate.name,
        text,
        url: gate.navigationUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(gate.navigationUrl);
      setCopiedId(gate.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyCoords = (gate: DarshanEntryPoint) => {
    const coordsStr = `${gate.coordinates.lat}, ${gate.coordinates.lng}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoordsId(gate.id);
    setTimeout(() => setCopiedCoordsId(null), 2000);
  };

  const scrollToGate = (id: string) => {
    setHighlightedGateId(id);
    const element = document.getElementById(`gate-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // auto-expand clicked gate
      setExpandedGates(prev => ({ ...prev, [id]: true }));
    }
    setTimeout(() => {
      setHighlightedGateId(null);
    }, 2800);
  };

  // Filter & Search Logic
  const filteredGates = useMemo(() => {
    return DARSHAN_ENTRY_POINTS.filter((gate) => {
      const matchesCategory = selectedFilter === 'all' || gate.category === selectedFilter;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        gate.name.toLowerCase().includes(q) ||
        gate.subtitle.toLowerCase().includes(q) ||
        gate.landmark.toLowerCase().includes(q) ||
        gate.targetDevotees.toLowerCase().includes(q) ||
        gate.categoryLabel.toLowerCase().includes(q) ||
        `gate ${gate.order}`.includes(q)
      );
    });
  }, [selectedFilter, searchQuery]);

  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'free': return styles.badgeFree;
      case 'paid': return styles.badgePaid;
      case 'vip': return styles.badgeVip;
      case 'special': return styles.badgeSpecial;
      case 'rush': return styles.badgeRush;
      default: return styles.badgeFree;
    }
  };

  const getCategoryCardClass = (cat: string) => {
    switch (cat) {
      case 'free': return styles.gateCardFree;
      case 'paid': return styles.gateCardPaid;
      case 'vip': return styles.gateCardVip;
      case 'special': return styles.gateCardSpecial;
      case 'rush': return styles.gateCardRush;
      default: return styles.gateCardFree;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── 1. Sticky Top Navigation Bar ── */}
      <header className={styles.topNav}>
        <div className={styles.topNavInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className={styles.navActionBtn} aria-label="Go Home">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                {lang === 'te' ? 'దర్శన ప్రవేశ ద్వారాలు' : 'Darshan Entry Points'}
              </h2>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {lang === 'te' ? 'తిరుమల · 15 గేట్ల వివరాలు & దారులు' : 'Tirumala · 15 Gates & Directions'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowMapModal(true)} 
            className={styles.navMapBtn}
            aria-label="Open Interactive Map"
          >
            <Map size={15} />
            <span>{lang === 'te' ? 'మ్యాప్' : 'Map'}</span>
          </button>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.mainLayoutGrid}>
          {/* ════════════════════════════════════════════════════════
              LEFT COLUMN: OVERVIEW, SEARCH, MAP PREVIEW & CALL CENTER
              ════════════════════════════════════════════════════════ */}
          <aside className={styles.leftColumn}>
            {/* 1. Hero Card */}
            <div className={styles.heroCard}>
              <div className={styles.heroCardHeader}>
                <div className={styles.heroIconBadge}>
                  <Landmark size={24} />
                </div>
                <div>
                  <h1 className={styles.mainTitle}>
                    {lang === 'te' ? 'శ్రీవారి దర్శన ప్రవేశ ద్వారాలు' : 'Darshan entry points'}
                  </h1>
                  <p className={styles.subLocation}>
                    <MapPin size={13} />
                    <span>{lang === 'te' ? 'తిరుమల క్షేత్రం' : 'Tirumala'}</span>
                  </p>
                </div>
              </div>

              {/* Live Status Pill */}
              <div className={styles.liveStatusPill}>
                <span className={styles.liveTag}>
                  {lang === 'te' ? 'ప్రస్తుత స్థితి' : 'RIGHT NOW'}
                </span>
                <span className={styles.liveCounter}>
                  <span className={styles.liveDot} />
                  {lang === 'te' ? '15 గేట్లు అందుబాటులో' : '15 places active'}
                </span>
              </div>

              {/* Instant Search Box */}
              <div className={styles.searchBoxContainer}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={lang === 'te' ? 'గేట్ లేదా టికెట్ శోధించండి...' : 'Search gate or ticket...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={styles.clearSearchBtn}
                    aria-label="Clear Search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className={styles.filtersRow} role="tablist">
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                  className={`${styles.filterPill} ${selectedFilter === 'all' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? 'అన్నీ (15)' : 'All (15)'}
                </button>
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'free'}
                  onClick={() => setSelectedFilter('free')}
                  className={`${styles.filterPill} ${selectedFilter === 'free' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? 'ఉచితం' : 'Free'}
                </button>
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'paid'}
                  onClick={() => setSelectedFilter('paid')}
                  className={`${styles.filterPill} ${selectedFilter === 'paid' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? '₹300' : '₹300'}
                </button>
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'vip'}
                  onClick={() => setSelectedFilter('vip')}
                  className={`${styles.filterPill} ${selectedFilter === 'vip' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? 'వీఐపీ' : 'VIP'}
                </button>
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'special'}
                  onClick={() => setSelectedFilter('special')}
                  className={`${styles.filterPill} ${selectedFilter === 'special' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? 'ప్రత్యేకం' : 'Special'}
                </button>
                <button 
                  role="tab"
                  aria-selected={selectedFilter === 'rush'}
                  onClick={() => setSelectedFilter('rush')}
                  className={`${styles.filterPill} ${selectedFilter === 'rush' ? styles.filterPillActive : ''}`}
                >
                  {lang === 'te' ? 'రద్దీ' : 'Rush'}
                </button>
              </div>
            </div>

            {/* 2. Interactive Map Card Preview with Clickable Gate Pins */}
            <div className={styles.mapCard}>
              <div className={styles.mapCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={16} />
                  <span>{lang === 'te' ? 'గేట్ల నక్షా' : 'Entry gates · Tirumala Map'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Tap pin to jump
                </span>
              </div>

              <div 
                className={styles.mapVisualArea}
                onClick={() => setShowMapModal(true)}
              >
                {/* Visual Topography Background */}
                <svg width="100%" height="100%" viewBox="0 0 360 180" preserveAspectRatio="none" style={{ opacity: 0.5 }}>
                  <path d="M 0,90 Q 90,40 180,90 T 360,90" fill="none" stroke="#0F5132" strokeWidth="2.5" />
                  <path d="M 60,0 Q 140,80 200,180" fill="none" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 100,20 C 160,50 220,110 320,140" fill="none" stroke="#D97706" strokeWidth="1.5" />
                  <circle cx="180" cy="90" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                  <circle cx="180" cy="90" r="6" fill="#D97706" />
                </svg>

                {/* Key Clickable Map Pins */}
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '48%', left: '44%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('vqc2-main'); }}
                  title="Gate 1: VQC-2 Entrance"
                >
                  <span>1</span>
                </div>
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '56%', left: '54%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('sed-300-shankar-road'); }}
                  title="Gate 3: SED ₹300 Gate"
                >
                  <span>3</span>
                </div>
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '42%', left: '34%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('vqc1-main'); }}
                  title="Gate 6: VQC-1 Gate"
                >
                  <span>6</span>
                </div>
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '64%', left: '60%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('senior-differently-abled'); }}
                  title="Gate 9: South Mada Street"
                >
                  <span>9</span>
                </div>
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '28%', left: '64%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('gogarbham-circle-rush'); }}
                  title="Gate 12: Gogarbham Circle"
                >
                  <span>12</span>
                </div>
                <div 
                  className={styles.mapPinBadge} 
                  style={{ top: '22%', left: '28%' }}
                  onClick={(e) => { e.stopPropagation(); scrollToGate('silathoranam-circle-rush'); }}
                  title="Gate 14: Silathoranam Circle"
                >
                  <span>14</span>
                </div>

                <div className={styles.mapOverlayPrompt}>
                  <MapPin size={13} />
                  <span>{lang === 'te' ? 'మ్యాప్ తెరిచి చూడండి' : 'Open interactive Tirumala map'}</span>
                </div>
              </div>

              <button 
                type="button" 
                className={styles.openMapFooterBtn}
                onClick={() => setShowMapModal(true)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Map size={15} />
                  <span>{lang === 'te' ? 'మ్యాప్ తెరవండి' : 'Open the map'}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
                  <span>15</span>
                  <MapPin size={13} />
                  <span>&gt;</span>
                </span>
              </button>
            </div>

            {/* 3. TTD Call Centre Banner */}
            <a 
              href={`tel:${TTD_HELPLINE.dialNumber}`} 
              className={styles.callCenterCard}
              aria-label="Call TTD 24/7 Call Centre"
            >
              <div className={styles.callCenterLeft}>
                <div className={styles.callCenterIconBox}>
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h3 className={styles.callCenterTitle}>{TTD_HELPLINE.title}</h3>
                  <p className={styles.callCenterSubtitle}>{TTD_HELPLINE.subtitle}</p>
                </div>
              </div>

              <div className={styles.callCenterNumber}>
                <PhoneCall size={16} />
                <span>{TTD_HELPLINE.phone}</span>
              </div>
            </a>
          </aside>

          {/* ════════════════════════════════════════════════════════
              RIGHT COLUMN: QUICK FINDER, FULL TIMELINE (1 TO 15),
              DEVOTEE GUIDELINES, GOOD TO KNOW & FAQS
              ════════════════════════════════════════════════════════ */}
          <div className={styles.rightColumn}>
            {/* 1. Quick Gate Finder Widget ("Find Your Gate") */}
            <section className={styles.quickFinderSection}>
              <div className={styles.quickFinderHeader}>
                <h2 className={styles.quickFinderTitle}>
                  <Sparkles size={17} color="#D97706" />
                  <span>{lang === 'te' ? 'గేట్ వెంటనే ఎంచుకోండి' : 'Quick Gate Finder'}</span>
                </h2>
              </div>

              <div className={styles.quickFinderGrid}>
                {QUICK_FINDER_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => scrollToGate(opt.gateId)}
                      className={styles.quickFinderChip}
                    >
                      <div className={styles.quickFinderChipTop}>
                        <div 
                          className={styles.quickFinderChipIcon}
                          style={{ background: opt.bg, color: opt.color }}
                        >
                          <Icon size={15} />
                        </div>
                        <span className={styles.quickFinderGateBadge}>
                          Gate {opt.gateNum}
                        </span>
                      </div>
                      <span className={styles.quickFinderChipTitle}>
                        {lang === 'te' ? opt.titleTe : opt.titleEn}
                      </span>
                      <span className={styles.quickFinderChipDesc}>
                        {lang === 'te' ? opt.descTe : opt.descEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Result Count / Status Notice if search active */}
            {searchQuery && (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px'
              }}>
                <span>Found <strong>{filteredGates.length}</strong> gates matching "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#0F5132', fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>
            )}

            {/* 2. Timeline List of 15 Gates */}
            <section className={styles.timelineList}>
              <div className={styles.timelineTrack} />

              {filteredGates.map((gate) => {
                const isExpanded = !!expandedGates[gate.id];
                const isHighlighted = highlightedGateId === gate.id;
                const isCopied = copiedId === gate.id;
                const isCoordsCopied = copiedCoordsId === gate.id;

                return (
                  <article 
                    key={gate.id} 
                    id={`gate-${gate.id}`}
                    className={styles.timelineItem}
                  >
                    {/* Gate Order Circle */}
                    <div className={styles.gateNumberBadge}>
                      {gate.order}
                    </div>

                    {/* Gate Details Card with Category Accent */}
                    <div className={`${styles.gateCard} ${getCategoryCardClass(gate.category)} ${isHighlighted ? styles.gateCardHighlighted : ''}`}>
                      <div className={styles.gateHeader}>
                        <div className={styles.gateTitleRow}>
                          <h3 className={styles.gateTitle}>{gate.name}</h3>
                        </div>
                        <p className={styles.gateSubtitle}>{gate.subtitle}</p>

                        <div className={styles.badgeWrap}>
                          <span className={`${styles.gateCategoryBadge} ${getCategoryClass(gate.category)}`}>
                            {gate.categoryLabel}
                          </span>
                          <span className={styles.landmarkTag}>
                            <MapPin size={11} color="#64748B" />
                            <span>{gate.landmark.split(',')[0]}</span>
                          </span>
                        </div>
                      </div>

                      {/* Expandable Info Drawer with 2-Column Grid */}
                      {isExpanded && (
                        <div className={styles.extraDetails}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailCard}>
                              <div className={styles.detailCardHeader}>
                                <Users size={12} />
                                <span>{lang === 'te' ? 'ఎవరికి (Devotees)' : 'Devotees'}</span>
                              </div>
                              <span className={styles.detailCardBody}>{gate.targetDevotees}</span>
                            </div>

                            <div className={styles.detailCard}>
                              <div className={styles.detailCardHeader}>
                                <MapPin size={12} />
                                <span>{lang === 'te' ? 'దారి (Approach)' : 'Approach'}</span>
                              </div>
                              <span className={styles.detailCardBody}>{gate.landmark}</span>
                            </div>

                            <div className={`${styles.detailCard} ${styles.detailCardHighlight} ${styles.detailCardFull}`}>
                              <div className={styles.detailCardHeader} style={{ color: '#0F5132' }}>
                                <Lightbulb size={12} color="#0F5132" />
                                <span>{lang === 'te' ? 'సూచన (Tip)' : 'Insider Tip'}</span>
                              </div>
                              <span className={styles.detailCardBody} style={{ color: '#0F172A', fontWeight: 600 }}>
                                {gate.reportingTip}
                              </span>
                            </div>

                            {/* GPS Coordinates Bar */}
                            <div className={`${styles.coordsBar} ${styles.detailCardFull}`}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Navigation size={12} color="#0F5132" />
                                <span>GPS: {gate.coordinates.lat}, {gate.coordinates.lng}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCoords(gate)}
                                className={styles.copyCoordsBtn}
                                title="Copy GPS Coordinates"
                              >
                                {isCoordsCopied ? <Check size={12} color="#0F5132" /> : <Copy size={12} />}
                                <span>{isCoordsCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className={styles.gateFooter}>
                        <a
                          href={gate.navigationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.directionsBtn}
                          aria-label={`Get directions to ${gate.name}`}
                        >
                          <Navigation size={13} style={{ fill: '#FFFFFF' }} />
                          <span>{lang === 'te' ? 'దారి (మ్యాప్స్)' : 'Directions'}</span>
                          <ExternalLink size={12} style={{ opacity: 0.8 }} />
                        </a>

                        <div className={styles.secondaryActions}>
                          <button 
                            type="button"
                            onClick={() => toggleGateExpand(gate.id)}
                            className={styles.iconActionBtn}
                            title={isExpanded ? "Show less" : "View gate details & tips"}
                            aria-label={isExpanded ? "Show less" : "View gate details & tips"}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          <button 
                            type="button"
                            onClick={() => handleShareGate(gate)}
                            className={styles.iconActionBtn}
                            title="Share or copy gate link"
                            aria-label="Share or copy gate link"
                          >
                            {isCopied ? <Check size={16} color="#0F5132" /> : <Share2 size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* 3. Devotee Guidelines & Dress Code Cheat Sheet */}
            <section className={styles.guidelinesSection}>
              <div className={styles.sectionTitleRow}>
                <ShieldCheck size={20} color="#0F5132" />
                <span>{lang === 'te' ? 'తిరుమల దర్శన నిబంధనలు & మార్గదర్శకాలు' : 'TTD Devotee Guidelines & Essential Rules'}</span>
              </div>

              <div className={styles.guidelinesGrid}>
                {DEVOTEE_GUIDELINES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={styles.guidelineCard}>
                      <div 
                        className={styles.guidelineIconBox}
                        style={{ background: item.bg, color: item.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className={styles.guidelineContent}>
                        <h4 className={styles.guidelineTitle}>
                          {lang === 'te' ? item.titleTe : item.titleEn}
                        </h4>
                        <p className={styles.guidelineDesc}>
                          {lang === 'te' ? item.descTe : item.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. Good To Know Section */}
            <section className={styles.goodToKnowSection}>
              <div className={styles.sectionTitleRow}>
                <Lightbulb size={20} color="#D97706" />
                <span>{lang === 'te' ? 'తెలుసుకోవలసిన ముఖ్య విషయాలు' : 'Good to know'}</span>
              </div>

              <div className={styles.tipsGrid}>
                {GOOD_TO_KNOW_TIPS.map((tip) => (
                  <div key={tip.step} className={styles.tipCard}>
                    <div className={styles.tipNumber}>{tip.step}</div>
                    <div className={styles.tipContent}>
                      <strong style={{ color: '#0F172A', display: 'block', marginBottom: '3px', fontSize: '13.5px' }}>
                        {tip.title}
                      </strong>
                      <span>{tip.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Common Questions FAQ Section */}
            <section className={styles.faqSection}>
              <div className={styles.sectionTitleRow}>
                <HelpCircle size={20} color="#0F5132" />
                <span>{lang === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Common questions'}</span>
              </div>

              <div>
                {COMMON_QUESTIONS.map((faq, idx) => {
                  const isOpen = !!expandedFaqs[idx];
                  return (
                    <div key={idx} className={styles.faqItem}>
                      <div 
                        className={styles.faqQuestion}
                        onClick={() => toggleFaqExpand(idx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFaqExpand(idx); }}
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#64748B" />}
                      </div>
                      {isOpen && (
                        <p className={styles.faqAnswer}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── 10. Mobile Sticky Floating Quick Dock ── */}
      <div className={styles.mobileFloatingBar}>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`${styles.mobileBarBtn} ${styles.mobileBarBtnSecondary}`}
        >
          <Sparkles size={15} color="#D97706" />
          <span>{lang === 'te' ? 'గేట్ ఎంచుకోండి' : 'Find My Gate'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowMapModal(true)}
          className={`${styles.mobileBarBtn} ${styles.mobileBarBtnPrimary}`}
        >
          <Map size={15} />
          <span>{lang === 'te' ? 'తిరుమల మ్యాప్' : 'Tirumala Map'}</span>
        </button>
      </div>

      {/* ── Interactive Map Modal ── */}
      {showMapModal && (
        <div className={styles.modalOverlay} onClick={() => setShowMapModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {lang === 'te' ? 'తిరుమల దర్శన గేట్ల నక్షా' : 'Tirumala Darshan Gates Map'}
              </h3>
              <button 
                onClick={() => setShowMapModal(false)}
                className={styles.modalCloseBtn}
                aria-label="Close Map"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Google Maps Embed centered on Tirumala Temple Complex & Gates */}
              <iframe
                title="Tirumala Darshan Entry Points Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://maps.google.com/maps?q=13.6825652,79.3444292&hl=en&z=16&output=embed"
              />
            </div>

            <div className={styles.modalFooter}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                {lang === 'te' ? 'తిరుమల పరిసరాల్లోని 15 గేట్లు' : 'All 15 gates located across Tirumala'}
              </span>
              <a
                href="https://www.google.com/maps/search/Tirumala+Vaikuntam+Queue+Complex/@13.6825652,79.3444292,16z"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                <ExternalLink size={14} />
                <span>Google Maps App</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

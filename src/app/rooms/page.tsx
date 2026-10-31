'use client';

import React, { useState, useMemo, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Search, X, List, Map, Navigation, 
  Phone, Clock, Bed, Ticket, Key, Building2, 
  ChevronDown, ChevronUp, Headset, MapPin, 
  ShieldCheck, Users, FileText, CreditCard, Compass, Info
} from 'lucide-react';
import { 
  TIRUMALA_STAYS, 
  AccommodationCategory,
  TirumalaStayLocation 
} from '@/data/tirumalaAccommodation';
import { useLanguage } from '@/lib/useLanguage';
import styles from './page.module.css';

// Dynamically load the Leaflet map on client-side only
const TirumalaAccommodationMap = dynamic(
  () => import('@/components/accommodation/TirumalaAccommodationMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '400px',
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B',
        fontSize: '13px',
        fontWeight: 600
      }}>
        Loading Tirumala Accommodation Map...
      </div>
    )
  }
);

function RoomsContent() {
  const lang = useLanguage();
  const searchParams = useSearchParams();
  const catParam = searchParams ? (searchParams.get('category') as AccommodationCategory | null) : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory | 'all'>(
    catParam && ['free_pac', 'allotment_counter', 'sub_enquiry', 'rest_house_mutt'].includes(catParam)
      ? catParam
      : 'all'
  );
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const directoryRef = useRef<HTMLDivElement>(null);

  const toggleDetails = (id: string) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToCategory = (category: AccommodationCategory) => {
    setSelectedCategory(category);
    if (directoryRef.current) {
      directoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter locations by search query and category
  const filteredLocations = useMemo(() => {
    return TIRUMALA_STAYS.filter(loc => {
      if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();

      const nameMatch = loc.name.toLowerCase().includes(query) || (loc.nameTe && loc.nameTe.toLowerCase().includes(query));
      const areaMatch = loc.area.toLowerCase().includes(query);
      const landmarkMatch = loc.landmark.toLowerCase().includes(query);
      const descMatch = loc.description.toLowerCase().includes(query);
      const aliasMatch = loc.searchAliases.some(alias => alias.toLowerCase().includes(query));

      return nameMatch || areaMatch || landmarkMatch || descMatch || aliasMatch;
    });
  }, [searchQuery, selectedCategory]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    return {
      all: TIRUMALA_STAYS.length,
      free_pac: TIRUMALA_STAYS.filter(l => l.category === 'free_pac').length,
      allotment_counter: TIRUMALA_STAYS.filter(l => l.category === 'allotment_counter').length,
      sub_enquiry: TIRUMALA_STAYS.filter(l => l.category === 'sub_enquiry').length,
      rest_house_mutt: TIRUMALA_STAYS.filter(l => l.category === 'rest_house_mutt').length
    };
  }, []);

  const getCategoryIcon = (category: AccommodationCategory) => {
    switch (category) {
      case 'free_pac': return <Bed size={18} />;
      case 'allotment_counter': return <Ticket size={18} />;
      case 'sub_enquiry': return <Key size={18} />;
      case 'rest_house_mutt': return <Building2 size={18} />;
    }
  };

  const getIconSquareClass = (category: AccommodationCategory) => {
    switch (category) {
      case 'free_pac': return styles.iconSquareFreePac;
      case 'allotment_counter': return styles.iconSquareAllotment;
      case 'sub_enquiry': return styles.iconSquareSubEnquiry;
      case 'rest_house_mutt': return styles.iconSquareRestHouse;
    }
  };

  // Visual chips with small icons and short labels instead of paragraphs
  const getFacilityChips = (category: AccommodationCategory) => {
    switch (category) {
      case 'free_pac':
        return [
          { icon: <Bed size={11} />, label: lang === 'te' ? 'ఉచిత హాల్' : 'Free Hall', className: styles.chipItemEmerald },
          { icon: <ShieldCheck size={11} />, label: lang === 'te' ? 'లాకర్లు' : 'Lockers', className: styles.chipItemEmerald },
          { icon: <Users size={11} />, label: lang === 'te' ? 'వాక్-ఇన్' : 'Walk-in', className: styles.chipItemEmerald }
        ];
      case 'allotment_counter':
        return [
          { icon: <Ticket size={11} />, label: lang === 'te' ? 'కేటాయింపు' : 'Allotment Counter', className: styles.chipItemAmber },
          { icon: <Building2 size={11} />, label: lang === 'te' ? 'సిఆర్ఓ' : 'CRO Office', className: styles.chipItemAmber },
          { icon: <FileText size={11} />, label: lang === 'te' ? 'నమోదు' : 'Registration', className: styles.chipItemAmber }
        ];
      case 'sub_enquiry':
        return [
          { icon: <Key size={11} />, label: lang === 'te' ? 'కీ కౌంటర్' : 'Key Disbursement', className: styles.chipItemPurple },
          { icon: <CreditCard size={11} />, label: lang === 'te' ? 'రుసుము డెస్క్' : 'Tariff Desk', className: styles.chipItemPurple },
          { icon: <Compass size={11} />, label: lang === 'te' ? 'సబ్-ఎంక్వైరీ' : 'Sub-Enquiry', className: styles.chipItemPurple }
        ];
      case 'rest_house_mutt':
        return [
          { icon: <Building2 size={11} />, label: lang === 'te' ? 'విశ్రాంతి భవనం' : 'Rest House', className: styles.chipItemBlue },
          { icon: <Users size={11} />, label: lang === 'te' ? 'భక్తుల బస' : 'Devotee Stay', className: styles.chipItemBlue }
        ];
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* 1. Header */}
        <header className={styles.headerRow}>
          <Link href="/essentials" className={styles.backBtn} aria-label="Go Back to Essentials">
            <ArrowLeft size={19} />
          </Link>
          <div className={styles.iconBadge}>
            <Bed size={22} />
          </div>
          <div className={styles.headerTitleGroup}>
            <h1 className={styles.pageTitle}>
              {lang === 'te' ? 'తిరుమల వసతి & హాళ్లు' : 'Tirumala Accommodation'}
            </h1>
          </div>
          <span className={styles.headerCountBadge}>
            {TIRUMALA_STAYS.length} Stays
          </span>
        </header>

        {/* 2. TWO VISUAL ENTRY POINTS */}
        <section className={styles.entryGrid} aria-label="Primary Entry Points">
          {/* Entry Point 1: Free TTD Stay */}
          <div 
            className={`${styles.entryCard} ${styles.entryCardFree}`}
            onClick={() => scrollToCategory('free_pac')}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className={styles.entryHeader}>
                <div className={styles.entryIconWrapFree}>
                  <Bed size={18} />
                </div>
                <h2 className={styles.entryTitle}>
                  {lang === 'te' ? 'ఉచిత టిటిడి బస' : 'Free TTD Stay'}
                </h2>
              </div>
              <p className={styles.entrySub}>
                {lang === 'te' ? 'పిఎసి హాళ్లు మరియు ఉచిత విశ్రాంతి సదుపాయాలు' : 'PAC halls and free resting facilities'}
              </p>
            </div>
            <button 
              type="button" 
              className={styles.entryActionBtnFree}
              onClick={(e) => {
                e.stopPropagation();
                scrollToCategory('free_pac');
              }}
            >
              <span>{lang === 'te' ? 'పిఎసిలు చూడండి' : 'Explore PACs'}</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Entry Point 2: Room Allotment */}
          <div 
            className={`${styles.entryCard} ${styles.entryCardAllotment}`}
            onClick={() => scrollToCategory('allotment_counter')}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className={styles.entryHeader}>
                <div className={styles.entryIconWrapAllotment}>
                  <Ticket size={18} />
                </div>
                <h2 className={styles.entryTitle}>
                  {lang === 'te' ? 'గదుల కేటాయింపు' : 'Room Allotment'}
                </h2>
              </div>
              <p className={styles.entrySub}>
                {lang === 'te' ? 'సిఆర్ఓ మరియు వసతి విచారణ కౌంటర్లు' : 'CRO and accommodation enquiry counters'}
              </p>
            </div>
            <button 
              type="button" 
              className={styles.entryActionBtnAllotment}
              onClick={(e) => {
                e.stopPropagation();
                scrollToCategory('allotment_counter');
              }}
            >
              <span>{lang === 'te' ? 'కౌంటర్లు చూడండి' : 'Find counters'}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </section>

        {/* 3. Search Bar */}
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'te' ? 'హాల్ లేదా కాటేజీ పేరు శోధించండి (ఉదా: PAC-2, CRO, నందకం)...' : 'Search accommodation or hall (e.g. PAC-2, CRO, Nandakam)...'}
            aria-label="Search Tirumala accommodation"
          />
          {searchQuery && (
            <button 
              type="button" 
              className={styles.clearSearchBtn} 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 4. Category Filter Pills */}
        <nav className={styles.filterPillsRow} aria-label="Accommodation Categories">
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'all' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span>All ({categoryCounts.all})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'free_pac' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedCategory('free_pac')}
          >
            <span className={styles.dotGreen} />
            <span>Free PACs ({categoryCounts.free_pac})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'allotment_counter' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedCategory('allotment_counter')}
          >
            <span className={styles.dotAmber} />
            <span>Allotment ({categoryCounts.allotment_counter})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'sub_enquiry' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedCategory('sub_enquiry')}
          >
            <span className={styles.dotPurple} />
            <span>Sub-Enquiry ({categoryCounts.sub_enquiry})</span>
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedCategory === 'rest_house_mutt' ? styles.filterPillActive : ''}`}
            onClick={() => setSelectedCategory('rest_house_mutt')}
          >
            <span className={styles.dotBlue} />
            <span>Rest Houses ({categoryCounts.rest_house_mutt})</span>
          </button>
        </nav>

        {/* 5. Directory Section Anchor with Segmented Switch */}
        <div ref={directoryRef} style={{ scrollMarginTop: '16px' }}>
          <div className={styles.viewToggleRow}>
            <div className={styles.toggleGroup}>
              <button 
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List View"
              >
                <List size={15} />
                <span>List</span>
              </button>
              <button 
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('map')}
                aria-label="Map View"
              >
                <Map size={15} />
                <span>Map</span>
              </button>
            </div>
            <span className={styles.resultsCount}>
              Showing {filteredLocations.length} locations
            </span>
          </div>

          {/* 6. INTERACTIVE MAP VIEW */}
          {viewMode === 'map' && (
            <section className={styles.mapContainerWrapper} aria-label="Interactive Map View">
              {/* Category Legend distinguishing pins */}
              <div className={styles.mapLegendRow}>
                <div className={styles.legendItem}>
                  <span className={styles.dotGreen} />
                  <span>Free PACs (H)</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.dotAmber} />
                  <span>Allotment (C)</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.dotPurple} />
                  <span>Sub-Enquiry (E)</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.dotBlue} />
                  <span>Rest Houses (R)</span>
                </div>
              </div>

              <TirumalaAccommodationMap
                locations={filteredLocations}
                activeLocationId={activeLocationId}
                onSelectLocation={(loc: TirumalaStayLocation) => {
                  setActiveLocationId(loc.id);
                }}
              />

              <div className={styles.mapList}>
                {filteredLocations.map((loc) => {
                  const isSelected = activeLocationId === loc.id;
                  return (
                    <div
                      key={`map-${loc.id}`}
                      className={styles.mapItemRow}
                      style={{
                        borderColor: isSelected ? '#0F5132' : undefined,
                        backgroundColor: isSelected ? '#F0FDF4' : undefined,
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveLocationId(loc.id)}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A' }}>
                          {loc.name}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {loc.landmark}
                        </span>
                      </div>
                      <a
                        href={loc.navigationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          color: '#0F5132', 
                          fontSize: '12px', 
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <span>Directions</span>
                        <Navigation size={13} style={{ transform: 'rotate(45deg)' }} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 7. VISUAL FACILITY CARDS (LIST VIEW) */}
          {viewMode === 'list' && (
            <section className={styles.cardsList} aria-label="Tirumala Stays Directory">
              {filteredLocations.length === 0 ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '32px 16px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}>
                  <Bed size={28} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                    No stays found matching &ldquo;{searchQuery}&rdquo;
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Try searching for &ldquo;PAC-2&rdquo;, &ldquo;CRO&rdquo;, &ldquo;Nandakam&rdquo;, or &ldquo;ATC&rdquo;.
                  </p>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isExpanded = !!expandedCardIds[loc.id];
                  const chips = getFacilityChips(loc.category);
                  return (
                    <article key={loc.id} className={styles.cardItem}>
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.cardLeft}>
                          <div className={`${styles.cardIconSquare} ${getIconSquareClass(loc.category)}`}>
                            {getCategoryIcon(loc.category)}
                          </div>
                          <div className={styles.cardTitleBlock}>
                            <h3 className={styles.cardTitle}>
                              {loc.name}
                              {loc.nameTe && (
                                <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B', marginLeft: '6px' }}>
                                  ({loc.nameTe})
                                </span>
                              )}
                            </h3>
                            <div className={styles.cardLandmark}>
                              <MapPin size={11} color="#64748B" />
                              <span>{loc.landmark}</span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          {loc.phone && (
                            <a 
                              href={`tel:${loc.phone}`} 
                              className={styles.callButton}
                              title={`Call ${loc.name}`}
                              aria-label={`Call ${loc.name}`}
                            >
                              <Phone size={14} />
                            </a>
                          )}
                          <a 
                            href={loc.navigationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.navButton}
                            title={`Directions to ${loc.name}`}
                            aria-label={`Get directions to ${loc.name}`}
                          >
                            <Navigation size={16} style={{ transform: 'rotate(45deg)' }} />
                          </a>
                        </div>
                      </div>

                      {/* Small Icons & Short Labels (No Paragraphs) */}
                      <div className={styles.cardChipRow}>
                        {chips.map((chip, idx) => (
                          <span key={idx} className={`${styles.chipItem} ${chip.className}`}>
                            {chip.icon}
                            <span>{chip.label}</span>
                          </span>
                        ))}
                        <span className={styles.chipItem}>
                          <Clock size={11} />
                          <span>{loc.operatingHours}*</span>
                        </span>
                      </div>

                      {/* Optional Expandable Overview */}
                      <button 
                        type="button"
                        className={styles.expandButton}
                        onClick={() => toggleDetails(loc.id)}
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? (lang === 'te' ? 'వివరాలు దాచు' : 'Hide details') : (lang === 'te' ? 'వివరాలు చూడండి' : 'View details')}</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>

                      {isExpanded && (
                        <div className={styles.expandedDrawer}>
                          <div className={styles.detailsGrid}>
                            <div className={`${styles.detailCard} ${styles.detailCardFull}`}>
                              <div className={styles.detailCardHeader}>
                                <Info size={11} color="#059669" />
                                <span>{lang === 'te' ? 'సదుపాయం వివరాలు' : 'Facility Overview'}</span>
                              </div>
                              <span className={styles.detailCardBody}>
                                {lang === 'te' && loc.shortDescTe ? loc.shortDescTe : (loc.shortDesc || loc.description)}
                              </span>
                            </div>

                            <div className={styles.detailCard}>
                              <div className={styles.detailCardHeader}>
                                <Compass size={11} color="#64748B" />
                                <span>{lang === 'te' ? 'ప్రాంతం' : 'Area & Zone'}</span>
                              </div>
                              <span className={styles.detailCardBody}>{loc.area}</span>
                            </div>

                            <div className={styles.detailCard}>
                              <div className={styles.detailCardHeader}>
                                <Ticket size={11} color="#64748B" />
                                <span>{lang === 'te' ? 'కేటాయింపు విధానం' : 'Booking Mode'}</span>
                              </div>
                              <span className={styles.detailCardBody}>{loc.bookingType}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          )}
        </div>

        {/* 8. CRO PROCESS TIMELINE (3 Simple Verified Steps) */}
        <section className={styles.timelineSection} aria-label="CRO Room Allotment Workflow">
          <div className={styles.timelineHeader}>
            <Ticket size={18} color="#D97706" />
            <h3 className={styles.timelineTitle}>
              {lang === 'te' ? 'ఆఫ్‌లైన్ గదుల కేటాయింపు విధానం' : 'Offline Room Allotment in 3 Simple Steps'}
            </h3>
          </div>
          <div className={styles.timelineSteps}>
            <div className={styles.timelineStep}>
              <span className={styles.timelineStepNum}>1</span>
              <div className={styles.timelineStepContent}>
                <div className={styles.timelineStepTitle}>
                  <Building2 size={13} color="#059669" />
                  <span>{lang === 'te' ? '1. సిఆర్ఓ కౌంటర్ వద్ద నమోదు' : '1. CRO Counter Registration'}</span>
                </div>
                <p className={styles.timelineStepDesc}>
                  {lang === 'te'
                    ? 'ప్రధాన బస్టాండ్ ఎదురుగా ఉన్న సెంట్రల్ రిసెప్షన్ ఆఫీస్ (CRO) వద్ద నమోదు చేసుకోండి.'
                    : 'Register in person at the Central Reception Office (opposite Tirumala bus stand).'}
                </p>
              </div>
            </div>
            <div className={styles.timelineConnector} />
            <div className={styles.timelineStep}>
              <span className={styles.timelineStepNum}>2</span>
              <div className={styles.timelineStepContent}>
                <div className={styles.timelineStepTitle}>
                  <Ticket size={13} color="#D97706" />
                  <span>{lang === 'te' ? '2. కేటాయింపు రశీదు' : '2. Allotment Confirmation'}</span>
                </div>
                <p className={styles.timelineStepDesc}>
                  {lang === 'te'
                    ? 'మీకు కేటాయించిన కాటేజీ సబ్-ఎంక్వైరీ ప్రాంతం వివరాలతో రశీదు పొందండి.'
                    : 'Receive allotment receipt detailing your assigned cottage sub-enquiry zone.'}
                </p>
              </div>
            </div>
            <div className={styles.timelineConnector} />
            <div className={styles.timelineStep}>
              <span className={styles.timelineStepNum}>3</span>
              <div className={styles.timelineStepContent}>
                <div className={styles.timelineStepTitle}>
                  <Key size={13} color="#7C3AED" />
                  <span>{lang === 'te' ? '3. సబ్-ఎంక్వైరీ వద్ద తాళాలు' : '3. Sub-Enquiry Key Pickup'}</span>
                </div>
                <p className={styles.timelineStepDesc}>
                  {lang === 'te'
                    ? 'కేటాయించిన సబ్-ఎంక్వైరీ ఆఫీస్ (ATC, SNC, TBC etc.) కు వెళ్లి రుసుము చెల్లించి తాళాలు తీసుకోండి.'
                    : 'Proceed to your designated Sub-Enquiry Office (e.g. ATC, SNC, TBC) to pay tariff and collect keys.'}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.timelineFootnote}>
            *Operating hours, allotments, and room tariffs are subject to official TTD updates.
          </div>
        </section>

        {/* 9. TTD Helpline Card */}
        <section className={styles.helplineCard} aria-label="TTD Call Center Helpline">
          <div className={styles.helplineLeft}>
            <div className={styles.helplineIconWrap}>
              <Headset size={20} />
            </div>
            <div>
              <h3 className={styles.helplineTitle}>TTD Call Center</h3>
              <p className={styles.helplineSub}>Official 24/7 Pilgrim Enquiries</p>
            </div>
          </div>
          <a href="tel:155257" className={styles.helplineBtn} aria-label="Call TTD Call Center at 155257">
            <Phone size={13} />
            <span>Call 155257</span>
          </a>
        </section>

      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ color: '#047857', fontWeight: 600 }}>Loading Tirumala Accommodation...</div>
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}

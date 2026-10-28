'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  ArrowLeft, BriefcaseMedical, DoorClosed, Lock, List, Map, 
  Navigation, Headset, Phone
} from 'lucide-react';
import { 
  MEDICAL_LOCATIONS_DATA, 
  MEDICAL_EMERGENCY,
  MEDICAL_HELPLINE, 
  MEDICAL_DISCLAIMER,
  MedicalLocation
} from '@/data/medicalLocations';
import styles from './page.module.css';

const MedicalInteractiveMap = dynamic(
  () => import('@/components/medical/MedicalInteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '420px',
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B',
        fontSize: '13px'
      }}>
        Loading Tirumala Medical Map...
      </div>
    )
  }
);

export default function MedicalDirectoryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Top Header */}
        <header className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <Link href="/essentials" className={styles.backBtn} aria-label="Go Back">
              <ArrowLeft size={20} />
            </Link>
            <div className={styles.medicalIconBadge}>
              <BriefcaseMedical size={22} />
            </div>
            <h1 className={styles.pageTitle}>Medical</h1>
          </div>
          <a 
            href={`tel:${MEDICAL_EMERGENCY.phone}`} 
            className={styles.emergencyPill}
            title="Emergency Ambulance 108"
          >
            <Phone size={14} />
            <span>{MEDICAL_EMERGENCY.phone}</span>
          </a>
        </header>

        {/* Quick Navigation Chips */}
        <nav className={styles.quickChipsRow} aria-label="Quick Facilities">
          <Link href="/darshan/entry-points" className={styles.quickChip}>
            <DoorClosed size={16} color="#0F5132" />
            <span>Darshan entry points</span>
          </Link>
          <Link href="/essentials/secure-belongings" className={styles.quickChip}>
            <Lock size={15} color="#B45309" />
            <span>Luggage & phone deposit</span>
          </Link>
        </nav>

        {/* View Switcher Toggle */}
        <div className={styles.viewToggleRow}>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleBtnActive : styles.toggleBtnInactive}`}
            onClick={() => setViewMode('list')}
            aria-label="List View"
          >
            <List size={16} />
            <span>List</span>
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.toggleBtnActive : styles.toggleBtnInactive}`}
            onClick={() => setViewMode('map')}
            aria-label="Map View"
          >
            <Map size={16} />
            <span>Map</span>
          </button>
        </div>

        {/* Main Content: List Mode */}
        {viewMode === 'list' && (
          <section className={styles.cardsList} aria-label="Medical Facilities">
            {MEDICAL_LOCATIONS_DATA.map((loc) => (
              <article key={loc.id} className={styles.cardItem}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardIconSquare}>
                    <BriefcaseMedical size={20} />
                  </div>
                  <div className={styles.cardInfo}>
                    <h2 className={styles.cardTitle}>{loc.name}</h2>
                    <p className={styles.cardSubtitle}>{loc.subtitle}</p>
                  </div>
                </div>
                <a 
                  href={loc.navigationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.navButton}
                  title={`Directions to ${loc.name}`}
                  aria-label={`Get directions to ${loc.name}`}
                >
                  <Navigation size={17} style={{ transform: 'rotate(45deg)' }} />
                </a>
              </article>
            ))}
          </section>
        )}

        {/* Main Content: Map Mode */}
        {viewMode === 'map' && (
          <section className={styles.mapContainerWrapper} aria-label="Interactive Map View">
            <div className={styles.mapHeader}>
              <h2 className={styles.mapTitle}>Tirumala Hilltop Medical Facilities ({MEDICAL_LOCATIONS_DATA.length} Centres)</h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Tap any pin or centre for directions</span>
            </div>

            {/* Interactive Leaflet Map */}
            <div style={{ marginBottom: '16px' }}>
              <MedicalInteractiveMap 
                locations={MEDICAL_LOCATIONS_DATA}
                activeLocationId={activeLocationId}
                onSelectLocation={(loc: MedicalLocation) => setActiveLocationId(loc.id)}
              />
            </div>

            {/* Medical Facility Selector & Directions List */}
            <div className={styles.mapList}>
              {MEDICAL_LOCATIONS_DATA.map((loc) => {
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
                      <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A' }}>{loc.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{loc.landmark}</span>
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

        {/* TTD Call Centre Footer Card */}
        <a 
          href={`tel:${MEDICAL_HELPLINE.phone}`}
          className={styles.helplineCard}
          title="Call TTD Call Centre"
        >
          <div className={styles.helplineLeft}>
            <div className={styles.headsetIconWrapper}>
              <Headset size={20} />
            </div>
            <div>
              <h3 className={styles.helplineTitle}>{MEDICAL_HELPLINE.title}</h3>
              <p className={styles.helplineSub}>{MEDICAL_HELPLINE.subtitle}</p>
            </div>
          </div>
          <div className={styles.helplineNumber}>
            <Phone size={15} />
            <span>{MEDICAL_HELPLINE.phoneFormatted}</span>
          </div>
        </a>

        {/* Disclaimer Notice */}
        <p className={styles.disclaimerText}>
          {MEDICAL_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, Navigation, Info, Check, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, HelpCircle, FileText,
  Share2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Briefcase, Smartphone, Footprints, Droplets, Bus, Sparkles, Luggage,
  Coffee, Sun
} from 'lucide-react';
import styles from '../Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS } from '@/content/knowledge';
import { useTrip } from '@/components/TripContext';
import { useLanguage } from '@/lib/useLanguage';
import { calculateDrivingDistance, TIRUPATI_CENTER, isCoordinateOnTirumalaHill, isWithinTirupatiRegion } from '@/utils/location';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  lock: Lock,
  utensils: Utensils,
  scissors: Scissors,
  bed: Bed,
  'shopping-bag': ShoppingBag,
  'shield-alert': ShieldAlert,
  briefcase: Briefcase,
  smartphone: Smartphone,
  footprints: Footprints,
  droplets: Droplets,
  bus: Bus,
  'file-text': FileText,
  clock: Clock,
  'map-pin': MapPin,
  info: Info,
  'alert-triangle': AlertTriangle,
  coffee: Coffee,
  sun: Sun,
  sparkles: Sparkles
};

export default function EssentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const lang = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showProhibited, setShowProhibited] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);

  // Dynamic time calculation in Indian Standard Time (UTC+5:30)
  const currentHourIST = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    return istTime.getHours() + (istTime.getMinutes() / 60);
  }, []);

  // Dynamic default active decision based on essential id and current time
  const initialDecisionId = useMemo(() => {
    if (id === 'secure-belongings') return 'phone';
    if (id === 'free-meals') {
      if (currentHourIST >= 9 && currentHourIST < 10.5) return 'tiffin';
      if (currentHourIST >= 10.5 && currentHourIST < 16) return 'lunch';
      if (currentHourIST >= 16 && currentHourIST < 17) return 'break';
      if (currentHourIST >= 17 && currentHourIST < 22.5) return 'dinner';
      return 'lunch';
    }
    if (id === 'hair-offering') return 'main';
    if (id === 'accommodation') return 'pac';
    return 'default';
  }, [id, currentHourIST]);

  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(initialDecisionId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { userLocation } = useTrip();
  const item = KNOWLEDGE_ITEMS.find(t => t.id === id || t.intentId === id);

  const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
  const effectiveLocation = isLocalUser ? userLocation! : TIRUPATI_CENTER;
  const isUserOnHill = userLocation ? isCoordinateOnTirumalaHill(userLocation.lat, userLocation.lng) : false;
  const isTirumalaSpot = item?.location?.toLowerCase().includes('tirumala') || 
                         item?.location?.toLowerCase().includes('vqc') || 
                         (item?.coordinates ? isCoordinateOnTirumalaHill(item.coordinates.lat, item.coordinates.lng) : false);

  // Dynamic context distance: only show walk time if within walkable radius (<= 2km)
  const liveDistance = useMemo(() => {
    if (!item?.coordinates) return null;
    const distKm = calculateDrivingDistance(
      effectiveLocation.lat,
      effectiveLocation.lng,
      item.coordinates.lat,
      item.coordinates.lng,
      Boolean(isTirumalaSpot)
    );
    const isWalkable = distKm <= 2;
    const walkMins = Math.max(1, Math.round(distKm * 12));
    const distM = Math.round(distKm * 1000);
    const distLabel = distKm < 1 ? `${distM} m` : `${distKm.toFixed(1)} km`;

    return {
      distKm,
      label: distLabel,
      walkMins: isWalkable ? walkMins : null,
      displayText: isWalkable 
        ? `${distLabel} away · ${walkMins}m walk`
        : `${distLabel} away`
    };
  }, [effectiveLocation, item, isTirumalaSpot]);

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

  if (!item) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#DC2626" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#0F172A' }}>Essential Facility Not Found</h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 20px 0' }}>The requested facility does not exist in our directory.</p>
        <button onClick={() => router.push('/essentials')} className={styles.ctaButton} style={{ width: 'auto', padding: '0 24px' }}>
          Back to Essentials
        </button>
      </div>
    );
  }

  const IconComp = ICON_MAP[item.iconName] || Info;

  const handleOpenMap = (customQuery?: string) => {
    if (item.coordinates) {
      const dest = customQuery 
        ? encodeURIComponent(`${customQuery} Tirumala`) 
        : `${item.coordinates.lat},${item.coordinates.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // Dynamic CTA Target Calculation based on current user selection
  const dynamicCtaInfo = (() => {
    if (item.id === 'secure-belongings') {
      if (selectedDecisionId === 'phone') {
        return {
          title: lang === 'te' ? 'VQC-I మొబైల్ కౌంటర్‌కు నావిగేట్ చేయండి' : 'Navigate to VQC-I Mobile Deposit',
          dest: 'VQC-I Mobile Deposit'
        };
      }
      if (selectedDecisionId === 'luggage') {
        return {
          title: lang === 'te' ? 'PAC-2 లాకర్ కాంప్లెక్స్‌కు నావిగేట్ చేయండి' : 'Navigate to PAC-2 Locker Complex',
          dest: 'PAC-2 Madhava Nilayam'
        };
      }
      return {
        title: lang === 'te' ? 'పాదరక్షల స్టాండ్‌కు నావిగేట్ చేయండి' : 'Navigate to VQC Footwear Stand',
        dest: 'VQC Footwear Counter'
      };
    }
    if (item.id === 'free-meals') {
      if (selectedDecisionId === 'tiffin') {
        return {
          title: lang === 'te' ? 'అల్పాహార శాలకు నావిగేట్ చేయండి' : 'Navigate to Annaprasadam Tiffin (9:00 - 10:30 AM)',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      if (selectedDecisionId === 'lunch') {
        return {
          title: lang === 'te' ? 'అన్నప్రసాద భోజన శాలకు నావిగేట్ చేయండి' : 'Navigate to Vengamamba Lunch Feast',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      if (selectedDecisionId === 'dinner') {
        return {
          title: lang === 'te' ? 'రాత్రి భోజన శాలకు నావిగేట్ చేయండి' : 'Navigate to Vengamamba Dinner',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      if (selectedDecisionId === 'vada' || selectedDecisionId === 'break') {
        return {
          title: lang === 'te' ? 'అన్నప్రసాదం ప్రాంగణానికి నావిగేట్ చేయండి' : 'Navigate to Annaprasadam Complex',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      return {
        title: lang === 'te' ? 'క్యూ కాంప్లెక్స్ వివరాలు చూడండి' : 'Navigate to VQC Queue Compartments',
        dest: 'Vaikuntam Queue Complex'
      };
    }
    if (item.id === 'hair-offering') {
      if (selectedDecisionId === 'mini') {
        return {
          title: lang === 'te' ? 'సమీప ఉప కల్యాణకట్టకు నావిగేట్ చేయండి' : 'Navigate to Mini Kalyanakatta (PAC-1)',
          dest: 'PAC 1 Kalyanakatta'
        };
      }
      if (selectedDecisionId === 'bath') {
        return {
          title: lang === 'te' ? 'ఉచిత వేడినీటి స్నాన ఘాట్లకు నావిగేట్ చేయండి' : 'Navigate to Free Bathing Ghats',
          dest: 'Kalyanakatta Bathing'
        };
      }
      return {
        title: lang === 'te' ? 'ప్రధాన కల్యాణకట్టకు నావిగేట్ చేయండి' : 'Navigate to Main Kalyanakatta (24/7)',
        dest: 'Main Kalyanakatta'
      };
    }
    if (item.id === 'accommodation') {
      if (selectedDecisionId === 'cro') {
        return {
          title: lang === 'te' ? 'కొండపై CRO కార్యాలయానికి నావిగేట్ చేయండి' : 'Navigate to CRO Allotment Office',
          dest: 'CRO'
        };
      }
      if (selectedDecisionId === 'transit') {
        return {
          title: lang === 'te' ? 'విష్ణు నివాసం (తిరుపతి)కి నావిగేట్ చేయండి' : 'Navigate to Vishnu Nivasam (Downhill)',
          dest: 'Vishnu Nivasam'
        };
      }
      return {
        title: lang === 'te' ? 'ఉచిత PAC విశ్రాంతి హాళ్లకు నావిగేట్ చేయండి' : 'Navigate to Free PAC Rest Halls',
        dest: 'PAC 1'
      };
    }
    return {
      title: lang === 'te' ? 'కేంద్రానికి నావిగేట్ చేయండి' : `Navigate to ${item.name}`,
      dest: item.name
    };
  })();

  // Meal live serving indicators
  const isTiffinActive = currentHourIST >= 9 && currentHourIST < 10.5;
  const isLunchActive = currentHourIST >= 10.5 && currentHourIST < 16;
  const isBreakActive = currentHourIST >= 16 && currentHourIST < 17;
  const isDinnerActive = currentHourIST >= 17 && currentHourIST < 22.5;

  // Related FAQs
  const relatedFaqs = FAQ_ITEMS.filter(faq => 
    faq.searchAliases.some(alias => item.searchAliases.includes(alias)) || faq.category === item.category
  ).slice(0, 4);

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/essentials')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 8px', textAlign: 'center' }}>
          <h1 className={styles.headerTitle}>{item.name}</h1>
          <p className={styles.headerSubtitle}>{lang === 'te' ? 'దర్శనానికి ముందు' : 'Before Darshan'}</p>
        </div>
        <button className={styles.iconButton} onClick={handleShare} aria-label="Share">
          <Share2 size={18} />
        </button>
      </header>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div style={{
          position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0F172A', color: '#FFFFFF', padding: '8px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 700, zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <CheckCircle2 size={14} color="#22C55E" />
          Link copied to clipboard!
        </div>
      )}

      {/* Scrollable Container with Bottom Padding for Sticky 56px CTA */}
      <div className={styles.scrollArea} style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 24px))', gap: '18px' }}>
        
        {/* COMPACT HERO */}
        <div className={styles.compactHero}>
          <div className={styles.heroPreHeading}>
            {lang === 'te' ? 'దర్శనానికి ముందు' : 'BEFORE DARSHAN'}
          </div>
          <h2 className={styles.heroMainTitle}>{item.name}</h2>
          <p className={styles.heroDesc}>
            {item.id === 'secure-belongings' 
              ? (lang === 'te' ? 'దర్శనానికి వెళ్లే ముందు లోపలికి అనుమతించని వస్తువులను భద్రపరచండి.' : 'Store items that cannot be taken inside.')
              : item.id === 'free-meals'
              ? (lang === 'te' ? 'భక్తులందరికీ నిరంతర పరిశుద్ధ ఉచిత అన్నప్రసాదం.' : 'Fresh satvik dining for all pilgrims.')
              : item.id === 'hair-offering'
              ? (lang === 'te' ? '24/7 ఉచిత కల్యాణకట్ట సేవలు & వేడినీటి స్నానాలు.' : 'Sanitized 24/7 tonsure & free hot showers.')
              : item.id === 'accommodation'
              ? (lang === 'te' ? 'ఉచిత PAC విశ్రాంతి హాళ్లు & గదుల కేటాయింపు.' : 'Free PAC rest halls & room allotment.')
              : item.description}
          </p>
          <div className={styles.heroLocationLine}>
            <MapPin size={12} color="#64748B" />
            <span>
              {item.id === 'hair-offering' 
                ? (lang === 'te' ? 'ప్రధాన కల్యాణకట్ట & 9 కేంద్రాలు · తిరుమల కొండ' : 'Main Kalyanakatta & 9 Centers · Tirumala Hill')
                : item.id === 'secure-belongings'
                ? (lang === 'te' 
                    ? (!isUserOnHill && liveDistance ? `తిరుమల కొండపై లాకర్లు · మీరు తిరుపతిలో ${liveDistance.label} దూరంలో ఉన్నారు` : 'VQC & PAC లాకర్ కౌంటర్లు · తిరుమల కొండ')
                    : (!isUserOnHill && liveDistance ? `Showing lockers ON Tirumala Hill · You are ${liveDistance.label} away in Tirupati` : 'VQC & PAC Lockers · Tirumala Hill'))
                : item.id === 'free-meals'
                ? (lang === 'te' ? 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాదం కాంప్లెక్స్, తిరుమల' : 'Matrusri Tarigonda Vengamamba Annaprasadam Complex, Tirumala')
                : item.id === 'accommodation'
                ? (lang === 'te' ? 'CRO కార్యాలయం & PAC హాళ్లు · తిరుమల కొండ' : 'CRO Office & PAC Halls · Tirumala Hill')
                : item.location}
              {(item.id !== 'secure-belongings' || isUserOnHill) && liveDistance ? ` · ${liveDistance.displayText}` : ''}
            </span>
          </div>
        </div>

        {/* OFFICIAL DEPOSIT LOCATIONS (TOP PRIORITY - PROMINENT LISTING) */}
        {item.id === 'secure-belongings' && item.subLocations && item.subLocations.length > 0 && (
          <section id="official-locations-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-sans), system-ui', fontWeight: 600, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1E232D', margin: 0 }}>
                {lang === 'te' ? 'అధికారిక భద్రతా కేంద్రాలు' : 'Official deposit locations'}
              </h2>
              <span style={{ background: '#F0FDF4', color: '#0F5132', border: '1px solid #BBF7D0', fontWeight: 600, borderRadius: '999px', padding: '2px 8px', fontSize: '11px' }}>
                {lang === 'te' ? '100% ఉచితం' : '100% Free Deposit'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {item.subLocations.map((sub, idx) => {
                const isTargeted = (selectedDecisionId === 'phone' && idx === 0) ||
                                   (selectedDecisionId === 'luggage' && (idx === 1 || idx === 4)) ||
                                   (selectedDecisionId === 'shoes' && idx === 0);
                return (
                  <div 
                    key={idx}
                    id={`location-card-${idx}`}
                    style={{
                      background: isTargeted ? '#F0FDF4' : '#FFFFFF',
                      border: isTargeted ? '1.5px solid #0F5132' : '1px solid rgba(30, 35, 45, 0.08)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      boxShadow: isTargeted ? '0 2px 6px rgba(15, 81, 50, 0.06)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                      transition: 'border-color 0.2s ease, background 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontWeight: 600, fontSize: '14px', color: '#1E232D', margin: 0 }}>
                          {sub.name}
                        </h3>
                        {isTargeted && (
                          <span style={{ background: '#DCFCE7', color: '#0F5132', border: '1px solid #BBF7D0', borderRadius: '999px', padding: '1px 7px', fontSize: '10px', fontWeight: 600 }}>
                            {lang === 'te' ? 'సిఫార్సు' : 'Recommended'}
                          </span>
                        )}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: '12px', color: '#64748B' }}>
                        {sub.distance} • {sub.walkTime}
                      </span>
                    </div>
                    {sub.bestFor && (
                      <div style={{ fontWeight: 500, fontSize: '12px', color: '#64748B' }}>
                        {sub.bestFor}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button 
                        style={{ background: 'none', border: 'none', padding: '4px 0', color: '#0F5132', fontWeight: 600, fontSize: '12.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => handleOpenMap(sub.name)}
                      >
                        <span>{lang === 'te' ? 'మ్యాప్ మార్గం చూడండి →' : 'Get directions →'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* OFFICIAL ANNAPRASADAM DETAILS FOR FREE MEALS */}
        {item.id === 'free-meals' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Location & Free Entry Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(30, 35, 45, 0.08)',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#F0FDF4',
                    color: '#0F5132',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={16} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0F5132' }}>
                      {lang === 'te' ? 'ప్రాంగణం' : 'LOCATION'}
                    </div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1E232D', margin: '2px 0 0 0', lineHeight: 1.35 }}>
                      Matrusri Tarigonda Vengamamba Annaprasadam Complex, Tirumala
                    </h3>
                  </div>
                </div>
              </div>

              {/* Service Badges (Strictly Lucide Icons Only) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={13} color="#059669" />
                  Free Annaprasadam for devotees
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={13} color="#059669" />
                  No ticket or payment required
                </span>
              </div>
            </div>

            {/* Special Vada Announcement Card */}
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#FEF08A',
                color: '#854D0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#854D0E' }}>
                    Special Annaprasadam Vada
                  </span>
                  <span style={{ background: '#FEF9C3', color: '#713F12', border: '1px solid #FDE047', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700 }}>
                    11:00 AM – 10:00 PM
                  </span>
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#713F12', lineHeight: 1.35 }}>
                  Available approximately from 11:00 AM to 10:00 PM, according to official TTD announcement.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* DECISION CARDS (WHAT -> WHERE -> ACTION) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '14.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#0F172A' }}>
            {item.id === 'secure-belongings' 
              ? (lang === 'te' ? 'ఎక్కడికి వెళ్లాలి?' : 'Where Should I Go?')
              : item.id === 'free-meals'
              ? (lang === 'te' ? 'అన్నప్రసాదం సమయాలు & వివరాలు' : 'Annaprasadam Timings & Food Details')
              : item.id === 'hair-offering'
              ? (lang === 'te' ? 'తలనీలాల కోసం ఎక్కడికి వెళ్లాలి?' : 'Where Should I Go for Tonsure?')
              : (lang === 'te' ? 'గది ఎక్కడ పొందవచ్చు?' : 'Where Can I Get a Room?')}
          </h3>

          <div className={styles.utilityDecisionGrid}>
            {/* SECURE BELONGINGS MATRIX — COMPACT CHIP SELECTOR */}
            {item.id === 'secure-belongings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                  <button 
                    onClick={() => {
                      setSelectedDecisionId('phone');
                      const el = document.getElementById('location-card-0');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{
                      background: selectedDecisionId === 'phone' ? '#F0FDF4' : '#F8FAFC',
                      color: selectedDecisionId === 'phone' ? '#0F5132' : '#475569',
                      border: selectedDecisionId === 'phone' ? '1.5px solid #0F5132' : '1px solid #E2E8F0',
                      fontWeight: selectedDecisionId === 'phone' ? 600 : 500,
                      borderRadius: '999px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      background: selectedDecisionId === 'phone' ? '#DCFCE7' : '#F1F5F9', 
                      color: selectedDecisionId === 'phone' ? '#0F5132' : '#64748B', 
                      borderRadius: '6px', 
                      padding: '2px', 
                      marginRight: '2px' 
                    }}>
                      <Smartphone size={14} strokeWidth={2} />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{lang === 'te' ? 'మొబైల్ ఫోన్లు → VQC-I' : 'Mobile → VQC-I'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedDecisionId('luggage');
                      const el = document.getElementById('location-card-1');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{
                      background: selectedDecisionId === 'luggage' ? '#F0FDF4' : '#F8FAFC',
                      color: selectedDecisionId === 'luggage' ? '#0F5132' : '#475569',
                      border: selectedDecisionId === 'luggage' ? '1.5px solid #0F5132' : '1px solid #E2E8F0',
                      fontWeight: selectedDecisionId === 'luggage' ? 600 : 500,
                      borderRadius: '999px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      background: selectedDecisionId === 'luggage' ? '#DCFCE7' : '#F1F5F9', 
                      color: selectedDecisionId === 'luggage' ? '#0F5132' : '#64748B', 
                      borderRadius: '6px', 
                      padding: '2px', 
                      marginRight: '2px' 
                    }}>
                      <Luggage size={14} strokeWidth={2} />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{lang === 'te' ? 'లగేజీ & బ్యాగులు → PAC-2' : 'Luggage → PAC-2'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedDecisionId('shoes');
                      const el = document.getElementById('location-card-0');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{
                      background: selectedDecisionId === 'shoes' ? '#F0FDF4' : '#F8FAFC',
                      color: selectedDecisionId === 'shoes' ? '#0F5132' : '#475569',
                      border: selectedDecisionId === 'shoes' ? '1.5px solid #0F5132' : '1px solid #E2E8F0',
                      fontWeight: selectedDecisionId === 'shoes' ? 600 : 500,
                      borderRadius: '999px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      background: selectedDecisionId === 'shoes' ? '#DCFCE7' : '#F1F5F9', 
                      color: selectedDecisionId === 'shoes' ? '#0F5132' : '#64748B', 
                      borderRadius: '6px', 
                      padding: '2px', 
                      marginRight: '2px' 
                    }}>
                      <Footprints size={14} strokeWidth={2} />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{lang === 'te' ? 'చెప్పులు → ఉచిత కౌంటర్లు' : 'Shoes → Free Stands'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* FREE MEALS MATRIX */}
            {item.id === 'free-meals' && (
              <>
                {/* 1. Tiffin (9:00 AM – 10:30 AM) */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'tiffin' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('tiffin')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Coffee size={16} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 className={styles.utilityDecisionName}>Tiffin</h4>
                      {isTiffinActive && (
                        <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                          Serving Now
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Matrusri Tarigonda Vengamamba Complex, Tirumala
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    9:00 AM – 10:30 AM · Free Satvik Tiffin
                  </p>
                  
                  {/* Food Details Box */}
                  <div style={{ margin: '4px 0 4px 42px', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Food Details:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 500, display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                      <span>• Upma</span>
                      <span>• Pongal</span>
                      <span>• Semiya Upma</span>
                      <span>• Chutney</span>
                    </div>
                  </div>

                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('tiffin'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 2. Lunch Feast (10:30 AM – 4:00 PM) */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'lunch' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('lunch')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Utensils size={16} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 className={styles.utilityDecisionName}>Traditional Lunch Feast</h4>
                      {isLunchActive && (
                        <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                          Serving Now
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Matrusri Tarigonda Vengamamba Complex, Tirumala
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    10:30 AM – 4:00 PM · Free Satvik Feast
                  </p>

                  {/* Food Details Box */}
                  <div style={{ margin: '4px 0 4px 42px', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Food Details:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 500, display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                      <span>• Rice</span>
                      <span>• Curry</span>
                      <span>• Sambar</span>
                      <span>• Rasam</span>
                      <span>• Chutney</span>
                      <span>• Buttermilk</span>
                      <span>• Sweet Pongal</span>
                    </div>
                  </div>

                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('lunch'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 3. Break (4:00 PM – 5:00 PM) */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'break' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('break')}
                  style={{ background: isBreakActive ? '#FFFBEB' : '#FFFFFF', borderColor: isBreakActive ? '#F59E0B' : '#E2E8F0' }}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox} style={{ background: isBreakActive ? '#FEF3C7' : '#F1F5F9', color: isBreakActive ? '#B45309' : '#64748B' }}>
                      <Clock size={16} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 className={styles.utilityDecisionName}>Sanitation & Preparation Break</h4>
                      <span style={{ background: '#F1F5F9', color: '#64748B', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 600 }}>
                        4:00 PM – 5:00 PM
                      </span>
                    </div>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Matrusri Tarigonda Vengamamba Complex, Tirumala
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Dining halls closed for scheduled hygiene cleaning and dinner session preparation.
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                      Dinner session opens at 5:00 PM
                    </span>
                  </div>
                </div>

                {/* 4. Dinner Feast (5:00 PM – 10:30 PM) */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'dinner' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('dinner')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Utensils size={16} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 className={styles.utilityDecisionName}>Evening & Night Dinner</h4>
                      {isDinnerActive && (
                        <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                          Serving Now
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Matrusri Tarigonda Vengamamba Complex, Tirumala
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    5:00 PM – 10:30 PM · Free Satvik Feast
                  </p>

                  {/* Food Details Box */}
                  <div style={{ margin: '4px 0 4px 42px', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Food Details:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 500, display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                      <span>• Rice</span>
                      <span>• Curry</span>
                      <span>• Sambar</span>
                      <span>• Rasam</span>
                      <span>• Chutney</span>
                      <span>• Buttermilk</span>
                      <span>• Sweet Pongal</span>
                    </div>
                  </div>

                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('dinner'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 5. Special Vada Card */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'vada' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('vada')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox} style={{ background: '#FEF3C7', color: '#B45309' }}>
                      <Sparkles size={16} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 className={styles.utilityDecisionName}>Special Annaprasadam Vada</h4>
                      <span style={{ background: '#FEF9C3', color: '#854D0E', border: '1px solid #FDE047', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                        TTD Announcement
                      </span>
                    </div>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Matrusri Tarigonda Vengamamba Complex, Tirumala
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Available approximately from 11:00 AM to 10:00 PM, according to official TTD announcement.
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('vada'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 6. In-Queue Food & Milk */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'queue' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('queue')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Droplets size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>In-Queue Food & Infant Milk</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Inside VQC Waiting Compartments
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Continuous 24/7 · Delivered direct to devotee seats inside queue lines
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <span style={{ fontSize: '12.5px', color: '#0F5132', fontWeight: 600 }}>Inside Queue Line</span>
                  </div>
                </div>
              </>
            )}

            {/* HAIR OFFERING MATRIX */}
            {item.id === 'hair-offering' && (
              <>
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'main' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('main')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Scissors size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Main Kalyanakatta Complex</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Opp. Annaprasadam Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Open 24/7 · 4 Floors · Free
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('main'); handleOpenMap('Main Kalyanakatta Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'mini' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('mini')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Scissors size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Mini Kalyanakattas (9 Centers)</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    PAC-1, PAC-2, PAC-3 & Rest Houses
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    2:00 AM – 10:00 PM · Shorter queues
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('mini'); handleOpenMap('PAC 1 Kalyanakatta Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'bath' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('bath')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Droplets size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Free Bathing Ghats</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Attached to Kalyanakatta & PACs
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    24/7 Continuous Hot Geysers · Free
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('bath'); handleOpenMap('Kalyanakatta Bathing Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ACCOMMODATION MATRIX */}
            {item.id === 'accommodation' && (
              <>
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'pac' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('pac')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Bed size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Free PAC Rest Halls</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    PAC-1 to PAC-5 & Madhava Nilayam
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    100% Free · 24/7 Security & Lockers
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('pac'); handleOpenMap('PAC 1 Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'cro' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('cro')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <MapPin size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Hilltop Offline Allotment (CRO)</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Central Reception Office, Opp. Bus Stand
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    3–4 AM Window · ₹100 / ₹500 Rooms
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('cro'); handleOpenMap('CRO Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'transit' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('transit')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Bus size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Tirupati Downhill Transit Rooms</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Vishnu Nivasam & Srinivasam Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Opp. Railway Station & Bus Stand
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('transit'); handleOpenMap('Vishnu Nivasam Tirupati'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* BEFORE YOU GO */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-sans), system-ui', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: '#1E232D' }}>
            {lang === 'te' ? 'వెళ్లే ముందు' : 'Before You Go'}
          </h3>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(30, 35, 45, 0.08)', borderRadius: '16px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '999px', width: '20px', height: '20px', display: 'grid', placeItems: 'center', color: '#059669', flexShrink: 0 }}>
                <Check size={12} strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'var(--font-sans), system-ui', fontWeight: 500, fontSize: '13px', color: '#334155' }}>
                {lang === 'te' ? 'ఒరిజినల్ ఆధార్ కార్డు / ప్రభుత్వ ఫోటో గుర్తింపు కార్డు' : 'Physical Aadhaar or Govt Photo ID'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '999px', width: '20px', height: '20px', display: 'grid', placeItems: 'center', color: '#059669', flexShrink: 0 }}>
                <Check size={12} strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'var(--font-sans), system-ui', fontWeight: 500, fontSize: '13px', color: '#334155' }}>
                {lang === 'te' ? 'దర్శన టికెట్ ప్రింట్‌అవుట్ లేదా బార్‌కోడ్' : 'Darshan ticket (physical or barcode)'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '999px', width: '20px', height: '20px', display: 'grid', placeItems: 'center', color: '#059669', flexShrink: 0 }}>
                <Check size={12} strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'var(--font-sans), system-ui', fontWeight: 500, fontSize: '13px', color: '#334155' }}>
                {lang === 'te' ? 'కొద్దిగా నగదు ₹50–₹100 (లడ్డూ లేదా తాళం కొరకు)' : 'Small cash ₹50–₹100'}
              </span>
            </div>
          </div>

          {/* Prohibited Items Accordion (M3 Neutral Card) */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(30, 35, 45, 0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <button 
              className={styles.prohibitedAccordionHeader}
              onClick={() => setShowProhibited(p => !p)}
              style={{ background: '#FFFFFF', padding: '12px 16px', border: 'none', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#FEF3C7', color: '#92400E', borderRadius: '6px', width: '24px', height: '24px', display: 'grid', placeItems: 'center' }}>
                  <AlertTriangle size={13} strokeWidth={2} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#1E232D' }}>
                  {lang === 'te' ? 'క్యూలోకి తీసుకెళ్లకూడని వస్తువులు' : 'Items not allowed inside'}
                </span>
              </div>
              {showProhibited ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
            </button>

            {showProhibited && (
              <div style={{ padding: '0 16px 14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontStyle: 'normal', marginBottom: '2px' }}>
                  {lang === 'te' 
                    ? 'స్కానర్ వద్ద భద్రతా సిబ్బంది తిప్పి పంపుతారు. దర్శనానికి ముందే డిపాజిట్ చేయండి.'
                    : 'Flagged by metal detectors; strictly barred by sanctum security. Deposit these before entering.'}
                </div>
                {item.requirements?.prohibited?.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#7F1D1D', fontWeight: 500 }}>
                    <X size={14} color="#DC2626" style={{ flexShrink: 0 }} />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS (COLLAPSIBLE NEUTRAL ACCORDION) */}
        {item.procedureTimeline && item.procedureTimeline.length > 0 && (
          <div className={styles.neutralAccordionCard}>
            <button 
              className={styles.neutralAccordionHeader}
              onClick={() => setShowTimeline(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#475569" />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E232D' }}>
                  {lang === 'te' ? 'విధానం ఎలా పనిచేస్తుంది?' : 'How It Works'}
                </span>
              </div>
              {showTimeline ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
            </button>

            {showTimeline && (
              <div className={styles.accordionBody}>
                <div className={styles.timelineList}>
                  {item.procedureTimeline.map((step) => (
                    <div key={step.stepNumber} className={styles.timelineItem}>
                      <div className={styles.timelineBadge}>{step.stepNumber}</div>
                      <div className={styles.timelineContent}>
                        <h4 className={styles.timelineStepTitle}>{step.title}</h4>
                        {step.description && <p className={styles.timelineStepDesc}>{step.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FREQUENTLY ASKED QUESTIONS (COLLAPSIBLE NEUTRAL ACCORDION) */}
        {relatedFaqs.length > 0 && (
          <div className={styles.neutralAccordionCard}>
            <button 
              className={styles.neutralAccordionHeader}
              onClick={() => setShowFaqs(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} color="#475569" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  {lang === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Frequently Asked Questions'}
                </span>
              </div>
              {showFaqs ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
            </button>

            {showFaqs && (
              <div className={styles.accordionBody}>
                {relatedFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className={`${styles.faqAccordionItem} ${isExpanded ? styles.faqAccordionItemActive : ''}`}>
                      <div 
                        className={styles.faqAccordionQuestion}
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      >
                        <span style={{ fontSize: '13px' }}>{faq.question}</span>
                        {isExpanded ? <ChevronUp size={15} color="#0F5132" /> : <ChevronDown size={15} color="#64748B" />}
                      </div>
                      {isExpanded && (
                        <div className={styles.faqAccordionAnswer} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 56px CONTEXTUAL STICKY BOTTOM NAVIGATION ACTION */}
      <div className={styles.stickyCtaContainer}>
        <button 
          className={styles.primaryStickyCta}
          onClick={() => handleOpenMap(dynamicCtaInfo.dest)}
        >
          <Navigation size={18} />
          <span>{dynamicCtaInfo.title}</span>
        </button>
      </div>
    </div>
  );
}

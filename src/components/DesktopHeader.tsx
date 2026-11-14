import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, setAppLanguage } from '@/lib/useLanguage';
import { 
  Sun, Bell, Navigation, 
  Home, Layers, Compass, Calendar, Languages
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { useTrip } from '@/components/TripContext';
import styles from './DesktopHeader.module.css';
import { useAlerts } from '@/hooks/useAlerts';
import { LocationPickerModal, LocationPill } from '@/components/common/LocationPickerModal';

interface DesktopHeaderProps {
  weather?: string;
  temperature?: string;
}

export function DesktopHeader({ weather, temperature }: DesktopHeaderProps) {
  const displayWeather = weather && temperature ? `${temperature} · ${weather}` : '☀ 24°C · Sunny';
  const { activeAlertsCount } = useAlerts();
  const { locationName, locationPermission } = useTrip();
  const pathname = usePathname();
  const lang = useLanguage();

  const [selectedLocation, setSelectedLocation] = useState<string>(locationName || 'Tirupati');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/wv|Android.*Version\/[0-9.]+|SaarthiApp/i.test(ua) || (window as any).AndroidInterface !== undefined) {
        setIsWebView(true);
      }
      const saved = localStorage.getItem('saarthi_user_region');
      if (saved) setSelectedLocation(saved);
      else if (locationName) setSelectedLocation(locationName);
    }
  }, [locationName]);

  const navLinks = [
    { href: '/', label: lang === 'te' ? 'హోమ్' : lang === 'kn' ? 'ಮುಖಪುಟ' : lang === 'hi' ? 'होम' : lang === 'ta' ? 'முகப்பு' : 'Home', icon: Home },
    { href: '/route', label: lang === 'te' ? 'యాత్రా మార్గం' : lang === 'kn' ? 'ಲೈವ್ ಮಾರ್ಗ & GPS' : lang === 'hi' ? 'लाइव मार्ग व GPS' : lang === 'ta' ? 'நேரலை வழி & GPS' : 'Live Route & GPS', icon: Navigation },
    { href: '/offline-maps', label: lang === 'te' ? 'ఆఫ్‌లైన్ మ్యాప్‌లు' : lang === 'kn' ? 'ಆಫ್‌ಲೈನ್ ನಕ್ಷೆಗಳು' : lang === 'hi' ? 'ऑफलाइन मानचित्र' : lang === 'ta' ? 'ஆஃப்லைன் வரைபடங்கள்' : 'Offline Maps', icon: Compass },
    { href: '/essentials', label: lang === 'te' ? 'అవసరాలు' : lang === 'kn' ? 'ಅಗತ್ಯಗಳು' : lang === 'hi' ? 'आवश्यकताएं' : lang === 'ta' ? 'அத்தியாவசியங்கள்' : 'Essentials', icon: Layers },
    { href: '/explore', label: lang === 'te' ? 'అన్వేషించు' : lang === 'kn' ? 'ಅನ್ವೇಷಿಸಿ' : lang === 'hi' ? 'स्थान देखें' : lang === 'ta' ? 'ஆராய்க' : 'Explore', icon: Compass },
    { href: '/festivals', label: lang === 'te' ? 'ఉత్సవాలు' : lang === 'kn' ? 'ಉತ್ಸವಗಳು' : lang === 'hi' ? 'त्यौहार' : lang === 'ta' ? 'திருவிழாக்கள்' : 'Festivals', icon: Calendar },
  ];

  return (
    <header className={styles.desktopHeaderContainer}>
      <div className={styles.innerHeader}>
        <div className={styles.leftBrand}>
          <Link href="/" className={styles.logoWrapper}>
            <Logo size={42} />
            <span className={styles.brandName}>Saarthi Guide</span>
          </Link>
          <LocationPill 
            locationName={selectedLocation}
            isGpsActive={locationPermission === 'granted'}
            onClick={() => setIsLocationModalOpen(true)} 
          />
        </div>

        {/* ── DESKTOP NAVIGATION MENU ── */}
        <nav className={styles.centerNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={16} className={isActive ? styles.activeNavIcon : styles.navIcon} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.rightMeta}>
          <div className={styles.weatherBadge}>
            <Sun size={15} />
            <span>{displayWeather}</span>
          </div>

          {!isWebView && (
            <Link
              href="/app"
              style={{
                background: 'linear-gradient(135deg, #022819 0%, #064E3B 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '20px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(2,40,25,0.25)',
                border: '1px solid #C89B3C'
              }}
            >
              <span>{lang === 'te' ? 'యాప్ పొందండి' : lang === 'kn' ? 'ಆ್ಯಪ್ ಪಡೆಯಿರಿ' : lang === 'hi' ? 'ऐप प्राप्त करें' : lang === 'ta' ? 'செயலியைப் பெறுக' : 'Get App'}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              const NEXT_LANG: Record<string, 'en' | 'te' | 'kn' | 'hi' | 'ta'> = {
                en: 'te',
                te: 'kn',
                kn: 'hi',
                hi: 'ta',
                ta: 'en'
              };
              setAppLanguage(NEXT_LANG[lang] || 'te');
            }}
            aria-label="Change Language"
            title="Switch Language"
            className={styles.langButton}
          >
            <Languages size={14} color="#0F5132" strokeWidth={2} />
            <span>
              {lang === 'te' ? 'తెలుగు' :
               lang === 'kn' ? 'ಕನ್ನಡ' :
               lang === 'hi' ? 'हिंदी' :
               lang === 'ta' ? 'தமிழ்' :
               'English'}
            </span>
          </button>

          <Link href="/alerts" className={styles.notifButton} aria-label="Notifications">
            <Bell size={18} />
            {activeAlertsCount > 0 && (
              <span className={styles.notifBadge}>
                {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* DYNAMIC REGION / STARTING LOCATION SELECTOR MODAL */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocationName={selectedLocation}
        onSelectLocation={(name) => setSelectedLocation(name)}
      />
    </header>
  );
}


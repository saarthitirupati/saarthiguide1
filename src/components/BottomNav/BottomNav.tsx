'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, Compass, BedDouble } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    home: 'Home',
    essentials: 'Essentials',
    rooms: 'Rooms',
    soon: 'Soon',
    explore: 'Explore',
  },
  te: {
    home: 'హోమ్',
    essentials: 'అవసరాలు',
    rooms: 'రూమ్స్',
    soon: 'త్వరలో',
    explore: 'అన్వేషించు',
  },
  hi: {
    home: 'होम',
    essentials: 'ज़रूरी बातें',
    rooms: 'कमरे',
    soon: 'जल्द',
    explore: 'खोजें',
  },
  ta: {
    home: 'முகப்பு',
    essentials: 'அத்தியாவசியங்கள்',
    rooms: 'அறைகள்',
    soon: 'விரைவில்',
    explore: 'ஆராய்க',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    essentials: 'ಅಗತ್ಯಗಳು',
    rooms: 'ಕೊಠಡಿ',
    soon: 'ಶೀಘ್ರ',
    explore: 'ಅನ್ವೇಷಿಸಿ',
  },
};

type TextMap = Record<string, string>;

const getNavItems = (t: TextMap) => [
  { key: 'home',       name: t.home || 'Home',             icon: Home,       href: '/' },
  { key: 'essentials', name: t.essentials || 'Essentials', icon: LayoutGrid, href: '/essentials' },
  { key: 'rooms',      name: t.rooms || 'Rooms',           icon: BedDouble,  href: '/room-booking', badge: t.soon || 'Soon' },
  { key: 'explore',    name: t.explore || 'Explore',       icon: Compass,    href: '/explore' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const lang = useLanguage();
  const t = (TEXTS as Record<string, TextMap>)[lang] || TEXTS.en;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = getNavItems(t);

  return (
    <nav className={`${styles.dockWrapper} notranslate`} translate="no" suppressHydrationWarning>
      <div className={styles.dockPill}>
        {navItems.map((item) => {
          const isActive = mounted && (
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          );

          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              className={`${styles.dockItem} ${isActive ? styles.dockItemActive : ''} notranslate`}
              aria-label={item.name}
              translate="no"
            >
              <motion.div
                className={styles.iconContainer}
                style={{ position: 'relative' }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <item.icon
                  size={19}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  className={isActive ? styles.iconActive : styles.iconInactive}
                />
                {item.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-20px',
                    fontSize: '7.5px',
                    fontWeight: 800,
                    lineHeight: 1,
                    padding: '2px 4px',
                    borderRadius: '6px',
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    border: '1px solid #FDE68A',
                    letterSpacing: '0.01em',
                    pointerEvents: 'none',
                  }}>
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className={`${isActive ? styles.labelActive : styles.labelInactive} notranslate`} translate="no">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

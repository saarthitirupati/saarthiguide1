'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Compass } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    home: 'Home',
    essentials: 'Essentials',
    explore: 'Explore',
  },
  te: {
    home: 'హోమ్',
    essentials: 'అవసరాలు',
    explore: 'అన్వేషించు',
  },
  hi: {
    home: 'होम',
    essentials: 'आवश्यकताएं',
    explore: 'खोजें',
  },
  ta: {
    home: 'முகப்பு',
    essentials: 'தேவைகள்',
    explore: 'ஆராய்க',
  },
};

type TextMap = Record<string, string>;

const getNavItems = (t: TextMap) => [
  { key: 'home',       name: t.home || 'Home',             icon: Home,      href: '/' },
  { key: 'essentials', name: t.essentials || 'Essentials', icon: Layers,    href: '/essentials', isFab: true },
  { key: 'explore',    name: t.explore || 'Explore',       icon: Compass,   href: '/explore' },
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
    <nav
      className={styles.nav}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        borderRadius: 0,
        borderTop: '1px solid rgba(226, 232, 240, 0.95)',
        backgroundColor: '#FFFFFF',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
      suppressHydrationWarning
    >
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = mounted && (
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          );

          if (item.isFab) {
            return (
              <div key={item.key} className={styles.slot}>
                <Link href={item.href} prefetch={false} className={styles.fabWrapper}>
                  <motion.div
                    className={styles.fabRing}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.75, 0.25, 0.75],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.8,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className={styles.fabBtn}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.88, rotate: -10 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: [0, 180, 360], scale: [1, 1.15, 1] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <item.icon size={24} className={styles.fabIcon} />
                    </motion.div>
                  </motion.div>
                  <span className={`${styles.fabLabel} ${isActive ? styles.fabLabelActive : ''}`}>
                    {item.name}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <div key={item.key} className={styles.slot}>
              <Link
                href={item.href}
                prefetch={false}
                className={styles.navLink}
              >
                <motion.div
                  className={`${styles.iconWrapper} ${isActive ? styles.iconWrapperActive : ''}`}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    className={isActive ? styles.activeIcon : styles.inactiveIcon}
                  />
                </motion.div>
                <span className={isActive ? styles.activeLabel : styles.inactiveLabel}>
                  {item.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

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
  { key: 'essentials', name: t.essentials || 'Essentials', icon: Layers,    href: '/essentials' },
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
    <nav className={styles.dockWrapper} suppressHydrationWarning>
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
              className={`${styles.dockItem} ${isActive ? styles.dockItemActive : ''}`}
              aria-label={item.name}
            >
              <motion.div
                className={styles.iconContainer}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <item.icon
                  size={19}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  className={isActive ? styles.iconActive : styles.iconInactive}
                />
              </motion.div>
              <span className={isActive ? styles.labelActive : styles.labelInactive}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

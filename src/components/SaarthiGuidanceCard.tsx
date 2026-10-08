'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Flame, Navigation } from 'lucide-react';

import { useLanguage } from '@/lib/useLanguage';

interface GuidancePill {
  label: string;
  title: string;
  url?: string;
  onClick?: () => void;
}

interface SaarthiGuidanceCardProps {
  dayName?: string;
  guidanceTitle?: string;
  quote?: string;
  primaryPill?: GuidancePill;
  secondaryPill?: GuidancePill;
  tertiaryPill?: GuidancePill;
  footerNote?: string;
  className?: string;
}

export default function SaarthiGuidanceCard({
  dayName,
  guidanceTitle,
  quote,
  primaryPill,
  secondaryPill,
  tertiaryPill,
  footerNote,
  className
}: SaarthiGuidanceCardProps) {
  const router = useRouter();
  const lang = useLanguage();

  // Dynamic day of week if not provided
  const currentDay = useMemo(() => {
    if (dayName) return dayName;
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysTe = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const daysTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
    const idx = new Date().getDay();
    if (lang === 'te') return daysTe[idx];
    if (lang === 'hi') return daysHi[idx];
    if (lang === 'ta') return daysTa[idx];
    return daysEn[idx];
  }, [dayName, lang]);

  const defaultTitle = lang === 'te' ? `${currentDay}: తిరుచానూరు పద్మావతి అమ్మవారిని దర్శించుకోండి.` :
                       lang === 'hi' ? `${currentDay}: तिरुचानूर पद्मावती अम्मावारी के दर्शन करें।` :
                       lang === 'ta' ? `${currentDay}: திருச்சானூர் பத்மாவதி தாயாரை தரியுங்கள்.` :
                       `${currentDay}: Visit Goddess Padmavathi at Tiruchanur first.`;
  const displayTitle = guidanceTitle || defaultTitle;

  const defaultQuote = lang === 'te' ? '"ప్రశాంతమైన నమ్మకంతో శ్రీవారిని దర్శించండి"' :
                       lang === 'hi' ? '"शांत भाव से श्रीवारी के दर्शन करें"' :
                       lang === 'ta' ? '"அமைதியான பக்தியுடன் ஸ்ரீவாரியைத் தரிசியுங்கள்"' :
                       '"In calm faith, seek Srivari"';

  const defaultPrimaryPill: GuidancePill = {
    label: lang === 'te' ? 'నేటి విశేషం' : lang === 'hi' ? 'पवित्र क्षेत्र' : lang === 'ta' ? 'புனித தலம்' : 'Sacred Shrine',
    title: lang === 'te' ? 'తిరుచానూరు' : lang === 'hi' ? 'तिरुचानूर' : lang === 'ta' ? 'திருச்சானூர்' : 'Padmavathi Temple',
    url: '/place/padmavathi-temple'
  };

  const defaultSecondaryPill: GuidancePill = {
    label: lang === 'te' ? 'ఉత్తమ మార్గం' : lang === 'hi' ? 'उत्तम मार्ग' : lang === 'ta' ? 'சிறந்த வழி' : 'Best Route',
    title: lang === 'te' ? 'స్థానిక క్షేత్రాలు' : lang === 'hi' ? 'स्थानीय मंदिर' : lang === 'ta' ? 'உள்ளூர் தலங்கள்' : 'Local Shrines',
    url: '/explore'
  };

  const defaultTertiaryPill: GuidancePill = {
    label: lang === 'te' ? 'అనుకూల సమయం' : lang === 'hi' ? 'अनुकूल समय' : lang === 'ta' ? 'உகந்த நேரம்' : 'Optimal Time',
    title: lang === 'te' ? 'ఉదయాన్నే' : lang === 'hi' ? 'प्रातः काल' : lang === 'ta' ? 'அதிகாலை' : 'Early Morning',
    url: '/route'
  };

  const pPill = primaryPill || defaultPrimaryPill;
  const sPill = secondaryPill || defaultSecondaryPill;
  const tPill = tertiaryPill || defaultTertiaryPill;

  const handlePillClick = (pill: GuidancePill) => {
    if (pill.onClick) {
      pill.onClick();
    } else if (pill.url) {
      if (pill.url.startsWith('http')) {
        window.open(pill.url, '_blank', 'noopener,noreferrer');
      } else {
        router.push(pill.url);
      }
    }
  };

  return (
    <div 
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        padding: '16px 18px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        margin: '12px 0'
      }}
    >
      {/* Top Row Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 900, fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase', flexShrink: 0 }}>
          <Sparkles size={15} color="#15803D" />
          <span>SAARTHI GUIDANCE</span>
        </div>
        <span style={{ fontSize: '12px', fontStyle: 'italic', fontWeight: 600, color: '#92400E', textAlign: 'right' }}>
          {quote || defaultQuote}
        </span>
      </div>

      {/* Main Guidance Title */}
      <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
        {displayTitle}
      </h3>

      {/* Three Action Pills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', width: '100%' }}>
        {/* Card 1 (Gold / Sacred Shrine) */}
        <div 
          onClick={() => handlePillClick(pPill)}
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '7px 4px',
            minHeight: '54px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minWidth: 0,
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: '#D97706', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%', marginBottom: '2px' }}>
            <Flame size={12} color="#D97706" style={{ flexShrink: 0 }} />
            <span style={{ color: '#B45309', whiteSpace: 'nowrap' }}>{pPill.label}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#78350F',
            lineHeight: 1.2,
            textAlign: 'center',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            width: '100%'
          }}>
            {pPill.title}
          </span>
        </div>

        {/* Card 2 (Soft Blue / Best Route) */}
        <div 
          onClick={() => handlePillClick(sPill)}
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '7px 4px',
            minHeight: '54px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minWidth: 0,
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: '#2563EB', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%', marginBottom: '2px' }}>
            <Navigation size={12} color="#2563EB" style={{ flexShrink: 0 }} />
            <span style={{ color: '#1D4ED8', whiteSpace: 'nowrap' }}>{sPill.label}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#1E40AF',
            lineHeight: 1.2,
            textAlign: 'center',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            width: '100%'
          }}>
            {sPill.title}
          </span>
        </div>

        {/* Card 3 (Soft Emerald / Optimal Time) */}
        <div 
          onClick={() => handlePillClick(tPill)}
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '7px 4px',
            minHeight: '54px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minWidth: 0,
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: '#059669', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%', marginBottom: '2px' }}>
            <Sparkles size={12} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ color: '#047857', whiteSpace: 'nowrap' }}>{tPill.label}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#065F46',
            lineHeight: 1.2,
            textAlign: 'center',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            width: '100%'
          }}>
            {tPill.title}
          </span>
        </div>
      </div>

      {/* Footer Meta Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: '#64748B', paddingTop: '2px' }}>
        <Sparkles size={13} color="#15803D" />
        <span>{footerNote}</span>
      </div>
    </div>
  );
}

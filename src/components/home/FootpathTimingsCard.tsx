'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Footprints, Clock, ShieldCheck, 
  ChevronRight, AlertCircle, TrendingUp, Luggage
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export function FootpathTimingsCard() {
  const lang = useLanguage();

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      border: '1px solid #D5ECD8',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(10, 78, 51, 0.06)',
      margin: '0px 12px 10px',
      fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ── 1. SACRED GREEN HEADER WITH AUTHENTIC FOOTPATH TRAIL ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #053320 0%, #0A4E33 55%, #0B5C3C 100%)',
        color: '#FFFFFF',
        padding: '14px 16px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Soft natural ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '5%',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Authentic Footpath Stone Steps Photography */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '46%',
          pointerEvents: 'none',
          opacity: 0.9,
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 20%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,1) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 20%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,1) 100%)',
          overflow: 'hidden'
        }}>
          <img
            src="/assets/temples/alipiri-footpath.png"
            alt="Tirumala Sacred Footpath Historic Trail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
              filter: 'contrast(1.05) saturate(1.08)'
            }}
          />
        </div>

        {/* Header Left: Icon & Title Group */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.08))',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.22), 0 2px 6px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Footprints size={18} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <h3 
              className="notranslate" 
              translate="no" 
              style={{
                fontSize: '15.5px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.015em',
                lineHeight: 1.2
              }}
            >
              {lang === 'kn' ? 'ತಿರುಮಲ ಪಾದಯಾತ್ರಾ ಮಾರ್ಗಗಳು' : lang === 'te' ? 'తిరుమల సోపాన మార్గాలు' : 'Footpath Routes'}
            </h3>
            <p 
              className="notranslate" 
              translate="no" 
              style={{
                fontSize: '11px',
                color: 'rgba(236, 253, 245, 0.85)',
                margin: '2px 0 0 0',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{lang === 'kn' ? 'ಕಾಲ್ನಡಿಗೆಯಲ್ಲಿ ತಿರುಮಲ' : lang === 'te' ? 'కాలినడకన తిరుమల' : 'Tirumala by Walk'}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{lang === 'kn' ? 'ದಿವ್ಯ ದರ್ಶನ (DD)' : lang === 'te' ? 'దివ్య దర్శనం (DD)' : 'Divya Darshan (DD)'}</span>
            </p>
          </div>
        </div>

        {/* Header Right: Details Button Pill */}
        <Link 
          href="/footpaths"
          className="notranslate"
          translate="no"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#064E3B',
            textDecoration: 'none',
            backgroundColor: '#FAF7F2',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            padding: '5px 12px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(0, 30, 18, 0.18)',
            flexShrink: 0
          }}
        >
          <span>{lang === 'kn' ? 'ವಿವರಗಳು' : lang === 'te' ? 'వివరాలు' : 'Details'}</span>
          <ChevronRight size={12} strokeWidth={2.8} />
        </Link>
      </div>

      {/* ── 2. TWO ROUTE TILES IN GRID ── */}
      <div style={{
        padding: '12px 10px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '10px'
      }}>
        {/* 1. Srivari Mettu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          background: 'linear-gradient(180deg, #FFFFFF 65%, #F0FDF4 100%)',
          border: '1px solid #D1FAE5',
          borderRadius: '16px',
          padding: '12px 10px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(22, 101, 52, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <TrendingUp size={13} color="#16A34A" strokeWidth={2.6} />
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'kn' ? 'ಶ್ರೀವಾರಿ ಮೆಟ್ಟು' : lang === 'te' ? 'శ్రీవారి మెట్టు' : 'Srivari Mettu'}
                </h4>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#14532D',
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.01em'
              }}>
                {lang === 'kn' ? 'ತೆರೆದಿದೆ' : lang === 'te' ? 'ఓపెన్' : 'Open'}
              </span>
            </div>

            {/* Steps & Duration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '8px' }}>
              <Footprints size={12} color="#16A34A" />
              <span>2,388 {lang === 'kn' ? 'ಮೆಟ್ಟಿಲುಗಳು' : lang === 'te' ? 'మెట్లు' : 'steps'}</span>
              <span>|</span>
              <span>~2 hrs</span>
            </div>

            {/* Time Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#F0F7FF',
              border: '1px solid #E0F2FE',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <Clock size={12} color="#0284C7" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <span>6:00 AM – 5:30 PM</span>
            </div>
          </div>

          {/* Restriction badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#991B1B',
            lineHeight: 1.2
          }}>
            <AlertCircle size={12} color="#DC2626" strokeWidth={2.4} style={{ flexShrink: 0 }} />
            <span>{lang === 'kn' ? '<12 ವರ್ಷ: ಮಧ್ಯಾಹ್ನ 2:00 ವರೆಗೆ' : lang === 'te' ? '<12 ఏళ్లు: 2 PM వరకు' : 'Kids < 12: till 2 PM'}</span>
          </div>
        </div>

        {/* 2. Alipiri Mettu */}
        <div style={{
          backgroundColor: '#FFFFFF',
          background: 'linear-gradient(180deg, #FFFFFF 65%, #FFFBEB 100%)',
          border: '1px solid #FEF3C7',
          borderRadius: '16px',
          padding: '12px 10px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <TrendingUp size={13} color="#D97706" strokeWidth={2.6} />
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                  {lang === 'kn' ? 'ಅಲಿಪಿರಿ ಮೆಟ್ಟು' : lang === 'te' ? 'అలిపిరి మెట్టు' : 'Alipiri Mettu'}
                </h4>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#14532D',
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.01em'
              }}>
                {lang === 'kn' ? 'ತೆರೆದಿದೆ' : lang === 'te' ? 'ఓపెన్' : 'Open'}
              </span>
            </div>

            {/* Steps & Duration */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '8px' }}>
              <Footprints size={12} color="#D97706" />
              <span>3,550 {lang === 'kn' ? 'ಮೆಟ್ಟಿಲುಗಳು' : lang === 'te' ? 'మెట్లు' : 'steps'}</span>
              <span>|</span>
              <span>~4 hrs</span>
            </div>

            {/* Time Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#F0F7FF',
              border: '1px solid #E0F2FE',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#0F172A',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <Clock size={12} color="#0284C7" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <span>5:00 AM – 9:30 PM</span>
            </div>
          </div>

          {/* Facility badges */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#F0FDF4',
              border: '1px solid #DCFCE7',
              color: '#166534',
              borderRadius: '8px',
              padding: '4px 6px',
              fontWeight: 700,
              fontSize: '9.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1.2
            }}>
              <ShieldCheck size={11} color="#059669" strokeWidth={2.4} />
              <span>{lang === 'kn' ? '24/7 ಬೆಳಕಿನ ವ್ಯವಸ್ಥೆ' : '24/7 Lit'}</span>
            </span>
            <span style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#334155',
              borderRadius: '8px',
              padding: '4px 6px',
              fontWeight: 600,
              fontSize: '9.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1.2
            }}>
              <Luggage size={11} color="#475569" strokeWidth={2.2} />
              <span>{lang === 'kn' ? 'ಲಗೇಜ್ ವ್ಯಾನ್' : 'Luggage Van'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

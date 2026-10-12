'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Footprints, Clock, AlertTriangle, ShieldCheck, 
  MapPin, ChevronRight, Baby, Sparkles, Navigation
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export function FootpathTimingsCard() {
  const lang = useLanguage();

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1.5px solid #E2E8F0',
      padding: '16px 16px 14px',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      margin: '8px 14px 12px'
    }}>
      {/* ── CARD HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Footprints size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              {lang === 'te' ? 'తిరుమల సోపాన మార్గాల వేళలు' : 'Tirumala Footpath Routes'}
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              {lang === 'te' ? 'అలిపిరి & శ్రీవారి మెట్టు నడక మార్గాలు' : 'Alipiri & Srivari Mettu Trek Timings'}
            </span>
          </div>
        </div>

        <Link 
          href="/footpaths"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#0F5132',
            textDecoration: 'none',
            backgroundColor: '#F0FDF4',
            padding: '4px 8px',
            borderRadius: '20px',
            border: '1px solid #BBF7D0'
          }}
        >
          <span>{lang === 'te' ? 'వివరాలు' : 'Details'}</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* ── 2-COLUMN ROUTE TILES ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '10px'
      }}>
        {/* 1. Srivari Mettu (Alternative Route) */}
        <div style={{
          backgroundColor: '#FFFDF7',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#B45309',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {lang === 'te' ? 'ప్రత్యామ్నాయ మార్గం' : 'Alternative Route'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                Open
              </span>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#78350F', margin: '0 0 6px', lineHeight: 1.2 }}>
              {lang === 'te' ? 'శ్రీవారి మెట్టు' : 'Srivari Mettu'}
            </h4>

            {/* Time Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#92400E',
              marginBottom: '6px'
            }}>
              <Clock size={12} color="#B45309" />
              <span>6:00 AM – 5:30 PM</span>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              ~2,388 {lang === 'te' ? 'మెట్లు' : 'Steps'} • 1.5–2 hrs
            </div>
          </div>

          {/* Child restriction warning badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '5px 7px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#B91C1C',
            lineHeight: 1.25
          }}>
            <Baby size={12} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>
              {lang === 'te' 
                ? '12 ఏళ్ల లోపు పిల్లలు 2:00 PM తర్వాత అనుమతించబడరు' 
                : '<12 yrs kids not allowed after 2:00 PM'}
            </span>
          </div>
        </div>

        {/* 2. Alipiri Mettu (Traditional Route) */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '14px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {lang === 'te' ? 'ప్రధాన మార్గం' : 'Main Footpath'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                Open
              </span>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px', lineHeight: 1.2 }}>
              {lang === 'te' ? 'అలిపిరి మెట్టు' : 'Alipiri Mettu'}
            </h4>

            {/* Time Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#1E40AF',
              marginBottom: '6px'
            }}>
              <Clock size={12} color="#2563EB" />
              <span>5:00 AM – 9:30 PM</span>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
              ~3,550 {lang === 'te' ? 'మెట్లు' : 'Steps'} • 3.5–4 hrs
            </div>
          </div>

          {/* Facility benefit badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '5px 7px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#15803D',
            lineHeight: 1.25
          }}>
            <ShieldCheck size={12} color="#16A34A" style={{ flexShrink: 0 }} />
            <span>
              {lang === 'te' 
                ? '24 గంటల లైటింగ్ & లగేజీ రవాణా' 
                : 'Covered canopy & free luggage van'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

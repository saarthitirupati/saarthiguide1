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
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
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
            fontWeight: 600,
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
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(30, 35, 45, 0.08)',
          borderRadius: '14px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {lang === 'te' ? 'ప్రత్యామ్నాయ మార్గం' : 'Alternative Route'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#166534',
                backgroundColor: '#DCFCE7',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                Open
              </span>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.2 }}>
              {lang === 'te' ? 'శ్రీవారి మెట్టు' : 'Srivari Mettu'}
            </h4>

            {/* Scannable meta line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginBottom: '6px' }}>
              <span>~2,388 {lang === 'te' ? 'మెట్లు' : 'steps'}</span>
              <span>•</span>
              <span>1.5–2 hrs</span>
            </div>

            {/* Time Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#F8FAFC',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              borderRadius: '8px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              <Clock size={12} color="#64748B" />
              <span>6:00 AM – 5:30 PM</span>
            </div>
          </div>

          {/* Calm constraint badge */}
          <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#991B1B',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: '999px',
              padding: '3px 7px',
              fontWeight: 600,
              fontSize: '9.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1.2
            }}>
              <Baby size={11} color="#DC2626" />
              <span>{lang === 'te' ? '<12 ఏళ్లు 2 PM వరకు' : 'No kids <12 after 2 PM'}</span>
            </span>
          </div>
        </div>

        {/* 2. Alipiri Mettu (Traditional Route) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(30, 35, 45, 0.08)',
          borderRadius: '14px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {lang === 'te' ? 'ప్రధాన మార్గం' : 'Main Footpath'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#166534',
                backgroundColor: '#DCFCE7',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                Open
              </span>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.2 }}>
              {lang === 'te' ? 'అలిపిరి మెట్టు' : 'Alipiri Mettu'}
            </h4>

            {/* Scannable meta line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#64748B', fontWeight: 500, marginBottom: '6px' }}>
              <span>~3,550 {lang === 'te' ? 'మెట్లు' : 'steps'}</span>
              <span>•</span>
              <span>3.5–4 hrs</span>
            </div>

            {/* Time Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#F8FAFC',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              borderRadius: '8px',
              padding: '4px 7px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              <Clock size={12} color="#64748B" />
              <span>5:00 AM – 9:30 PM</span>
            </div>
          </div>

          {/* Calm visual facility badges */}
          <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.08)',
              color: '#065F46',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '999px',
              padding: '3px 7px',
              fontWeight: 600,
              fontSize: '9.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1.2
            }}>
              <ShieldCheck size={11} color="#059669" />
              <span>24/7 Lit</span>
            </span>
            <span style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#475569',
              borderRadius: '999px',
              padding: '3px 7px',
              fontWeight: 500,
              fontSize: '9.5px',
              lineHeight: 1.2
            }}>
              Luggage Van
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

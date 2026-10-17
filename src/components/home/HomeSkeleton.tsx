'use client';

import React from 'react';

export function HomeSkeleton() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', width: '100%', padding: '14px', boxSizing: 'border-box' }}>
      {/* Top Header & Greeting Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px' }}>
        <div>
          <div className="shimmer-wave" style={{ width: '120px', height: '14px', borderRadius: '6px', marginBottom: '6px' }}></div>
          <div className="shimmer-wave" style={{ width: '180px', height: '22px', borderRadius: '8px' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
      </div>

      {/* Layer 1: HomeHero Recommendation Card Skeleton */}
      <div style={{ width: '100%', minHeight: '190px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #ECE9E3', padding: '16px', boxSizing: 'border-box', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="shimmer-wave" style={{ width: '100px', height: '18px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ width: '70px', height: '18px', borderRadius: '12px' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '85%', height: '20px', borderRadius: '6px', marginBottom: '8px' }}></div>
        <div className="shimmer-wave" style={{ width: '60%', height: '14px', borderRadius: '6px', marginBottom: '16px' }}></div>
        <div className="shimmer-wave" style={{ width: '100%', height: '44px', borderRadius: '14px' }}></div>
      </div>

      {/* Layer 2: QuickChecklist / SSD Token Card Skeleton */}
      <div style={{ width: '100%', minHeight: '140px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #ECE9E3', padding: '14px', boxSizing: 'border-box', marginBottom: '10px' }}>
        <div className="shimmer-wave" style={{ width: '130px', height: '16px', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
        </div>
      </div>

      {/* Layer 2.05: Footpath Timings Card Skeleton */}
      <div style={{ width: '100%', height: '78px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '14px 16px', boxSizing: 'border-box', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="shimmer-wave" style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0 }}></div>
          <div style={{ flex: 1 }}>
            <div className="shimmer-wave" style={{ width: '150px', height: '14px', borderRadius: '4px', marginBottom: '6px' }}></div>
            <div className="shimmer-wave" style={{ width: '190px', height: '11px', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      {/* Layer 2.1: Vaikunta Ekadasi Banner Skeleton */}
      <div style={{ width: '100%', height: '118px', backgroundColor: '#132A1C', borderRadius: '22px', border: '1px solid rgba(200, 155, 60, 0.35)', padding: '16px 18px', boxSizing: 'border-box', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div className="shimmer-wave" style={{ width: '110px', height: '10px', borderRadius: '4px', marginBottom: '8px', backgroundColor: 'rgba(254, 240, 138, 0.15)' }}></div>
          <div className="shimmer-wave" style={{ width: '160px', height: '17px', borderRadius: '6px', marginBottom: '10px', backgroundColor: 'rgba(254, 240, 138, 0.2)' }}></div>
          <div className="shimmer-wave" style={{ width: '130px', height: '24px', borderRadius: '14px', backgroundColor: 'rgba(254, 240, 138, 0.2)' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '70px', height: '80px', borderRadius: '12px', backgroundColor: 'rgba(254, 240, 138, 0.15)' }}></div>
      </div>

      {/* Layer 2.5: Yatra Essentials Compliance Checklist Skeleton */}
      <div style={{ width: '100%', height: '56px', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(15, 23, 42, 0.08)', padding: '12px 14px', boxSizing: 'border-box', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="shimmer-wave" style={{ width: '24px', height: '24px', borderRadius: '6px' }}></div>
          <div className="shimmer-wave" style={{ width: '120px', height: '14px', borderRadius: '4px' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '42px', height: '20px', borderRadius: '10px' }}></div>
      </div>

      {/* Layer 3: Primary Services 2x2 Grid Skeleton */}
      <div style={{ marginBottom: '16px' }}>
        <div className="shimmer-wave" style={{ width: '140px', height: '18px', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
        </div>
      </div>
    </div>
  );
}

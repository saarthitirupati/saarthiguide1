'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Smartphone, Share, PlusSquare, ArrowRight, ShieldCheck, 
  Compass, ExternalLink, Download, CheckCircle2, ChevronRight,
  Info, QrCode as QrCodeIcon, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export default function AppLandingPage() {
  const lang = useLanguage();

  // Device detection state (client-only to prevent hydration mismatch)
  const [mounted, setMounted] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
    const isAndroidDevice = /Android/i.test(ua);

    // Detect common in-app WebViews (Instagram, FB, WhatsApp, Line, Twitter, etc.)
    const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|MicroMessenger/i.test(ua) ||
      (!isIOSDevice && /wv/i.test(ua));
    setIsInAppBrowser(inApp);

    if (isIOSDevice) {
      setDeviceType('ios');
    } else if (isAndroidDevice) {
      setDeviceType('android');
      // If Android and not in-app webview, attempt prompt or direct play store intent
      const playUrl = 'https://play.google.com/store/apps/details?id=in.saarthiguide.travel';
      const marketUrl = 'market://details?id=in.saarthiguide.travel';

      // Check if user came with auto-redirect query or direct intent
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auto') === '1' && !inApp) {
        window.location.href = marketUrl;
        setTimeout(() => {
          window.location.href = playUrl;
        }, 1200);
      }
    } else {
      setDeviceType('desktop');
      // Generate QR code pointing to this exact URL for mobile scan
      const currentUrl = 'https://www.saarthiguide.in/app';
      QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#022819',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Failed to generate QR Code:', err);
      });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F5',
      color: '#0F172A',
      fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif',
      paddingBottom: '80px'
    }}>
      {/* ── TOP HERO BANNER ── */}
      <header style={{
        background: 'linear-gradient(135deg, #022819 0%, #064E3B 100%)',
        color: '#FFFFFF',
        padding: '36px 20px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '3px solid #C89B3C'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'rgba(200, 155, 60, 0.12)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(200, 155, 60, 0.18)',
            border: '1px solid rgba(200, 155, 60, 0.4)',
            color: '#FDE047',
            padding: '5px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            <ShieldCheck size={14} color="#C89B3C" />
            <span>{lang === 'te' ? 'అధికారిక యాత్రా సహాయకి' : 'Official Pilgrim Companion'}</span>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            {lang === 'te' ? 'సారథిని మీ మొబైల్‌లో పొందండి' : 'Install Saarthi on Your Device'}
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#D1FAE5',
            margin: 0,
            lineHeight: 1.5,
            fontWeight: 500
          }}>
            {lang === 'te' 
              ? 'ప్రత్యక్ష తిరుమల దర్శనం సమయాలు, ఉచిత టోకెన్ స్థితి & ఆఫ్‌లైన్ మ్యాప్‌లు — ప్రకటనలు లేని ఉచిత సేవ.'
              : 'Real-time TTD darshan wait times, SSD token status & precinct maps — 100% free with no ads.'}
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{
        maxWidth: '520px',
        margin: '-24px auto 0',
        padding: '0 16px',
        position: 'relative',
        zIndex: 2
      }}>

        {/* ── 1. IPHONE / IPAD VIEW ── */}
        {mounted && deviceType === 'ios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* In-App Browser Warning Alert */}
            {isInAppBrowser && (
              <div style={{
                background: '#FEF3C7',
                border: '1.5px solid #F59E0B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
              }}>
                <AlertTriangle size={20} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
                    {lang === 'te' ? 'సఫారీ (Safari) బ్రౌజర్‌లో తెరవండి' : 'Open in Safari to Install'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#B45309', marginTop: '2px', lineHeight: 1.4 }}>
                    {lang === 'te'
                      ? 'మీరు ఇన్‌స్టాగ్రామ్ లేదా వాట్సాప్ బ్రౌజర్‌లో ఉన్నారు. పైన లేదా కింద ఉన్న ••• నొక్కి "Open in Safari" ఎంచుకోండి.'
                      : 'You are using an in-app browser. Tap ••• or the Share button and select "Open in Safari" to add to Home Screen.'}
                  </div>
                </div>
              </div>
            )}

            {/* iOS PWA Step-by-Step Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '22px 20px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#022819',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C89B3C',
                  flexShrink: 0
                }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#0F172A' }}>
                    {lang === 'te' ? 'ఐఫోన్ హోమ్ స్క్రీన్‌కు జోడించే విధానం' : 'Add to iPhone Home Screen'}
                  </h2>
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                    {lang === 'te' ? 'యాప్ స్టోర్ లేకుండా ఉచితంగా ఇన్‌స్టాల్ చేసుకోండి' : 'Free direct install — No App Store fee or account needed'}
                  </span>
                </div>
              </div>

              {/* Steps Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Step 1 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  borderRadius: '14px'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Share size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                      {lang === 'te' ? '1. షేర్ బటన్ [↑] నొక్కండి' : '1. Tap Safari Share [ ↑ ]'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                      {lang === 'te' ? 'సఫారీ బ్రౌజర్ దిగువ బార్‌లో షేర్ ఐకాన్ ఉంటుంది' : 'Located at the bottom center of your Safari screen'}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  padding: '12px 14px',
                  borderRadius: '14px'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <PlusSquare size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#14532D' }}>
                      {lang === 'te' ? '2. "Add to Home Screen" [+] నొక్కండి' : '2. Tap "Add to Home Screen"'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '1px' }}>
                      {lang === 'te' ? 'ఆప్షన్స్ క్రిందికి స్క్రోల్ చేసి [+] ఎంచుకోండి' : 'Scroll down the share sheet and tap [+] Add'}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#FAF5FF',
                  border: '1px solid #E9D5FF',
                  padding: '12px 14px',
                  borderRadius: '14px'
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: '#F3E8FF',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#581C87' }}>
                      {lang === 'te' ? '3. పై కుడి మూలలో "Add" నొక్కండి' : '3. Tap "Add" on Top Right'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#6B21A8', marginTop: '1px' }}>
                      {lang === 'te' ? 'సారథి మీ హోమ్ స్క్రీన్‌పై యాప్‌గా సిద్ధమవుతుంది' : 'Instant full-screen launch without browser bars'}
                    </div>
                  </div>
                </div>
              </div>

              {/* iOS Feature Badges */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#334155', fontWeight: 700 }}>
                  <CheckCircle2 size={14} color="#0F5132" />
                  <span>Full Screen Launch</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#334155', fontWeight: 700 }}>
                  <CheckCircle2 size={14} color="#0F5132" />
                  <span>Zero Storage Space</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#334155', fontWeight: 700 }}>
                  <CheckCircle2 size={14} color="#0F5132" />
                  <span>Push Alerts (iOS 16.4+)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#334155', fontWeight: 700 }}>
                  <CheckCircle2 size={14} color="#0F5132" />
                  <span>Cached Maps Guide</span>
                </div>
              </div>
            </div>

            {/* Quick Open Web Link */}
            <Link 
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#0F172A',
                padding: '13px',
                borderRadius: '14px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13.5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <Compass size={17} color="#0F5132" />
              <span>{lang === 'te' ? 'ఇన్‌స్టాల్ చేయకుండా వెబ్‌సైట్‌ను చూడండి' : 'Open Saarthi in Safari Directly →'}</span>
            </Link>

          </div>
        )}

        {/* ── 2. ANDROID VIEW ── */}
        {mounted && deviceType === 'android' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#022819',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C89B3C',
                margin: '0 auto 14px'
              }}>
                <Download size={26} />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                {lang === 'te' ? 'గూగుల్ ప్లే స్టోర్ నుండి ఇన్‌స్టాల్ చేసుకోండి' : 'Get Saarthi on Google Play'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px', lineHeight: 1.4 }}>
                {lang === 'te' 
                  ? 'ఆండ్రాయిడ్ కోసం అధికారిక ప్లే స్టోర్ యాప్ ఉచితంగా లభిస్తుంది.'
                  : 'Official verified app on Google Play Store with automated updates.'}
              </p>

              <a
                href="market://details?id=in.saarthiguide.travel"
                onClick={(e) => {
                  // Fallback to web link if market:// isn't resolved
                  setTimeout(() => {
                    window.location.href = 'https://play.google.com/store/apps/details?id=in.saarthiguide.travel';
                  }, 800);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #022819 0%, #064E3B 100%)',
                  color: '#FFFFFF',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  boxShadow: '0 4px 14px rgba(2, 40, 25, 0.3)',
                  border: '1px solid #C89B3C'
                }}
              >
                <Download size={18} color="#C89B3C" />
                <span>{lang === 'te' ? 'ప్లే స్టోర్‌లో తెరవండి (Install)' : 'Open in Google Play Store'}</span>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=in.saarthiguide.travel"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '14px',
                  fontSize: '12px',
                  color: '#2563EB',
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                <span>Browser Play Store Link</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Quick Open Web Link */}
            <Link 
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#0F172A',
                padding: '13px',
                borderRadius: '14px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13.5px'
              }}
            >
              <Compass size={17} color="#0F5132" />
              <span>{lang === 'te' ? 'ఇన్‌స్టాల్ చేయకుండా వెబ్‌సైట్‌ను చూడండి' : 'Continue to Website Directly →'}</span>
            </Link>
          </div>
        )}

        {/* ── 3. DESKTOP VIEW (QR CODE SCAN) ── */}
        {mounted && deviceType === 'desktop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0F5132',
                background: '#DCFCE7',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                <QrCodeIcon size={14} />
                <span>Instant Mobile Pairing</span>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                Scan with iPhone or Android
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px', lineHeight: 1.4 }}>
                Point your phone camera to install Saarthi on your mobile screen.
              </p>

              {/* QR Code Canvas / Img */}
              <div style={{
                display: 'inline-block',
                padding: '12px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Saarthi App Install QR Code" 
                    width={200} 
                    height={200}
                    style={{ display: 'block', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ width: '200px', height: '200px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCodeIcon size={48} color="#94A3B8" />
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '18px',
                fontSize: '12px',
                color: '#475569',
                fontWeight: 700
              }}>
                <span>✓ iOS (Safari PWA)</span>
                <span>•</span>
                <span>✓ Android (Google Play)</span>
              </div>
            </div>

            {/* Quick Open Web Link */}
            <Link 
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#022819',
                border: '1px solid #C89B3C',
                color: '#FFFFFF',
                padding: '13px',
                borderRadius: '14px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13.5px'
              }}
            >
              <Compass size={17} color="#C89B3C" />
              <span>Explore Saarthi in Web Browser →</span>
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
// @ts-expect-error - react-dom types not included in devDependencies
import { createPortal } from 'react-dom';
import { Languages, X, Check } from 'lucide-react';
import { useLanguage, setAppLanguage, type AppLang } from '@/lib/useLanguage';

interface LanguageOption {
  code: AppLang;
  badge: string;
  nativeName: string;
  englishLabel: string;
  subText: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', badge: 'Aa', nativeName: 'English', englishLabel: 'English', subText: 'Default App Language' },
  { code: 'te', badge: 'అ', nativeName: 'తెలుగు', englishLabel: 'Telugu', subText: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
  { code: 'kn', badge: 'ಅ', nativeName: 'ಕನ್ನಡ', englishLabel: 'Kannada', subText: 'ಕರ್ನಾಟಕ ಮತ್ತು ಬೆಂಗಳೂರು' },
  { code: 'hi', badge: 'अ', nativeName: 'हिंदी', englishLabel: 'Hindi', subText: 'भारत की राजभाषा' },
  { code: 'ta', badge: 'அ', nativeName: 'தமிழ்', englishLabel: 'Tamil', subText: 'தமிழ்நாடு & புதுச்சேரி' }
];

export interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguagePickerModal({ isOpen, onClose }: LanguagePickerModalProps) {
  const currentLang = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and support Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSelectLanguage = (code: AppLang) => {
    if (code === currentLang) {
      onClose();
      return;
    }
    // setAppLanguage saves to localStorage ('saarthi_user_language') and reloads cleanly
    setAppLanguage(code);
  };

  const modalTitle = currentLang === 'te' 
    ? 'భాషను ఎంచుకోండి' 
    : currentLang === 'hi' 
    ? 'भाषा चुनें' 
    : currentLang === 'ta' 
    ? 'மொழியைத் தேர்ந்தெடுக்கவும்' 
    : 'Choose Language';

  const modalSubtitle = currentLang === 'te'
    ? 'మీకు అనుకూలమైన భాషను ఎంచుకోండి'
    : currentLang === 'hi'
    ? 'अपनी पसंदीदा भाषा चुनें'
    : currentLang === 'ta'
    ? 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்'
    : 'Select your preferred app language';

  return createPortal(
    <div 
      className="saarthi-lang-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-picker-title"
    >
      <style>{`
        @keyframes saarthiModalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes saarthiSheetSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .saarthi-lang-card {
          animation: saarthiModalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 640px) {
          .saarthi-lang-backdrop {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .saarthi-lang-card {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            border-top-left-radius: 22px !important;
            border-top-right-radius: 22px !important;
            max-width: 100% !important;
            animation: saarthiSheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
      `}</style>

      <div 
        className="saarthi-lang-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#DCFCE7',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Languages size={18} color="#047857" strokeWidth={2.2} />
            </div>
            <div>
              <h3 
                id="language-picker-title" 
                style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}
              >
                {modalTitle}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                {modalSubtitle}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              transition: 'background 0.15s ease'
            }}
            aria-label="Close language selector"
          >
            <X size={16} />
          </button>
        </div>

        {/* Language Options List */}
        <div 
          role="listbox" 
          aria-label={modalTitle}
          style={{
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: 'min(70vh, 480px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectLanguage(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: isSelected ? '#F0FDF4' : '#FFFFFF',
                  border: isSelected ? '1.5px solid #059669' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 2px 6px rgba(5, 150, 105, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: isSelected ? '#DCFCE7' : '#F8FAFC',
                    border: isSelected ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: isSelected ? '#047857' : '#475569',
                    flexShrink: 0
                  }}>
                    {lang.badge}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: isSelected ? '#065F46' : '#0F172A' }}>
                        {lang.nativeName}
                      </span>
                      {lang.code !== 'en' && (
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                          ({lang.englishLabel})
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: isSelected ? '#047857' : '#64748B', display: 'block', marginTop: '1px' }}>
                      {lang.subText}
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isSelected ? '#059669' : '#FFFFFF',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginLeft: '8px',
                  transition: 'all 0.15s ease'
                }}>
                  {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}


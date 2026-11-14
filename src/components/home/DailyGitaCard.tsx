'use client';

import React, { useState } from 'react';
import { BookOpen, Share2, Sparkles, Check, HeartHandshake, Volume2, VolumeX } from 'lucide-react';
import { getDailyGitaShloka, GitaShloka } from '@/data/bhagavadGita';
import { useLanguage } from '@/lib/useLanguage';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { playSaarthiSonicIdent } from '@/lib/audioIdentity';

interface DailyGitaCardProps {
  date?: Date;
  variant?: 'mobile' | 'desktop';
  embedded?: boolean;
}

export function DailyGitaCard({ date, variant = 'desktop', embedded = false }: DailyGitaCardProps) {
  const lang = useLanguage();
  const shloka: GitaShloka = getDailyGitaShloka(date);
  
  const getInitialScript = (l: string): 'te' | 'kn' | 'ta' | 'sa' | 'en' => {
    if (l === 'te') return 'te';
    if (l === 'kn') return 'kn';
    if (l === 'ta') return 'ta';
    if (l === 'hi') return 'sa';
    return 'en';
  };

  const [script, setScript] = useState<'te' | 'kn' | 'ta' | 'sa' | 'en'>(getInitialScript(lang));

  React.useEffect(() => {
    setScript(getInitialScript(lang));
  }, [lang]);

  const activeShlokaText = script === 'en' ? shloka.transliteration
    : script === 'sa' ? shloka.shlokaSanskrit
    : script === 'te' ? shloka.shlokaTelugu
    : script === 'kn' ? (shloka.shlokaKannada || shloka.shlokaTelugu)
    : (shloka.shlokaTamil || shloka.shlokaSanskrit);

  const localizedRef = lang === 'te' ? shloka.referenceTe
    : lang === 'kn' ? (shloka.referenceKn || shloka.referenceEn)
    : lang === 'hi' ? (shloka.referenceHi || shloka.referenceEn)
    : lang === 'ta' ? (shloka.referenceTa || shloka.referenceEn)
    : shloka.referenceEn;

  const localizedMeaning = lang === 'te' ? shloka.meaningTe
    : lang === 'kn' ? (shloka.meaningKn || shloka.meaningEn)
    : lang === 'hi' ? (shloka.meaningHi || shloka.meaningEn)
    : lang === 'ta' ? (shloka.meaningTa || shloka.meaningEn)
    : shloka.meaningEn;

  const localizedReflection = lang === 'te' ? shloka.pilgrimReflectionTe
    : lang === 'kn' ? (shloka.pilgrimReflectionKn || shloka.pilgrimReflectionEn)
    : lang === 'hi' ? (shloka.pilgrimReflectionHi || shloka.pilgrimReflectionEn)
    : lang === 'ta' ? (shloka.pilgrimReflectionTa || shloka.pilgrimReflectionEn)
    : shloka.pilgrimReflectionEn;

  const localizedTheme = lang === 'te' ? shloka.themeTe
    : lang === 'kn' ? (shloka.themeKn || shloka.themeEn)
    : lang === 'hi' ? (shloka.themeHi || shloka.themeEn)
    : lang === 'ta' ? (shloka.themeTa || shloka.themeEn)
    : shloka.themeEn;

  const [activeTab, setActiveTab] = useState<'meaning' | 'practice'>('meaning');
  const [copied, setCopied] = useState(false);
  const [streak, setStreak] = useState(1);
  const { isSpeaking, toggleSpeak, stop } = useSpeechSynthesis();

  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const lastRead = localStorage.getItem('saarthi_gita_last_read');
      const currentStreak = parseInt(localStorage.getItem('saarthi_gita_streak') || '1', 10);
      const todayStr = new Date().toISOString().slice(0, 10);

      if (lastRead === todayStr) {
        setStreak(currentStreak);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        const newStreak = lastRead === yesterdayStr ? currentStreak + 1 : 1;
        localStorage.setItem('saarthi_gita_last_read', todayStr);
        localStorage.setItem('saarthi_gita_streak', newStreak.toString());
        setStreak(newStreak);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleAudioPlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      playSaarthiSonicIdent(true);
      const textToRecite = activeShlokaText;
      const speechLang = script === 'te' ? 'te-IN'
        : script === 'kn' ? 'kn-IN'
        : script === 'ta' ? 'ta-IN'
        : script === 'sa' ? 'sa-IN'
        : 'en-IN';
      const speechMode = script === 'sa' ? 'sanskrit' : 'devotional';
      toggleSpeak(textToRecite, {
        lang: speechLang,
        mode: speechMode,
        fallbackText: shloka.transliteration
      });
    }
  };

  const handleShare = async () => {
    const textToShare = `*${
      lang === 'te' ? 'శ్రీమద్భగవద్గీత నిత్య శ్లోకం'
      : lang === 'kn' ? 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ ನಿತ್ಯ ಶ್ಲೋಕ'
      : lang === 'hi' ? 'श्रीमद्भगवद्गीता नित्य श्लोक'
      : lang === 'ta' ? 'ஸ்ரீமத் பகவத் கீதை தினசரி ஸ்லோகம்'
      : 'Daily Bhagavad Gita Shloka'
    }*\n${localizedRef}\n\n"${activeShlokaText}"\n\n• ${lang === 'te' ? 'భావం' : lang === 'kn' ? 'ಭಾವಾರ್ಥ' : lang === 'hi' ? 'भावार्थ' : lang === 'ta' ? 'பொருள்' : 'Meaning'}:\n${localizedMeaning}\n\n• ${lang === 'te' ? 'యాత్ర సాధన' : lang === 'kn' ? 'ಯಾತ್ರಾ ಚಿಂತನೆ' : lang === 'hi' ? 'यात्रा साधना' : lang === 'ta' ? 'யாத்திரை சிந்தனை' : 'Pilgrim Reflection'}:\n${localizedReflection}\n\n— Saarthi Tirumala Yatra Companion (saarthiguide.in)`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Bhagavad Gita Shloka - Saarthi Guide',
          text: textToShare,
          url: 'https://www.saarthiguide.in'
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="notranslate"
      translate="no"
      style={embedded ? {
        position: 'relative',
        width: '100%'
      } : {
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF5 50%, #FEF9C3 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '20px',
        padding: variant === 'desktop' ? '18px 20px' : '14px 16px',
        boxShadow: '0 4px 18px rgba(217, 119, 6, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Golden Ambient Watermark (Only if standalone) */}
      {!embedded && (
        <div
          style={{
            position: 'absolute',
            right: '-12px',
            bottom: '-16px',
            fontSize: '110px',
            color: 'rgba(217, 119, 6, 0.04)',
            fontWeight: 700,
            fontFamily: 'serif',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1
          }}
        >
          ॐ
        </div>
      )}

      {/* ── HEADER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              border: '1px solid #FCD34D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(217, 119, 6, 0.1)',
              flexShrink: 0
            }}
          >
            <BookOpen size={15} color="#B45309" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
                {lang === 'te' ? 'భగవద్గీత నిత్య శ్లోకం'
                 : lang === 'kn' ? 'ಭಗವದ್ಗೀತಾ ನಿತ್ಯ ಶ್ಲೋಕ'
                 : lang === 'hi' ? 'भगवद्गीता नित्य श्लोक'
                 : lang === 'ta' ? 'பகவத் கீதை தினசரி ஸ்லோகம்'
                 : 'Daily Gita Shloka'}
              </span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#78350F',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                padding: '1px 6px',
                borderRadius: '7px',
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
              }}>
                {streak} {
                  lang === 'te' ? 'రోజు సాధన'
                  : lang === 'kn' ? 'ದಿನ ಸಾಧನೆ'
                  : lang === 'hi' ? 'दिन साधना'
                  : lang === 'ta' ? 'நாள் சாதனை'
                  : (streak === 1 ? 'Day Streak' : 'Days Streak')
                }
              </span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', marginTop: '1px' }}>
              {localizedRef}
            </div>
          </div>
        </div>

        {/* Sleek Segmented Script Selector Tabs (All 5 Scripts) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FCD34D',
            borderRadius: '9px',
            padding: '2px',
            gap: '2px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            marginLeft: 'auto'
          }}
        >
          {[
            { id: 'te', label: 'తెలుగు' },
            { id: 'kn', label: 'ಕನ್ನಡ' },
            { id: 'ta', label: 'தமிழ்' },
            { id: 'sa', label: 'संस्कृतम्' },
            { id: 'en', label: 'English' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setScript(tab.id as any)}
              style={{
                background: script === tab.id ? '#D97706' : 'transparent',
                color: script === tab.id ? '#FFFFFF' : '#78350F',
                border: 'none',
                borderRadius: '7px',
                padding: '2px 6px',
                fontSize: '9.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SACRED SHLOKA BOX ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '12px 14px',
          marginBottom: '10px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: script === 'en' ? '12.5px' : '14px',
            fontWeight: 600,
            color: '#78350F',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            fontFamily: script === 'en' ? 'inherit' : 'serif'
          }}
        >
          {activeShlokaText}
        </p>
      </div>

      {/* ── MEANING SUMMARY ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #FCD34D',
        borderRadius: '12px',
        padding: '10px 12px',
        marginBottom: '10px'
      }}>
        <p style={{ fontSize: '12px', color: '#78350F', margin: 0, lineHeight: '1.45', fontWeight: 700 }}>
          {localizedMeaning}
        </p>
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          borderTop: '1px dashed #FDE68A',
          paddingTop: '10px',
          gap: '8px'
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: '#B45309',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            padding: '2.5px 8px',
            borderRadius: '6px'
          }}
        >
          {localizedTheme}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Primary Action: Solid Warm Accent Fill */}
          <button
            onClick={handleAudioPlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: isSpeaking ? '#FDE68A' : '#FEF3C7',
              border: `1.5px solid ${isSpeaking ? '#B45309' : '#F59E0B'}`,
              borderRadius: '10px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#92400E',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(217, 119, 6, 0.1)',
              transition: 'all 0.15s ease'
            }}
          >
            {isSpeaking ? <VolumeX size={13} color="#DC2626" /> : <Volume2 size={13} color="#D97706" />}
            <span>
              {isSpeaking ? (
                lang === 'te' ? 'ఆపండి'
                : lang === 'kn' ? 'ನಿಲ್ಲಿಸಿ'
                : lang === 'hi' ? 'रोकें'
                : lang === 'ta' ? 'நிறுத்த'
                : 'Stop Audio'
              ) : (
                lang === 'te' ? 'శ్లోకం వినండి'
                : lang === 'kn' ? 'ಶ್ಲೋಕ ಕೇಳಿ'
                : lang === 'hi' ? 'श्लोक सुनें'
                : lang === 'ta' ? 'ஸ்லோகம் கேட்க'
                : 'Listen Shloka'
              )}
            </span>
          </button>

          {/* Secondary Action: Clean Outline Pill */}
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FCD34D',
              borderRadius: '10px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#92400E',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'background 0.15s ease'
            }}
          >
            {copied ? <Check size={12} color="#059669" /> : <Share2 size={12} color="#D97706" />}
            <span>
              {copied ? (
                lang === 'te' ? 'కాపీ చేయబడింది!'
                : lang === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!'
                : lang === 'hi' ? 'कॉपी हो गया!'
                : lang === 'ta' ? 'நகலெடுக்கப்பட்டது!'
                : 'Copied!'
              ) : (
                lang === 'te' ? 'శ్లోకం షేర్ చేయండి'
                : lang === 'kn' ? 'ಶ್ಲೋಕ ಹಂಚಿಕೊಳ್ಳಿ'
                : lang === 'hi' ? 'श्लोक साझा करें'
                : lang === 'ta' ? 'ஸ்லோகம் பகிர்க'
                : 'Share Shloka'
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Sparkles, Flame, Share2, Compass, Volume2, VolumeX } from 'lucide-react';
import { getTodaysCompanion, TodaysCompanionData } from '@/data/dailySpiritualEngine';
import { ShareableQuoteCardModal } from './ShareableQuoteCardModal';
import { DailyGitaCard } from './DailyGitaCard';
import { useLanguage } from '@/lib/useLanguage';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { playSaarthiSonicIdent } from '@/lib/audioIdentity';

const TEXTS = {
  en: {
    todaysCompanion: "Today's Companion",
    didYouKnow: 'Did You Know?',
    share: 'Share',
    listen: 'Listen',
    stop: 'Stop'
  },
  te: {
    todaysCompanion: 'నేటి సహచరి',
    didYouKnow: 'మీకు తెలుసా?',
    share: 'షేర్ చేయండి',
    listen: 'వినండి',
    stop: 'ఆపండి'
  },
  hi: {
    todaysCompanion: 'आज का साथी',
    didYouKnow: 'क्या आप जानते हैं?',
    share: 'साझा करें',
    listen: 'सुनें',
    stop: 'रोकें'
  },
  ta: {
    todaysCompanion: 'இன்றைய துணை',
    didYouKnow: 'உங்களுக்கு தெரியுமா?',
    share: 'பகிரவும்',
    listen: 'கேட்க',
    stop: 'நிறுத்த'
  },
  kn: {
    todaysCompanion: 'ಇಂದಿನ ಒಡನಾಡಿ',
    didYouKnow: 'ನಿಮಗೆ ತಿಳಿದಿದೆಯೇ?',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ'
  }
};

export function DailyContent(props: any) {
  const { dailyContent, liveStatus, todayFestival, variant = 'mobile' } = props;
  const isDesktop = variant === 'desktop';
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;

  // Compute companion data — priority: API > engine with live context
  const companionData: TodaysCompanionData = useMemo(() => {
    if (dailyContent?.todaysCompanion) {
      return dailyContent.todaysCompanion;
    }
    return getTodaysCompanion(new Date(), liveStatus, 'general', todayFestival);
  }, [dailyContent, liveStatus, todayFestival]);

  const localizedTheme = lang === 'te' ? (companionData.themeTe || companionData.theme)
    : lang === 'kn' ? (companionData.themeKn || companionData.theme)
    : lang === 'hi' ? (companionData.themeHi || companionData.theme)
    : lang === 'ta' ? (companionData.themeTa || companionData.theme)
    : companionData.theme;

  const localizedPriorityReason = lang === 'te' ? (companionData.priorityReasonTe || companionData.priorityReason)
    : lang === 'kn' ? (companionData.priorityReasonKn || companionData.priorityReason)
    : lang === 'hi' ? (companionData.priorityReasonHi || companionData.priorityReason)
    : lang === 'ta' ? (companionData.priorityReasonTa || companionData.priorityReason)
    : companionData.priorityReason;

  const localizedQuote = lang === 'te' ? (companionData.divineMoment.quoteTe || companionData.divineMoment.quote)
    : lang === 'kn' ? (companionData.divineMoment.quoteKn || companionData.divineMoment.quote)
    : lang === 'hi' ? (companionData.divineMoment.quoteHi || companionData.divineMoment.quote)
    : lang === 'ta' ? (companionData.divineMoment.quoteTa || companionData.divineMoment.quote)
    : companionData.divineMoment.quote;

  const localizedAuthor = lang === 'te' ? (companionData.divineMoment.authorTe || companionData.divineMoment.author)
    : lang === 'kn' ? (companionData.divineMoment.authorKn || companionData.divineMoment.author)
    : lang === 'hi' ? (companionData.divineMoment.authorHi || companionData.divineMoment.author)
    : lang === 'ta' ? (companionData.divineMoment.authorTa || companionData.divineMoment.author)
    : companionData.divineMoment.author;

  const localizedDuration = lang === 'te' ? (companionData.divineMoment.durationTe || '30-సెకన్ల ధ్యానం')
    : lang === 'kn' ? (companionData.divineMoment.durationKn || '30-ಸೆಕೆಂಡ್ ಚಿಂತನೆ')
    : lang === 'hi' ? (companionData.divineMoment.durationHi || '30-सेकंड चिंतन')
    : lang === 'ta' ? (companionData.divineMoment.durationTa || '30-விநாடி சிந்தனை')
    : '30-Sec Reflection';

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isSpeaking, toggleSpeak, stop } = useSpeechSynthesis();

  const handleAudioPlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      playSaarthiSonicIdent(true);
      const speechLang = lang === 'te' ? 'te-IN' : lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
      toggleSpeak(localizedQuote, { lang: speechLang, mode: 'explainer' });
    }
  };

  // Priority badge colour
  const priorityColors = {
    1: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' }, // Festival — red
    2: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' }, // Temple day — orange
    3: { bg: '#FFFBEB', border: '#FDE68A', text: '#78350F' }, // Weekday — amber
    4: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' }, // General — green
  } as const;
  const badge = priorityColors[(companionData.priorityLevel as 1|2|3|4)] ?? priorityColors[3];

  return (
    <div className="notranslate" translate="no" style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF7 50%, #FEF9C3 100%)',
      border: '1.5px solid #FDE68A',
      borderRadius: '20px',
      padding: isDesktop ? '20px 22px' : '15px 16px',
      boxShadow: '0 4px 18px rgba(217, 119, 6, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Golden Ambient Watermark */}
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

      {/* ── 1. TODAY'S COMPANION HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={16} color="#D97706" />
          <span>{t.todaysCompanion}</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 800,
            color: '#92400E',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
            padding: '2px 7px',
            borderRadius: '6px'
          }}>
            {localizedTheme}
          </span>
          <span style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: badge.text,
            backgroundColor: badge.bg,
            border: `1px solid ${badge.border}`,
            padding: '2px 8px',
            borderRadius: '8px',
            letterSpacing: '0.2px',
            whiteSpace: 'nowrap'
          }}>
            {localizedPriorityReason}
          </span>
        </div>
      </div>

      {/* ── 2. DIVINE MOMENT QUOTE BLOCK ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #FEF08A',
        borderRadius: '14px',
        padding: '12px 14px',
        boxShadow: '0 2px 6px rgba(217, 119, 6, 0.04)',
        marginBottom: '14px'
      }}>
        <blockquote style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#1E232D',
          margin: '0 0 10px 0',
          lineHeight: '1.5',
          fontStyle: 'italic',
          borderLeft: '3.5px solid #0F5132',
          paddingLeft: '10px'
        }}>
          "{localizedQuote}"
        </blockquote>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #FEF3C7', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
              ~ {localizedAuthor}
            </span>
            <span style={{ fontSize: '10px', color: '#92400E', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#FEF3C7', padding: '1px 6px', borderRadius: '6px' }}>
              <Sparkles size={10} color="#D97706" />
              <span>{localizedDuration}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Primary Action: Solid Warm Accent Fill */}
            <button
              onClick={handleAudioPlay}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: isSpeaking ? '#FDE68A' : '#FEF3C7',
                border: `1.5px solid ${isSpeaking ? '#B45309' : '#F59E0B'}`,
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#92400E',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(217, 119, 6, 0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              {isSpeaking ? <VolumeX size={11} color="#DC2626" /> : <Volume2 size={11} color="#D97706" />}
              <span>{isSpeaking ? t.stop : t.listen}</span>
            </button>

            {/* Secondary Action: Clean Outline Pill */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#92400E',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <Share2 size={11} color="#D97706" />
              <span>{t.share}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. ELEGANT SUBTLE DIVIDER ── */}
      <div style={{ borderTop: '1px dashed #FDE68A', margin: '0 0 12px 0' }} />

      {/* ── 4. EMBEDDED DAILY BHAGAVAD GITA SHLOKA ── */}
      <div>
        <DailyGitaCard variant={variant} embedded={true} />
      </div>

      {/* Share Modal */}
      <ShareableQuoteCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quote={localizedQuote}
        author={localizedAuthor}
        theme={localizedTheme}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

interface ShareableQuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
  author: string;
  theme: string;
}

export function ShareableQuoteCardModal({ isOpen, onClose, quote, author, theme }: ShareableQuoteCardModalProps) {
  const [copied, setCopied] = useState(false);
  const lang = useLanguage();

  if (!isOpen) return null;

  const titleText = lang === 'te' ? 'నేటి దివ్య మార్గదర్శనం'
    : lang === 'kn' ? 'ಇಂದಿನ ದಿವ್ಯ ಸಂದೇಶ'
    : lang === 'hi' ? 'आज का दिव्य मार्गदर्शन'
    : lang === 'ta' ? 'இன்றைய தெய்வீக வழிகாட்டல்'
    : "Today's Divine Guidance";

  const appSubtext = lang === 'te' ? 'సారథి - తిరుమల యాత్రా మార్గదర్శి'
    : lang === 'kn' ? 'ಸಾರಥಿ - ತಿರುಮಲ ಯಾತ್ರಾ ಮಾರ್ಗದರ್ಶಿ'
    : lang === 'hi' ? 'सारथी - तिरुमला यात्रा साथी'
    : lang === 'ta' ? 'சாரதி - திருமலை யாத்திரை வழிகாட்டி'
    : 'Saarthi - Tirumala Yatra Companion';

  const fullShareText = `*${titleText}* (${theme})\n\n"${quote}"\n\n~ ${author}\n\n— *${appSubtext}* (saarthiguide.in)`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '24px',
        maxWidth: '380px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease-out'
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} />
            <span>
              {lang === 'te' ? 'దివ్య సందేశాన్ని షేర్ చేయండి'
               : lang === 'kn' ? 'ದಿವ್ಯ ಸಂದೇಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ'
               : lang === 'hi' ? 'दिव्य संदेश साझा करें'
               : lang === 'ta' ? 'தெய்வீக ஆசியைப் பகிர்க'
               : 'Share Divine Blessing'}
            </span>
          </span>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* The Visual Quote Card (Designed for Screenshot / WhatsApp preview) */}
        <div style={{ padding: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)',
            borderRadius: '20px',
            padding: '24px 20px',
            color: '#FFFFFF',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(180, 83, 9, 0.25)',
            border: '2px solid #FDE68A'
          }}>
            {/* Saarthi branding badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={18} color="#FDE68A" />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#FDE68A' }}>
                  SAARTHI · PILGRIM COMPANION
                </span>
              </div>
              <span style={{ fontSize: '10px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {theme}
              </span>
            </div>

            {/* Quote content */}
            <blockquote style={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '1.5',
              fontStyle: 'italic',
              margin: '0 0 16px 0',
              color: '#FFFBEB',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              "{quote}"
            </blockquote>

            {/* Author */}
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#FDE68A',
              textAlign: 'right',
              borderTop: '1px solid rgba(254, 230, 138, 0.3)',
              paddingTop: '10px'
            }}>
              ~ {author}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={handleWhatsAppShare}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#25D366',
                color: '#FFF',
                border: 'none',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <Share2 size={16} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: copied ? '#059669' : '#F1F5F9',
                color: copied ? '#FFF' : '#334155',
                border: 'none',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>
                {copied
                  ? (lang === 'te' ? 'కాపీ చేయబడింది!' : lang === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : lang === 'hi' ? 'कॉपी हो गया!' : lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!')
                  : (lang === 'te' ? 'కోట్ కాపీ చేయండి' : lang === 'kn' ? 'ಸಂದೇಶ ಕಾಪಿ ಮಾಡಿ' : lang === 'hi' ? 'संदेश कॉपी करें' : lang === 'ta' ? 'மேற்கோள் நகலெடு' : 'Copy Quote')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

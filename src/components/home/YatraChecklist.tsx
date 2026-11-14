'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, IdCard, Shirt, Coins, Pill, Smartphone, Check, Briefcase } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleTe: string;
  titleKn: string;
  titleHi: string;
  titleTa: string;
  shortEn: string;
  shortTe: string;
  shortKn: string;
  shortHi: string;
  shortTa: string;
  descEn: string;
  descTe: string;
  descKn: string;
  descHi: string;
  descTa: string;
  tagEn: string;
  tagTe: string;
  tagKn: string;
  tagHi: string;
  tagTa: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'aadhaar',
    titleEn: 'Original Physical Aadhaar Card',
    titleTe: 'అసలు ఆధార్ కార్డు (ఒరిజినల్)',
    titleKn: 'ಮೂಲ ಭೌತಿಕ ಆಧಾರ್ ಕಾರ್ಡ್',
    titleHi: 'मूल आधार कार्ड (ओरिजिनल)',
    titleTa: 'அசல் ஆதார் அட்டை',
    shortEn: 'ID Card',
    shortTe: 'ఆధార్ ID',
    shortKn: 'ಆಧಾರ್ ID',
    shortHi: 'आधार ID',
    shortTa: 'ஆதார் ID',
    descEn: 'Required for all members. Photos or xerox copies are rejected at Vaikuntam queue.',
    descTe: 'అన్ని వయసుల వారికి తప్పనిసరి. ఫోన్ ఫోటోలను అనుమతించరు.',
    descKn: 'ಎಲ್ಲಾ ಭಕ್ತರಿಗೂ ಕಡ್ಡಾಯ. ವೈಕುಂಠಂ ಸರತಿಯಲ್ಲಿ ಮೊಬೈಲ್ ಫೋಟೋಗಳನ್ನು ಒಪ್ಪುವುದಿಲ್ಲ.',
    descHi: 'सभी भक्तों के लिए अनिवार्य। वैकुंठम कतार में फोन फोटो या ज़ेरॉक्स मान्य नहीं हैं।',
    descTa: 'அனைத்து பக்தர்களுக்கும் கட்டாயம். வைகுண்டம் வரிசையில் மொபைல் புகைப்படங்கள் ஏற்கப்படாது.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి',
    tagKn: 'ಕಡ್ಡಾಯ',
    tagHi: 'अनिवार्य',
    tagTa: 'கட்டாயம்'
  },
  {
    id: 'dress',
    titleEn: 'Traditional Dress Code Compliant',
    titleTe: 'సాంప్రదాయ వస్త్రధారణ నియమావళి',
    titleKn: 'ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪಿನ ನಿಯಮ',
    titleHi: 'पारंपरिक वेशभूषा नियम',
    titleTa: 'பாரம்பரிய உடை கட்டுப்பாடு',
    shortEn: 'Dress Code',
    shortTe: 'వస్త్రధారణ',
    shortKn: 'ವಸ್ತ್ರ ನಿಯಮ',
    shortHi: 'वेशभूषा',
    shortTa: 'உடை விதி',
    descEn: 'Men: Dhoti/Kurta. Women: Saree/Chudidar. Jeans and Western wear are barred.',
    descTe: 'పురుషులు: ధోతీ/కుర్తా. స్త్రీలు: చీర/చుడీదార్.',
    descKn: 'ಪುರುಷರು: ಧೋತಿ/ಕುರ್ತಾ. ಮಹಿಳೆಯರು: ಸೀರೆ/ಚೂಡಿದಾರ್. ಜೀನ್ಸ್ ಹಾಗೂ ಪಾಶ್ಚಾತ್ಯ ಉಡುಪುಗಳಿಗೆ ಪ್ರವೇಶವಿಲ್ಲ.',
    descHi: 'पुरुष: धोती/कुर्ता। महिलाएं: साड़ी/चूड़ीदार। जींस व वेस्टर्न परिधान वर्जित हैं।',
    descTa: 'ஆண்கள்: வேஷ்டி/குர்தா. பெண்கள்: புடவை/சுடிதார். ஜீன்ஸ் மற்றும் மேலைநாட்டு உடைகளுக்கு அனுமதி இல்லை.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి',
    tagKn: 'ಕಡ್ಡಾಯ',
    tagHi: 'अनिवार्य',
    tagTa: 'கட்டாயம்'
  },
  {
    id: 'cash',
    titleEn: 'Physical Cash & ₹50 Notes',
    titleTe: 'నగదు & ₹50 నోట్లు',
    titleKn: 'ನಗದು ಹಣ & ₹50 ನೋಟುಗಳು',
    titleHi: 'नकद राशि व ₹50 के नोट',
    titleTa: 'ரொக்கப் பணம் & ₹50 நோட்டுகள்',
    shortEn: 'Cash & Coins',
    shortTe: 'నగదు',
    shortKn: 'ನಗದು',
    shortHi: 'नकद',
    shortTa: 'பணம்',
    descEn: 'For extra Srivari Laddus (₹50 each) and locker tokens. Mobile UPI often fails.',
    descTe: 'అదనపు లడ్డూల కోసం. కొండపై యూపీఐ ఆగిపోయే ప్రమాదం ఉంది.',
    descKn: 'ಹೆಚ್ಚುವರಿ ಲಡ್ಡುಗಳು (ತಲಾ ₹50) ಮತ್ತು ಲಾಕರ್ ಟೋಕನ್‌ಗಳಿಗೆ. ಬೆಟ್ಟದ ಮೇಲೆ UPI ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇರಬಹುದು.',
    descHi: 'अतिरिक्त श्रीवारी लड्डू (₹50 प्रत्येक) व लॉकर के लिए। पहाड़ी पर यूपीआई नेटवर्क बाधित हो सकता है।',
    descTa: 'கூடுதல் லட்டு (தலா ₹50) மற்றும் லாக்கர் பயன்பாட்டிற்கு. மலையில் UPI இணைய வேகம் குறைய வாய்ப்புள்ளது.',
    tagEn: 'Recommended',
    tagTe: 'సిఫార్సు',
    tagKn: 'ಶಿಫಾರಸು',
    tagHi: 'अनुशंसित',
    tagTa: 'பரிந்துரை'
  },
  {
    id: 'medicine',
    titleEn: 'Personal Medication & Water',
    titleTe: 'వ్యక్తిగత మందులు & నీరు',
    titleKn: 'ವೈಯಕ್ತಿಕ ಔಷಧಿಗಳು & ಕುಡಿಯುವ ನೀರು',
    titleHi: 'दवाइयां एवं पेयजल',
    titleTa: 'அத்தியாவசிய மருந்துகள் & குடிநீர்',
    shortEn: 'Meds & Water',
    shortTe: 'మందులు',
    shortKn: 'ಔಷಧಿಗಳು',
    shortHi: 'दवाइयां',
    shortTa: 'மருந்துகள்',
    descEn: 'Queue waiting in compartments can span 4–10 hours. Keep daily pills handy.',
    descTe: 'క్యూ వేచి ఉండే సమయం 4-10 గంటలు ఉండవచ్చు. మందులను పౌచ్‌లో ఉంచుకోండి.',
    descKn: 'ಕಾಂಪಾರ್ಟ್‌ಮೆಂಟ್‌ಗಳಲ್ಲಿ ಕಾಯುವ ಸಮಯ 4-10 ಗಂಟೆಗಳಾಗಬಹುದು. ನಿಯಮಿತ ಮಾತ್ರೆಗಳನ್ನು ಜತೆಯಲ್ಲೇ ಇಟ್ಟುಕೊಳ್ಳಿ.',
    descHi: 'कम्पार्टमेंट में प्रतीक्षा समय 4-10 घंटे हो सकता है। दैनिक दवाएं साथ रखें।',
    descTa: 'அறைகளில் காத்திருப்பு நேரம் 4-10 மணிநேரம் ஆகலாம். தினசரி மாத்திரைகளை கையில் வைத்திருக்கவும்.',
    tagEn: 'Elders & Kids',
    tagTe: 'ముఖ్యమైనది',
    tagKn: 'ಹಿರಿಯರು & ಮಕ್ಕಳಿಗೆ',
    tagHi: 'बुजुर्ग व बच्चे',
    tagTa: 'முதியோர் & குழந்தைகள்'
  },
  {
    id: 'powerbank',
    titleEn: 'Charged Phone & Power Bank',
    titleTe: 'ఫోన్ & పవర్ బ్యాంక్',
    titleKn: 'ಚಾರ್ಜ್ ಮಾಡಿದ ಮೊಬೈಲ್ & ಪವರ್ ಬ್ಯಾಂಕ್',
    titleHi: 'चार्ज फोन व पावर बैंक',
    titleTa: 'சார்ஜ் செய்யப்பட்ட போன் & பவர் பேங்க்',
    shortEn: 'Phone & Power',
    shortTe: 'ఫోన్',
    shortKn: 'ಮೊಬೈಲ್',
    shortHi: 'मोबाइल',
    shortTa: 'மொபைல்',
    descEn: 'Phones are permitted inside waiting compartments; deposit safely before entering the main temple.',
    descTe: 'కంపార్ట్‌మెంట్లలో ఫోన్లు అనుమతిస్తారు. గర్భాలయ ప్రవేశానికి ముందు ఉచితంగా డిపాజిట్ చేయవచ్చు.',
    descKn: 'ಕಾಂಪಾರ್ಟ್‌ಮೆಂಟ್‌ಗಳಲ್ಲಿ ಮೊಬೈಲ್ ಅನುಮತಿಸಲಾಗಿದೆ; ಮುಖ್ಯ ಗರ್ಭಗುಡಿ ಪ್ರವೇಶಿಸುವ ಮುನ್ನ ಉಚಿತ ಕೌಂಟರ್‌ನಲ್ಲಿ ಠೇವಣಿ ಇರಿಸಿ.',
    descHi: 'प्रतीक्षा कक्षों में फोन ले जाने की अनुमति है; मुख्य मंदिर प्रवेश से पूर्व सुरक्षित काउंटर पर जमा करें।',
    descTa: 'காத்திருப்பு அறைகளில் போன் அனுமதிக்கப்படுகிறது; கருவறை நுழைவுக்கு முன் இலவசமாக பாதுகாப்பகத்தில் ஒப்படைக்கவும்.',
    tagEn: 'Helpful',
    tagTe: 'ఉపయోగకరం',
    tagKn: 'ಉಪಯುಕ್ತ',
    tagHi: 'उपयोगी',
    tagTa: 'பயனுள்ளது'
  }
];

const STORAGE_KEY = 'saarthi_yatra_checklist_v1';

export function YatraChecklist() {
  const lang = useLanguage();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCheckedIds(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const getItemIcon = (id: string, isChecked: boolean, color = '#D97706') => {
    if (isChecked) return <Check size={16} color="#16A34A" />;
    switch (id) {
      case 'aadhaar': return <IdCard size={16} color={color} />;
      case 'dress': return <Shirt size={16} color={color} />;
      case 'cash': return <Coins size={16} color={color} />;
      case 'medicine': return <Pill size={16} color={color} />;
      case 'powerbank': return <Smartphone size={16} color={color} />;
      default: return <Briefcase size={16} color={color} />;
    }
  };

  const completedCount = CHECKLIST_ITEMS.filter(item => checkedIds[item.id]).length;
  const isAllDone = completedCount === CHECKLIST_ITEMS.length;

  return (
    <div style={{ padding: '0 14px', marginBottom: '14px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
      }}>
        {/* Header Row */}
        <div
          onClick={() => setIsExpanded(prev => !prev)}
          style={{
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: isAllDone ? 'rgba(240, 253, 244, 0.6)' : '#FFFFFF',
            borderBottom: isExpanded ? '1px solid rgba(15, 23, 42, 0.06)' : 'none',
            transition: 'background-color 0.2s ease'
          }}
          role="button"
          aria-expanded={isExpanded}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(217, 119, 6, 0.12)',
              border: `1.5px solid ${isAllDone ? '#86EFAC' : '#0F172A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={15} color={isAllDone ? '#15803D' : '#D97706'} />
            </div>
            <span style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.01em'
            }}>
              {lang === 'te' ? 'యాత్ర అత్యవసర చెక్‌లిస్ట్' : lang === 'kn' ? 'ಯಾತ್ರಾ ಅಗತ್ಯ ವಸ್ತುಗಳ ಪಟ್ಟಿ' : lang === 'hi' ? 'यात्रा आवश्यक चेकलिस्ट' : lang === 'ta' ? 'பயண அத்தியாவசிய பட்டியல்' : 'Yatra Essentials'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2.5px 9px',
              borderRadius: '12px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(15, 23, 42, 0.06)',
              color: isAllDone ? '#166534' : '#334155',
              border: `1px solid ${isAllDone ? '#BBF7D0' : 'rgba(15, 23, 42, 0.1)'}`
            }}>
              {isClient ? `${completedCount}/5` : (lang === 'te' ? '5 అంశాలు' : lang === 'kn' ? '5 ಅಂಶಗಳು' : lang === 'hi' ? '5 वस्तुएं' : lang === 'ta' ? '5 பொருட்கள்' : '5 Items')}
            </span>
            {isExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
          </div>
        </div>

        {/* FAST SVG ICON CHIPS ROW (STRICTLY NO EMOJIS) */}
        <div style={{
          padding: '10px 12px 12px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          backgroundColor: isAllDone ? '#F0FDF4' : '#FAF8F4',
          transition: 'background-color 0.25s ease'
        }}>
          {CHECKLIST_ITEMS.map(item => {
            const isChecked = isClient && !!checkedIds[item.id];
            const itemTitle = lang === 'te' ? item.titleTe : lang === 'kn' ? item.titleKn : lang === 'hi' ? item.titleHi : lang === 'ta' ? item.titleTa : item.titleEn;
            const itemShort = lang === 'te' ? item.shortTe : lang === 'kn' ? item.shortKn : lang === 'hi' ? item.shortHi : lang === 'ta' ? item.shortTa : item.shortEn;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => toggleItem(item.id, e)}
                title={itemTitle}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  borderRadius: '12px',
                  background: isChecked ? 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' : '#FFFFFF',
                  border: `1.5px solid ${isChecked ? '#86EFAC' : '#E2E8F0'}`,
                  boxShadow: isChecked ? '0 2px 6px rgba(22, 163, 74, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'transform 0.12s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.15s ease'
                }}
                className="active:scale-95"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '22px', marginBottom: '2px' }}>
                  {getItemIcon(item.id, isChecked, isChecked ? '#15803D' : '#D97706')}
                </div>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 600,
                  color: isChecked ? '#14532D' : '#334155',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}>
                  {itemShort}
                </span>
              </button>
            );
          })}
        </div>

        {/* 🌟 100% COMPLETION CELEBRATION BADGE */}
        {isAllDone && (
          <div style={{
            backgroundColor: '#DCFCE7',
            borderTop: '1px solid #86EFAC',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#14532D',
            fontSize: '11px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            <ShieldCheck size={14} color="#15803D" />
            <span>
              {lang === 'te'
                ? 'యాత్ర సన్నద్ధత 100% పూర్తయింది! శ్రీవారి దర్శనానికి మీ యాత్ర సిద్ధంగా ఉంది.'
                : lang === 'kn'
                ? 'ಯಾತ್ರಾ ಸಿದ್ಧತೆ 100% ಪೂರ್ಣಗೊಂಡಿದೆ! ಶ್ರೀವಾರಿ ದರ್ಶನಕ್ಕೆ ನಿಮ್ಮ ಪ್ರಯಾಣ ಸಿದ್ಧವಾಗಿದೆ.'
                : lang === 'hi'
                ? 'यात्रा की तैयारी 100% पूर्ण! श्रीवारी दर्शन के लिए आपकी यात्रा तैयार है।'
                : lang === 'ta'
                ? 'பயணத் தயாரிப்பு 100% நிறைவடைந்தது! ஸ்ரீவாரி தரிசனத்திற்கு நீங்கள் தயார்.'
                : '100% Ready for Srivari Darshan! All essentials verified.'}
            </span>
          </div>
        )}

        {/* Expandable Details for Each Item */}
        {isExpanded && (
          <div style={{ padding: '10px 14px 12px 14px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHECKLIST_ITEMS.map(item => {
              const isChecked = isClient && !!checkedIds[item.id];
              const itemTitle = lang === 'te' ? item.titleTe : lang === 'kn' ? item.titleKn : lang === 'hi' ? item.titleHi : lang === 'ta' ? item.titleTa : item.titleEn;
              const itemDesc = lang === 'te' ? item.descTe : lang === 'kn' ? item.descKn : lang === 'hi' ? item.descHi : lang === 'ta' ? item.descTa : item.descEn;
              return (
                <div
                  key={item.id}
                  onClick={(e) => toggleItem(item.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    backgroundColor: isChecked ? '#F0FDF4' : '#FFFFFF',
                    border: `1px solid ${isChecked ? '#BBF7D0' : '#E2E8F0'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {getItemIcon(item.id, isChecked, isChecked ? '#16A34A' : '#475569')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isChecked ? '#166534' : '#0F172A', textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {itemTitle}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '1px' }}>
                      {itemDesc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

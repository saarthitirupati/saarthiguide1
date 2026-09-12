'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  tagEn: string;
  tagTe: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'aadhaar',
    titleEn: 'Original Physical Aadhaar Card',
    titleTe: 'అసలు ఆధార్ కార్డు (ఒరిజినల్)',
    descEn: 'Required for all members (including kids). Phone photos or Xerox copies are rejected at Vaikuntam queue verification.',
    descTe: 'అన్ని వయసుల వారికి తప్పనిసరి. ఫోన్ ఫోటోలు లేదా జిరాక్స్ కాపీలను వైకుంఠం క్యూ వద్ద అనుమతించరు.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి'
  },
  {
    id: 'dress',
    titleEn: 'Traditional Dress Code Compliant',
    titleTe: 'సాంప్రదాయ వస్త్రధారణ నియమావళి',
    descEn: 'Men: Dhoti/Kurta or White Pancha. Women: Saree or Chudidar with Dupatta. Jeans, T-shirts, and Western wear are barred.',
    descTe: 'పురుషులు: ధోతీ/కుర్తా లేదా తెల్ల పంచె. స్త్రీలు: చీర లేదా దుపట్టాతో కూడిన చుడీదార్. జీన్స్, టీ-షర్టులను అనుమతించరు.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి'
  },
  {
    id: 'cash',
    titleEn: 'Physical Cash & ₹50 Notes/Coins',
    titleTe: 'నగదు & ₹50 నోట్లు/చిల్లర',
    descEn: 'For extra Srivari Laddus (₹50 each) and locker tokens. Mobile UPI frequently fails on the hill due to network rush.',
    descTe: 'అదనపు లడ్డూలు (ఒక్కొక్కటి ₹50), లాకర్ల కోసం. కొండపై నెట్‌వర్క్ రద్దీ వల్ల యూపీఐ/ఆన్‌లైన్ చెల్లింపులు ఆగిపోయే ప్రమాదం ఉంది.',
    tagEn: 'Recommended',
    tagTe: 'సిఫార్సు'
  },
  {
    id: 'medicine',
    titleEn: 'Personal Medication & Water Pouch',
    titleTe: 'వ్యక్తిగత మందులు & చిన్న వాటర్ బాటిల్',
    descEn: 'Queue waiting in holding compartments can span 4–10 hours. Keep essential daily pills handy in a small pouch.',
    descTe: 'కంపార్ట్‌మెంట్లలో వేచి ఉండే సమయం 4-10 గంటలు ఉండవచ్చు. అవసరమైన రోజువారీ మందులను చిన్న పౌచ్‌లో అందుబాటులో ఉంచుకోండి.',
    tagEn: 'Elders & Kids',
    tagTe: 'ముఖ్యమైనది'
  },
  {
    id: 'powerbank',
    titleEn: 'Fully Charged Mobile & Power Bank',
    titleTe: 'పూర్తిగా ఛార్జ్ అయిన మొబైల్ & పవర్ బ్యాంక్',
    descEn: 'Phones are permitted inside waiting compartments (great for contact), and safely deposited right before the sanctum.',
    descTe: 'కంపార్ట్‌మెంట్లలో ఫోన్లు అనుమతిస్తారు (కుటుంబ సభ్యులతో సంప్రదించడానికి). గర్భాలయ ప్రవేశానికి ముందు ఉచితంగా డిపాజిట్ చేయవచ్చు.',
    tagEn: 'Helpful',
    tagTe: 'ఉపయోగకరం'
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

  const toggleItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
        {/* Header (Always Visible & Tappable to Expand) */}
        <div
          onClick={() => setIsExpanded(prev => !prev)}
          style={{
            padding: '14px 14px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(217, 119, 6, 0.12)',
              border: `1.5px solid ${isAllDone ? '#86EFAC' : '#0F172A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={16} color={isAllDone ? '#15803D' : '#D97706'} />
            </div>
            <div>
              <div style={{
                fontSize: '13.5px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                {lang === 'te' ? 'యాత్ర అత్యవసర చెక్‌లిస్ట్' : 'Yatra Essentials Checklist'}
              </div>
              <div style={{
                fontSize: '11px',
                color: isAllDone ? '#16A34A' : '#64748B',
                fontWeight: isAllDone ? 700 : 500,
                marginTop: '2px',
                lineHeight: 1.2
              }}>
                {isAllDone
                  ? (lang === 'te' ? '✓ దర్శనానికి సిద్ధమయ్యారు!' : '✓ All 5 Essentials Ready for Darshan!')
                  : isClient
                    ? (lang === 'te' ? `${completedCount} / 5 సిద్ధంగా ఉన్నాయి · చూడటానికి నొక్కండి` : `${completedCount} of 5 packed · Tap to review`)
                    : (lang === 'te' ? 'దర్శనానికి ముందు చెక్ చేసుకోండి' : 'Verify before entering queue')
                }
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '12px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(15, 23, 42, 0.06)',
              color: isAllDone ? '#166534' : '#334155',
              border: `1px solid ${isAllDone ? '#BBF7D0' : 'rgba(15, 23, 42, 0.1)'}`
            }}>
              {isClient ? `${completedCount}/5` : '5 Items'}
            </span>
            {isExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
          </div>
        </div>

        {/* Expandable Items List */}
        {isExpanded && (
          <div style={{ padding: '8px 14px 12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{
              fontSize: '11px',
              color: '#475569',
              margin: '2px 0 6px 0',
              fontWeight: 500,
              lineHeight: 1.35
            }}>
              {lang === 'te'
                ? 'వైకుంఠం క్యూ వద్ద తిరస్కరణకు గురికాకుండా ఉండటానికి దర్శనానికి బయలుదేరే ముందు ఈ 5 అంశాలను సరిచూసుకోండి:'
                : 'Avoid being turned away at queue verification. Verify these 5 essentials before heading to the temple:'}
            </p>

            {CHECKLIST_ITEMS.map(item => {
              const isChecked = isClient && !!checkedIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={(e) => toggleItem(item.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 10px',
                    borderRadius: '12px',
                    backgroundColor: isChecked ? '#F8FAFC' : '#FFFFFF',
                    border: `1px solid ${isChecked ? '#E2E8F0' : 'rgba(15, 23, 42, 0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {isChecked ? (
                      <CheckCircle2 size={18} color="#16A34A" />
                    ) : (
                      <Circle size={18} color="#94A3B8" />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: isChecked ? '#64748B' : '#0F172A',
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}>
                        {lang === 'te' ? item.titleTe : item.titleEn}
                      </span>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '1.5px 6px',
                        borderRadius: '6px',
                        backgroundColor: item.tagEn === 'Mandatory' ? '#FEE2E2' : '#F1F5F9',
                        color: item.tagEn === 'Mandatory' ? '#991B1B' : '#475569',
                        flexShrink: 0
                      }}>
                        {lang === 'te' ? item.tagTe : item.tagEn}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '10.5px',
                      color: isChecked ? '#94A3B8' : '#475569',
                      lineHeight: 1.35,
                      fontWeight: 400
                    }}>
                      {lang === 'te' ? item.descTe : item.descEn}
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

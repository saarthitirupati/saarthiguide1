'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Sun, Info, ChevronRight } from 'lucide-react';
import { FESTIVALS_2026 } from '@/data/festivals';
import { useLanguage } from '@/lib/useLanguage';
import styles from './KarthikaAdvisoryCard.module.css';

export function KarthikaAdvisoryCard() {
  const lang = useLanguage();
  const isTe = lang === 'te';

  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [todayString, setTodayString] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    const now = new Date();
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
    setTodayString(todayStr);

    const karthikaFest = FESTIVALS_2026.find(f => f.id === 'karthika-masam-2026');
    if (!karthikaFest) {
      setMounted(true);
      return;
    }

    const active = todayStr >= karthikaFest.date && todayStr <= (karthikaFest.dateEnd || karthikaFest.date);
    setIsActive(active);

    try {
      if (localStorage.getItem('karthika_advisory_voted') === 'true') {
        setFeedbackGiven(true);
      }
    } catch {}

    if (active) {
      try {
        const alreadyLogged = sessionStorage.getItem('karthika_advisory_imp_logged');
        if (!alreadyLogged) {
          sessionStorage.setItem('karthika_advisory_imp_logged', 'true');
          const sessionId = localStorage.getItem('saarthi_session_id') || `sess_${Date.now().toString(36)}`;

          fetch('/api/v1/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              eventType: 'karthika_advisory_impression',
              entityType: 'place',
              entityId: 'kapila-theertham',
              metadata: {
                cardVersion: 'v2_karthika_advisory_ui',
                date: todayStr
              }
            })
          }).catch(() => {});
        }
      } catch {}
    }

    setMounted(true);
  }, []);

  if (!mounted || !isActive) {
    return null;
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    try {
      localStorage.setItem('karthika_advisory_voted', 'true');
      const sessionId = localStorage.getItem('saarthi_session_id') || `sess_${Date.now().toString(36)}`;

      fetch('/api/v1/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'karthika_advisory_feedback',
          entityType: 'place',
          entityId: 'kapila-theertham',
          metadata: {
            helpful,
            cardVersion: 'v2_karthika_advisory_ui',
            date: todayString
          }
        })
      }).catch(() => {});
    } catch {}
  };

  return (
    <section 
      className={`${styles.card} ${isTe ? styles.cardTelugu : ''}`}
      aria-label={isTe ? 'కపిల తీర్థం కార్తీక మాస దర్శన సూచన' : 'Kapila Theertham Karthika Masam Timing Advisory'}
    >
      {/* ── CARD HEADER ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBadge} aria-hidden="true">
            <Calendar size={16} />
          </div>
          <div className={styles.headerText}>
            <div className={styles.category}>
              {isTe ? 'కార్తీక మాస సూచన' : 'Karthika Masam'}
            </div>
            <h2 className={styles.title}>
              {isTe ? 'కపిల తీర్థం దర్శనం' : 'Kapila Theertham'}
            </h2>
          </div>
        </div>

        <Link 
          href="/place/kapila-theertham"
          className={styles.detailsLink}
          aria-label={isTe ? 'కపిల తీర్థం పూర్తి వివరాలు' : 'Kapila Theertham details'}
        >
          <span>{isTe ? 'వివరాలు' : 'Details'}</span>
          <ChevronRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* ── 2-COLUMN SCANNABLE TILES (LOW TEXT, HIGH VISUAL) ── */}
      <div className={styles.grid}>
        {/* Tile 1: Queue Times */}
        <div className={styles.tile}>
          <div className={styles.tileHeader}>
            <Clock size={13} className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>
              {isTe ? 'దర్శనం సమయం' : 'Estimated Wait'}
            </span>
          </div>
          <div className={styles.tileHighlight}>1.5 – 2.5 hrs</div>
          <div className={styles.tileSubtext}>
            {isTe ? 'పండుగ రద్దీ అంచనా' : 'Festival queue estimate'}
          </div>
        </div>

        {/* Tile 2: Suggested Window */}
        <div className={styles.tile}>
          <div className={styles.tileHeader}>
            <Sun size={13} className={styles.tileIcon} aria-hidden="true" />
            <span className={styles.tileLabel}>
              {isTe ? 'అనుకూల సమయం' : 'Best Window'}
            </span>
          </div>
          <div className={styles.tileHighlight}>12:30 – 3:30 PM</div>
          <div className={styles.tileSubtext}>
            {isTe ? 'రద్దీ తక్కువగా ఉండే సమయం' : 'Lighter rush period'}
          </div>
        </div>
      </div>

      {/* ── NOTICE BOX (CONCISE & PUNCHY) ── */}
      <div className={styles.noticeBox}>
        <Info size={14} className={styles.noticeIcon} aria-hidden="true" />
        <span className={styles.noticeText}>
          {isTe 
            ? 'పుష్కరిణి, జలపాతం ప్రవేశం స్థానిక భద్రతా సూచనలపై ఆధారపడి ఉంటుంది.'
            : 'Water & pushkarini entry subject to local safety rules on the day.'}
        </span>
      </div>

      {/* ── FEEDBACK FOOTER ── */}
      <div className={styles.footer}>
        <span className={styles.feedbackPrompt}>
          {feedbackGiven 
            ? (isTe ? 'ధన్యవాదాలు.' : 'Thank you for your feedback.') 
            : (isTe ? 'ఈ అంచనా ఉపయోగపడిందా?' : 'Was this estimate helpful?')}
        </span>
        {!feedbackGiven && (
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => handleFeedback(true)}
              aria-label={isTe ? 'అవును, ఈ సమాచారం ఉపయోగపడింది' : 'Yes, this estimate was helpful'}
              className={styles.feedbackButton}
            >
              {isTe ? 'అవును' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => handleFeedback(false)}
              aria-label={isTe ? 'కాదు, ఈ సమాచారం ఉపయోగపడలేదు' : 'No, this estimate was not helpful'}
              className={styles.feedbackButton}
            >
              {isTe ? 'కాదు' : 'No'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
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
    // 7. Compute date after mount to avoid Next.js hydration mismatch
    const now = new Date();
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
    setTodayString(todayStr);

    // 1. Data-driven active check matching decision engine
    const karthikaFest = FESTIVALS_2026.find(f => f.id === 'karthika-masam-2026');
    if (!karthikaFest) {
      setMounted(true);
      return;
    }

    const active = todayStr >= karthikaFest.date && todayStr <= (karthikaFest.dateEnd || karthikaFest.date);
    setIsActive(active);

    // 8. Prevent repeat votes via localStorage
    try {
      if (localStorage.getItem('karthika_advisory_voted') === 'true') {
        setFeedbackGiven(true);
      }
    } catch {}

    // 3. Log one anonymous impression per session
    if (active) {
      try {
        const alreadyLogged = sessionStorage.getItem('karthika_advisory_imp_logged');
        if (!alreadyLogged) {
          sessionStorage.setItem('karthika_advisory_imp_logged', 'true');
          const sessionId = localStorage.getItem('saarthi_session_id') || `sess_${Date.now().toString(36)}`;

          // 2. Error handled without unhandled promise rejection
          fetch('/api/v1/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              eventType: 'karthika_advisory_impression',
              entityType: 'place',
              entityId: 'kapila-theertham',
              metadata: {
                cardVersion: 'v1_karthika_advisory',
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

      // 2. Handled fetch failure
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
            cardVersion: 'v1_karthika_advisory',
            date: todayString
          }
        })
      }).catch(() => {});
    } catch {}
  };

  return (
    <section 
      className={`${styles.card} ${isTe ? styles.cardTelugu : ''}`}
      aria-label={isTe ? 'కపిల తీర్థం కార్తీక మాస సూచన' : 'Karthika Masam Advisory for Kapila Theertham'}
    >
      <div className={styles.category}>
        {isTe ? 'కార్తీక మాస సూచన' : 'KARTHIKA MASAM ADVISORY'}
      </div>
      <h2 className={styles.title}>
        {isTe ? 'శ్రీ కపిలేశ్వర స్వామి దేవస్థానం (కపిల తీర్థం)' : 'Sri Kapileswara Swamy Temple (Kapila Theertham)'}
      </h2>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          {isTe ? 'దర్శనం సమయం' : 'Queue times'}
        </div>
        <div className={styles.sectionText}>
          {isTe 
            ? 'భక్తుల రద్దీ ఎక్కువగా ఉండే అవకాశం ఉంది. దర్శనానికి సుమారు 1.5 నుండి 2.5 గంటల సమయం కేటాయించండి (గత పండుగల ఆధారిత అంచనా).'
            : 'Festival queues are expected. Plan for about 1.5 to 2.5 hours (estimate based on past festival patterns).'}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          {isTe ? 'అనుకూల సమయం' : 'Suggested window'}
        </div>
        <div className={styles.sectionText}>
          {isTe 
            ? 'మధ్యాహ్నం 12:30 నుండి 3:30 వరకు రద్దీ కొంత తక్కువగా ఉండే అవకాశం ఉంది (ఉదయం స్నానాల రద్దీ మరియు సాయంత్రం ప్రార్థనల మధ్య).'
            : '12:30 PM to 3:30 PM may be lighter, between the morning bath rush and the evening prayer crowds.'}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          {isTe ? 'గమనిక' : 'Please note'}
        </div>
        <div className={styles.sectionText}>
          {isTe 
            ? 'పుష్కరిణి మరియు జలపాతం ప్రవేశం ఆ రోజు దేవాలయ, స్థానిక అధికారుల ఆదేశాలపై ఆధారపడి ఉంటుంది.'
            : 'Pushkarini and waterfall access depends on temple and local authority instructions on the day.'}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.feedbackPrompt}>
          {feedbackGiven 
            ? (isTe ? 'మీ స్పందనకు ధన్యవాదాలు.' : 'Thank you for your feedback.') 
            : (isTe ? 'ఈ సమాచారం మీకు ఉపయోగపడిందా?' : 'Was this timing estimate helpful?')}
        </span>
        {!feedbackGiven && (
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => handleFeedback(true)}
              aria-label={isTe ? 'అవును, ఈ సమాచారం ఉపయోగపడింది' : 'Yes, this timing estimate was helpful'}
              className={styles.feedbackButton}
            >
              {isTe ? 'అవును' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => handleFeedback(false)}
              aria-label={isTe ? 'కాదు, ఈ సమాచారం ఉపయోగపడలేదు' : 'No, this timing estimate was not helpful'}
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


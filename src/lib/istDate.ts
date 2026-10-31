/**
 * Isomorphic Asia/Kolkata (IST) date & time helper.
 * Safe for use in Server Components, API Routes, Edge Runtime, and Client Components.
 * Contains pure JavaScript date arithmetic with zero React or browser dependencies.
 */
export function getISTDateInfo(lastUpdatedStr?: string, refDate: Date = new Date()) {
  const istDateFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const istShortDateFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short'
  });

  const istTimeFmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Extract calendar day/month/year strictly in Asia/Kolkata
  const kolkataParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(refDate);

  const getP = (type: string) => parseInt(kolkataParts.find(p => p.type === type)?.value || '0', 10);
  const y = getP('year');
  const m = getP('month'); // 1-12
  const d = getP('day');   // 1-31

  // Anchor to 12:00 UTC on the target calendar day so UTC+5:30 (17:30 IST) never shifts date
  const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const yesterdayDate = new Date(Date.UTC(y, m - 1, d - 1, 12, 0, 0));
  const tomorrowDate = new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0));

  const todayStr = istDateFmt.format(todayDate);
  const todayShortStr = istShortDateFmt.format(todayDate);
  const yesterdayStr = istDateFmt.format(yesterdayDate);
  const yesterdayShortStr = istShortDateFmt.format(yesterdayDate);
  const tomorrowStr = istDateFmt.format(tomorrowDate);

  // Last Updated formatted
  let updatedDisplay = '';
  if (lastUpdatedStr) {
    try {
      const updDate = new Date(lastUpdatedStr);
      if (!isNaN(updDate.getTime())) {
        updatedDisplay = `${istDateFmt.format(updDate)}, ${istTimeFmt.format(updDate)}`;
      }
    } catch {
      // fallback
    }
  }
  if (!updatedDisplay) {
    updatedDisplay = `${todayStr}, ${istTimeFmt.format(refDate)}`;
  }

  return {
    today: todayStr,
    todayShort: todayShortStr,
    yesterday: yesterdayStr,
    yesterdayShort: yesterdayShortStr,
    tomorrow: tomorrowStr,
    updatedDisplay
  };
}

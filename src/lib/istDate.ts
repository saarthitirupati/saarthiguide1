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

/**
 * Format relative time dynamically (e.g. "Just now", "45s ago", "2m ago", "1h ago", "Yesterday")
 */
export function formatRelativeTime(dateInput?: string | number | null, now: number = Date.now()): string {
  if (!dateInput) return 'Just now';
  const timestamp = typeof dateInput === 'number' ? dateInput : new Date(dateInput).getTime();
  if (isNaN(timestamp) || timestamp <= 0) return typeof dateInput === 'string' ? dateInput : 'Just now';

  const diffMs = now - timestamp;
  if (diffMs < 0) return 'Just now';

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 15) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric'
  }).format(new Date(timestamp));
}

/**
 * Format exact time in Asia/Kolkata (IST)
 */
export function formatISTTime(dateInput?: string | number | null): string {
  if (!dateInput) return '';
  const timestamp = typeof dateInput === 'number' ? dateInput : new Date(dateInput).getTime();
  if (isNaN(timestamp) || timestamp <= 0) return '';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp)) + ' IST';
}

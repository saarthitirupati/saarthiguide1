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

/**
 * Checks whether an IST time string (e.g. "11:30 AM", "2:00 PM", "21 Nov 2026, 12:00 PM") has already passed in Asia/Kolkata.
 */
export function isTimeInPastIST(timeStr?: string, refDate: Date = new Date()): boolean {
  if (!timeStr) return false;

  // 1. If an explicit calendar date is embedded (e.g. "21 Nov 2026, 12:00 PM" or "21 Nov"), parse full date
  const embeddedDateMatch = timeStr.match(/\b(\d{1,2})\s+([A-Za-z]{3})(?:\s+(\d{4}))?/);
  if (embeddedDateMatch) {
    const day = parseInt(embeddedDateMatch[1], 10);
    const monthStr = embeddedDateMatch[2].toLowerCase();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIdx = months.indexOf(monthStr.substring(0, 3));
    if (monthIdx !== -1) {
      const year = embeddedDateMatch[3] ? parseInt(embeddedDateMatch[3], 10) : 2026;
      const timeMatch = timeStr.match(/\b(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?\b/);
      let hours = 12;
      let minutes = 0;
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const mod = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
        if (mod === 'PM' && hours < 12) hours += 12;
        else if (mod === 'AM' && hours === 12) hours = 0;
      }
      // Target time in IST -> convert to UTC timestamp (IST is UTC+5:30)
      const targetUtc = Date.UTC(year, monthIdx, day, hours - 5, minutes - 30);
      return refDate.getTime() >= targetUtc;
    }
  }

  // 2. Fallback: only time given today in IST
  const match = timeStr.match(/\b(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?\b/);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const modifier = match[3] ? match[3].toUpperCase() : null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  else if (modifier === 'AM' && hours === 12) hours = 0;

  const targetMinutes = hours * 60 + minutes;

  const kolkataParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(refDate);

  const getP = (type: string) => parseInt(kolkataParts.find(p => p.type === type)?.value || '0', 10);
  const curH = getP('hour');
  const curM = getP('minute');
  const currentMinutes = curH * 60 + curM;

  return currentMinutes >= targetMinutes;
}

/**
 * Returns date parts and formatted strings for today, target darshan date (today + 1),
 * and milliseconds until the next 00:00:01 IST rollover.
 */
export function getISTMidnightState(refDate: Date = new Date()) {
  const kolkataParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }).formatToParts(refDate);

  const getP = (type: string) => parseInt(kolkataParts.find(p => p.type === type)?.value || '0', 10);
  const y = getP('year');
  const m = getP('month');
  const d = getP('day');
  const h = getP('hour');
  const min = getP('minute');
  const s = getP('second');

  // Today and Tomorrow in IST
  const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const targetDarshanDate = new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0));

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

  const todayStr = istDateFmt.format(todayDate);
  const todayShortStr = istShortDateFmt.format(todayDate);
  const targetDarshanStr = istDateFmt.format(targetDarshanDate);
  const targetDarshanShortStr = istShortDateFmt.format(targetDarshanDate);

  // Milliseconds elapsed today in IST
  const currentSeconds = h * 3600 + min * 60 + s;
  const totalSecondsInDay = 86400;
  // Next midnight plus 1-second buffer
  const msUntilMidnight = Math.max(1000, (totalSecondsInDay - currentSeconds + 1) * 1000);

  return {
    year: y,
    month: m,
    day: d,
    hour: h,
    minute: min,
    todayStr,
    todayShortStr,
    targetDarshanStr,
    targetDarshanShortStr,
    msUntilMidnight
  };
}

/**
 * Autonomous Dynamic Notification Engine
 * 
 * First-Principles Rule:
 * Runs automatically via scheduled cloud watchers without requiring human/admin clicks.
 * Evaluates real ground state (queue wait times, SSD counter openings, ghat curfews,
 * festivals, and weather) and dispatches timely, explainable, anti-spam alerts to subscribers.
 */

import { readStatus, TirumalaStatus } from '@/lib/statusDb';
import { FESTIVALS_2026 } from '@/data/festivals';
import { getPanchangamData } from '@/lib/panchangam';
import { pushNotifyAll } from '@/lib/pushNotify';
import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

export interface AutonomousDecision {
  shouldBroadcast: boolean;
  type:
    | 'ghat_curfew'
    | 'ssd_morning'
    | 'crowd_surge'
    | 'weekend_crowd'
    | 'weekend_prep'
    | 'festival_eve'
    | 'festival_today'
    | 'optimal_queue'
    | 'daily_spot'
    | 'none';
  title: string;
  body: string;
  url: string;
  tag: string;
  reason: string;
  urgency: 'critical' | 'high' | 'normal';
}

export interface BroadcastLog {
  lastBroadcastDate: string; // YYYY-MM-DD in IST
  lastBroadcastType: string;
  lastBroadcastTime: string;
  totalSentCount: number;
  sentTypesToday?: string[];
}

const BROADCAST_FILE = path.join(process.cwd(), 'data', 'push_broadcast.json');
let inMemoryBroadcastLog: BroadcastLog = {
  lastBroadcastDate: '',
  lastBroadcastType: '',
  lastBroadcastTime: '',
  totalSentCount: 0,
  sentTypesToday: []
};

// Helper: Get current IST components
function getISTDate(): { dateStr: string; hour: number; minute: number; dayOfWeek: number } {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = istFormatter.formatToParts(now);
  const find = (type: string) => parts.find(p => p.type === type)?.value || '';

  const dateStr = `${find('year')}-${find('month')}-${find('day')}`;
  const hour = parseInt(find('hour'), 10) || 0;
  const minute = parseInt(find('minute'), 10) || 0;

  // Day of week in Asia/Kolkata (0 = Sun, 5 = Fri, 6 = Sat)
  const istDateObj = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const dayOfWeek = istDateObj.getDay();

  return { dateStr, hour, minute, dayOfWeek };
}

function getTomorrowDateStr(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

async function getBroadcastLog(): Promise<BroadcastLog> {
  try {
    const data = await fs.readFile(BROADCAST_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    inMemoryBroadcastLog = { ...inMemoryBroadcastLog, ...parsed };
  } catch {
    // Memory fallback on read-only environments
  }
  return inMemoryBroadcastLog;
}

async function saveBroadcastLog(log: BroadcastLog): Promise<void> {
  inMemoryBroadcastLog = log;
  try {
    await fs.writeFile(BROADCAST_FILE, JSON.stringify(log, null, 2), 'utf-8');
  } catch {
    // Ignore read-only filesystem errors
  }
}

/**
 * Core Autonomous Decision Matrix
 */
export async function evaluateAutonomousTrigger(): Promise<AutonomousDecision> {
  const { dateStr, hour, minute, dayOfWeek } = getISTDate();
  const status: TirumalaStatus = await readStatus();
  const panchangam = getPanchangamData();
  const log = await getBroadcastLog();

  const sentToday = (log.lastBroadcastDate === dateStr ? (log.sentTypesToday || [log.lastBroadcastType]) : []).filter(Boolean);

  // Frequency Cap Guard:
  // Disallows duplicate alert types within the same day.
  // Caps non-critical broadcasts to 2 per day total, but critical ghat curfew always fires.
  const canSend = (type: string, urgency: 'critical' | 'high' | 'normal') => {
    if (sentToday.includes(type)) return false;
    if (sentToday.length >= 2 && urgency !== 'critical') return false;
    return true;
  };

  // Parse Sarva Darshan wait hours
  const waitMinutes = status.darshans?.find(d => d.name.includes('Sarva'))?.waitTime;
  let parsedWaitHours = 14;
  if (waitMinutes) {
    const match = waitMinutes.match(/(\d+)/);
    if (match) parsedWaitHours = parseInt(match[1], 10);
  }

  // 1. RULE 1: Night Ghat Road Curfew (9:00 PM - 10:15 PM IST)
  // Alipiri toll gate ascending road closes strictly at 11:00 PM.
  if ((hour === 21 || (hour === 22 && minute <= 15)) && canSend('ghat_curfew', 'critical')) {
    return {
      shouldBroadcast: true,
      type: 'ghat_curfew',
      title: '⚠️ Ghat Road Closes in 90 Mins',
      body: 'Alipiri toll gate stops ascending vehicles at 11:00 PM. Pass through toll now to avoid overnight hold.',
      url: '/route',
      tag: 'ghat-curfew',
      urgency: 'critical',
      reason: 'Current IST time is between 9:00 PM and 10:15 PM, approaching 11:00 PM ascending ghat road curfew.'
    };
  }

  // 2. RULE 2: Offline SSD Token Counters Opening (4:30 AM - 5:30 AM IST) - Connected to Admin Panel
  if ((hour === 4 && minute >= 30 || hour === 5 && minute <= 30) && canSend('ssd_morning', 'high')) {
    const isClosed = status.ssdTokenStatus === 'closed-for-day';
    const openTime = status.ssdNextTokenTime || '5:00 AM';
    const activeCounters = status.ssdCounters && status.ssdCounters.length > 0
      ? status.ssdCounters.map(c => c.name.replace(/ Counter$/i, '')).join(' & ')
      : 'Vishnu Nivasam & Srinivasam';

    if (isClosed) {
      return {
        shouldBroadcast: true,
        type: 'ssd_morning',
        title: '⚠️ Today’s SSD Token Quota Closed',
        body: status.ssdNotice || 'Offline SSD token quota for today is complete. Next issuance tomorrow morning.',
        url: '/darshan/ssd-token',
        tag: 'ssd-morning',
        urgency: 'high',
        reason: 'Admin panel has set SSD Token status to closed-for-day.'
      };
    }

    const customNotice = status.ssdNotice ? ` ${status.ssdNotice}` : '';
    return {
      shouldBroadcast: true,
      type: 'ssd_morning',
      title: `🎫 Free SSD Counters Opening at ${openTime}`,
      body: `Offline token counters opening shortly at ${activeCounters}. Bring original Aadhaar cards for biometric issue.${customNotice}`,
      url: '/darshan/ssd-token',
      tag: 'ssd-morning',
      urgency: 'high',
      reason: `Connected to Admin Panel SSD state: early morning opening at ${openTime} across ${activeCounters}.`
    };
  }

  // 3. RULE 3: Extreme Crowd Spike / Surge Window (8:00 AM - 6:00 PM IST)
  if (hour >= 8 && hour <= 18 && canSend('crowd_surge', 'high')) {
    if (parsedWaitHours >= 18 || status.crowdLevel === 'very-high') {
      return {
        shouldBroadcast: true,
        type: 'crowd_surge',
        title: `🚨 Heavy Crowd Surge at Tirumala (~${parsedWaitHours}h wait)`,
        body: `Sarva Darshan queue compartments are packed. Expect ~${parsedWaitHours} hrs wait. Carry essentials for elders & children.`,
        url: '/route',
        tag: 'crowd-surge',
        urgency: 'high',
        reason: `Sarva Darshan queue wait time (~${parsedWaitHours} hrs) exceeds 18 hours or crowdLevel is very-high.`
      };
    }
  }

  // 4. RULE 4: Weekend Peak Rush Advisory (Saturday & Sunday 6:30 AM - 11:30 AM IST)
  if ((dayOfWeek === 0 || dayOfWeek === 6) && hour >= 6 && hour <= 11 && canSend('weekend_crowd', 'high')) {
    if (parsedWaitHours >= 14 || status.crowdLevel === 'high' || status.crowdLevel === 'very-high') {
      const dayName = dayOfWeek === 6 ? 'Saturday' : 'Sunday';
      return {
        shouldBroadcast: true,
        type: 'weekend_crowd',
        title: `⚠️ ${dayName} Rush: Heavy Weekend Footfall (~${parsedWaitHours}h)`,
        body: `Weekend pilgrim influx is at peak in Tirumala. SSD quota exhausts rapidly. Check live compartment wait times.`,
        url: '/route',
        tag: 'weekend-crowd',
        urgency: 'high',
        reason: `Weekend (${dayName}) footfall surge detected with wait time ~${parsedWaitHours} hours.`
      };
    }
  }

  // 5. RULE 5: Weekend Travel Preparation Alert (Friday 5:00 PM - 8:30 PM IST)
  if (dayOfWeek === 5 && hour >= 17 && hour <= 20 && canSend('weekend_prep', 'normal')) {
    return {
      shouldBroadcast: true,
      type: 'weekend_prep',
      title: '🏔️ Weekend Yatra Prep: Tirumala Travel Advisory',
      body: 'High pilgrim inflow arriving for the weekend. Pass Alipiri toll early; offline SSD token counters open at 5:00 AM.',
      url: '/darshan/ssd-token',
      tag: 'weekend-prep',
      urgency: 'normal',
      reason: 'Friday evening weekend pilgrimage advisory for incoming pilgrims.'
    };
  }

  // 6. RULE 6: Festival Eve (T-1 Day Ahead) Advisory (6:00 PM - 8:30 PM IST)
  if (hour >= 18 && hour <= 20 && canSend('festival_eve', 'high')) {
    const tomorrowStr = getTomorrowDateStr(dateStr);
    let tomorrowFestival: any = null;
    try {
      const { data: dbFest } = await supabase
        .from('festivals')
        .select('*')
        .eq('date', tomorrowStr)
        .maybeSingle();
      if (dbFest) tomorrowFestival = dbFest;
    } catch {}
    if (!tomorrowFestival) {
      tomorrowFestival = FESTIVALS_2026.find(f => f.date === tomorrowStr);
    }

    if (tomorrowFestival) {
      return {
        shouldBroadcast: true,
        type: 'festival_eve',
        title: `🪔 Tomorrow in Tirumala: ${tomorrowFestival.name} Eve`,
        body: `Special rituals & heavy crowd expected tomorrow. Reach Tirumala early to avoid long ghat & queue holdups.`,
        url: tomorrowFestival.slug ? `/festivals/${tomorrowFestival.slug}` : '/festivals',
        tag: 'festival-eve',
        urgency: 'high',
        reason: `Festival eve advisory for tomorrow's festival (${tomorrowFestival.name}).`
      };
    }
  }

  // 7. RULE 7: Major Temple Festival / Auspicious Tithi Today (6:30 AM - 9:30 AM IST) - Connected to Admin Panel
  if (hour >= 6 && hour <= 9 && canSend('festival_today', 'high')) {
    // 7a. Check live festivals configured by admin in Supabase first
    let liveFestival: any = null;
    try {
      const { data: dbFest } = await supabase
        .from('festivals')
        .select('*')
        .eq('date', dateStr)
        .maybeSingle();
      if (dbFest) liveFestival = dbFest;
    } catch {}

    // 7b. Fallback to static festival calendar if not yet in database
    if (!liveFestival) {
      liveFestival = FESTIVALS_2026.find(f => f.date === dateStr);
    }

    const isSpecialTithi = panchangam.tithiEn.includes('Ekadashi') || panchangam.tithiEn.includes('Pournami');

    if (liveFestival) {
      const advisory = liveFestival.visitor_notes || liveFestival.description || `Special rituals & sevas today. Expected crowd: ${liveFestival.crowd_level || 'High'}.`;
      return {
        shouldBroadcast: true,
        type: 'festival_today',
        title: `🪔 Today in Tirumala: ${liveFestival.name}`,
        body: `${liveFestival.location ? liveFestival.location + ' • ' : ''}${advisory.slice(0, 110)}`,
        url: liveFestival.slug ? `/festivals/${liveFestival.slug}` : '/festivals',
        tag: 'festival-today',
        urgency: 'high',
        reason: `Connected to Admin Panel Festivals: Matched live festival for today (${liveFestival.name}).`
      };
    }

    if (isSpecialTithi) {
      return {
        shouldBroadcast: true,
        type: 'festival_today',
        title: `🕉️ Auspicious ${panchangam.tithiEn} Today`,
        body: `Srivari Temple sacred observance day (${panchangam.pakshaEn} Paksha). Check live queue status before traveling.`,
        url: '/festivals',
        tag: 'festival-today',
        urgency: 'normal',
        reason: `Auspicious Vedic lunar tithi (${panchangam.tithiEn}) observed today.`
      };
    }
  }

  // 8. RULE 8: Optimal Queue Window (Sarva Darshan wait <= 8 hrs or darshan speed fast)
  if (hour >= 8 && hour <= 19 && (parsedWaitHours <= 8 || status.darshanSpeed === 'fast') && canSend('optimal_queue', 'high')) {
    return {
      shouldBroadcast: true,
      type: 'optimal_queue',
      title: `🟢 Low Darshan Wait Time (~${parsedWaitHours} hrs)`,
      body: 'Sarva Darshan queue lines are moving smoothly right now. Favorable window to enter VQC-2 queue.',
      url: '/route',
      tag: 'optimal-queue',
      urgency: 'high',
      reason: `Sarva Darshan queue wait time (~${parsedWaitHours} hrs) is under the 8-hour low threshold.`
    };
  }

  // 9. RULE 9: Default Morning Spiritual Spotlight (7:30 AM - 10:30 AM IST)
  if (hour >= 7 && hour <= 10 && canSend('daily_spot', 'normal')) {
    return {
      shouldBroadcast: true,
      type: 'daily_spot',
      title: '🙏 Morning Yatra Guidance — Saarthi',
      body: `Live queue, SSD token counts & free Annaprasadam timings updated for ${panchangam.vaaramEn}.`,
      url: '/',
      tag: 'daily-spot',
      urgency: 'normal',
      reason: 'Scheduled morning darshan status and essentials refresh.'
    };
  }

  return {
    shouldBroadcast: false,
    type: 'none',
    title: '',
    body: '',
    url: '',
    tag: '',
    urgency: 'normal',
    reason: `No critical event threshold met at current IST hour ${hour}:${minute} (Sent today: ${sentToday.join(', ') || 'none'}).`
  };
}

/**
 * Execute the Autonomous Notification Cycle
 */
export async function executeAutonomousCycle(dryRun: boolean = false): Promise<{
  executed: boolean;
  decision: AutonomousDecision;
  istTime: string;
}> {
  const { dateStr, hour, minute } = getISTDate();
  const istTime = `${dateStr} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} IST`;
  const decision = await evaluateAutonomousTrigger();

  if (!decision.shouldBroadcast) {
    return { executed: false, decision, istTime };
  }

  if (dryRun) {
    return { executed: false, decision, istTime };
  }

  // Dispatch push notifications to all subscribers (capped safely for Cloudflare runtime)
  await pushNotifyAll({
    title: decision.title,
    body: decision.body,
    url: decision.url,
    tag: decision.tag
  });

  // Record broadcast log to enforce frequency cap
  const currentLog = await getBroadcastLog();
  const existingTypes = currentLog.lastBroadcastDate === dateStr ? (currentLog.sentTypesToday || [currentLog.lastBroadcastType]) : [];
  const updatedTypes = Array.from(new Set([...existingTypes, decision.type]));

  await saveBroadcastLog({
    lastBroadcastDate: dateStr,
    lastBroadcastType: decision.type,
    lastBroadcastTime: istTime,
    totalSentCount: currentLog.totalSentCount + 1,
    sentTypesToday: updatedTypes,
  });

  return { executed: true, decision, istTime };
}

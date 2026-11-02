import { supabase } from '@/lib/supabase';
import defaultAlertsData from '../../data/live_alerts.json';
import fs from 'fs/promises';
import path from 'path';

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived' | 'Scheduled';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_ALERTS_FILE = path.join(process.cwd(), 'data', 'live_alerts.json');

// Memory cache store for serverless environment persistence fallback
let IN_MEMORY_ALERTS: LiveAlert[] = [];
const DELETED_ALERT_IDS = new Set<string>();

async function readLocalAlerts(): Promise<LiveAlert[]> {
  try {
    const content = await fs.readFile(LOCAL_ALERTS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalAlerts(alerts: LiveAlert[]) {
  try {
    await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (e) {
    // Ignore read-only filesystem errors on Vercel
  }
}

export async function fetchLiveAlerts(showAll = false): Promise<LiveAlert[]> {
  const now = Date.now();
  let dbAlerts: LiveAlert[] | null = null;

  // 1. Try fetching from Supabase live_updates table
  try {
    const { data, error } = await supabase
      .from('live_updates')
      .select('value')
      .eq('module', 'live_alerts')
      .maybeSingle();

    if (!error && data?.value) {
      const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      if (Array.isArray(parsed)) {
        dbAlerts = parsed as LiveAlert[];
      }
    }
  } catch (err) {
    console.warn('Supabase live_updates fetch warning:', err);
  }

  // 2. Fetch local fallback ONLY if Supabase has never been set (null)
  const baseAlerts: LiveAlert[] = dbAlerts !== null ? dbAlerts : await readLocalAlerts();

  // 3. Combine with in-memory created alerts, excluding deleted IDs
  const combinedMap = new Map<string, LiveAlert>();

  for (const a of [...IN_MEMORY_ALERTS, ...baseAlerts]) {
    if (a && a.id && !DELETED_ALERT_IDS.has(a.id) && !combinedMap.has(a.id)) {
      combinedMap.set(a.id, a);
    }
  }

  const allList = Array.from(combinedMap.values());

  // 4. Apply filtering and sorting
  const filtered = allList.filter((a) => {
    if (!a) return false;
    if (DELETED_ALERT_IDS.has(a.id)) return false;
    if (showAll) return true;

    // Filter out future scheduled alerts from public pilgrims
    if (a.start_time) {
      const startTimeMs = new Date(a.start_time).getTime();
      if (!isNaN(startTimeMs) && startTimeMs > now) {
        return false;
      }
    }

    if (a.status !== 'Published' && a.status !== 'Scheduled') return false;
    if (!a.expiry_time) return true;
    const exp = new Date(a.expiry_time).getTime();
    return !isNaN(exp) && exp > now;
  });

  const sorted = filtered.sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });

  // Empty feed remains empty! Prevent seed/mock fallback alerts from resurfacing.
  return sorted;
}

export async function saveLiveAlert(alertData: Partial<LiveAlert>): Promise<LiveAlert> {
  const now = new Date();
  const nowIso = now.toISOString();
  const id = alertData.id || Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  const existingAlert = IN_MEMORY_ALERTS.find(a => a.id === id);
  const startTime = alertData.start_time || existingAlert?.start_time || nowIso;
  const isFutureScheduled = new Date(startTime).getTime() > (now.getTime() + 60000);
  
  let calculatedStatus: LiveAlert['status'] = 'Published';
  if (alertData.status === 'Draft') {
    calculatedStatus = 'Draft';
  } else if (alertData.status === 'Expired') {
    calculatedStatus = 'Expired';
  } else if (alertData.status === 'Archived') {
    calculatedStatus = 'Archived';
  } else if (isFutureScheduled) {
    calculatedStatus = 'Scheduled';
  } else {
    calculatedStatus = alertData.status || 'Published';
  }

  const newAlert: LiveAlert = {
    id,
    title: alertData.title || '',
    description: alertData.description || (alertData as any).message || '',
    image: alertData.image || '',
    category: alertData.category || 'Advisory',
    severity: alertData.severity || 'Medium',
    popup_type: alertData.popup_type || 'Popup',
    cta: alertData.cta || 'None',
    status: calculatedStatus,
    target_location: alertData.target_location || 'All Users',
    start_time: startTime,
    expiry_time: alertData.expiry_time || existingAlert?.expiry_time || new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: alertData.created_at || existingAlert?.created_at || nowIso,
    updated_at: nowIso
  };

  // Remove from deleted set if re-created or updated
  DELETED_ALERT_IDS.delete(id);

  // Add to in-memory list
  IN_MEMORY_ALERTS = [newAlert, ...IN_MEMORY_ALERTS.filter((a) => a.id !== id)];

  // 1. Try Supabase live_updates upsert
  try {
    const existing = await fetchLiveAlerts(true);
    const updatedList = [newAlert, ...existing.filter((a) => a.id !== id)];
    await supabase
      .from('live_updates')
      .upsert({
        module: 'live_alerts',
        value: JSON.stringify(updatedList),
        updated_at: now
      }, { onConflict: 'module' });
  } catch (e) {
    console.warn('Supabase live_updates save warning:', e);
  }

  // 2. Try writing to local file
  try {
    const local = await readLocalAlerts();
    const updatedLocal = [newAlert, ...local.filter((a) => a.id !== id)];
    await writeLocalAlerts(updatedLocal);
  } catch (e) {}

  return newAlert;
}

export async function deleteLiveAlert(id: string): Promise<boolean> {
  if (!id) return false;

  DELETED_ALERT_IDS.add(id);
  IN_MEMORY_ALERTS = IN_MEMORY_ALERTS.filter((a) => a.id !== id);

  // 1. Try Supabase live_updates delete/upsert
  try {
    const existing = await fetchLiveAlerts(true);
    const updatedList = existing.filter((a) => a.id !== id);
    await supabase
      .from('live_updates')
      .upsert({
        module: 'live_alerts',
        value: JSON.stringify(updatedList),
        updated_at: new Date().toISOString()
      }, { onConflict: 'module' });
  } catch (e) {
    console.warn('Supabase live_updates delete warning:', e);
  }

  // 2. Try local file delete
  try {
    const local = await readLocalAlerts();
    const updatedLocal = local.filter((a) => a.id !== id);
    await writeLocalAlerts(updatedLocal);
  } catch (e) {}

  return true;
}

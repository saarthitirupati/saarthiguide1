'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Building2,
  Bell,
  Phone,
  RefreshCw,
  Clock,
  MessageCircle,
  LogOut,
  Lock,
  Mail,
  Search,
  Download,
  Trash2,
  CheckSquare,
  Calendar,
  IndianRupee,
  Check,
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  TrendingUp,
  Zap,
  ArrowRight,
  XCircle,
  CheckCircle2,
  ChevronDown,
  PlusCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type LeadStatus = 'pending' | 'not_lifted' | 'callback' | 'contacted' | 'yes' | 'no' | 'booked' | 'checked_in' | 'completed' | 'cancelled';
const BOOKED_LIFECYCLE: LeadStatus[] = ['booked', 'checked_in', 'completed'];
type DateFilterMode = 'all' | 'arrival' | 'booked' | 'created';
type AdminTab = 'overview' | 'leads' | 'bookings' | 'manual' | 'settings';

interface WaitlistEntry {
  id: string;
  service: string;
  timestamp: string;
  name?: string;
  phone?: string;
  email?: string;
  leadStatus?: LeadStatus;
  checkIn?: string;
  checkOut?: string;
  budget?: string;
  note?: string;
  advancePaid?: boolean;
  advanceAmount?: string;
  updatedAt?: string;
  bookedAt?: string;
}

const STATUS_META: Record<LeadStatus, { label: string; bg: string; color: string; border: string }> = {
  pending: { label: 'To-Do (New)', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  not_lifted: { label: 'Not Lifted', bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  callback: { label: 'Call Back Later', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  contacted: { label: 'Contacted', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  yes: { label: 'Yes (Interested)', bg: '#ECFDF5', color: '#15803D', border: '#BBF7D0' },
  booked: { label: 'Booked', bg: '#DCFCE7', color: '#065F46', border: '#86EFAC' },
  checked_in: { label: 'Checked In', bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
  completed: { label: 'Completed', bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  cancelled: { label: 'Cancelled', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
  no: { label: 'Not Interested', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
};

const STATUS_OPTIONS: LeadStatus[] = [
  'pending',
  'not_lifted',
  'callback',
  'contacted',
  'yes',
  'booked',
  'checked_in',
  'completed',
  'cancelled',
  'no',
];

function StatusSelect({
  value,
  onChange,
  compact = false,
}: {
  value: LeadStatus;
  onChange: (next: LeadStatus) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[value];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: meta.bg,
          color: meta.color,
          border: `1.5px solid ${meta.border}`,
          borderRadius: compact ? '999px' : '10px',
          padding: compact ? '4px 10px' : '7px 11px',
          fontSize: compact ? '11px' : '12px',
          fontWeight: 800,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: open ? '0 0 0 3px rgba(15, 81, 50, 0.12)' : 'none',
          transition: 'box-shadow 0.15s ease'
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: meta.color, flexShrink: 0 }} />
        <span>{meta.label.replace(' (New)', '').replace(' (Interested)', '')}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 80,
            minWidth: '185px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '6px',
            boxShadow: '0 14px 32px rgba(15, 23, 42, 0.14)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {STATUS_OPTIONS.map((opt) => {
            const optMeta = STATUS_META[opt];
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (opt !== value) onChange(opt);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: isSelected ? optMeta.bg : 'transparent',
                  color: isSelected ? optMeta.color : '#1E293B',
                  fontSize: '12px',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: optMeta.color, flexShrink: 0 }} />
                  <span>{optMeta.label}</span>
                </span>
                {isSelected && <Check size={13} color={optMeta.color} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function toIstYmd(value?: string | null): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);
}

function addIstDays(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return ymd;
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays, 12, 0, 0));
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(dt);
}

function buildSmoothAreaPath(values: number[], width: number, height: number, padTop = 14, padBottom = 18): { line: string; area: string; points: { x: number; y: number }[] } {
  const maxVal = Math.max(...values, 1);
  const usableH = height - padTop - padBottom;
  const stepX = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((v, i) => ({
    x: i * stepX,
    y: padTop + usableH - (v / maxVal) * usableH,
  }));

  if (points.length === 0) return { line: '', area: '', points: [] };

  let line = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    line += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
  return { line, area, points };
}

export default function SaarthiHotelAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [roomsNotifyCount, setRoomsNotifyCount] = useState<number>(0);
  const [notifyItems, setNotifyItems] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [todoFilter, setTodoFilter] = useState<'all' | LeadStatus>('all');
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;
  const [drafts, setDrafts] = useState<Record<string, { checkIn: string; checkOut: string; budget: string; note: string; advancePaid: boolean; advanceAmount: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [lastSynced, setLastSynced] = useState('');
  const [actionError, setActionError] = useState('');
  const [contactPhone, setContactPhone] = useState('9618831607');
  const [savingPhone, setSavingPhone] = useState(false);
  const [savedPhone, setSavedPhone] = useState(false);
  const [bookingsPaused, setBookingsPaused] = useState(true);
  const [togglingPaused, setTogglingPaused] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [expandedNoteIds, setExpandedNoteIds] = useState<Record<string, boolean>>({});
  const [manualForm, setManualForm] = useState<{
    name: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    budget: string;
    note: string;
    advancePaid: boolean;
    advanceAmount: string;
    leadStatus: LeadStatus;
  }>({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    budget: '',
    note: '',
    advancePaid: false,
    advanceAmount: '',
    leadStatus: 'booked',
  });
  const [submittingManual, setSubmittingManual] = useState(false);
  const [manualSuccess, setManualSuccess] = useState('');
  const [manualError, setManualError] = useState('');
  const [trendMode, setTrendMode] = useState<'leads' | 'arrivals'>('leads');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const pendingMutationIdsRef = useRef<Set<string>>(new Set());
  const lastMutationAtRef = useRef<number>(0);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 900);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const getAdminToken = () => {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem('saarthi_hotel_admin_token') || '';
    } catch {
      return '';
    }
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const fetchStartedAt = Date.now();

    try {
      const interestRes = await fetch('/api/launch-interest', { cache: 'no-store' });

      if (interestRes.ok) {
        const interestData = await interestRes.json();
        if (interestData?.success) {
          if (pendingMutationIdsRef.current.size > 0 || lastMutationAtRef.current > fetchStartedAt) {
            return;
          }
          setRoomsNotifyCount(Number(interestData.rooms) || 0);
          if (typeof interestData.contactPhone === 'string' && interestData.contactPhone.length === 10) {
            setContactPhone(interestData.contactPhone);
          }
          if (typeof interestData.bookingsPaused === 'boolean') {
            setBookingsPaused(interestData.bookingsPaused);
          }
          const recentList: WaitlistEntry[] = Array.isArray(interestData.recent) ? interestData.recent : [];
          const roomItems = recentList.filter((item) => item.service === 'rooms');
          setNotifyItems(roomItems);
          setDrafts((prev) => {
            const next = { ...prev };
            for (const item of roomItems) {
              if (!next[item.id]) {
                next[item.id] = {
                  checkIn: item.checkIn || '',
                  checkOut: item.checkOut || '',
                  budget: item.budget || '',
                  note: item.note || '',
                  advancePaid: Boolean(item.advancePaid),
                  advanceAmount: item.advanceAmount || '',
                };
              }
            }
            return next;
          });
        }
      }

      setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Failed to load saarthihoteladmin data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let authed = false;
    if (typeof window !== 'undefined') {
      const hasToken = localStorage.getItem('saarthi_hotel_admin_token') === 'saarthi_hotel_admin_2026';
      authed = hasToken;
      setIsAuthenticated(authed);
      setAuthChecked(true);
    }

    if (!authed) return;

    fetchData();

    const channel = supabase
      .channel(`saarthi_hotel_admin_${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_updates' },
        (payload: any) => {
          if (
            payload?.new?.module === 'launch_waitlist' ||
            payload?.new?.module === 'hotel_booking'
          ) {
            fetchData(true);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hotel_bookings' },
        () => fetchData(true)
      )
      .subscribe();

    const interval = setInterval(() => {
      if (typeof document === 'undefined' || !document.hidden) {
        fetchData(true);
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/saarthihoteladmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.ok) {
        const d = await res.json();
        try {
          localStorage.setItem('saarthi_hotel_admin_token', d.token || 'saarthi_hotel_admin_2026');
        } catch {}
        setIsAuthenticated(true);
      } else {
        const d = await res.json().catch(() => ({}));
        setLoginError(d.error || 'Invalid Hotel Admin ID or password.');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/saarthihoteladmin/login', { method: 'DELETE' });
    } catch {}
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('saarthi_hotel_admin_token');
      } catch {}
    }
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const updateLead = async (
    id: string,
    updates: { leadStatus?: LeadStatus; checkIn?: string; checkOut?: string; budget?: string; note?: string; advancePaid?: boolean; advanceAmount?: string }
  ) => {
    setActionError('');
    setSavingId(id);
    pendingMutationIdsRef.current.add(id);
    lastMutationAtRef.current = Date.now();

    const prevItem = notifyItems.find((item) => item.id === id);
    const nowIso = new Date().toISOString();
    setNotifyItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = updates.leadStatus ?? item.leadStatus;
        const nextBookedAt =
          nextStatus && BOOKED_LIFECYCLE.includes(nextStatus)
            ? (item.leadStatus && BOOKED_LIFECYCLE.includes(item.leadStatus) && item.bookedAt ? item.bookedAt : nowIso)
            : undefined;
        return {
          ...item,
          ...updates,
          updatedAt: nowIso,
          bookedAt: nextBookedAt,
        };
      })
    );

    try {
      const res = await fetch('/api/launch-interest', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-admin-token': getAdminToken(),
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.status === 401) {
        try {
          localStorage.removeItem('saarthi_hotel_admin_token');
        } catch {}
        setIsAuthenticated(false);
        setLoginError('Session expired. Please sign in again.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        if (prevItem) {
          setNotifyItems((prev) => prev.map((item) => (item.id === id ? prevItem : item)));
        }
        setActionError(data?.error || 'Could not save status change. Please try again.');
        return;
      }

      lastMutationAtRef.current = Date.now();
      if (data?.item) {
        setNotifyItems((prev) => prev.map((item) => (item.id === id ? data.item : item)));
      }
      setSavedId(id);
      setTimeout(() => setSavedId((curr) => (curr === id ? null : curr)), 2000);
    } catch (e) {
      console.error('Failed to update lead:', e);
      if (prevItem) {
        setNotifyItems((prev) => prev.map((item) => (item.id === id ? prevItem : item)));
      }
      setActionError('Network error while saving. Please try again.');
    } finally {
      pendingMutationIdsRef.current.delete(id);
      setSavingId(null);
    }
  };

  const handleDraftChange = (id: string, field: 'checkIn' | 'checkOut' | 'budget' | 'note' | 'advanceAmount', value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        checkIn: prev[id]?.checkIn || '',
        checkOut: prev[id]?.checkOut || '',
        budget: prev[id]?.budget || '',
        note: prev[id]?.note || '',
        advancePaid: prev[id]?.advancePaid ?? false,
        advanceAmount: prev[id]?.advanceAmount || '',
        [field]: value,
      },
    }));
  };

  const handleDraftAdvancePaidChange = (id: string, paid: boolean) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        checkIn: prev[id]?.checkIn || '',
        checkOut: prev[id]?.checkOut || '',
        budget: prev[id]?.budget || '',
        note: prev[id]?.note || '',
        advancePaid: paid,
        advanceAmount: paid ? (prev[id]?.advanceAmount || '') : '',
      },
    }));
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = manualForm.name.trim();
    const cleanDigits = manualForm.phone.replace(/\D/g, '').slice(-10);
    if (cleanName.length < 2) {
      setManualError('Please enter pilgrim name (at least 2 characters).');
      return;
    }
    if (cleanDigits.length !== 10) {
      setManualError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (manualForm.checkIn && manualForm.checkOut && manualForm.checkOut < manualForm.checkIn) {
      setManualError('Check-out date cannot be before Check-in date.');
      return;
    }

    setManualError('');
    setManualSuccess('');
    setSubmittingManual(true);
    lastMutationAtRef.current = Date.now();

    try {
      const res = await fetch('/api/launch-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-admin-token': getAdminToken(),
        },
        body: JSON.stringify({
          service: 'rooms',
          manual: true,
          name: cleanName,
          phone: cleanDigits,
          checkIn: manualForm.checkIn,
          checkOut: manualForm.checkOut,
          budget: manualForm.budget,
          note: manualForm.note,
          advancePaid: manualForm.advancePaid,
          advanceAmount: manualForm.advancePaid ? manualForm.advanceAmount : '',
          leadStatus: manualForm.leadStatus,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setManualError(data?.error || 'Failed to save manual booking.');
        return;
      }

      lastMutationAtRef.current = Date.now();
      if (data?.item) {
        setNotifyItems((prev) => [data.item, ...prev]);
        setDrafts((prev) => ({
          ...prev,
          [data.item.id]: {
            checkIn: data.item.checkIn || '',
            checkOut: data.item.checkOut || '',
            budget: data.item.budget || '',
            note: data.item.note || '',
            advancePaid: Boolean(data.item.advancePaid),
            advanceAmount: data.item.advanceAmount || '',
          },
        }));
      }
      if (typeof data?.counts?.rooms === 'number') {
        setRoomsNotifyCount(data.counts.rooms);
      }

      setManualSuccess(`Saved ${cleanName} (${STATUS_META[manualForm.leadStatus].label}).`);
      setManualForm({
        name: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        budget: '',
        note: '',
        advancePaid: false,
        advanceAmount: '',
        leadStatus: 'booked',
      });
    } catch {
      setManualError('Network error while saving manual booking.');
    } finally {
      setSubmittingManual(false);
    }
  };

  const handleToggleBookingsPaused = async () => {
    if (togglingPaused) return;
    const nextPaused = !bookingsPaused;
    setActionError('');
    setTogglingPaused(true);
    lastMutationAtRef.current = Date.now();
    setBookingsPaused(nextPaused);
    try {
      const res = await fetch('/api/launch-interest', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-admin-token': getAdminToken(),
        },
        body: JSON.stringify({ bookingsPaused: nextPaused }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setBookingsPaused(!nextPaused);
        setActionError(data?.error || 'Failed to update booking status.');
        return;
      }
      lastMutationAtRef.current = Date.now();
      if (typeof data?.bookingsPaused === 'boolean') {
        setBookingsPaused(data.bookingsPaused);
      }
    } catch {
      setBookingsPaused(!nextPaused);
      setActionError('Network error while toggling booking status.');
    } finally {
      setTogglingPaused(false);
    }
  };

  const handleSaveContactPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = contactPhone.replace(/\D/g, '').slice(-10);
    if (digits.length !== 10 || savingPhone) return;
    setActionError('');
    setSavingPhone(true);
    lastMutationAtRef.current = Date.now();
    try {
      const res = await fetch('/api/launch-interest', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-admin-token': getAdminToken(),
        },
        body: JSON.stringify({ contactPhone: digits }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setActionError(data?.error || 'Failed to update contact number.');
        return;
      }
      lastMutationAtRef.current = Date.now();
      setContactPhone(digits);
      setSavedPhone(true);
      setTimeout(() => setSavedPhone(false), 2000);
    } catch {
      setActionError('Network error while updating contact number.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleClearAll = async () => {
    if (clearing || notifyItems.length === 0) return;
    if (typeof window !== 'undefined' && !window.confirm('Clear all room notify leads? This cannot be undone.')) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch('/api/launch-interest?service=rooms', {
        method: 'DELETE',
        headers: { 'x-hotel-admin-token': getAdminToken() },
      });
      if (res.ok) {
        setRoomsNotifyCount(0);
        setNotifyItems([]);
      }
    } catch (e) {
      console.error('Failed to clear room notify leads:', e);
    } finally {
      setClearing(false);
    }
  };

  const todayIstYmd = useMemo(
    () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
    []
  );

  const todayIstStr = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
    []
  );

  const todayCount = useMemo(
    () => notifyItems.filter((item) => toIstYmd(item.timestamp) === todayIstYmd).length,
    [notifyItems, todayIstYmd]
  );

  const pendingTodoCount = useMemo(
    () => notifyItems.filter((item) => (item.leadStatus || 'pending') === 'pending').length,
    [notifyItems]
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const hasDateRange = dateFilterMode !== 'all' && (Boolean(dateFrom) || Boolean(dateTo));
    const effectiveFrom = dateFrom || dateTo;
    const effectiveTo = dateTo || dateFrom;

    const filtered = notifyItems.filter((item) => {
      const status = item.leadStatus || 'pending';
      if (activeTab === 'bookings') {
        if (!BOOKED_LIFECYCLE.includes(status)) return false;
      } else if (todoFilter !== 'all' && status !== todoFilter) {
        return false;
      }

      if (hasDateRange) {
        let targetYmd = '';
        if (dateFilterMode === 'arrival') {
          targetYmd = toIstYmd(item.checkIn);
        } else if (dateFilterMode === 'booked') {
          if (!BOOKED_LIFECYCLE.includes(status)) return false;
          targetYmd = toIstYmd(item.bookedAt || item.updatedAt || item.timestamp);
        } else if (dateFilterMode === 'created') {
          targetYmd = toIstYmd(item.timestamp);
        }
        if (!targetYmd) return false;
        if (effectiveFrom && targetYmd < effectiveFrom) return false;
        if (effectiveTo && targetYmd > effectiveTo) return false;
      }

      if (!q) return true;
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q)
      );
    });

    if (activeTab === 'bookings') {
      return [...filtered].sort((a, b) => {
        const aIn = toIstYmd(a.checkIn) || '9999-99-99';
        const bIn = toIstYmd(b.checkIn) || '9999-99-99';
        return aIn.localeCompare(bIn);
      });
    }
    return filtered;
  }, [notifyItems, searchQuery, todoFilter, dateFilterMode, dateFrom, dateTo, activeTab]);

  const filteredBookedCount = useMemo(
    () => filteredItems.filter((item) => item.leadStatus && BOOKED_LIFECYCLE.includes(item.leadStatus)).length,
    [filteredItems]
  );

  const dashboardMetrics = useMemo(() => {
    const tomorrowYmd = addIstDays(todayIstYmd, 1);
    const statusCounts: Record<LeadStatus, number> = {
      pending: 0,
      not_lifted: 0,
      callback: 0,
      contacted: 0,
      yes: 0,
      booked: 0,
      checked_in: 0,
      completed: 0,
      cancelled: 0,
      no: 0,
    };

    let arrivingTodayTotal = 0;
    let arrivingTodayBooked = 0;
    let arrivingTomorrowTotal = 0;
    let arrivingTomorrowBooked = 0;
    let bookedToday = 0;

    const last7Map = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      last7Map.set(addIstDays(todayIstYmd, -i), 0);
    }

    const next7Map = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      next7Map.set(addIstDays(todayIstYmd, i), 0);
    }

    for (const item of notifyItems) {
      const st: LeadStatus = item.leadStatus || 'pending';
      statusCounts[st] = (statusCounts[st] || 0) + 1;

      const createdYmd = toIstYmd(item.timestamp);
      if (createdYmd && last7Map.has(createdYmd)) {
        last7Map.set(createdYmd, (last7Map.get(createdYmd) || 0) + 1);
      }

      const checkInYmd = toIstYmd(item.checkIn);
      if (checkInYmd === todayIstYmd) {
        arrivingTodayTotal++;
        if (st === 'booked') arrivingTodayBooked++;
      } else if (checkInYmd === tomorrowYmd) {
        arrivingTomorrowTotal++;
        if (st === 'booked') arrivingTomorrowBooked++;
      }

      if (checkInYmd && next7Map.has(checkInYmd)) {
        next7Map.set(checkInYmd, (next7Map.get(checkInYmd) || 0) + 1);
      }

      if (st === 'booked' && toIstYmd(item.bookedAt || item.updatedAt || item.timestamp) === todayIstYmd) {
        bookedToday++;
      }
    }

    const totalLeads = notifyItems.length;
    const totalConfirmedLifecycle = statusCounts.booked + statusCounts.checked_in + statusCounts.completed;
    const bookedRatePct = totalLeads > 0 ? Math.round((totalConfirmedLifecycle / totalLeads) * 100) : 0;
    const interestedAndBookedPct = totalLeads > 0
      ? Math.round(((totalConfirmedLifecycle + statusCounts.yes) / totalLeads) * 100)
      : 0;

    const formatShortDay = (ymd: string) => {
      const [y, m, d] = ymd.split('-').map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(dt);
    };

    const last7Series = Array.from(last7Map.entries()).map(([ymd, count]) => ({
      ymd,
      label: ymd === todayIstYmd ? 'Today' : formatShortDay(ymd),
      count,
    }));

    const next7Series = Array.from(next7Map.entries()).map(([ymd, count], idx) => ({
      ymd,
      label: idx === 0 ? 'Today' : idx === 1 ? 'Tmrw' : formatShortDay(ymd),
      count,
    }));

    return {
      tomorrowYmd,
      statusCounts,
      arrivingTodayTotal,
      arrivingTodayBooked,
      arrivingTomorrowTotal,
      arrivingTomorrowBooked,
      bookedToday,
      followUpRetry: statusCounts.not_lifted + statusCounts.callback,
      bookedRatePct,
      interestedAndBookedPct,
      last7Series,
      next7Series,
    };
  }, [notifyItems, todayIstYmd]);

  const handleExportCsv = () => {
    const source = activeTab === 'overview' || activeTab === 'settings' ? notifyItems : filteredItems;
    if (source.length === 0) return;
    const rows = [
      ['Name', 'Mobile', 'Status', 'Check-in', 'Check-out', 'Preferred Budget', 'Advance Paid', 'Advance Amount', 'Note', 'Booked At', 'Submitted At'],
      ...source.map((item) => [
        (item.name || 'Pilgrim').replace(/,/g, ' '),
        item.phone ? `+91 ${item.phone}` : '',
        item.leadStatus || 'pending',
        item.checkIn || '',
        item.checkOut || '',
        (item.budget || '').replace(/,/g, ' '),
        item.advancePaid ? 'Yes' : 'No',
        item.advancePaid && item.advanceAmount ? item.advanceAmount : '',
        (item.note || '').replace(/,/g, ' ').replace(/\n/g, ' '),
        item.leadStatus === 'booked' && (item.bookedAt || item.updatedAt)
          ? new Date(item.bookedAt || item.updatedAt || '').toLocaleString('en-IN')
          : '',
        new Date(item.timestamp).toLocaleString('en-IN')
      ])
    ];
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-rooms-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters =
    todoFilter !== 'all' ||
    searchQuery.trim().length > 0 ||
    (dateFilterMode !== 'all' && (Boolean(dateFrom) || Boolean(dateTo)));

  const resetAllFilters = () => {
    setTodoFilter('all');
    setSearchQuery('');
    setDateFilterMode('all');
    setDateFrom('');
    setDateTo('');
  };

  const applyDatePreset = (preset: 'today' | 'tomorrow' | 'next7' | 'month' | 'clear') => {
    if (preset === 'clear') {
      setDateFilterMode('all');
      setDateFrom('');
      setDateTo('');
      return;
    }
    const nextMode: DateFilterMode = dateFilterMode === 'all' ? 'arrival' : dateFilterMode;
    setDateFilterMode(nextMode);
    if (preset === 'today') {
      setDateFrom(todayIstYmd);
      setDateTo(todayIstYmd);
    } else if (preset === 'tomorrow') {
      const tmrw = addIstDays(todayIstYmd, 1);
      setDateFrom(tmrw);
      setDateTo(tmrw);
    } else if (preset === 'next7') {
      setDateFrom(todayIstYmd);
      setDateTo(addIstDays(todayIstYmd, 6));
    } else if (preset === 'month') {
      const [y, m] = todayIstYmd.split('-');
      const lastDay = new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate();
      setDateFrom(`${y}-${m}-01`);
      setDateTo(`${y}-${m}-${String(lastDay).padStart(2, '0')}`);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, todoFilter, dateFilterMode, dateFrom, dateTo, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(
    () => filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredItems, safePage]
  );

  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F7F6',
        color: '#0F5132',
        fontWeight: 700,
        fontSize: '14px'
      }}>
        Checking admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#0F172A'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px 24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#ECFDF5',
              color: '#0F5132',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Building2 size={26} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
              Tirupati Rooms Admin
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Saarthi Rooms Booking &amp; Leads Control
            </p>
          </div>

          {loginError && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '14px'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Admin Email</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '0 12px',
                backgroundColor: '#F8FAFC'
              }}>
                <Mail size={16} color="#64748B" style={{ marginRight: '8px' }} />
                <input
                  type="email"
                  required
                  placeholder="saarthihoteladmin@saarthiguide.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '11px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    color: '#0F172A'
                  }}
                />
              </div>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Password</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '0 12px',
                backgroundColor: '#F8FAFC'
              }}>
                <Lock size={16} color="#64748B" style={{ marginRight: '8px' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '11px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    color: '#0F172A'
                  }}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loggingIn}
              style={{
                backgroundColor: '#0F5132',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: loggingIn ? 'wait' : 'pointer',
                marginTop: '4px'
              }}
            >
              {loggingIn ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeSeries = trendMode === 'leads' ? dashboardMetrics.last7Series : dashboardMetrics.next7Series;
  const trendValues = activeSeries.map((s) => s.count);
  const trendChart = buildSmoothAreaPath(trendValues, 520, 150);
  const trendMax = Math.max(...trendValues, 1);

  const totalForRing = Math.max(notifyItems.length, 1);
  const confirmedLifecycleCount =
    dashboardMetrics.statusCounts.booked +
    dashboardMetrics.statusCounts.checked_in +
    dashboardMetrics.statusCounts.completed;
  const followUpRingCount =
    dashboardMetrics.statusCounts.pending +
    dashboardMetrics.statusCounts.callback +
    dashboardMetrics.statusCounts.not_lifted +
    dashboardMetrics.statusCounts.contacted;
  const closedRingCount = dashboardMetrics.statusCounts.no + dashboardMetrics.statusCounts.cancelled;

  const bookedPct = (confirmedLifecycleCount / totalForRing) * 100;
  const yesPct = (dashboardMetrics.statusCounts.yes / totalForRing) * 100;
  const pendingPct = (followUpRingCount / totalForRing) * 100;
  const noPct = (closedRingCount / totalForRing) * 100;

  const ringRadius = 48;
  const ringCirc = 2 * Math.PI * ringRadius;
  const segBooked = (bookedPct / 100) * ringCirc;
  const segYes = (yesPct / 100) * ringCirc;
  const segPending = (pendingPct / 100) * ringCirc;
  const segNo = (noPct / 100) * ringCirc;

  const navItems: { key: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { key: 'bookings', label: 'Bookings', icon: <Calendar size={17} />, badge: confirmedLifecycleCount },
    { key: 'manual', label: 'Manual Booking', icon: <PlusCircle size={17} /> },
    { key: 'leads', label: 'Pilgrims List', icon: <Users size={17} />, badge: pendingTodoCount },
    { key: 'settings', label: 'Settings', icon: <Settings size={17} /> },
  ];

  const pageMeta: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: 'Dashboard', subtitle: 'Welcome to Tirupati Rooms Booking Admin Panel' },
    bookings: { title: 'Confirmed Bookings', subtitle: 'Booked pilgrims sorted by upcoming Check-in date' },
    manual: { title: 'Manual Booking', subtitle: 'Add phone, Instagram DM, or walk-in room bookings anytime (24/7)' },
    leads: { title: 'Pilgrims List & To-Do', subtitle: 'Search, filter by arrival or booking date, and update status' },
    settings: { title: 'Desk Settings', subtitle: 'Control live /room-booking availability, desk phone & exports' },
  };

  const navigateTo = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setCurrentPage(1);
  };

  const sidebarContent = (
    <div style={{
      width: '235px',
      minWidth: '235px',
      background: 'linear-gradient(180deg, #0F5132 0%, #064E3B 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '20px 14px',
      boxSizing: 'border-box'
    }}>
      <div>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(253,230,138,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDE68A'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.15 }}>Tirupati</div>
              <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: 600 }}>Rooms Booking</div>
            </div>
          </div>
          {!isDesktop && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((nav) => {
            const active = activeTab === nav.key;
            return (
              <button
                key={nav.key}
                type="button"
                onClick={() => navigateTo(nav.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: active ? '#D1FAE5' : 'transparent',
                  color: active ? '#064E3B' : '#E2F2EA',
                  fontSize: '13.5px',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {nav.icon}
                  <span>{nav.label}</span>
                </span>
                {typeof nav.badge === 'number' && nav.badge > 0 && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    backgroundColor: active ? '#0F5132' : 'rgba(255,255,255,0.16)',
                    color: '#FFFFFF'
                  }}>
                    {nav.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Live Status + Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.09)',
          borderRadius: '12px',
          padding: '10px 12px',
          fontSize: '11.5px',
          color: '#D1FAE5'
        }}>
          <div style={{ fontWeight: 800, marginBottom: '2px', color: '#FFFFFF' }}>
            Desk Status: {bookingsPaused ? 'Paused' : 'Live'}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.9 }}>
            {bookingsPaused ? 'Online requests paused' : 'Open 6 AM – 10 PM IST'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7F6',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex'
    }}>
      {/* Desktop Fixed Full-Height Sidebar */}
      {isDesktop && (
        <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40 }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer Sidebar */}
      {!isDesktop && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ height: '100%' }}>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0, marginLeft: isDesktop ? '235px' : 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: isDesktop ? '14px 22px' : '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0F172A'
                }}
              >
                <Menu size={18} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#0F172A', lineHeight: 1.2 }}>
                {pageMeta[activeTab].title}
              </h1>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                {pageMeta[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleToggleBookingsPaused}
              disabled={togglingPaused}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '999px',
                border: `1.5px solid ${bookingsPaused ? '#FDE68A' : '#86EFAC'}`,
                backgroundColor: bookingsPaused ? '#FEF3C7' : '#DCFCE7',
                color: bookingsPaused ? '#92400E' : '#065F46',
                fontSize: '12px',
                fontWeight: 800,
                cursor: togglingPaused ? 'wait' : 'pointer'
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: bookingsPaused ? '#D97706' : '#16A34A'
              }} />
              <span>{togglingPaused ? 'Updating...' : bookingsPaused ? 'Paused (Resume)' : 'Live (Pause)'}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F8FAFC',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} />
              <span>{refreshing ? 'Syncing...' : lastSynced || 'Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTodoFilter('pending');
                setDateFilterMode('all');
                setDateFrom('');
                setDateTo('');
                navigateTo('leads');
              }}
              title="View Pending To-Do Calls"
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155'
              }}
            >
              <Bell size={16} />
              {pendingTodoCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  borderRadius: '999px',
                  padding: '1px 5px',
                  lineHeight: 1.3
                }}>
                  {pendingTodoCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main style={{ padding: isDesktop ? '20px 22px' : '14px 12px', maxWidth: '1200px', width: '100%', boxSizing: 'border-box' }}>
          {actionError && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              {actionError}
            </div>
          )}

          {/* ══════════════════ OVERVIEW DASHBOARD ══════════════════ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Row 1: 4 Pastel KPI Cards with Wave Sparklines */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px'
              }}>
                {[
                  {
                    title: 'Total Leads',
                    value: loading ? '—' : notifyItems.length,
                    sub: `+${todayCount} today`,
                    bg: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 75%)',
                    border: '#BBF7D0',
                    iconBg: '#DCFCE7',
                    accent: '#15803D',
                    wave: '#86EFAC',
                    icon: <Building2 size={18} />,
                    onClick: () => { resetAllFilters(); navigateTo('leads'); }
                  },
                  {
                    title: 'Pending To-Do',
                    value: loading ? '—' : pendingTodoCount,
                    sub: `+${dashboardMetrics.followUpRetry} retry queue`,
                    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 75%)',
                    border: '#FED7AA',
                    iconBg: '#FFEDD5',
                    accent: '#C2410C',
                    wave: '#FDBA74',
                    icon: <Clock size={18} />,
                    onClick: () => { setTodoFilter('pending'); setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('leads'); }
                  },
                  {
                    title: 'Confirmed Booked',
                    value: loading ? '—' : dashboardMetrics.statusCounts.booked,
                    sub: `${dashboardMetrics.bookedRatePct}% conversion`,
                    bg: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 75%)',
                    border: '#86EFAC',
                    iconBg: '#D1FAE5',
                    accent: '#065F46',
                    wave: '#6EE7B7',
                    icon: <CheckCircle2 size={18} />,
                    onClick: () => { setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('bookings'); }
                  },
                  {
                    title: 'Not Interested',
                    value: loading ? '—' : dashboardMetrics.statusCounts.no,
                    sub: `${dashboardMetrics.statusCounts.yes} still interested`,
                    bg: 'linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 75%)',
                    border: '#DDD6FE',
                    iconBg: '#EDE9FE',
                    accent: '#6D28D9',
                    wave: '#C4B5FD',
                    icon: <XCircle size={18} />,
                    onClick: () => { setTodoFilter('no'); setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('leads'); }
                  },
                ].map((card) => (
  <button
                    key={card.title}
                    type="button"
                    onClick={card.onClick}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left',
                      background: card.bg,
                      border: `1px solid ${card.border}`,
                      borderRadius: '18px',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: card.iconBg,
                        color: card.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {card.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{card.title}</div>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                          {card.value}
                        </div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: card.accent, marginTop: '2px' }}>
                          {card.sub}
                        </div>
                      </div>
                    </div>
                    <svg viewBox="0 0 200 40" preserveAspectRatio="none" style={{ position: 'absolute', right: 0, bottom: 0, width: '65%', height: '38px', opacity: 0.45 }}>
                      <path d="M0 32 Q 35 12, 70 26 T 140 16 T 200 22 L 200 40 L 0 40 Z" fill={card.wave} />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Row 2: Booking / Lead Trends (Area Chart) + Lead Breakdown (Donut Chart) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1.65fr 1fr' : '1fr',
                gap: '16px'
              }}>
                {/* Trends Area Chart */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={18} color="#0F5132" />
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                        {trendMode === 'leads' ? 'Lead Trends (Last 7 Days)' : 'Upcoming Arrivals (Next 7 Days)'}
                      </span>
                    </div>
                    <select
                      value={trendMode}
                      onChange={(e) => setTrendMode(e.target.value as 'leads' | 'arrivals')}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#0F172A',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="leads">Leads (Last 7 Days)</option>
                      <option value="arrivals">Arrivals (Next 7 Days)</option>
                    </select>
                  </div>

                  <div style={{ position: 'relative', width: '100%' }}>
                    <svg viewBox="0 0 520 160" style={{ width: '100%', height: '165px', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      {[0, 0.5, 1].map((ratio, idx) => {
                        const y = 14 + (150 - 32) * ratio;
                        const val = Math.round(trendMax * (1 - ratio));
                        return (
                          <g key={idx}>
                            <line x1="0" y1={y} x2="520" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                            <text x="0" y={y - 4} fontSize="10" fill="#94A3B8" fontWeight="700">{val}</text>
                          </g>
                        );
                      })}
                      {trendChart.area && <path d={trendChart.area} fill="url(#trendGrad)" />}
                      {trendChart.line && <path d={trendChart.line} fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />}
                      {trendChart.points.map((pt, i) => (
                        <g key={activeSeries[i].ymd}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" />
                          <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#0F5132">
                            {activeSeries[i].count}
                          </text>
                        </g>
                      ))}
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', padding: '0 4px' }}>
                      {activeSeries.map((s) => (
        <button
                          key={s.ymd}
                          type="button"
                          onClick={() => {
                            setTodoFilter('all');
                            setDateFilterMode(trendMode === 'leads' ? 'created' : 'arrival');
                            setDateFrom(s.ymd);
                            setDateTo(s.ymd);
                            navigateTo('leads');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: '2px 4px'
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Ring Breakdown */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <CheckSquare size={17} color="#0F5132" />
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                      Pipeline Status
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '136px', height: '136px', flexShrink: 0 }}>
                      <svg viewBox="0 0 120 120" style={{ width: '136px', height: '136px', transform: 'rotate(-90deg)' }}>
                        <circle cx="60" cy="60" r={ringRadius} fill="none" stroke="#F1F5F9" strokeWidth="12" />
                        <circle
                          cx="60" cy="60" r={ringRadius} fill="none" stroke="#0F5132" strokeWidth="12"
                          strokeDasharray={`${segBooked} ${ringCirc}`}
                          strokeDashoffset={0}
                        />
                        <circle
                          cx="60" cy="60" r={ringRadius} fill="none" stroke="#22C55E" strokeWidth="12"
                          strokeDasharray={`${segYes} ${ringCirc}`}
                          strokeDashoffset={-segBooked}
                        />
                        <circle
                          cx="60" cy="60" r={ringRadius} fill="none" stroke="#F59E0B" strokeWidth="12"
                          strokeDasharray={`${segPending} ${ringCirc}`}
                          strokeDashoffset={-(segBooked + segYes)}
                        />
                        <circle
                          cx="60" cy="60" r={ringRadius} fill="none" stroke="#CBD5E1" strokeWidth="12"
                          strokeDasharray={`${segNo} ${ringCirc}`}
                          strokeDashoffset={-(segBooked + segYes + segPending)}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                      }}>
                        <span style={{ fontSize: '21px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                          {dashboardMetrics.interestedAndBookedPct}%
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748B', marginTop: '3px' }}>
                          Booked / Yes
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 700, minWidth: '145px' }}>
                      {([
                        { label: 'Booked / Stay', count: confirmedLifecycleCount, color: '#0F5132', onClick: () => { setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('bookings'); } },
                        { label: 'Interested', count: dashboardMetrics.statusCounts.yes, color: '#22C55E', onClick: () => { setTodoFilter('yes'); setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('leads'); } },
                        { label: 'Follow-up', count: followUpRingCount, color: '#F59E0B', onClick: () => { setTodoFilter('pending'); setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('leads'); } },
                        { label: 'Closed / No', count: closedRingCount, color: '#CBD5E1', onClick: () => { setTodoFilter('no'); setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('leads'); } },
                      ] as const).map((row) => (
        <button
                          key={row.label}
                          type="button"
                          onClick={row.onClick}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '14px',
                            background: 'transparent',
                            border: 'none',
                            padding: '3px 6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#334155'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: row.color, flexShrink: 0 }} />
                            <span>{row.label}</span>
                          </span>
                          <span style={{ fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{row.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

  <button
                    type="button"
                    onClick={() => { resetAllFilters(); navigateTo('leads'); }}
                    style={{
                      marginTop: '14px',
                      width: '100%',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #BBF7D0',
                      color: '#0F5132',
                      borderRadius: '12px',
                      padding: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>View All Leads</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Row 3: Recent Leads Table + Quick Actions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1.65fr 1fr' : '1fr',
                gap: '16px'
              }}>
                {/* Recent Leads / Bookings Table */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
                  overflowX: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                      <Calendar size={16} color="#0F5132" /> Recent Leads &amp; Bookings
                    </span>
    <button
                      type="button"
                      onClick={() => { resetAllFilters(); navigateTo('leads'); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#0F5132',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        <th style={{ padding: '9px 10px', borderRadius: '8px 0 0 8px' }}>Pilgrim</th>
                        <th style={{ padding: '9px 8px' }}>Mobile</th>
                        <th style={{ padding: '9px 8px' }}>Stay Date</th>
                        <th style={{ padding: '9px 8px' }}>Status</th>
                        <th style={{ padding: '9px 10px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifyItems.slice(0, 6).map((item) => {
                        const st: LeadStatus = item.leadStatus || 'pending';
                        const meta = STATUS_META[st];
                        const displayName = item.name?.trim() || 'Pilgrim Visitor';
                        const clean10 = (item.phone || '').replace(/\D/g, '').slice(-10);
                        const formatYmd = (ymd?: string) => {
                          if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return '';
                          const [y, m, d] = ymd.split('-').map(Number);
                          return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' }).format(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
                        };
                        const inLabel = formatYmd(item.checkIn);
                        const outLabel = formatYmd(item.checkOut);
                        const waHref = clean10
                          ? `https://wa.me/91${clean10}?text=${encodeURIComponent(`Namaste ${displayName}! Regarding your Tirupati Room booking inquiry on Saarthi Guide...`)}`
                          : '#';

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '11px 10px' }}>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>
                                {displayName}
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                {new Date(item.timestamp).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </td>
                            <td style={{ padding: '11px 8px', fontWeight: 700, color: '#0F5132', whiteSpace: 'nowrap' }}>
                              {clean10 ? `+91 ${clean10}` : '—'}
                            </td>
                            <td style={{ padding: '11px 8px', whiteSpace: 'nowrap' }}>
                              {inLabel ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: '#F1F5F9',
                                  color: '#334155',
                                  borderRadius: '8px',
                                  padding: '4px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 700
                                }}>
                                  {outLabel ? `${inLabel} → ${outLabel}` : inLabel}
                                </span>
                              ) : (
                                <span style={{ color: '#94A3B8', fontWeight: 600 }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '11px 8px' }}>
                              <StatusSelect
                                value={st}
                                compact
                                onChange={(next) => updateLead(item.id, { leadStatus: next })}
                              />
                            </td>
                            <td style={{ padding: '11px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {clean10 && (
                                  <>
                                    <a
                                      href={`tel:+91${clean10}`}
                                      title="Call Pilgrim"
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        backgroundColor: '#F1F5F9',
                                        color: '#0F5132',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none'
                                      }}
                                    >
                                      <Phone size={13} />
                                    </a>
                                    <a
                                      href={waHref}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="WhatsApp Pilgrim"
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        backgroundColor: '#DCFCE7',
                                        color: '#15803D',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none'
                                      }}
                                    >
                                      <MessageCircle size={13} />
                                    </a>
                                  </>
                                )}
                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(clean10 || item.name || '');
                                    setTodoFilter('all');
                                    navigateTo('leads');
                                  }}
                                  style={{
                                    backgroundColor: '#EFF6FF',
                                    border: '1px solid #BFDBFE',
                                    color: '#1D4ED8',
                                    borderRadius: '8px',
                                    padding: '5px 10px',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {notifyItems.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                            No room leads yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quick Actions (2x2 Pastel Tiles) */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                    <Zap size={17} color="#D97706" />
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Quick Actions</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1 }}>
    <button
                      type="button"
                      onClick={() => {
                        setTodoFilter('all');
                        setDateFilterMode('arrival');
                        setDateFrom(todayIstYmd);
                        setDateTo(todayIstYmd);
                        navigateTo('leads');
                      }}
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #BBF7D0',
                        borderRadius: '14px',
                        padding: '14px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#0F5132',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      <Calendar size={18} />
                      <span>Arriving Today ({dashboardMetrics.arrivingTodayTotal})</span>
                    </button>

    <button
                      type="button"
                      onClick={() => { setDateFilterMode('all'); setDateFrom(''); setDateTo(''); navigateTo('bookings'); }}
                      style={{
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '14px',
                        padding: '14px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#1D4ED8',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>View Bookings ({dashboardMetrics.statusCounts.booked})</span>
                    </button>

    <button
                      type="button"
                      onClick={() => {
                        setTodoFilter('pending');
                        setDateFilterMode('all');
                        setDateFrom('');
                        setDateTo('');
                        navigateTo('leads');
                      }}
                      style={{
                        backgroundColor: '#F5F3FF',
                        border: '1px solid #DDD6FE',
                        borderRadius: '14px',
                        padding: '14px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#6D28D9',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      <Phone size={18} />
                      <span>Call To-Do ({pendingTodoCount})</span>
                    </button>

    <button
                      type="button"
                      onClick={() => navigateTo('settings')}
                      style={{
                        backgroundColor: '#FFF7ED',
                        border: '1px solid #FED7AA',
                        borderRadius: '14px',
                        padding: '14px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#C2410C',
                        fontWeight: 800,
                        fontSize: '12px'
                      }}
                    >
                      <Settings size={18} />
                      <span>Desk Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ MANUAL BOOKING TAB ══════════════════ */}
          {activeTab === 'manual' && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '22px',
              maxWidth: '680px',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Add Manual Room Booking / Lead
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
                  Works 24/7 even when public /room-booking is paused or outside 6 AM – 10 PM IST.
                </p>
              </div>

              {manualError && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  marginBottom: '14px'
                }}>
                  {manualError}
                </div>
              )}

              {manualSuccess && (
                <div style={{
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #BBF7D0',
                  color: '#065F46',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>{manualSuccess}</span>
  <button
                    type="button"
                    onClick={() => navigateTo('bookings')}
                    style={{
                      backgroundColor: '#0F5132',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '5px 11px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View in Bookings →
                  </button>
                </div>
              )}

              <form onSubmit={handleCreateManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Pilgrim Name <span style={{ color: '#DC2626' }}>*</span>
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder="e.g. Ramesh Kumar"
                      value={manualForm.name}
                      onChange={(e) => setManualForm((f) => ({ ...f, name: e.target.value }))}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                      Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '11px',
                      padding: '0 12px'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginRight: '6px' }}>+91</span>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={manualForm.phone}
                        onChange={(e) => setManualForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        style={{
                          flex: 1,
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent',
                          padding: '9px 0',
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#0F172A'
                        }}
                      />
                    </div>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Check-in Date</span>
                    <input
                      type="date"
                      value={manualForm.checkIn}
                      onChange={(e) => {
                        const nextIn = e.target.value;
                        setManualForm((f) => ({
                          ...f,
                          checkIn: nextIn,
                          checkOut: f.checkOut && nextIn && nextIn > f.checkOut ? '' : f.checkOut,
                        }));
                      }}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F172A'
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Check-out Date</span>
                    <input
                      type="date"
                      min={manualForm.checkIn || undefined}
                      value={manualForm.checkOut}
                      onChange={(e) => setManualForm((f) => ({ ...f, checkOut: e.target.value }))}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F172A'
                      }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Budget / Tariff</span>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="e.g. ₹1,500"
                      value={manualForm.budget}
                      onChange={(e) => setManualForm((f) => ({ ...f, budget: e.target.value }))}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Booking Status:</span>
                  <StatusSelect
                    value={manualForm.leadStatus}
                    onChange={(next) => setManualForm((f) => ({ ...f, leadStatus: next }))}
                  />
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Note (Source / Hotel / Room Details)</span>
                  <input
                    type="text"
                    maxLength={300}
                    placeholder="e.g. Instagram DM — AC Double near Bus Stand, ₹1,500 confirmed"
                    value={manualForm.note}
                    onChange={(e) => setManualForm((f) => ({ ...f, note: e.target.value }))}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '11px',
                      padding: '9px 12px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    backgroundColor: manualForm.advancePaid ? '#ECFDF5' : '#F8FAFC',
                    border: `1.5px solid ${manualForm.advancePaid ? '#86EFAC' : '#CBD5E1'}`,
                    borderRadius: '11px',
                    padding: '8px 12px'
                  }}>
                    <input
                      type="checkbox"
                      checked={manualForm.advancePaid}
                      onChange={(e) => setManualForm((f) => ({
                        ...f,
                        advancePaid: e.target.checked,
                        advanceAmount: e.target.checked ? f.advanceAmount : '',
                      }))}
                      style={{ width: '15px', height: '15px', accentColor: '#0F5132', cursor: 'pointer' }}
                    />
                    <span>Advance Paid</span>
                  </label>

                  {manualForm.advancePaid && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #86EFAC',
                      borderRadius: '11px',
                      padding: '0 10px'
                    }}>
                      <IndianRupee size={13} color="#0F5132" style={{ marginRight: '4px' }} />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Advance amount (e.g. 500)"
                        value={manualForm.advanceAmount}
                        onChange={(e) => setManualForm((f) => ({ ...f, advanceAmount: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                        style={{
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent',
                          padding: '8px 0',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          width: '170px'
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingManual}
                  style={{
                    backgroundColor: '#0F5132',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: submittingManual ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px'
                  }}
                >
                  <PlusCircle size={16} />
                  <span>{submittingManual ? 'Saving Booking...' : 'Save Manual Booking'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════ SETTINGS TAB ══════════════════ */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px' }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '18px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Online Room Booking Availability
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {bookingsPaused
                      ? 'Currently paused — /room-booking shows "Room Bookings Temporarily Paused".'
                      : 'Currently live — /room-booking accepts requests from 6:00 AM to 10:00 PM IST.'}
                  </div>
                </div>
<button
                  type="button"
                  onClick={handleToggleBookingsPaused}
                  disabled={togglingPaused}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: bookingsPaused ? '#0F5132' : '#B45309',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: togglingPaused ? 'wait' : 'pointer'
                  }}
                >
                  {togglingPaused ? 'Updating...' : bookingsPaused ? 'Resume Room Bookings' : 'Pause Room Bookings'}
                </button>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '18px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Room Booking Desk Mobile Number
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Shown dynamically on /room-booking for instant / urgent needs
                  </div>
                </div>
                <form onSubmit={handleSaveContactPhone} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0 10px'
                  }}>
                    <Phone size={13} color="#0F5132" style={{ marginRight: '6px' }} />
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginRight: '4px' }}>+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile"
                      style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        padding: '8px 0',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0F172A',
                        width: '105px'
                      }}
                    />
                  </div>
  <button
                    type="submit"
                    disabled={savingPhone || contactPhone.replace(/\D/g, '').length !== 10}
                    style={{
                      backgroundColor: savedPhone ? '#16A34A' : '#0F5132',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: savingPhone ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {savedPhone ? <><Check size={13} /> Updated</> : savingPhone ? 'Saving...' : 'Update Number'}
                  </button>
                </form>
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '18px',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Export or Clear Leads ({roomsNotifyCount} total)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Download all room leads as CSV or clear the list.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={notifyItems.length === 0}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: notifyItems.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Download size={13} /> Export All CSV
                  </button>
                  {notifyItems.length > 0 && (
    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={clearing}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#B91C1C',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: clearing ? 'wait' : 'pointer'
                      }}
                    >
                      <Trash2 size={13} /> {clearing ? 'Clearing...' : 'Clear All'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ LEADS & BOOKINGS LIST ══════════════════ */}
          {(activeTab === 'leads' || activeTab === 'bookings') && (
            <section style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '18px 20px',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
            }}>
              {/* Toolbar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    {activeTab === 'bookings' ? 'Confirmed Bookings' : 'Follow-Up To-Do & Customer Leads'}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                    {activeTab === 'bookings'
                      ? 'Sorted by upcoming Check-in date (soonest first).'
                      : `Today: ${todayCount} new (${todayIstStr}) • Mark status and save stay details.`}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F8FAFC',
                    border: `1.5px solid ${searchQuery ? '#0F5132' : '#CBD5E1'}`,
                    borderRadius: '11px',
                    padding: '6px 10px'
                  }}>
                    <Search size={14} color={searchQuery ? '#0F5132' : '#64748B'} />
                    <input
                      type="text"
                      placeholder="Search name or mobile..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        width: '160px'
                      }}
                    />
                    {searchQuery && (
      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        title="Clear search"
                        style={{
                          background: '#E2E8F0',
                          border: 'none',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#334155',
                          padding: 0
                        }}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>

  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={filteredItems.length === 0}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: filteredItems.length === 0 ? '#F8FAFC' : '#ECFDF5',
                      border: `1px solid ${filteredItems.length === 0 ? '#CBD5E1' : '#BBF7D0'}`,
                      color: filteredItems.length === 0 ? '#94A3B8' : '#0F5132',
                      borderRadius: '11px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: filteredItems.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Download size={13} />
                    <span>Export CSV ({filteredItems.length})</span>
                  </button>
                </div>
              </div>

              {/* Status Tabs with color-coded count badges (shown on Leads tab) */}
              {activeTab === 'leads' && (
                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {([
                    { key: 'all', label: 'All', count: notifyItems.length, badgeBg: '#E2E8F0', badgeColor: '#334155' },
                    { key: 'pending', label: 'To-Do', count: dashboardMetrics.statusCounts.pending, badgeBg: '#FEF3C7', badgeColor: '#92400E' },
                    { key: 'not_lifted', label: 'Not Lifted', count: dashboardMetrics.statusCounts.not_lifted, badgeBg: '#FFEDD5', badgeColor: '#C2410C' },
                    { key: 'callback', label: 'Call Back', count: dashboardMetrics.statusCounts.callback, badgeBg: '#EDE9FE', badgeColor: '#6D28D9' },
                    { key: 'contacted', label: 'Contacted', count: dashboardMetrics.statusCounts.contacted, badgeBg: '#DBEAFE', badgeColor: '#1D4ED8' },
                    { key: 'yes', label: 'Yes', count: dashboardMetrics.statusCounts.yes, badgeBg: '#DCFCE7', badgeColor: '#15803D' },
                    { key: 'booked', label: 'Booked', count: dashboardMetrics.statusCounts.booked, badgeBg: '#D1FAE5', badgeColor: '#065F46' },
                    { key: 'checked_in', label: 'Checked In', count: dashboardMetrics.statusCounts.checked_in, badgeBg: '#E0F2FE', badgeColor: '#0369A1' },
                    { key: 'completed', label: 'Completed', count: dashboardMetrics.statusCounts.completed, badgeBg: '#D1FAE5', badgeColor: '#047857' },
                    { key: 'cancelled', label: 'Cancelled', count: dashboardMetrics.statusCounts.cancelled, badgeBg: '#F1F5F9', badgeColor: '#475569' },
                    { key: 'no', label: 'Not Interested', count: dashboardMetrics.statusCounts.no, badgeBg: '#FEE2E2', badgeColor: '#991B1B' },
                  ] as const).map((tab) => {
                    const active = todoFilter === tab.key;
                    return (
      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setTodoFilter(tab.key)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: '999px',
                          border: `1.5px solid ${active ? '#0F5132' : '#E2E8F0'}`,
                          backgroundColor: active ? '#0F5132' : '#FFFFFF',
                          color: active ? '#FFFFFF' : '#334155',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{tab.label}</span>
                        <span style={{
                          padding: '1px 6px',
                          borderRadius: '999px',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          backgroundColor: active ? 'rgba(255,255,255,0.2)' : tab.badgeBg,
                          color: active ? '#FFFFFF' : tab.badgeColor
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Compact Single-Row Date Filter Bar */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '9px 12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#0F5132" /> Date Filter:
                  </span>
                  <select
                    value={dateFilterMode}
                    onChange={(e) => {
                      const next = e.target.value as DateFilterMode;
                      setDateFilterMode(next);
                      if (next !== 'all' && !dateFrom && !dateTo) {
                        setDateFrom(todayIstYmd);
                        setDateTo(todayIstYmd);
                      }
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${dateFilterMode !== 'all' ? '#0F5132' : '#CBD5E1'}`,
                      borderRadius: '9px',
                      padding: '5px 9px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Dates</option>
                    <option value="arrival">Arrivals (Check-in Date)</option>
                    <option value="booked">Bookings Made Date</option>
                    <option value="created">Lead Created Date</option>
                  </select>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDateFrom(v);
                        if (v && dateFilterMode === 'all') setDateFilterMode('arrival');
                        if (v && dateTo && v > dateTo) setDateTo(v);
                      }}
                      aria-label="Date from"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#0F172A'
                      }}
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 700 }}>to</span>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDateTo(v);
                        if (v && dateFilterMode === 'all') setDateFilterMode('arrival');
                      }}
                      aria-label="Date to"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#0F172A'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {(() => {
                    const tmrwYmd = addIstDays(todayIstYmd, 1);
                    const next7Ymd = addIstDays(todayIstYmd, 6);
                    const [ymY, ymM] = todayIstYmd.split('-');
                    const monthLast = `${ymY}-${ymM}-${String(new Date(Date.UTC(Number(ymY), Number(ymM), 0)).getUTCDate()).padStart(2, '0')}`;
                    const monthFirst = `${ymY}-${ymM}-01`;

                    const presets: { key: 'today' | 'tomorrow' | 'next7' | 'month'; label: string; isActive: boolean }[] = [
                      { key: 'today', label: 'Today', isActive: dateFilterMode !== 'all' && dateFrom === todayIstYmd && dateTo === todayIstYmd },
                      { key: 'tomorrow', label: 'Tomorrow', isActive: dateFilterMode !== 'all' && dateFrom === tmrwYmd && dateTo === tmrwYmd },
                      { key: 'next7', label: 'Next 7 Days', isActive: dateFilterMode !== 'all' && dateFrom === todayIstYmd && dateTo === next7Ymd },
                      { key: 'month', label: 'This Month', isActive: dateFilterMode !== 'all' && dateFrom === monthFirst && dateTo === monthLast },
                    ];

                    return (
                      <>
                        {presets.map((p) => (
          <button
                            key={p.key}
                            type="button"
                            onClick={() => applyDatePreset(p.key)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              border: `1px solid ${p.isActive ? '#0F5132' : '#CBD5E1'}`,
                              backgroundColor: p.isActive ? '#ECFDF5' : '#FFFFFF',
                              color: p.isActive ? '#0F5132' : '#334155',
                              fontSize: '11.5px',
                              fontWeight: p.isActive ? 800 : 700,
                              cursor: 'pointer'
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                        {(dateFilterMode !== 'all' || dateFrom || dateTo) && (
          <button
                            type="button"
                            onClick={() => applyDatePreset('clear')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#B91C1C',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {hasActiveFilters && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  marginBottom: '14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#065F46'
                }}>
                  <span>
                    {dateFilterMode === 'arrival' && (dateFrom || dateTo)
                      ? `Arrivals (${dateFrom || dateTo}${dateTo && dateTo !== dateFrom ? ` → ${dateTo}` : ''}): `
                      : dateFilterMode === 'booked' && (dateFrom || dateTo)
                        ? `Bookings Made (${dateFrom || dateTo}${dateTo && dateTo !== dateFrom ? ` → ${dateTo}` : ''}): `
                        : dateFilterMode === 'created' && (dateFrom || dateTo)
                          ? `Leads Created (${dateFrom || dateTo}${dateTo && dateTo !== dateFrom ? ` → ${dateTo}` : ''}): `
                          : 'Filtered: '}
                    {filteredItems.length} matching ({filteredBookedCount} Booked)
                  </span>
  <button
                    type="button"
                    onClick={resetAllFilters}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #86EFAC',
                      color: '#065F46',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div style={{
                  padding: '42px 20px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px dashed #CBD5E1'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    No matching records found
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    Try clearing your search, date filter, or switching tabs.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {paginatedItems.map((item) => {
                    const digits = (item.phone || '').replace(/\D/g, '');
                    const clean10 = digits.slice(-10);
                    const displayName = item.name?.trim() || 'Pilgrim Visitor';
                    const currentStatus: LeadStatus = item.leadStatus || 'pending';
                    const statusStyle = STATUS_META[currentStatus];
                    const showStayDetails = currentStatus === 'yes' || BOOKED_LIFECYCLE.includes(currentStatus);
                    const isNoteOpen = Boolean(expandedNoteIds[item.id]);
                    const draft = drafts[item.id] || {
                      checkIn: item.checkIn || '',
                      checkOut: item.checkOut || '',
                      budget: item.budget || '',
                      note: item.note || '',
                      advancePaid: Boolean(item.advancePaid),
                      advanceAmount: item.advanceAmount || '',
                    };
                    const formatYmd = (ymd?: string) => {
                      if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return '';
                      const [y, m, d] = ymd.split('-').map(Number);
                      return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' }).format(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
                    };
                    const inLabel = formatYmd(item.checkIn);
                    const outLabel = formatYmd(item.checkOut);

                    const waUrl = clean10
                      ? `https://wa.me/91${clean10}?text=${encodeURIComponent(`Namaste ${displayName}! Regarding your Tirupati Room booking inquiry on Saarthi Guide...`)}`
                      : '#';

                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#FFFFFF',
                          border: `1.5px solid ${showStayDetails ? '#BBF7D0' : '#E2E8F0'}`,
                          borderRadius: '14px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                              {displayName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '3px' }}>
                              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F5132' }}>
                                {clean10 ? `+91 ${clean10}` : 'No mobile'}
                              </span>
                              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                                • {new Date(item.timestamp).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                              {(inLabel || outLabel) && (
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#0F5132',
                                  backgroundColor: '#ECFDF5',
                                  border: '1px solid #BBF7D0',
                                  borderRadius: '999px',
                                  padding: '2px 8px'
                                }}>
                                  {inLabel && outLabel
                                    ? `${inLabel} → ${outLabel}`
                                    : inLabel
                                      ? `In: ${inLabel}`
                                      : `Out: ${outLabel}`}
                                </span>
                              )}
                              {currentStatus === 'booked' && (
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#065F46',
                                  backgroundColor: '#DCFCE7',
                                  border: '1px solid #86EFAC',
                                  borderRadius: '999px',
                                  padding: '2px 8px'
                                }}>
                                  Booked: {formatYmd(toIstYmd(item.bookedAt || item.updatedAt || item.timestamp))}
                                </span>
                              )}
                              {item.advancePaid && (
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  color: '#065F46',
                                  backgroundColor: '#D1FAE5',
                                  border: '1px solid #6EE7B7',
                                  borderRadius: '999px',
                                  padding: '2px 8px'
                                }}>
                                  {item.advanceAmount ? `Advance Paid: ₹${item.advanceAmount}` : 'Advance Paid'}
                                </span>
                              )}
                            </div>
                            {!isNoteOpen && item.note && (
                              <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                                Note: {item.note}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <StatusSelect
                              value={currentStatus}
                              onChange={(next) => updateLead(item.id, { leadStatus: next })}
                            />

                            {clean10 && (
                              <>
                                <a
                                  href={`tel:+91${clean10}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    color: '#0F172A',
                                    borderRadius: '10px',
                                    padding: '7px 11px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <Phone size={12} /> Call
                                </a>
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    backgroundColor: '#16A34A',
                                    color: '#FFFFFF',
                                    borderRadius: '10px',
                                    padding: '7px 11px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <MessageCircle size={12} /> WhatsApp
                                </a>
                              </>
                            )}
            <button
                              type="button"
                              onClick={() => setExpandedNoteIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: isNoteOpen ? '#EFF6FF' : '#F8FAFC',
                                border: `1px solid ${isNoteOpen ? '#BFDBFE' : '#CBD5E1'}`,
                                color: isNoteOpen ? '#1D4ED8' : '#475569',
                                borderRadius: '10px',
                                padding: '7px 10px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {isNoteOpen ? 'Hide Note' : item.note ? 'Edit Note' : '+ Note'}
                            </button>
                          </div>
                        </div>

                        {showStayDetails && (
                          <div style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px dashed #CBD5E1',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '10px',
                            alignItems: 'end'
                          }}>
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={11} color="#0F5132" /> Check-in Date
                              </span>
                              <input
                                type="date"
                                value={draft.checkIn}
                                onChange={(e) => handleDraftChange(item.id, 'checkIn', e.target.value)}
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '10px',
                                  padding: '7px 10px',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  color: '#0F172A'
                                }}
                              />
                            </label>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={11} color="#0F5132" /> Check-out Date
                              </span>
                              <input
                                type="date"
                                value={draft.checkOut}
                                min={draft.checkIn || undefined}
                                onChange={(e) => handleDraftChange(item.id, 'checkOut', e.target.value)}
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '10px',
                                  padding: '7px 10px',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  color: '#0F172A'
                                }}
                              />
                            </label>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <IndianRupee size={11} color="#0F5132" /> Budget Preferred
                              </span>
                              <input
                                type="text"
                                placeholder="e.g. ₹1,000 - ₹1,500"
                                value={draft.budget}
                                onChange={(e) => handleDraftChange(item.id, 'budget', e.target.value)}
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '10px',
                                  padding: '7px 10px',
                                  fontSize: '12.5px',
                                  fontWeight: 600,
                                  color: '#0F172A'
                                }}
                              />
                            </label>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                                Advance Payment
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '34px' }}>
                                <label style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: draft.advancePaid ? '#ECFDF5' : '#FFFFFF',
                                  border: `1px solid ${draft.advancePaid ? '#86EFAC' : '#CBD5E1'}`,
                                  borderRadius: '10px',
                                  padding: '6px 10px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: '#0F172A',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}>
                                  <input
                                    type="checkbox"
                                    checked={draft.advancePaid}
                                    onChange={(e) => handleDraftAdvancePaidChange(item.id, e.target.checked)}
                                    style={{ width: '14px', height: '14px', accentColor: '#0F5132', cursor: 'pointer' }}
                                  />
                                  <span>Paid</span>
                                </label>
                                {draft.advancePaid && (
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #86EFAC',
                                    borderRadius: '10px',
                                    padding: '0 8px',
                                    flex: 1,
                                    minWidth: '90px'
                                  }}>
                                    <IndianRupee size={12} color="#0F5132" style={{ marginRight: '3px', flexShrink: 0 }} />
                                    <input
                                      type="tel"
                                      inputMode="numeric"
                                      maxLength={8}
                                      placeholder="Amount"
                                      value={draft.advanceAmount}
                                      onChange={(e) => handleDraftChange(item.id, 'advanceAmount', e.target.value.replace(/\D/g, '').slice(0, 8))}
                                      style={{
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        padding: '6px 0',
                                        fontSize: '12.5px',
                                        fontWeight: 700,
                                        color: '#0F172A',
                                        width: '100%'
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => updateLead(item.id, {
                                leadStatus: currentStatus,
                                checkIn: draft.checkIn,
                                checkOut: draft.checkOut,
                                budget: draft.budget,
                                note: draft.note,
                                advancePaid: draft.advancePaid,
                                advanceAmount: draft.advancePaid ? draft.advanceAmount : '',
                              })}
                              disabled={savingId === item.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                backgroundColor: savedId === item.id ? '#16A34A' : '#0F5132',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px 14px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                cursor: savingId === item.id ? 'wait' : 'pointer',
                                height: '34px'
                              }}
                            >
                              {savedId === item.id ? <><Check size={14} /> Saved</> : savingId === item.id ? 'Saving...' : 'Save Details'}
                            </button>
                          </div>
                        )}

                        {isNoteOpen && (
                        <div style={{
                          marginTop: '10px',
                          paddingTop: '10px',
                          borderTop: '1px dashed #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <input
                            type="text"
                            maxLength={300}
                            placeholder="Add note (e.g. didn't lift at 4 PM, needs AC room near station)..."
                            value={draft.note}
                            onChange={(e) => handleDraftChange(item.id, 'note', e.target.value)}
                            style={{
                              flex: 1,
                              minWidth: '200px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              borderRadius: '10px',
                              padding: '7px 10px',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              color: '#0F172A'
                            }}
                          />
          <button
                            type="button"
                            onClick={() => updateLead(item.id, { note: draft.note })}
                            disabled={savingId === item.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              backgroundColor: savedId === item.id ? '#16A34A' : '#FFFFFF',
                              color: savedId === item.id ? '#FFFFFF' : '#0F5132',
                              border: `1px solid ${savedId === item.id ? '#16A34A' : '#CBD5E1'}`,
                              borderRadius: '10px',
                              padding: '7px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: savingId === item.id ? 'wait' : 'pointer'
                            }}
                          >
                            {savedId === item.id ? <><Check size={13} /> Saved</> : 'Save Note'}
                          </button>
                        </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredItems.length > PAGE_SIZE && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingTop: '12px',
                      marginTop: '4px',
                      borderTop: '1px solid #E2E8F0'
                    }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569' }}>
                        Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredItems.length)} of {filteredItems.length} • Page {safePage} of {totalPages}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: safePage <= 1 ? '#F1F5F9' : '#FFFFFF',
                            color: safePage <= 1 ? '#94A3B8' : '#0F172A',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: safePage <= 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ← Previous
                        </button>
        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: safePage >= totalPages ? '#E2E8F0' : '#0F5132',
                            color: safePage >= totalPages ? '#94A3B8' : '#FFFFFF',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: safePage >= totalPages ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

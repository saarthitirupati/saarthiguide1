'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Bell,
  Phone,
  RefreshCw,
  Clock,
  MessageCircle,
  ArrowLeft,
  LogOut,
  Lock,
  Mail,
  Search,
  Download,
  Trash2,
  Sparkles,
  ExternalLink,
  CheckSquare,
  Calendar,
  IndianRupee,
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type LeadStatus = 'pending' | 'not_lifted' | 'callback' | 'contacted' | 'yes' | 'no' | 'booked';

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
}

const STATUS_META: Record<LeadStatus, { label: string; bg: string; color: string; border: string }> = {
  pending: { label: 'To-Do (New)', bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  not_lifted: { label: 'Not Lifted', bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  callback: { label: 'Call Back Later', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  contacted: { label: 'Contacted', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  yes: { label: 'Yes (Interested)', bg: '#ECFDF5', color: '#15803D', border: '#BBF7D0' },
  booked: { label: 'Booked', bg: '#DCFCE7', color: '#065F46', border: '#86EFAC' },
  no: { label: 'Not Interested', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
};

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
  const [drafts, setDrafts] = useState<Record<string, { checkIn: string; checkOut: string; budget: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [lastSynced, setLastSynced] = useState('');

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const interestRes = await fetch('/api/launch-interest', { cache: 'no-store' });

      if (interestRes.ok) {
        const interestData = await interestRes.json();
        if (interestData?.success) {
          setRoomsNotifyCount(Number(interestData.rooms) || 0);
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
    updates: { leadStatus?: LeadStatus; checkIn?: string; checkOut?: string; budget?: string }
  ) => {
    setSavingId(id);
    setNotifyItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      const res = await fetch('/api/launch-interest', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setSavedId(id);
        setTimeout(() => setSavedId((curr) => (curr === id ? null : curr)), 2000);
      }
    } catch (e) {
      console.error('Failed to update lead:', e);
    } finally {
      setSavingId(null);
    }
  };

  const handleDraftChange = (id: string, field: 'checkIn' | 'checkOut' | 'budget', value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        checkIn: prev[id]?.checkIn || '',
        checkOut: prev[id]?.checkOut || '',
        budget: prev[id]?.budget || '',
        [field]: value,
      },
    }));
  };

  const handleClearAll = async () => {
    if (clearing || notifyItems.length === 0) return;
    if (typeof window !== 'undefined' && !window.confirm('Clear all room notify leads? This cannot be undone.')) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch('/api/launch-interest?service=rooms', { method: 'DELETE' });
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

  const handleExportCsv = () => {
    if (notifyItems.length === 0) return;
    const rows = [
      ['Name', 'Mobile', 'Status', 'Check-in', 'Check-out', 'Preferred Budget', 'Submitted At'],
      ...notifyItems.map((item) => [
        (item.name || 'Pilgrim').replace(/,/g, ' '),
        item.phone ? `+91 ${item.phone}` : '',
        item.leadStatus || 'pending',
        item.checkIn || '',
        item.checkOut || '',
        (item.budget || '').replace(/,/g, ' '),
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

  const todayIstStr = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
    []
  );

  const todayCount = useMemo(() => {
    return notifyItems.filter((item) => {
      try {
        const d = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.timestamp));
        return d === todayIstStr;
      } catch {
        return false;
      }
    }).length;
  }, [notifyItems, todayIstStr]);

  const pendingTodoCount = useMemo(
    () => notifyItems.filter((item) => (item.leadStatus || 'pending') === 'pending').length,
    [notifyItems]
  );

  const yesCount = useMemo(
    () => notifyItems.filter((item) => item.leadStatus === 'yes' || item.leadStatus === 'booked').length,
    [notifyItems]
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notifyItems.filter((item) => {
      const status = item.leadStatus || 'pending';
      if (todoFilter !== 'all' && status !== todoFilter) return false;
      if (!q) return true;
      return (
        (item.name || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q)
      );
    });
  }, [notifyItems, searchQuery, todoFilter]);

  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#F8FAFC',
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
              Hotel Admin Portal
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Saarthi Rooms Notify &amp; Bookings Control
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
                  placeholder="••••••••••••"
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
                width: '100%',
                backgroundColor: '#0F5132',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: loggingIn ? 'wait' : 'pointer',
                marginTop: '4px'
              }}
            >
              {loggingIn ? 'Signing in...' : 'Sign In to Hotel Admin'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <Link href="/room-booking" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F5132', textDecoration: 'none' }}>
              ← Back to Rooms Booking
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F7F5',
      color: '#0F172A',
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '64px'
    }}>
      {/* ── SACRED EMERALD HEADER ── */}
      <header style={{
        background: 'linear-gradient(135deg, #022C22 0%, #064E3B 55%, #0F5132 100%)',
        color: '#FFFFFF',
        padding: '18px 20px',
        boxShadow: '0 6px 20px rgba(2, 44, 34, 0.18)'
      }}>
        <div style={{
          maxWidth: '1020px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/room-booking"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '19px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  Saarthi Hotel Admin
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(52, 211, 153, 0.45)',
                  color: '#A7F3D0'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} />
                  LIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#A7F3D0', margin: '3px 0 0 0' }}>
                Real-time Room Notify Leads &amp; Follow-up To-Do List
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {lastSynced && (
              <span style={{ fontSize: '11.5px', color: '#D1FAE5', display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
                <Clock size={12} /> {lastSynced}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FFFFFF',
                color: '#0F5132',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1020px', margin: '0 auto', padding: '22px 16px' }}>
        {/* ── KPI CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '22px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #BBF7D0',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 4px 16px rgba(15, 81, 50, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Room Notify Count
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={16} />
              </div>
            </div>
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#0F5132', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '—' : roomsNotifyCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
              Today: {todayCount} new ({todayIstStr})
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FDE68A',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending To-Do
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={16} />
              </div>
            </div>
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#92400E', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '—' : pendingTodoCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
              Customers awaiting follow-up call
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Interested / Booked
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
            </div>
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '—' : yesCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
              With check-in &amp; budget details
            </div>
          </div>
        </div>

        {/* ── LEADS & TO-DO PANEL ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '22px',
          padding: '20px',
          boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
        }}>
          {/* Panel Header + Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
              <CheckSquare size={18} color="#0F5132" />
              Follow-Up To-Do &amp; Customer Leads
              <span style={{
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: '#ECFDF5',
                color: '#0F5132',
                padding: '3px 9px',
                borderRadius: '999px',
                border: '1px solid #BBF7D0'
              }}>
                {filteredItems.length}
              </span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '6px 10px'
              }}>
                <Search size={14} color="#64748B" />
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
                    width: '150px'
                  }}
                />
              </div>

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
                  color: notifyItems.length === 0 ? '#94A3B8' : '#0F172A',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: notifyItems.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Download size={13} />
                <span>CSV</span>
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
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: clearing ? 'wait' : 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                  <span>{clearing ? 'Clearing...' : 'Clear'}</span>
                </button>
              )}
            </div>
          </div>

          {/* To-Do Status Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {([
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'To-Do' },
              { key: 'not_lifted', label: 'Not Lifted' },
              { key: 'callback', label: 'Call Back' },
              { key: 'contacted', label: 'Contacted' },
              { key: 'yes', label: 'Yes (Interested)' },
              { key: 'booked', label: 'Booked' },
              { key: 'no', label: 'Not Interested' },
            ] as const).map((tab) => {
              const active = todoFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTodoFilter(tab.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? '#0F5132' : '#CBD5E1'}`,
                    backgroundColor: active ? '#0F5132' : '#F8FAFC',
                    color: active ? '#FFFFFF' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div style={{
              padding: '42px 20px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px dashed #CBD5E1'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#ECFDF5',
                color: '#0F5132',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Bell size={22} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                {searchQuery || todoFilter !== 'all' ? 'No matching leads found' : 'No Room Notify Requests Yet'}
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                {searchQuery || todoFilter !== 'all'
                  ? 'Try clearing your search or switching the filter tab.'
                  : 'New pilgrims who enter their Name and Mobile Number on /room-booking will appear here automatically in real time.'}
              </p>
              {!searchQuery && todoFilter === 'all' && (
                <Link
                  href="/room-booking"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#0F5132',
                    color: '#FFFFFF',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>Preview /room-booking</span>
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredItems.map((item) => {
                const digits = (item.phone || '').replace(/\D/g, '');
                const clean10 = digits.slice(-10);
                const displayName = item.name?.trim() || 'Pilgrim Visitor';
                const initial = displayName.charAt(0).toUpperCase();
                const currentStatus: LeadStatus = item.leadStatus || 'pending';
                const statusStyle = STATUS_META[currentStatus];
                const showStayDetails = currentStatus === 'yes' || currentStatus === 'booked';
                const draft = drafts[item.id] || {
                  checkIn: item.checkIn || '',
                  checkOut: item.checkOut || '',
                  budget: item.budget || '',
                };

                const waUrl = clean10
                  ? `https://wa.me/91${clean10}?text=${encodeURIComponent(`Namaste ${displayName}! Regarding your Tirupati Room booking inquiry on Saarthi Guide...`)}`
                  : '#';

                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '15px 16px',
                      backgroundColor: '#F8FAFC',
                      border: `1.5px solid ${showStayDetails ? '#BBF7D0' : '#E2E8F0'}`,
                      borderRadius: '18px'
                    }}
                  >
                    {/* Top Row: Pilgrim Info + Status Selector + Call/WA */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: '#0F5132',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {initial}
                        </div>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A' }}>
                            {displayName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '3px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F5132' }}>
                              {clean10 ? `+91 ${clean10}` : 'No mobile provided'}
                            </span>
                            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                              • {new Date(item.timestamp).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Customer Status Dropdown */}
                        <select
                          value={currentStatus}
                          onChange={(e) => updateLead(item.id, { leadStatus: e.target.value as LeadStatus })}
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1.5px solid ${statusStyle.border}`,
                            borderRadius: '10px',
                            padding: '7px 10px',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="pending">To-Do (New)</option>
                          <option value="not_lifted">Not Lifted</option>
                          <option value="callback">Call Back Later</option>
                          <option value="contacted">Contacted</option>
                          <option value="yes">Yes (Interested)</option>
                          <option value="booked">Booked</option>
                          <option value="no">Not Interested</option>
                        </select>

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
                                textDecoration: 'none',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                              }}
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Conditional Stay Details (Check-in, Check-out, Budget Preferred) when Yes / Booked */}
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

                        <button
                          type="button"
                          onClick={() => updateLead(item.id, {
                            leadStatus: currentStatus,
                            checkIn: draft.checkIn,
                            checkOut: draft.checkOut,
                            budget: draft.budget,
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
                          {savedId === item.id ? (
                            <>
                              <Check size={14} /> Saved
                            </>
                          ) : savingId === item.id ? (
                            'Saving...'
                          ) : (
                            'Save Details'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

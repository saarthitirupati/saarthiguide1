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
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WaitlistEntry {
  id: string;
  service: string;
  timestamp: string;
  name?: string;
  phone?: string;
  email?: string;
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
          setNotifyItems(recentList.filter((item) => item.service === 'rooms'));
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
      ['Name', 'Mobile', 'Submitted At'],
      ...notifyItems.map((item) => [
        (item.name || 'Pilgrim').replace(/,/g, ' '),
        item.phone ? `+91 ${item.phone}` : '',
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

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notifyItems;
    return notifyItems.filter((item) =>
      (item.name || '').toLowerCase().includes(q) ||
      (item.phone || '').toLowerCase().includes(q)
    );
  }, [notifyItems, searchQuery]);

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
                Real-time Room Notify Leads &amp; Pilgrim Interest Desk
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
              Total pilgrim requests from /room-booking
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
                Today&apos;s Leads (IST)
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
            </div>
            <div style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? '—' : todayCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
              Submitted today ({todayIstStr})
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
                Latest Activity
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} />
              </div>
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginTop: '6px' }}>
              {loading
                ? 'Loading...'
                : notifyItems.length > 0
                  ? new Date(notifyItems[0].timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
                  : 'No signups yet'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
              {notifyItems.length > 0 && notifyItems[0].name ? `Latest: ${notifyItems[0].name}` : 'Auto-syncs every 15s & live'}
            </div>
          </div>
        </div>

        {/* ── LEADS DIRECTORY PANEL ── */}
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
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                <Phone size={18} color="#0F5132" />
                Rooms Notify Leads
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
            </div>

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
                    width: '160px'
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
                {searchQuery ? 'No matching leads found' : 'No Room Notify Requests Yet'}
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                {searchQuery
                  ? 'Try clearing your search filter.'
                  : 'New pilgrims who enter their Name and Mobile Number on /room-booking will appear here automatically in real time.'}
              </p>
              {!searchQuery && (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredItems.map((item) => {
                const digits = (item.phone || '').replace(/\D/g, '');
                const clean10 = digits.slice(-10);
                const displayName = item.name?.trim() || 'Pilgrim Visitor';
                const initial = displayName.charAt(0).toUpperCase();
                const waUrl = clean10
                  ? `https://wa.me/91${clean10}?text=${encodeURIComponent(`Namaste ${displayName}! Regarding your Tirupati Room alert on Saarthi Guide...`)}`
                  : '#';

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      padding: '14px 16px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px'
                    }}
                  >
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

                    {clean10 && (
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          <Phone size={13} /> Call
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
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                          }}
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
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

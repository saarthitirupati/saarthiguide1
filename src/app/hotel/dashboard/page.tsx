'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Calendar, Phone, MessageSquare, Check, X, 
  Clock, Users, MapPin, LogOut, RefreshCw, Car, FileText, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HOTELS } from '@/data/hotels';

interface Booking {
  id: string;
  hotel_id?: string;
  hotel_name?: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  rooms_count: number;
  budget_per_night?: number;
  cab_preference?: string;
  special_requirements?: string;
  communication_language?: string;
  total_amount?: number;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'pending';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export default function HotelDashboardPage() {
  const router = useRouter();
  const hotel = HOTELS[0]; // Hotel Vamana Inn
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('');

  const fetchBookings = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch from unified partner API endpoint (reads Supabase or local persistent store)
      const res = await fetch('/api/hotel-admin/bookings', {
        headers: {
          'x-partner-id': 'vamana-inn-tirupati'
        },
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return;
        }
      }
    } catch (e) {
      console.warn('Dashboard fetch notice:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('hotel_authenticated');
      const hasCookie = document.cookie.includes('hotel_auth=') || document.cookie.includes('saarthi_admin=');
      if (!auth && !hasCookie) {
        router.replace('/hotel/login?redirect=/hotel/dashboard');
        return;
      }
    }

    fetchBookings();

    // Dual Realtime listener for Postgres changes (hotel_bookings + live_updates)
    const channelName = `realtime_vamana_dash_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hotel_bookings' },
        () => fetchBookings(true)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_updates' },
        (payload: any) => {
          if (
            payload?.new?.module === 'hotel_booking' ||
            payload?.new?.module === 'launch_waitlist' ||
            payload?.old?.module === 'hotel_booking'
          ) {
            fetchBookings(true);
          }
        }
      )
      .subscribe();

    // Polling fallback every 10 seconds
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [router]);

  const updateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'confirmed' | 'cancelled') => {
    // Optimistic UI update
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );

    try {
      await fetch('/api/hotel-admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-partner-id': 'vamana-inn-tirupati'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (e) {
      console.warn('Failed to update status on server:', e);
    }
  };

  const openGuestWhatsApp = (b: Booking) => {
    const text = encodeURIComponent(
      `Hello ${b.guest_name}, regarding your stay inquiry at ${hotel.name} (Ref: ${b.id}) for ${b.check_in} to ${b.check_out}: ` +
      `Your room request is ${b.status === 'confirmed' ? 'CONFIRMED' : 'under review'}. We look forward to welcoming you!`
    );
    window.open(`https://wa.me/91${b.guest_phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hotel_authenticated');
      document.cookie = 'hotel_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/hotel/login');
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'new') return b.status === 'new' || b.status === 'pending';
    return b.status === filter;
  });

  const newCount = bookings.filter(b => b.status === 'new' || b.status === 'pending').length;
  const contactedCount = bookings.filter(b => b.status === 'contacted').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      maxWidth: '780px',
      margin: '0 auto',
      paddingBottom: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 🧭 DASHBOARD HEADER */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(15, 81, 50, 0.1)',
            color: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '15.5px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
              {hotel.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>● Live Partner</span>
              {lastSynced && (
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>• Synced {lastSynced}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fetchBookings(false)}
            disabled={isRefreshing}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              fontWeight: 600
            }}
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #FCA5A5',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              fontWeight: 600
            }}
          >
            <LogOut size={13} /> Exit
          </button>
        </div>
      </header>

      {/* 📊 DYNAMIC SUMMARY TILES */}
      <div style={{ padding: '16px 16px 8px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div 
          onClick={() => setFilter('all')}
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 10px', 
            borderRadius: '12px', 
            border: filter === 'all' ? '2px solid #0F5132' : '1px solid #E2E8F0',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Total</span>
          <strong style={{ fontSize: '19px', color: '#0F172A' }}>{bookings.length}</strong>
        </div>
        <div 
          onClick={() => setFilter('new')}
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 10px', 
            borderRadius: '12px', 
            border: filter === 'new' ? '2px solid #D97706' : '1px solid #E2E8F0',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>New</span>
          <strong style={{ fontSize: '19px', color: '#D97706' }}>{newCount}</strong>
        </div>
        <div 
          onClick={() => setFilter('contacted')}
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 10px', 
            borderRadius: '12px', 
            border: filter === 'contacted' ? '2px solid #2563EB' : '1px solid #E2E8F0',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Contacted</span>
          <strong style={{ fontSize: '19px', color: '#2563EB' }}>{contactedCount}</strong>
        </div>
        <div 
          onClick={() => setFilter('confirmed')}
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 10px', 
            borderRadius: '12px', 
            border: filter === 'confirmed' ? '2px solid #16A34A' : '1px solid #E2E8F0',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Confirmed</span>
          <strong style={{ fontSize: '19px', color: '#16A34A' }}>{confirmedCount}</strong>
        </div>
      </div>

      {/* 📋 BOOKING LIST */}
      <main style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, margin: '4px 0', color: '#334155' }}>
            {filter === 'all' ? 'All Pilgrim Enquiries' : `${filter.toUpperCase()} Enquiries`} ({filteredBookings.length})
          </h2>
          <span style={{ fontSize: '11px', color: '#64748B' }}>Auto-synced</span>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
            Loading live bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            backgroundColor: '#FFFFFF', 
            borderRadius: '14px', 
            border: '1px solid #E2E8F0' 
          }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748B' }}>
              No enquiries found in this category.
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94A3B8' }}>
              New submissions from /tirupati-hotels will appear here instantly.
            </p>
          </div>
        ) : (
          filteredBookings.map(b => {
            const isPendingOrNew = b.status === 'new' || b.status === 'pending';
            const isConfirmed = b.status === 'confirmed';
            const isContacted = b.status === 'contacted';
            const isCancelled = b.status === 'cancelled';

            const statusBg = isConfirmed ? '#DCFCE7' : isCancelled ? '#FEE2E2' : isContacted ? '#DBEAFE' : '#FEF3C7';
            const statusColor = isConfirmed ? '#166534' : isCancelled ? '#991B1B' : isContacted ? '#1E40AF' : '#92400E';

            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: isPendingOrNew ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                  padding: '14px 16px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  position: 'relative'
                }}
              >
                {/* Header row: Reference ID, Guest Name, Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#0F5132', fontWeight: 800, letterSpacing: '0.02em' }}>
                      Ref: {b.id}
                    </span>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 800, margin: '2px 0 0 0', color: '#0F172A' }}>
                      {b.guest_name}
                    </h3>
                    <a
                      href={`tel:${b.guest_phone}`}
                      style={{ fontSize: '12px', color: '#0F5132', textDecoration: 'none', fontWeight: 600 }}
                    >
                      📞 +91 {b.guest_phone}
                    </a>
                  </div>

                  <span style={{
                    padding: '3px 9px',
                    borderRadius: '10px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: statusBg,
                    color: statusColor
                  }}>
                    {b.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  color: '#475569',
                  margin: '8px 0'
                }}>
                  <div><strong>Check-in:</strong> {b.check_in}</div>
                  <div><strong>Check-out:</strong> {b.check_out}</div>
                  <div><strong>Guests / Rooms:</strong> {b.guests_count} Guests ({b.rooms_count} Room)</div>
                  <div><strong>Budget:</strong> ₹{b.budget_per_night || b.total_amount}/night</div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Language:</strong> 🗣️ <span style={{ color: '#0F5132', fontWeight: 700 }}>{b.communication_language || 'Telugu'}</span>
                  </div>
                  {b.cab_preference && (
                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Car size={13} color="#0F5132" />
                      <strong>Cab:</strong> {b.cab_preference === 'yes' ? 'Yes, Cab needed' : b.cab_preference === 'contact' ? 'Discuss cab options' : 'Room only'}
                    </div>
                  )}
                  {b.special_requirements && (
                    <div style={{ gridColumn: 'span 2', color: '#334155' }}>
                      <strong>Note:</strong> &ldquo;{b.special_requirements}&rdquo;
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => openGuestWhatsApp(b)}
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#25D366',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>

                  <a
                    href={`tel:${b.guest_phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#F1F5F9',
                      color: '#0F172A',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={13} /> Call
                  </a>

                  {isPendingOrNew && (
                    <>
                      <button
                        onClick={() => updateStatus(b.id, 'contacted')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: '1px solid #BFDBFE',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Contacted
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'confirmed')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#0F5132',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#FEF2F2',
                          color: '#991B1B',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: '1px solid #FECACA',
                          cursor: 'pointer'
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {isContacted && (
                    <>
                      <button
                        onClick={() => updateStatus(b.id, 'confirmed')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#0F5132',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#FEF2F2',
                          color: '#991B1B',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: '1px solid #FECACA',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        color: '#64748B',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}


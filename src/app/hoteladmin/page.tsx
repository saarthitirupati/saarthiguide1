'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Calendar, Phone, MessageSquare, Check, X, 
  Clock, Users, MapPin, LogOut, RefreshCw, AlertCircle, 
  Car, IndianRupee, Search, ShieldCheck, ChevronRight, Filter
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
  rooms_count?: number;
  budget_per_night?: number;
  cab_preference?: string;
  special_requirements?: string;
  communication_language?: string;
  total_amount?: number;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'pending';
  admin_notes?: string;
  created_at: string;
}

export default function HotelAdminPage() {
  const router = useRouter();
  const hotel = HOTELS[0]; // Hotel Vamana Inn
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'contacted' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fallback sample bookings if database is completely empty
  const sampleBookings: Booking[] = [
    {
      id: 'SRTH-849201',
      hotel_id: 'vamana-inn-tirupati',
      hotel_name: 'Hotel Vamana Inn, Tirupati',
      guest_name: 'Nageswara Rao',
      guest_phone: '9848012345',
      check_in: '2026-10-22',
      check_out: '2026-10-24',
      guests_count: 2,
      rooms_count: 1,
      budget_per_night: 2500,
      cab_preference: 'yes',
      special_requirements: 'Ground floor room preferred for senior citizen.',
      total_amount: 2500,
      status: 'confirmed',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'SRTH-849202',
      hotel_id: 'vamana-inn-tirupati',
      hotel_name: 'Hotel Vamana Inn, Tirupati',
      guest_name: 'Praveen Reddy',
      guest_phone: '9989054321',
      check_in: '2026-10-25',
      check_out: '2026-10-26',
      guests_count: 4,
      rooms_count: 2,
      budget_per_night: 4500,
      cab_preference: 'contact',
      special_requirements: 'Need temple pickup from Tirupati Railway Station.',
      total_amount: 4500,
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'SRTH-849203',
      hotel_id: 'vamana-inn-tirupati',
      hotel_name: 'Hotel Vamana Inn, Tirupati',
      guest_name: 'Suresh Kumar',
      guest_phone: '9440187654',
      check_in: '2026-10-28',
      check_out: '2026-10-30',
      guests_count: 1,
      rooms_count: 1,
      budget_per_night: 1200,
      cab_preference: 'no',
      special_requirements: '',
      total_amount: 1200,
      status: 'contacted',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ];

  // 1. Authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('hotel_authenticated');
      if (!auth) {
        // Also check if admin token cookie exists
        const hasCookie = document.cookie.includes('hotel_auth=') || document.cookie.includes('saarthi_admin=');
        if (!hasCookie) {
          router.replace('/hotel/login?redirect=/hoteladmin');
          return;
        }
      }
      setIsAuthenticated(true);
    }
  }, [router]);

  // 2. Fetch bookings via resilient API (never direct client queries to avoid 404s)
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hotel-admin/bookings', {
        headers: {
          'x-hotel-auth': 'vamana-inn-tirupati',
          'x-partner-id': 'vamana-inn-tirupati'
        },
        cache: 'no-store'
      });
      const json = await res.json();
      if (json?.success && Array.isArray(json.bookings)) {
        setBookings(json.bookings);
      }
    } catch (e) {
      console.warn('HotelAdmin fetch notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBookings();

    // 3. Dual Supabase Realtime Subscription (hotel_bookings + live_updates cloud backup)
    const channelName = `hotel-admin-realtime-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hotel_bookings' },
        () => {
          fetchBookings();
        }
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
            fetchBookings();
          }
        }
      )
      .subscribe();

    // Periodic fallback poll every 10s
    const pollInterval = setInterval(() => {
      fetchBookings();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // 4. Update Status handler
  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    setIsUpdating(id);
    // Optimistic UI update
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: newStatus } : b)));

    try {
      await fetch('/api/hotel-admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-auth': 'vamana-inn-tirupati',
          'x-partner-id': 'vamana-inn-tirupati'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (e) {
      console.warn('Status update warning:', e);
    } finally {
      setIsUpdating(null);
    }
  };

  // 5. Save Admin Notes handler
  const handleSaveNotes = async (id: string) => {
    setIsUpdating(id);
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, admin_notes: noteText } : b)));
    setEditingNotesId(null);

    try {
      await fetch('/api/hotel-admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-hotel-auth': 'vamana-inn-tirupati',
          'x-partner-id': 'vamana-inn-tirupati'
        },
        body: JSON.stringify({ id, status: bookings.find(b => b.id === id)?.status || 'new', adminNotes: noteText })
      });
    } catch (e) {
      console.warn('Notes update warning:', e);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hotel_authenticated');
      document.cookie = 'hotel_auth=; Max-Age=0; path=/';
    }
    router.push('/hotel/login');
  };

  const openWhatsApp = (b: Booking) => {
    const text = encodeURIComponent(
      `Hello ${b.guest_name}, this is Saarthi Accommodation Desk regarding your stay enquiry (Ref: ${b.id}) ` +
      `for ${b.check_in} to ${b.check_out}. ` +
      `We have verified room options matching your budget of ₹${b.budget_per_night || 2500}/night. How may we assist you with confirmation?`
    );
    window.open(`https://wa.me/91${b.guest_phone.replace(/\D/g, '').slice(-10)}?text=${text}`, '_blank');
  };

  // Filtered and searched bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Tab filter
      const currentStatus = b.status === 'pending' ? 'new' : b.status;
      if (activeTab !== 'all' && currentStatus !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = b.guest_name?.toLowerCase().includes(q);
        const matchPhone = b.guest_phone?.includes(q);
        const matchId = b.id?.toLowerCase().includes(q);
        return matchName || matchPhone || matchId;
      }
      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  const counts = {
    total: bookings.length,
    new: bookings.filter(b => b.status === 'new' || b.status === 'pending').length,
    contacted: bookings.filter(b => b.status === 'contacted').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <p style={{ color: '#64748B', fontSize: '14px' }}>Verifying authentication...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      maxWidth: '900px',
      margin: '0 auto',
      paddingBottom: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ── TOP HEADER ── */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ECFDF5',
            color: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Hotel Admin
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#D1FAE5',
                padding: '2px 8px',
                borderRadius: '10px',
                letterSpacing: '0.04em'
              }}>
                LIVE SYNC
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Overview of room booking & pilgrim stay enquiries
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchBookings}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #FCA5A5',
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <LogOut size={13} /> Exit
          </button>
        </div>
      </header>

      {/* ── METRIC TILES ── */}
      <div style={{
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
            Total Requests
          </span>
          <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'block', marginTop: '4px' }}>
            {counts.total}
          </strong>
        </div>

        <div style={{
          backgroundColor: '#FFFBEB',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #FDE68A',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#B45309', display: 'block', textTransform: 'uppercase' }}>
            New Requests
          </span>
          <strong style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', display: 'block', marginTop: '4px' }}>
            {counts.new}
          </strong>
        </div>

        <div style={{
          backgroundColor: '#EFF6FF',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #BFDBFE',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', display: 'block', textTransform: 'uppercase' }}>
            Contacted
          </span>
          <strong style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', display: 'block', marginTop: '4px' }}>
            {counts.contacted}
          </strong>
        </div>

        <div style={{
          backgroundColor: '#F0FDF4',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #BBF7D0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', display: 'block', textTransform: 'uppercase' }}>
            Confirmed
          </span>
          <strong style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', display: 'block', marginTop: '4px' }}>
            {counts.confirmed}
          </strong>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div style={{ padding: '0 20px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '10px',
          padding: '8px 12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search by customer name, mobile, or Ref ID (e.g. SRTH-849201)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
              backgroundColor: 'transparent'
            }}
          />
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {(['all', 'new', 'contacted', 'confirmed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'capitalize',
                border: activeTab === tab ? '1.5px solid #0F5132' : '1px solid #E2E8F0',
                backgroundColor: activeTab === tab ? '#0F5132' : '#FFFFFF',
                color: activeTab === tab ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'all' ? `All (${counts.total})` :
               tab === 'new' ? `New (${counts.new})` :
               tab === 'contacted' ? `Contacted (${counts.contacted})` :
               tab === 'confirmed' ? `Confirmed (${counts.confirmed})` :
               `Cancelled (${counts.cancelled})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── ENQUIRIES LIST ── */}
      <main style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
            Loading requests...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <Building2 size={36} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#334155' }}>
              No enquiries found
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0 }}>
              {searchQuery ? 'Try matching another name or reference ID' : 'New stay requests will appear here in real-time'}
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const currentStatus = b.status === 'pending' ? 'new' : b.status;
            const statusBg = 
              currentStatus === 'confirmed' ? '#DCFCE7' :
              currentStatus === 'contacted' ? '#DBEAFE' :
              currentStatus === 'cancelled' ? '#FEE2E2' : '#FEF3C7';
            const statusColor = 
              currentStatus === 'confirmed' ? '#166534' :
              currentStatus === 'contacted' ? '#1E40AF' :
              currentStatus === 'cancelled' ? '#991B1B' : '#92400E';

            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: currentStatus === 'new' ? '1.5px solid #FDE68A' : '1px solid #E2E8F0',
                  padding: '16px 18px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                  position: 'relative'
                }}
              >
                {/* Header Row: Ref ID, Name & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F5132', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                        {b.id}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 2px', color: '#0F172A' }}>
                      {b.guest_name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                      <a
                        href={`tel:${b.guest_phone}`}
                        style={{ fontSize: '13px', color: '#0F5132', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={13} /> {b.guest_phone}
                      </a>
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: statusBg,
                    color: statusColor,
                    letterSpacing: '0.02em'
                  }}>
                    {currentStatus}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#334155',
                  marginBottom: '12px'
                }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>DATES</span>
                    <strong>{b.check_in} → {b.check_out}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>PILGRIMS</span>
                    <strong>{b.guests_count} {b.guests_count === 1 ? 'Person' : 'People'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>BUDGET PREFERENCE</span>
                    <strong style={{ color: '#0F5132' }}>₹{b.budget_per_night || 2500} / night</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>LANGUAGE</span>
                    <strong style={{ color: '#0F5132' }}>🗣️ {b.communication_language || 'Telugu'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>CAB NEEDED?</span>
                    <strong>
                      {b.cab_preference === 'yes' ? '🚕 Yes, cab needed' :
                       b.cab_preference === 'contact' ? '💬 Discuss cab' :
                       '🚫 Room only'}
                    </strong>
                  </div>
                </div>

                {/* Special Requirements */}
                {b.special_requirements && (
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#92400E',
                    marginBottom: '12px'
                  }}>
                    <strong>Guest Note:</strong> {b.special_requirements}
                  </div>
                )}

                {/* Internal Admin Notes */}
                {editingNotesId === b.id ? (
                  <div style={{ marginBottom: '12px' }}>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add internal coordination notes (e.g. Vamana room 204 allocated, rate agreed ₹2,200)..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px',
                        fontSize: '12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        minHeight: '60px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button
                        onClick={() => handleSaveNotes(b.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#0F5132',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          border: 'none',
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  b.admin_notes && (
                    <div style={{
                      backgroundColor: '#F1F5F9',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      color: '#475569',
                      marginBottom: '12px'
                    }}>
                      <strong>Internal Note:</strong> {b.admin_notes}
                    </div>
                  )
                )}

                {/* Actions Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openWhatsApp(b)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </button>
                    <a
                      href={`tel:${b.guest_phone}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0F5132',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Phone size={13} /> Call
                    </a>
                    {editingNotesId !== b.id && (
                      <button
                        onClick={() => {
                          setEditingNotesId(b.id);
                          setNoteText(b.admin_notes || '');
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {b.admin_notes ? 'Edit Note' : '+ Note'}
                      </button>
                    )}
                  </div>

                  {/* Status Dropdown / Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Status:</span>
                    <select
                      value={currentStatus}
                      disabled={isUpdating === b.id}
                      onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1.5px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

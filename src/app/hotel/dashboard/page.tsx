'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Calendar, Phone, MessageSquare, Check, X, 
  Clock, Users, MapPin, LogOut, RefreshCw, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HOTELS } from '@/data/hotels';

interface Booking {
  id: string;
  hotel_id: string;
  hotel_name: string;
  guest_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  rooms_count: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export default function HotelDashboardPage() {
  const router = useRouter();
  const hotel = HOTELS[0]; // Hotel Vamana Inn
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial sample bookings if database is fresh
  const sampleBookings: Booking[] = [
    {
      id: 'SRTH-849201',
      hotel_id: 'vamana-inn-tirupati',
      hotel_name: 'Hotel Vamana Inn, Tirupati',
      guest_name: 'Nageswara Rao',
      guest_phone: '9848012345',
      check_in: '2026-10-18',
      check_out: '2026-10-19',
      guests_count: 2,
      rooms_count: 1,
      total_amount: 799,
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'SRTH-849202',
      hotel_id: 'vamana-inn-tirupati',
      hotel_name: 'Hotel Vamana Inn, Tirupati',
      guest_name: 'Praveen Reddy',
      guest_phone: '9989054321',
      check_in: '2026-10-20',
      check_out: '2026-10-22',
      guests_count: 4,
      rooms_count: 2,
      total_amount: 3196,
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotel_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setBookings(data as Booking[]);
      } else {
        setBookings(sampleBookings);
      }
    } catch {
      setBookings(sampleBookings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );

    try {
      await supabase
        .from('hotel_bookings')
        .update({ status: newStatus })
        .eq('id', id);
    } catch (e) {
      console.warn('Update notice:', e);
    }
  };

  const openGuestWhatsApp = (b: Booking) => {
    const text = encodeURIComponent(
      `Hello ${b.guest_name}, regarding your booking at ${hotel.name} (Ref: ${b.id}) for ${b.check_in} to ${b.check_out}: ` +
      `Your room is ${b.status === 'confirmed' ? 'CONFIRMED' : 'under review'}. We look forward to welcoming you!`
    );
    window.open(`https://wa.me/91${b.guest_phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      maxWidth: '780px',
      margin: '0 auto',
      paddingBottom: '60px'
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
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>● Active on Saarthi</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchBookings}
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
              fontSize: '11.5px'
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => router.push('/hotel/login')}
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
              fontSize: '11.5px'
            }}
          >
            <LogOut size={13} /> Exit
          </button>
        </div>
      </header>

      {/* 📊 SUMMARY TILES */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Total Requests</span>
          <strong style={{ fontSize: '20px', color: '#0F172A' }}>{bookings.length}</strong>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Pending</span>
          <strong style={{ fontSize: '20px', color: '#D97706' }}>
            {bookings.filter(b => b.status === 'pending').length}
          </strong>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Confirmed</span>
          <strong style={{ fontSize: '20px', color: '#16A34A' }}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </strong>
        </div>
      </div>

      {/* 📋 BOOKING LIST */}
      <main style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, margin: '4px 0', color: '#334155' }}>
          Recent Pilgrim Bookings
        </h2>

        {isLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
            Loading bookings...
          </div>
        ) : (
          bookings.map(b => (
            <div
              key={b.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Ref: {b.id}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 0 0', color: '#0F172A' }}>
                    {b.guest_name}
                  </h3>
                  <a
                    href={`tel:${b.guest_phone}`}
                    style={{ fontSize: '12px', color: '#0F5132', textDecoration: 'none', fontWeight: 500 }}
                  >
                    📞 {b.guest_phone}
                  </a>
                </div>

                <span style={{
                  padding: '3px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  backgroundColor: b.status === 'confirmed' ? '#DCFCE7' : b.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                  color: b.status === 'confirmed' ? '#166534' : b.status === 'cancelled' ? '#991B1B' : '#92400E'
                }}>
                  {b.status}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                backgroundColor: '#F8FAFC',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                color: '#475569',
                margin: '8px 0'
              }}>
                <div><strong>Check-in:</strong> {b.check_in}</div>
                <div><strong>Check-out:</strong> {b.check_out}</div>
                <div><strong>Rooms / Guests:</strong> {b.rooms_count} Room(s), {b.guests_count} Guest(s)</div>
                <div><strong>Amount:</strong> ₹{b.total_amount}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => openGuestWhatsApp(b)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare size={13} /> Chat on WhatsApp
                </button>

                {b.status === 'pending' && (
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
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

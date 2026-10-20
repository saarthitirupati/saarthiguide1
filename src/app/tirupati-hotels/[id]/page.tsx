'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Star, MapPin, ShieldCheck, Check, 
  Sparkles, Navigation, Phone, MessageSquare, 
  Calendar, Users, Clock, AlertCircle, ExternalLink,
  ChevronLeft, ChevronRight, Wind, Wifi, ShieldAlert
} from 'lucide-react';
import { getHotelById } from '@/data/hotels';
import { useLanguage } from '@/lib/useLanguage';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = useLanguage();
  const hotelId = params?.id as string;
  const hotel = useMemo(() => getHotelById(hotelId), [hotelId]);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Calculate nights & total
  const nights = useMemo(() => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  if (!hotel) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <p style={{ fontSize: '16px', color: '#64748B' }}>Hotel not found.</p>
        <Link href="/tirupati-hotels" style={{ color: '#0F5132', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to all stays
        </Link>
      </div>
    );
  }

  const totalAmount = hotel.pricePerNight * nights * roomsCount;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please enter your Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          hotelName: hotel.name,
          guestName,
          guestPhone,
          checkIn,
          checkOut,
          guests: guestsCount,
          rooms: roomsCount,
          totalAmount,
          whatsappPhone: hotel.whatsappPhone
        })
      });

      const data = await res.json();
      setBookingSuccess(data);

      // Open WhatsApp directly with the pre-formatted booking details
      if (data?.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
      // Fallback direct WhatsApp dispatch
      const msg = encodeURIComponent(
        `*New Booking Request - ${hotel.name}*\n` +
        `• Guest: ${guestName} (${guestPhone})\n` +
        `• Dates: ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? 's' : ''})\n` +
        `• Rooms: ${roomsCount} Room, ${guestsCount} Guest(s)\n` +
        `• Total Amount: ₹${totalAmount}\n\n` +
        `Please confirm room availability.`
      );
      const fallbackUrl = `https://wa.me/${hotel.whatsappPhone}?text=${msg}`;
      window.open(fallbackUrl, '_blank');
      setBookingSuccess({ success: true, bookingId: 'SAARTHI-' + Date.now().toString().slice(-6), whatsappUrl: fallbackUrl });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      maxWidth: '680px',
      margin: '0 auto',
      paddingBottom: '100px',
      boxSizing: 'border-box'
    }}>
      {/* 🧭 HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
              {hotel.name}
            </h1>
            <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
              {hotel.locationArea}
            </p>
          </div>
        </div>

        <a
          href={hotel.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '10px',
            backgroundColor: '#F1F5F9',
            color: '#0F5132',
            fontSize: '11.5px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          <Navigation size={13} />
          Maps
        </a>
      </header>

      {/* 🖼️ INTERACTIVE GALLERY */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', backgroundColor: '#0F172A' }}>
        <img
          src={hotel.images[activePhotoIdx]}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Gallery navigation controls */}
        {hotel.images.length > 1 && (
          <>
            <button
              onClick={() => setActivePhotoIdx(prev => (prev === 0 ? hotel.images.length - 1 : prev - 1))}
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActivePhotoIdx(prev => (prev === hotel.images.length - 1 ? 0 : prev + 1))}
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '3px 8px',
          borderRadius: '12px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: 600
        }}>
          {activePhotoIdx + 1} / {hotel.images.length}
        </div>
      </div>

      {/* 📋 DETAILS & INFO */}
      <main style={{ padding: '16px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(15, 81, 50, 0.1)',
                color: '#0F5132',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '6px'
              }}>
                <ShieldCheck size={12} /> Verified Private Stay
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 4px 0', color: '#0F172A' }}>
                {hotel.name}
              </h2>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                {hotel.address}
              </p>
            </div>

            <div style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Star size={12} fill="#EAB308" color="#EAB308" />
              {hotel.rating} <span style={{ opacity: 0.7, fontSize: '10.5px' }}>({hotel.reviewCount})</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            padding: '8px 10px',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#334155',
            fontWeight: 500
          }}>
            <MapPin size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span>{hotel.distanceSummary}</span>
          </div>
        </div>

        {/* ❄️ AMENITIES */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '14px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#0F172A' }}>
            Room Amenities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {hotel.features.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155' }}>
                <Check size={14} color="#16A34A" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📜 PROPERTY RULES & POLICIES */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '14px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#0F172A' }}>
            Check-In Policies & Rules
          </h3>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '10px', fontSize: '12px', color: '#475569' }}>
            <div><strong>Check-in:</strong> {hotel.policies.checkIn}</div>
            <div><strong>Check-out:</strong> {hotel.policies.checkOut}</div>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
            {hotel.policies.rules.map((rule, idx) => (
              <li key={idx} style={{ marginBottom: '3px' }}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* 📝 DIRECT BOOKING & WHATSAPP FORM */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '18px 16px',
          border: '1.5px solid #0F5132',
          boxShadow: '0 4px 16px rgba(15, 81, 50, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#0F5132' }}>
              Book Room via WhatsApp
            </h3>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>₹{hotel.pricePerNight}</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}> /night</span>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={todayStr}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Rooms
                </label>
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={1}>1 Room</option>
                  <option value={2}>2 Rooms</option>
                  <option value={3}>3 Rooms</option>
                  <option value={4}>4+ Rooms</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Family</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Reddy"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                WhatsApp Mobile Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Price Breakdown */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '12px',
              color: '#475569',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span>₹{hotel.pricePerNight} × {nights} night(s) × {roomsCount} room(s)</span>
              </div>
              <strong style={{ fontSize: '14px', color: '#0F5132' }}>₹{totalAmount}</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <MessageSquare size={16} />
              {isSubmitting ? 'Sending Request...' : 'Send WhatsApp Booking Request'}
            </button>
            <p style={{ fontSize: '10.5px', color: '#64748B', textAlign: 'center', margin: 0 }}>
              ⚡ Instant response from hotel owner · Zero advance payment required
            </p>
          </form>
        </div>
      </main>

      {/* 🚀 BOOKING SUCCESS MODAL */}
      {bookingSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '24px 20px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <Check size={26} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: '#0F172A' }}>
              Booking Request Prepared!
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Your booking reference is <strong>{bookingSuccess.bookingId}</strong>. WhatsApp has been opened to confirm directly with the hotel manager.
            </p>

            <a
              href={bookingSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                boxSizing: 'border-box',
                marginBottom: '10px'
              }}
            >
              <MessageSquare size={16} /> Open WhatsApp Chat
            </a>

            <button
              onClick={() => setBookingSuccess(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

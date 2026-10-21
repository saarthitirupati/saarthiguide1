'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bed, User, Phone, Calendar, Users, IndianRupee, Car, 
  FileText, ShieldCheck, Send, CheckCircle2, ChevronDown, 
  Bell, MessageSquare, RefreshCw, ArrowLeft, Sparkles, Check,
  Languages, MapPin
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';

const DRAFT_STORAGE_KEY = 'saarthi_room_booking_draft';
const USER_BOOKINGS_STORAGE_KEY = 'saarthi_user_hotel_bookings';

interface BookingReceipt {
  bookingId: string;
  whatsappUrl?: string;
  details: {
    fullName: string;
    phone: string;
    communicationLanguage?: string;
    checkIn: string;
    checkOut: string;
    pilgrims: string;
    budget: number;
    cab: string;
    notes?: string;
  };
  submittedAt?: string;
}

export default function TirupatiHotelsPage() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('Telugu');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [pilgrimsCount, setPilgrimsCount] = useState<'1 person' | '2 people' | '3–4 people' | '5 or more'>('2 people');
  const [budget, setBudget] = useState(2500);
  const [needCab, setNeedCab] = useState<'yes' | 'no' | 'contact'>('yes');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // UI / Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingReceipt | null>(null);

  // Today's formatted IST date for date pickers min value
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Initial Load: Check for active booking receipt first, fallback to draft
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // A. Restore confirmed booking receipt if present in localStorage
    try {
      const storedBookings = localStorage.getItem(USER_BOOKINGS_STORAGE_KEY);
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        const latest: BookingReceipt | null = Array.isArray(parsed)
          ? (parsed.length > 0 ? parsed[parsed.length - 1] : null)
          : (parsed?.bookingId ? parsed : null);

        if (latest && typeof latest.bookingId === 'string' && latest.bookingId.startsWith('SRTH-') && latest.details) {
          setSubmittedBooking(latest);
          return; // Show active confirmed confirmation screen directly
        }
      }
    } catch (e) {
      console.warn('Failed to restore saved hotel bookings receipt:', e);
    }

    // B. If no active receipt, restore any unsubmitted draft
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.mobileNumber) setMobileNumber(parsed.mobileNumber);
        if (parsed.preferredLanguage) setPreferredLanguage(parsed.preferredLanguage);
        if (parsed.checkInDate) setCheckInDate(parsed.checkInDate);
        if (parsed.checkOutDate) setCheckOutDate(parsed.checkOutDate);
        if (parsed.pilgrimsCount) setPilgrimsCount(parsed.pilgrimsCount);
        if (parsed.budget) setBudget(Number(parsed.budget));
        if (parsed.needCab) setNeedCab(parsed.needCab);
        if (parsed.additionalNotes) setAdditionalNotes(parsed.additionalNotes);
      } else {
        // Pre-select based on existing app language preference if available
        const appLang = localStorage.getItem('saarthi_user_language');
        if (appLang === 'te') setPreferredLanguage('Telugu');
        else if (appLang === 'hi') setPreferredLanguage('Hindi');
        else if (appLang === 'ta') setPreferredLanguage('Tamil');
        else if (appLang === 'kn') setPreferredLanguage('Kannada');
        else if (appLang === 'en') setPreferredLanguage('English');
      }
    } catch (e) {
      console.warn('Failed to restore room booking draft:', e);
    }
  }, []);

  // 2. Auto-save draft to localStorage whenever form changes (only when not confirmed)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (submittedBooking) return; // Don't overwrite draft while viewing confirmed receipt

    const draft = {
      fullName,
      mobileNumber,
      preferredLanguage,
      checkInDate,
      checkOutDate,
      pilgrimsCount,
      budget,
      needCab,
      additionalNotes
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // storage quota or private mode warning
    }
  }, [fullName, mobileNumber, preferredLanguage, checkInDate, checkOutDate, pilgrimsCount, budget, needCab, additionalNotes, submittedBooking]);

  // Convert pilgrims pill to number for backend
  const getPilgrimNumber = (val: string): number => {
    if (val === '1 person') return 1;
    if (val === '2 people') return 2;
    if (val === '3–4 people') return 4;
    return 6;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 2) {
      setValidationError('Please enter your full name.');
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!checkInDate) {
      setValidationError('Please select a check-in date.');
      return;
    }

    if (!checkOutDate) {
      setValidationError('Please select a check-out date.');
      return;
    }

    if (new Date(checkOutDate) < new Date(checkInDate)) {
      setValidationError('Check-out date cannot be earlier than check-in date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: 'vamana-inn-tirupati',
          hotelName: 'Hotel Vamana Inn & Partner Stays',
          guestName: cleanName,
          guestPhone: cleanPhone.slice(-10),
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: getPilgrimNumber(pilgrimsCount),
          rooms: pilgrimsCount === '5 or more' ? 2 : 1,
          budgetPerNight: budget,
          cabPreference: needCab,
          communicationLanguage: preferredLanguage,
          specialRequirements: additionalNotes.trim(),
          totalAmount: budget
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.bookingId) {
        throw new Error(data.error || 'Failed to submit booking request.');
      }

      const receipt: BookingReceipt = {
        bookingId: data.bookingId,
        whatsappUrl: data.whatsappUrl,
        details: {
          fullName: cleanName,
          phone: cleanPhone.slice(-10),
          communicationLanguage: preferredLanguage,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          pilgrims: pilgrimsCount,
          budget,
          cab: needCab === 'yes' ? 'Yes, Cab needed' : needCab === 'contact' ? 'Discuss cab options' : 'No cab (Room only)',
          notes: additionalNotes.trim()
        },
        submittedAt: new Date().toISOString()
      };

      // Backend confirmed success: save receipt to localStorage and clear draft
      if (typeof window !== 'undefined') {
        try {
          const existingRaw = localStorage.getItem(USER_BOOKINGS_STORAGE_KEY);
          let bookingsList: BookingReceipt[] = [];
          if (existingRaw) {
            const parsed = JSON.parse(existingRaw);
            if (Array.isArray(parsed)) bookingsList = parsed;
            else if (parsed?.bookingId) bookingsList = [parsed];
          }
          bookingsList.push(receipt);
          localStorage.setItem(USER_BOOKINGS_STORAGE_KEY, JSON.stringify(bookingsList));

          // Remove draft only after successful submission and receipt storage
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch (storageErr) {
          console.warn('Could not save booking receipt to localStorage:', storageErr);
        }
      }

      setSubmittedBooking(receipt);
    } catch (err: any) {
      // Submission failed: Draft is preserved in localStorage so user data is not lost
      setValidationError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Book Another Stay" Reset Handler
  const handleBookAnotherStay = () => {
    setSubmittedBooking(null);
    setFullName('');
    setMobileNumber('');
    setCheckInDate('');
    setCheckOutDate('');
    setPilgrimsCount('2 people');
    setBudget(2500);
    setPreferredLanguage('Telugu');
    setNeedCab('yes');
    setAdditionalNotes('');
    setValidationError(null);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(USER_BOOKINGS_STORAGE_KEY);
      } catch (e) {
        console.warn('Could not clear active booking storage:', e);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAFAF7',
      color: '#1B2A1E',
      maxWidth: '680px',
      margin: '0 auto',
      paddingBottom: '72px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ── TOP HEADER (Saarthi Subpage Navigation) ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ECEEEA',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F0',
              color: '#0F5132',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#1B2A1E', lineHeight: 1.2 }}>
              Pilgrim Stay
            </h1>
            <p style={{ fontSize: '11px', margin: 0, color: '#687968' }}>
              Tirupati Foothills & Temple Stays
            </p>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <ShieldCheck size={13} color="#166534" />
          <span>Verified Stays</span>
        </div>
      </header>



      {/* ── MAIN CONTENT CONTAINER (72px padding-bottom for compact clearance above bottom nav) ── */}
      <main style={{ padding: '8px 16px 72px' }}>
        {/* ── SUCCESS VIEW: Request Submitted ── */}
        {submittedBooking ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #D1E2CF',
            padding: '28px 20px',
            boxShadow: '0 8px 24px rgba(15, 81, 50, 0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              color: '#0F5132',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} color="#0F5132" />
            </div>

            <span style={{
              display: 'inline-block',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              Ref ID: {submittedBooking.bookingId}
            </span>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1B2A1E', margin: '0 0 8px' }}>
              Stay Request Received!
            </h2>

            <p style={{ fontSize: '13.5px', color: '#556857', lineHeight: 1.5, margin: '0 0 20px' }}>
              Our accommodation team will review availability with our verified stay partner and call you shortly to confirm your booking.
            </p>

            {/* Request Summary Card */}
            <div style={{
              backgroundColor: '#F9FAF8',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              padding: '14px 16px',
              textAlign: 'left',
              fontSize: '12.5px',
              color: '#374151',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Guest:</span>
                <strong>{submittedBooking.details.fullName} ({submittedBooking.details.phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Preferred Language:</span>
                <strong style={{ color: '#0F5132' }}>🗣️ {submittedBooking.details.communicationLanguage || 'Telugu'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Dates:</span>
                <strong>{submittedBooking.details.checkIn} to {submittedBooking.details.checkOut}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Pilgrims:</span>
                <strong>{submittedBooking.details.pilgrims}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Budget Preference:</span>
                <strong style={{ color: '#0F5132' }}>₹{submittedBooking.details.budget} / room / night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>Cab Service:</span>
                <strong>{submittedBooking.details.cab}</strong>
              </div>
              {submittedBooking.details.notes && (
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '6px' }}>
                  <span style={{ color: '#6B7280', display: 'block', marginBottom: '2px' }}>Special Request:</span>
                  <span style={{ fontStyle: 'italic' }}>{submittedBooking.details.notes}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Follow-up Button */}
            {submittedBooking.whatsappUrl && (
              <a
                href={submittedBooking.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '13px 20px',
                  borderRadius: '24px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                  marginBottom: '10px'
                }}
              >
                <MessageSquare size={16} />
                Instant WhatsApp Confirmation
              </a>
            )}

            {/* "Book Another Stay" button */}
            <button
              onClick={handleBookAnotherStay}
              style={{
                width: '100%',
                backgroundColor: '#F1F5F0',
                border: '1px solid #D1E2CF',
                color: '#0F5132',
                padding: '12px 18px',
                borderRadius: '24px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>+ Book Another Stay</span>
            </button>
          </div>
        ) : (
          /* ── MAIN ROOM BOOKING REQUEST FORM ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Visual Hero Banner Card */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px -4px rgba(15, 81, 50, 0.16)',
              border: '1px solid #ECEEEA',
              backgroundColor: '#0F5132',
              position: 'relative'
            }}>
              <img
                src="/hotel-hero.png"
                alt="Find Comfortable Rooms in Tirupati"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: '220px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Quick Feature Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { icon: MapPin, text: 'Near Temple' },
                { icon: ShieldCheck, text: 'Verified Stays' },
                { icon: IndianRupee, text: 'Budget Friendly' }
              ].map((badge, idx) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #ECEEEA',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#0F5132',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <IconComponent size={12} color="#0F5132" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Error Banner */}
            {validationError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#B91C1C',
                fontSize: '12px',
                fontWeight: 600
              }}>
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* ── SECTION 1: CONTACT DETAILS ── */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #ECEEEA',
                padding: '14px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <User size={15} color="#0F5132" />
                  <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#1B2A1E', margin: 0 }}>
                    1. Contact & Language
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Name & Phone Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '3px' }}>
                        Full Name <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '8px 10px'
                      }}>
                        <User size={14} color="#9CA3AF" style={{ marginRight: '6px', flexShrink: 0 }} />
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '12.5px',
                            color: '#1B2A1E',
                            backgroundColor: 'transparent'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '3px' }}>
                        WhatsApp Mobile <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '8px 10px'
                      }}>
                        <Phone size={14} color="#9CA3AF" style={{ marginRight: '6px', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginRight: '4px' }}>+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '12.5px',
                            color: '#1B2A1E',
                            backgroundColor: 'transparent'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Language Selection Chips with Lucide Icons */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '5px' }}>
                      <Languages size={12} color="#0F5132" />
                      <span>Preferred Call Language</span>
                    </label>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {[
                        { code: 'Telugu', label: 'తెలుగు' },
                        { code: 'English', label: 'English' },
                        { code: 'Hindi', label: 'हिंदी' },
                        { code: 'Tamil', label: 'தமிழ்' },
                        { code: 'Kannada', label: 'ಕನ್ನಡ' }
                      ].map((lang) => {
                        const isSelected = preferredLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setPreferredLanguage(lang.code)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '16px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isSelected ? '1.5px solid #0F5132' : '1px solid #E5E7EB',
                              backgroundColor: isSelected ? '#ECFDF5' : '#FAF8F5',
                              color: isSelected ? '#0F5132' : '#4B5563',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isSelected && <Check size={11} color="#0F5132" />}
                            <span>{lang.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: STAY & PILGRIMS ── */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #ECEEEA',
                padding: '14px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Calendar size={15} color="#0F5132" />
                  <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#1B2A1E', margin: 0 }}>
                    2. Stay Dates & Pilgrims
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '3px' }}>
                        Check-in <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '8px 10px'
                      }}>
                        <Calendar size={13} color="#0F5132" style={{ marginRight: '6px', flexShrink: 0 }} />
                        <input
                          type="date"
                          required
                          min={todayStr}
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '12px',
                            color: checkInDate ? '#1B2A1E' : '#9CA3AF',
                            backgroundColor: 'transparent',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '3px' }}>
                        Check-out <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '8px 10px'
                      }}>
                        <Calendar size={13} color="#0F5132" style={{ marginRight: '6px', flexShrink: 0 }} />
                        <input
                          type="date"
                          required
                          min={checkInDate || todayStr}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '12px',
                            color: checkOutDate ? '#1B2A1E' : '#9CA3AF',
                            backgroundColor: 'transparent',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pilgrim Count Cards */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '5px' }}>
                      <Users size={12} color="#0F5132" />
                      <span>Pilgrims & Room Count</span>
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '6px'
                    }}>
                      {[
                        { key: '1 person', title: '1', sub: 'Single' },
                        { key: '2 people', title: '2', sub: '1 Room' },
                        { key: '3–4 people', title: '3–4', sub: 'Family' },
                        { key: '5 or more', title: '5+', sub: 'Suite' }
                      ].map((item) => {
                        const isSelected = pilgrimsCount === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setPilgrimsCount(item.key as any)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '7px 2px',
                              borderRadius: '10px',
                              border: isSelected ? '1.5px solid #0F5132' : '1px solid #E5E7EB',
                              backgroundColor: isSelected ? '#ECFDF5' : '#FAF8F5',
                              color: isSelected ? '#0F5132' : '#4B5563',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ fontSize: '13px', fontWeight: 800 }}>{item.title}</span>
                            <span style={{ fontSize: '10px', color: isSelected ? '#065F46' : '#6B7280' }}>{item.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: PREFERENCES & EXTRAS ── */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #ECEEEA',
                padding: '14px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <IndianRupee size={15} color="#0F5132" />
                  <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#1B2A1E', margin: 0 }}>
                    3. Budget & Preferences
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Budget Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563' }}>
                        Budget / Night
                      </span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#0F5132',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #BBF7D0',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        ₹ {budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Presets */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {[
                        { label: '₹1.2k (Budget)', val: 1200 },
                        { label: '₹2.5k (Standard)', val: 2500 },
                        { label: '₹4.5k (Deluxe)', val: 4500 }
                      ].map((preset) => {
                        const isPresetActive = budget === preset.val;
                        return (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => setBudget(preset.val)}
                            style={{
                              flex: 1,
                              padding: '5px 2px',
                              borderRadius: '8px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isPresetActive ? '1.5px solid #0F5132' : '1px solid #E5E7EB',
                              backgroundColor: isPresetActive ? '#ECFDF5' : '#FAF8F5',
                              color: isPresetActive ? '#0F5132' : '#6B7280',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="range"
                      min="1200"
                      max="7500"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      style={{
                        width: '100%',
                        height: '5px',
                        borderRadius: '3px',
                        accentColor: '#0F5132',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Cab Selection (Clean horizontal pills) */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '5px' }}>
                      <Car size={12} color="#0F5132" />
                      <span>Tirumala Ghat Cab?</span>
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { key: 'yes', label: 'Yes, need cab' },
                        { key: 'no', label: 'Room only' },
                        { key: 'contact', label: 'Call me' }
                      ].map(item => {
                        const isSelected = needCab === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setNeedCab(item.key as any)}
                            style={{
                              flex: 1,
                              padding: '6px 4px',
                              borderRadius: '10px',
                              border: isSelected ? '1.5px solid #0F5132' : '1px solid #E5E7EB',
                              backgroundColor: isSelected ? '#ECFDF5' : '#FAF8F5',
                              fontSize: '11px',
                              color: isSelected ? '#0F5132' : '#4B5563',
                              fontWeight: isSelected ? 800 : 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#FAF8F5',
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '7px 10px'
                    }}>
                      <FileText size={13} color="#9CA3AF" style={{ marginRight: '6px', flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="Special requests (ground floor, elderly...)"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '12px',
                          color: '#1B2A1E',
                          backgroundColor: 'transparent',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#0F5132" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', color: '#065F46', fontWeight: 600 }}>
                  Free booking request • No advance payment required
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0F5132 0%, #166534 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '13px 20px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 81, 50, 0.22)',
                  transition: 'opacity 0.2s ease',
                  opacity: isSubmitting ? 0.75 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Stay Request</span>
                  </>
                )}
              </button>

              {/* Microcopy below button */}
              <p style={{
                fontSize: '11px',
                color: '#6B7280',
                textAlign: 'center',
                margin: '0 auto'
              }}>
                Direct partner rates. Zero booking fee.
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

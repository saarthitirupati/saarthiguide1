'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bed, User, Phone, Calendar, Users, IndianRupee, Car, 
  FileText, ShieldCheck, Send, CheckCircle2, ChevronDown, 
  Bell, MessageSquare, RefreshCw
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
      paddingBottom: '100px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ── TOP HEADER (Saarthi Brand Header) ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #ECEEEA',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Saarthi Logo & Name */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo size={32} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F5132', letterSpacing: '-0.02em' }}>
            Saarthi
          </span>
        </Link>

        {/* Right: Tirupati Location Pill, Lang, Alert Bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Location Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#166534',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 700
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Tirupati</span>
            <ChevronDown size={13} color="#166534" />
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            color: '#374151',
            padding: '5px 9px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            <span>文A EN</span>
          </div>

          {/* Bell Icon */}
          <Link
            href="/alerts"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              textDecoration: 'none'
            }}
          >
            <Bell size={16} />
          </Link>
        </div>
      </header>



      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ padding: '8px 18px 24px' }}>
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
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #ECEEEA',
            padding: '22px 18px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
          }}>
            {/* Header Box: Bed Icon in light green circle + Title */}
            <div style={{
              backgroundColor: '#ECFDF5',
              borderRadius: '18px',
              padding: '16px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #A7F3D0',
                color: '#0F5132',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.08)'
              }}>
                <Bed size={24} color="#0F5132" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  margin: '0 0 3px',
                  color: '#1B2A1E',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  Find Your Pilgrim Stay
                </h1>
                <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, lineHeight: 1.4 }}>
                  Tell us your requirements. Our team will help coordinate your stay.
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {validationError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#B91C1C',
                fontSize: '12.5px',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Field 1: Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '10px 14px'
                }}>
                  <User size={16} color="#9CA3AF" style={{ marginRight: '10px', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '13.5px',
                      color: '#1B2A1E',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                  Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '10px 14px'
                }}>
                  <Phone size={16} color="#9CA3AF" style={{ marginRight: '10px', flexShrink: 0 }} />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '13.5px',
                      color: '#1B2A1E',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>

              {/* Communication Language Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                  Preferred Language (for Call / WhatsApp)
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { code: 'Telugu', label: 'తెలుగు (Telugu)' },
                    { code: 'English', label: 'English' },
                    { code: 'Hindi', label: 'हिंदी (Hindi)' },
                    { code: 'Tamil', label: 'தமிழ் (Tamil)' },
                    { code: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLanguage(lang.code)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: preferredLanguage === lang.code ? '1.5px solid #0F5132' : '1px solid #E5E7EB',
                        backgroundColor: preferredLanguage === lang.code ? '#ECFDF5' : '#FFFFFF',
                        color: preferredLanguage === lang.code ? '#0F5132' : '#4B5563',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3 & 4: Check-in Date & Check-out Date (2 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                    Check-in Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '9px 12px'
                  }}>
                    <Calendar size={15} color="#9CA3AF" style={{ marginRight: '8px', flexShrink: 0 }} />
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
                        fontSize: '12.5px',
                        color: checkInDate ? '#1B2A1E' : '#9CA3AF',
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                    Check-out Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '9px 12px'
                  }}>
                    <Calendar size={15} color="#9CA3AF" style={{ marginRight: '8px', flexShrink: 0 }} />
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
                        fontSize: '12.5px',
                        color: checkOutDate ? '#1B2A1E' : '#9CA3AF',
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Field 5: Number of Pilgrims */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '8px' }}>
                  <Users size={15} color="#0F5132" />
                  <span>Number of Pilgrims</span>
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {(['1 person', '2 people', '3–4 people', '5 or more'] as const).map((option) => {
                    const isSelected = pilgrimsCount === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPilgrimsCount(option)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 4px',
                          borderRadius: '12px',
                          border: isSelected ? '1.5px solid #0F5132' : '1.5px solid #E5E7EB',
                          backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                          color: isSelected ? '#0F5132' : '#4B5563',
                          fontSize: '12px',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: isSelected ? '4px solid #0F5132' : '1.5px solid #D1D5DB',
                          boxSizing: 'border-box'
                        }} />
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 6: Budget per room, per night */}
              <div style={{ paddingTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1B2A1E' }}>
                    <IndianRupee size={15} color="#0F5132" />
                    <span>Budget per room, per night</span>
                  </label>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F5132' }}>
                    ₹ {budget.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1200"
                  max="7500"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    accentColor: '#0F5132',
                    cursor: 'pointer'
                  }}
                />

                {/* Range Scale Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                  <span>₹ 1,200</span>
                  <span>₹ 4,500</span>
                  <span>₹ 7,500</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Final room availability and price will be confirmed by our team.
                </p>
              </div>

              {/* Field 7: Do you need a cab? */}
              <div style={{ paddingTop: '4px', borderTop: '1px solid #F3F4F6' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '8px' }}>
                  <Car size={15} color="#0F5132" />
                  <span>Do you need a cab?</span>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'yes', label: 'Yes, I need a cab' },
                    { key: 'no', label: 'No, room only' },
                    { key: 'contact', label: 'Please contact me about cab options' }
                  ].map(item => {
                    const isSelected = needCab === item.key;
                    return (
                      <label
                        key={item.key}
                        onClick={() => setNeedCab(item.key as any)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid #A7F3D0' : '1px solid transparent',
                          backgroundColor: isSelected ? '#F0FDF4' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: isSelected ? '#0F5132' : '#374151',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        <span style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #0F5132' : '1.5px solid #CBD5E1',
                          boxSizing: 'border-box'
                        }} />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Field 8: Additional requirements (optional) */}
              <div style={{ paddingTop: '4px', borderTop: '1px solid #F3F4F6' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1B2A1E', marginBottom: '6px' }}>
                  <FileText size={15} color="#0F5132" />
                  <span>Additional requirements (optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Temple pickup, elderly pilgrims, special requirements..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#1B2A1E',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Disclaimer Notice Box */}
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}>
                <ShieldCheck size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#0F5132', display: 'block', marginBottom: '2px' }}>
                    Booking request, not instant confirmation
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#065F46', lineHeight: 1.4, display: 'block' }}>
                    Our team will check availability and contact you to confirm the details before your booking is finalized.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: '#0F5132',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
                  transition: 'background-color 0.2s ease',
                  opacity: isSubmitting ? 0.75 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>

              {/* Microcopy below button */}
              <p style={{
                fontSize: '11.5px',
                color: '#6B7280',
                textAlign: 'center',
                margin: '0 auto'
              }}>
                We'll get back to you soon with the best options for your stay.
              </p>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

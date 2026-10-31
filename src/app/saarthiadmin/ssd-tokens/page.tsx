'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  XCircle, 
  AlertTriangle, 
  Bell, 
  Megaphone,
  Users, 
  MessageSquare, 
  Send, 
  FileText, 
  RefreshCw, 
  Eye, 
  Calendar, 
  X, 
  Check, 
  Pause,
  Save,
  ChevronRight,
  Info,
  Edit2
} from 'lucide-react';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';

/**
 * Temple Gopuram Icon with custom color
 */
function TempleIcon({ color = '#EF4444', size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="2.5" r="1.5" fill={color} />
      <path d="M12 4.5L5 9H19L12 4.5Z" fill={color} />
      <rect x="4" y="9" width="16" height="2" rx="0.5" fill={color} />
      <rect x="5.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="9.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="13.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="17.5" y="11" width="2" height="7" rx="0.5" fill={color} />
      <rect x="3" y="18" width="18" height="2" rx="0.5" fill={color} />
      <rect x="2" y="20" width="20" height="2" rx="0.5" fill={color} />
    </svg>
  );
}

interface NotificationHistoryItem {
  id: string;
  dateTime: string;
  type: string;
  message: string;
  status: 'Sent' | 'Failed' | 'Pending';
  sentTo?: string;
}

/**
 * Format date-time safely for Asia/Kolkata (IST) display
 */
function formatKolkata(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '') return '';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return dateStr; // Preserve existing custom text string
  }
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(parsed);
}

/**
 * Convert ISO / date string to datetime-local input string (YYYY-MM-DDTHH:mm) in IST
 */
function toDatetimeLocalValue(str: string): string {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '';
  const istTime = new Date(d.getTime() + (5.5 * 60 + d.getTimezoneOffset()) * 60000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${istTime.getFullYear()}-${pad(istTime.getMonth() + 1)}-${pad(istTime.getDate())}T${pad(istTime.getHours())}:${pad(istTime.getMinutes())}`;
}

export default function AdminSsdTokensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. Global Issuing Status (Kept independent from individual SSD/DD statuses)
  const [globalStatus, setGlobalStatus] = useState<'issuing' | 'paused' | 'closed-for-day' | 'suspended'>('closed-for-day');

  // 2. Live Notice & Metadata
  const [liveNotice, setLiveNotice] = useState<string>('SSD 10K & DD 2K Tokens Quota completed. Next update at 5:30 PM tomorrow.');
  const [nextBatchTime, setNextBatchTime] = useState<string>('5:30 PM');
  const [advisoryBadge, setAdvisoryBadge] = useState<string>('Quota Completed');
  const [modeBadge, setModeBadge] = useState<string>('Tokens Not Available');

  // 3. SSD Tokens (Daily Quota 10,000)
  const [ssdAvailable, setSsdAvailable] = useState<string>('0');
  const [ssdStatus, setSsdStatus] = useState<'issuing' | 'paused' | 'completed' | 'suspended'>('completed');
  const [ssdStartTime, setSsdStartTime] = useState<string>('30 Oct 2026, 5:30 PM');
  const [ssdCompletedTime, setSsdCompletedTime] = useState<string>('31 Oct 2026, 12:44 AM');

  // 4. DD Tokens (Daily Quota 2,000)
  const [ddAvailable, setDdAvailable] = useState<string>('0');
  const [ddStatus, setDdStatus] = useState<'issuing' | 'paused' | 'completed' | 'suspended'>('completed');
  const [ddStartTime, setDdStartTime] = useState<string>('30 Oct 2026, 5:30 PM');
  const [ddCompletedTime, setDdCompletedTime] = useState<string>('31 Oct 2026, 2:00 AM');

  // 5. Publish Choice: Default is strictly "website_only"
  const [publishChoice, setPublishChoice] = useState<'website_only' | 'website_and_push'>('website_only');

  // 6. Notification Customization Controls
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // 7. Notification History
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([
    {
      id: 'h-1',
      dateTime: '30 Oct 2026, 5:30 PM',
      type: 'SSD + DD',
      message: 'Quota completed',
      status: 'Sent'
    },
    {
      id: 'h-2',
      dateTime: '29 Oct 2026, 6:00 PM',
      type: 'DD Tokens',
      message: 'Issuing started',
      status: 'Sent'
    },
    {
      id: 'h-3',
      dateTime: '28 Oct 2026, 8:15 PM',
      type: 'SSD Tokens',
      message: 'Paused temporarily',
      status: 'Sent'
    }
  ]);

  // Load initial live status from API
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const data = await safeFetchJson<any>('/api/admin/ssd-tokens');
      if (data) {
        if (data.ssdTokenStatus) setGlobalStatus(data.ssdTokenStatus);
        if (data.ssdNotice !== undefined && data.ssdNotice.trim() !== '') setLiveNotice(data.ssdNotice);
        if (data.ssdNextTokenTime) setNextBatchTime(data.ssdNextTokenTime);
        if (data.ssdAdvisoryTag !== undefined) setAdvisoryBadge(data.ssdAdvisoryTag);
        if (data.ssdModeBadge !== undefined) setModeBadge(data.ssdModeBadge);

        // Load SSD token details
        if (data.ssdTokenDetails) {
          if (data.ssdTokenDetails.tokensLeft !== undefined) {
            setSsdAvailable(String(data.ssdTokenDetails.tokensLeft));
          }
          if (data.ssdTokenDetails.status) {
            setSsdStatus(data.ssdTokenDetails.status);
          }
          if (data.ssdTokenDetails.startTime) {
            setSsdStartTime(data.ssdTokenDetails.startTime);
          }
          if (data.ssdTokenDetails.completedTime) {
            setSsdCompletedTime(data.ssdTokenDetails.completedTime);
          }
        }

        // Load DD token details
        if (data.ddTokenDetails) {
          if (data.ddTokenDetails.tokensLeft !== undefined) {
            setDdAvailable(String(data.ddTokenDetails.tokensLeft));
          }
          if (data.ddTokenDetails.status) {
            setDdStatus(data.ddTokenDetails.status);
          }
          if (data.ddTokenDetails.startTime) {
            setDdStartTime(data.ddTokenDetails.startTime);
          }
          if (data.ddTokenDetails.completedTime) {
            setDdCompletedTime(data.ddTokenDetails.completedTime);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load SSD/DD token status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Requirement 3: Global status updates globalStatus only and does NOT overwrite individual SSD/DD statuses
  const handleGlobalStatusChange = (status: 'issuing' | 'paused' | 'closed-for-day' | 'suspended') => {
    setGlobalStatus(status);
    if (status === 'closed-for-day') {
      setAdvisoryBadge('Quota Completed');
      setModeBadge('Tokens Not Available');
    } else if (status === 'issuing') {
      setAdvisoryBadge('');
      setModeBadge('Open 24/7');
    } else if (status === 'paused') {
      setAdvisoryBadge('High Rush');
      setModeBadge('Paused');
    } else if (status === 'suspended') {
      setAdvisoryBadge('Brahmotsavam');
      setModeBadge('Walk-in Only');
    }
  };

  // Dynamic default preview title based on statuses
  const defaultAutoTitle = (
    ssdStatus === 'completed' && ddStatus === 'completed'
      ? "Today's SSD & DD Token Quota Completed"
      : ssdStatus === 'issuing' || ddStatus === 'issuing'
      ? 'SSD & DD Tokens Issuing Now'
      : ssdStatus === 'paused' || ddStatus === 'paused'
      ? 'SSD / DD Token Issuance Paused'
      : 'SSD & DD Tokens Update'
  );

  const defaultAutoBody = liveNotice.trim() || `SSD ${ssdAvailable} & DD ${ddAvailable} tokens available.`;

  const previewTitle = customTitle.trim() || defaultAutoTitle;
  const previewBody = customBody.trim() || defaultAutoBody;

  // Submit Handler
  const handlePublish = async () => {
    setSaving(true);
    setMessage(null);

    let sendPushApproved = false;
    if (publishChoice === 'website_and_push') {
      sendPushApproved = window.confirm(
        `Dispatch Push Notification to all subscribers?\n\nTitle: ${previewTitle}\nMessage: ${previewBody}`
      );
      if (!sendPushApproved) {
        setSaving(false);
        return; // Admin cancelled push dispatch
      }
    }

    try {
      const adminToken = typeof window !== 'undefined' 
        ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026') 
        : 'saarthi_admin_token_2026';

      const nowIso = new Date().toISOString();
      const payload = {
        ssdTokenStatus: globalStatus,
        ssdNextTokenTime: nextBatchTime,
        ssdNotice: liveNotice,
        ssdTimingsGuide: `SSD Quota: 10,000 (Available: ${ssdAvailable}, Started at ${ssdStartTime || 'N/A'}, Completed at ${ssdCompletedTime || 'N/A'}, Status: ${ssdStatus}, Verified at: ${nowIso}), DD Quota: 2,000 (Available: ${ddAvailable}, Started at ${ddStartTime || 'N/A'}, Completed at ${ddCompletedTime || 'N/A'}, Status: ${ddStatus}, Verified at: ${nowIso})`,
        ssdAdvisoryTag: advisoryBadge,
        ssdModeBadge: modeBadge,
        ssdTokenDetails: {
          totalTokens: '10,000',
          tokensLeft: ssdAvailable,
          status: ssdStatus,
          startTime: ssdStartTime,
          completedTime: ssdCompletedTime,
          lastVerifiedAt: nowIso
        },
        ddTokenDetails: {
          totalTokens: '2,000',
          tokensLeft: ddAvailable,
          status: ddStatus,
          startTime: ddStartTime,
          completedTime: ddCompletedTime,
          lastVerifiedAt: nowIso
        },
        sendSsdPush: sendPushApproved,
        sendDdPush: sendPushApproved,
        sendToAll: true,
        customNotification: sendPushApproved ? { title: previewTitle, body: previewBody } : null
      };

      const res = await fetch('/api/admin/ssd-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        notifyRealtimeUpdate();

        if (sendPushApproved) {
          setNotificationHistory(prev => [
            {
              id: `notif-${Date.now()}`,
              dateTime: formatKolkata(new Date().toISOString()),
              type: 'SSD + DD',
              message: liveNotice.trim() || 'Quota and token status updated',
              status: 'Sent'
            },
            ...prev
          ]);

          setMessage({
            text: 'Live status updated & push notification broadcasted successfully!',
            type: 'success'
          });
        } else {
          setMessage({
            text: 'Website SSD & DD token updates published live (No notification sent).',
            type: 'success'
          });
        }
      } else {
        setMessage({
          text: 'Failed to publish: ' + (data?.error || 'Authentication error. Please re-login.'),
          type: 'error'
        });
      }
    } catch (err: any) {
      setMessage({
        text: 'Error saving token updates: ' + (err?.message || 'Network error'),
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 20px 80px 20px', fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TempleIcon color="#2563EB" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              SSD & DD Token Management
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
              Manage Sarva Darshan (SSD) and Divya Darshan (DD) token issuance details for Tirumala.
            </p>
          </div>
        </div>
      </div>

      {/* ── STATUS MESSAGE BANNER ── */}
      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '13.5px',
          fontWeight: 600,
          background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          color: message.type === 'success' ? '#166534' : '#991B1B',
          border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`
        }}>
          {message.text}
        </div>
      )}

      {/* ── MAIN TWO-COLUMN WORKSPACE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* ══════════════════════════════════════════════════════════
            LEFT COLUMN: Global Status, Token Cards & Publishing
            ══════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ── CARD 1: GLOBAL ISSUING STATUS ── */}
          <div style={{ background: '#FFFDF7', border: '1px solid #FEF08A', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '16px' }}>☀️</span>
              <h2 style={{ fontSize: '14.5px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                Global Issuing Status
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: '#B45309', margin: '0 0 14px 0' }}>
              Select the current overall token issuance status.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              
              {/* Option 1: Issuing Now */}
              <button
                type="button"
                onClick={() => handleGlobalStatusChange('issuing')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: globalStatus === 'issuing' ? '2px solid #16A34A' : '1px solid #E2E8F0',
                  background: globalStatus === 'issuing' ? '#F0FDF4' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#166534' }}>Issuing Now</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Tokens are being issued</span>
              </button>

              {/* Option 2: Paused / Wait */}
              <button
                type="button"
                onClick={() => handleGlobalStatusChange('paused')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: globalStatus === 'paused' ? '2px solid #D97706' : '1px solid #E2E8F0',
                  background: globalStatus === 'paused' ? '#FFFBEB' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PauseCircle size={16} color="#D97706" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#B45309' }}>Paused / Wait</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Temporarily paused</span>
              </button>

              {/* Option 3: Quota Completed */}
              <button
                type="button"
                onClick={() => handleGlobalStatusChange('closed-for-day')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: globalStatus === 'closed-for-day' ? '2px solid #DC2626' : '1px solid #E2E8F0',
                  background: globalStatus === 'closed-for-day' ? '#FEF2F2' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} color="#DC2626" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#991B1B' }}>Quota Completed</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>All tokens issued</span>
              </button>

              {/* Option 4: Suspended (Festival) */}
              <button
                type="button"
                onClick={() => handleGlobalStatusChange('suspended')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: globalStatus === 'suspended' ? '2px solid #EA580C' : '1px solid #E2E8F0',
                  background: globalStatus === 'suspended' ? '#FFF7ED' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} color="#EA580C" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#C2410C' }}>Suspended (Festival)</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Temporarily suspended</span>
              </button>

            </div>
          </div>

          {/* ── CARD 2: TWO INDEPENDENT TOKEN CARDS (SSD & DD) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            {/* ── SSD TOKENS SUBCARD ── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TempleIcon color="#DC2626" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>SSD Tokens</h3>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Slotted Sarva Darshan (Tirupati Counters)</span>
                  </div>
                </div>
                <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 8px', textAlign: 'right' }}>
                  <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Daily Quota</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>10,000</span>
                </div>
              </div>

              {/* Tokens Available (Current Count) */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Tokens Available (Current Count)
                  </label>
                  <Info size={12} color="#94A3B8" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Enter verified remaining tokens
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={ssdAvailable}
                    onChange={(e) => setSsdAvailable(e.target.value)}
                    placeholder="e.g. 4,780 or 0"
                    style={{
                      width: '100%',
                      padding: '10px 85px 10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '14px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
                    / 10,000
                  </span>
                </div>
              </div>

              {/* Status Dropdown */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={ssdStatus}
                  onChange={(e) => setSsdStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: ssdStatus === 'issuing' ? '#F0FDF4' : ssdStatus === 'completed' ? '#FEF2F2' : '#FFFFFF',
                    color: ssdStatus === 'issuing' ? '#166534' : ssdStatus === 'completed' ? '#991B1B' : '#0F172A',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="issuing">Issuing Now</option>
                  <option value="paused">Paused / Wait</option>
                  <option value="completed">Quota Completed</option>
                  <option value="suspended">Suspended (Festival)</option>
                </select>
              </div>

              {/* Issuing Started Time */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Issuing Started Time
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Clock size={15} color="#64748B" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={ssdStartTime}
                    onChange={(e) => setSsdStartTime(e.target.value)}
                    placeholder="e.g. 30 Oct 2026, 5:30 PM"
                    style={{
                      width: '100%',
                      padding: '9px 40px 9px 34px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                  />
                  <label style={{ position: 'absolute', right: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Pick date & time">
                    <Calendar size={16} color="#64748B" />
                    <input
                      type="datetime-local"
                      value={toDatetimeLocalValue(ssdStartTime)}
                      onChange={(e) => {
                        if (e.target.value) setSsdStartTime(formatKolkata(e.target.value));
                      }}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                    />
                  </label>
                </div>
              </div>

              {/* Quota Completed Time (Manual) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Quota Completed Time (Manual)
                  </label>
                  <Info size={12} color="#94A3B8" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Set the actual time when issuing stopped
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Clock size={15} color="#64748B" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    disabled={ssdStatus !== 'completed'}
                    value={ssdCompletedTime}
                    onChange={(e) => setSsdCompletedTime(e.target.value)}
                    placeholder="Select date & time"
                    style={{
                      width: '100%',
                      padding: '9px 64px 9px 34px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: ssdStatus === 'completed' ? '#0F172A' : '#94A3B8',
                      background: ssdStatus === 'completed' ? '#FFFFFF' : '#F8FAFC',
                      cursor: ssdStatus === 'completed' ? 'text' : 'not-allowed',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ssdCompletedTime && ssdStatus === 'completed' && (
                      <button
                        type="button"
                        onClick={() => setSsdCompletedTime('')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: '#94A3B8' }}
                        title="Clear completed time"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <label style={{ cursor: ssdStatus === 'completed' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center' }} title="Pick date & time">
                      <Calendar size={16} color={ssdStatus === 'completed' ? '#64748B' : '#CBD5E1'} />
                      <input
                        type="datetime-local"
                        disabled={ssdStatus !== 'completed'}
                        value={toDatetimeLocalValue(ssdCompletedTime)}
                        onChange={(e) => {
                          if (e.target.value) setSsdCompletedTime(formatKolkata(e.target.value));
                        }}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                    </label>
                  </div>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                  {ssdStatus === 'completed'
                    ? 'ℹ️ You can manually set or correct the closed time based on official updates from TTD.'
                    : 'ℹ️ This will be enabled when status is set to "Quota Completed".'}
                </span>
              </div>
            </div>

            {/* ── DD TOKENS SUBCARD ── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TempleIcon color="#2563EB" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>DD Tokens</h3>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Srivari Mettu Divya Darshan (Footpath Counters)</span>
                  </div>
                </div>
                <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '4px 8px', textAlign: 'right' }}>
                  <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Daily Quota</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>2,000</span>
                </div>
              </div>

              {/* Tokens Available (Current Count) */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Tokens Available (Current Count)
                  </label>
                  <Info size={12} color="#94A3B8" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Enter verified remaining tokens
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={ddAvailable}
                    onChange={(e) => setDdAvailable(e.target.value)}
                    placeholder="e.g. 1,486 or 0"
                    style={{
                      width: '100%',
                      padding: '10px 80px 10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ position: 'absolute', right: '14px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
                    / 2,000
                  </span>
                </div>
              </div>

              {/* Status Dropdown */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={ddStatus}
                  onChange={(e) => setDdStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: ddStatus === 'issuing' ? '#F0FDF4' : ddStatus === 'completed' ? '#FEF2F2' : '#FFFFFF',
                    color: ddStatus === 'issuing' ? '#166534' : ddStatus === 'completed' ? '#991B1B' : '#0F172A',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="issuing">Issuing Now</option>
                  <option value="paused">Paused / Wait</option>
                  <option value="completed">Quota Completed</option>
                  <option value="suspended">Suspended (Festival)</option>
                </select>
              </div>

              {/* Issuing Started Time */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Issuing Started Time
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Clock size={15} color="#64748B" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={ddStartTime}
                    onChange={(e) => setDdStartTime(e.target.value)}
                    placeholder="e.g. 30 Oct 2026, 5:30 PM"
                    style={{
                      width: '100%',
                      padding: '9px 40px 9px 34px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                  />
                  <label style={{ position: 'absolute', right: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Pick date & time">
                    <Calendar size={16} color="#64748B" />
                    <input
                      type="datetime-local"
                      value={toDatetimeLocalValue(ddStartTime)}
                      onChange={(e) => {
                        if (e.target.value) setDdStartTime(formatKolkata(e.target.value));
                      }}
                      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                    />
                  </label>
                </div>
              </div>

              {/* Quota Completed Time (Manual) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    Quota Completed Time (Manual)
                  </label>
                  <Info size={12} color="#94A3B8" />
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Set the actual time when issuing stopped
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Clock size={15} color="#64748B" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    disabled={ddStatus !== 'completed'}
                    value={ddCompletedTime}
                    onChange={(e) => setDdCompletedTime(e.target.value)}
                    placeholder="Select date & time"
                    style={{
                      width: '100%',
                      padding: '9px 64px 9px 34px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: ddStatus === 'completed' ? '#0F172A' : '#94A3B8',
                      background: ddStatus === 'completed' ? '#FFFFFF' : '#F8FAFC',
                      cursor: ddStatus === 'completed' ? 'text' : 'not-allowed',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ddCompletedTime && ddStatus === 'completed' && (
                      <button
                        type="button"
                        onClick={() => setDdCompletedTime('')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: '#94A3B8' }}
                        title="Clear completed time"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <label style={{ cursor: ddStatus === 'completed' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center' }} title="Pick date & time">
                      <Calendar size={16} color={ddStatus === 'completed' ? '#64748B' : '#CBD5E1'} />
                      <input
                        type="datetime-local"
                        disabled={ddStatus !== 'completed'}
                        value={toDatetimeLocalValue(ddCompletedTime)}
                        onChange={(e) => {
                          if (e.target.value) setDdCompletedTime(formatKolkata(e.target.value));
                        }}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                    </label>
                  </div>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                  {ddStatus === 'completed'
                    ? 'ℹ️ You can manually set or correct the closed time based on official updates from TTD.'
                    : 'ℹ️ This will be enabled when status is set to "Quota Completed".'}
                </span>
              </div>
            </div>

          </div>

          {/* ── CARD 3: HOW WOULD YOU LIKE TO PUBLISH? ── */}
          <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: '18px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '18px' }}>🚀</span>
              <h2 style={{ fontSize: '14.5px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                How would you like to publish?
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: '#B91C1C', margin: '0 0 14px 0' }}>
              Choose whether to just update the token status or also send a push notification to subscribers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              
              {/* Choice A: Update website only (Default) */}
              <div
                onClick={() => setPublishChoice('website_only')}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: publishChoice === 'website_only' ? '2px solid #16A34A' : '1px solid #E2E8F0',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: publishChoice === 'website_only' ? '5px solid #16A34A' : '2px solid #CBD5E1',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Update website only
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    Save changes without sending notifications.
                  </span>
                </div>
              </div>

              {/* Choice B: Update website + send notification */}
              <div
                onClick={() => setPublishChoice('website_and_push')}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: publishChoice === 'website_and_push' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: publishChoice === 'website_and_push' ? '5px solid #2563EB' : '2px solid #CBD5E1',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Update website + send notification
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    Send a push notification to all subscribers after confirmation.
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Action Button */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={saving}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '12px',
                border: 'none',
                background: '#15803D',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
                transition: 'opacity 0.15s ease'
              }}
            >
              <Save size={16} />
              <span>
                {saving 
                  ? 'Saving changes...' 
                  : publishChoice === 'website_only' 
                  ? 'Publish Update Only' 
                  : 'Publish Update & Send Notification'}
              </span>
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT COLUMN: Live Notice, Notification Preview & History
            ══════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ── CARD 1: LIVE NOTICE / ALERT (OPTIONAL) ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Megaphone size={18} color="#2563EB" />
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Live Notice / Alert <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>(Optional)</span>
              </h3>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 12px 0' }}>
              This message will be shown on the app.
            </p>

            <textarea
              rows={3}
              maxLength={200}
              value={liveNotice}
              onChange={(e) => setLiveNotice(e.target.value)}
              placeholder="e.g. SSD 10K & DD 2K Tokens Quota completed. Next update at 5:30 PM tomorrow."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                color: '#0F172A',
                lineHeight: 1.45,
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', textAlign: 'right', marginTop: '4px' }}>
              {liveNotice.length}/200
            </span>
          </div>

          {/* ── CARD 2: NOTIFICATION PREVIEW ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#2563EB" />
                <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Notification Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizing(!isCustomizing)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: isCustomizing ? '#EFF6FF' : '#F8FAFC',
                  border: isCustomizing ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                  color: isCustomizing ? '#1D4ED8' : '#475569',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={11} />
                <span>{isCustomizing ? 'Hide Editor' : 'Customize'}</span>
              </button>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 14px 0' }}>
              How it will appear to users
            </p>

            {/* Mobile Notification Card */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              marginBottom: isCustomizing ? '14px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {/* App Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#0F5132',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0
                }}>
                  <TempleIcon color="#FFFFFF" size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      Saarthi Guide
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                      now
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
                    {previewTitle}
                  </span>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                    {previewBody}
                  </span>
                </div>
              </div>
            </div>

            {/* Customizable Notification Inputs Panel */}
            {isCustomizing && (
              <div style={{
                padding: '14px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                      Notification Title
                    </label>
                    {customTitle && (
                      <button
                        type="button"
                        onClick={() => setCustomTitle('')}
                        style={{ fontSize: '10.5px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reset Title
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={defaultAutoTitle}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                      Notification Message Body
                    </label>
                    {customBody && (
                      <button
                        type="button"
                        onClick={() => setCustomBody('')}
                        style={{ fontSize: '10.5px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reset Message
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder={defaultAutoBody}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12.5px',
                      color: '#0F172A',
                      lineHeight: 1.4,
                      resize: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                      Overrides default alert text
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                      {customBody.length}/200
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CARD 3: RECENT NOTIFICATION HISTORY ── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#64748B" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Recent Notification History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {}}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#2563EB',
                  background: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notificationHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid #F1F5F9',
                    background: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.dateTime}</span>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: 700,
                        background: '#DCFCE7',
                        color: '#15803D',
                        border: '1px solid #86EFAC'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#475569', display: 'block' }}>
                      {item.message}
                    </span>
                  </div>
                  <ChevronRight size={16} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

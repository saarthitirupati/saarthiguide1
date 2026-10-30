'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  PauseCircle, 
  XCircle, 
  AlertTriangle, 
  Bell, 
  Users, 
  MessageSquare, 
  Send, 
  FileText, 
  RefreshCw, 
  Eye, 
  Lightbulb, 
  Calendar, 
  X, 
  Check, 
  Pause,
  Edit2
} from 'lucide-react';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';

/**
 * Temple Gopuram Icon matching the screenshot
 */
function TempleIcon({ color = '#EF4444' }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
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

/**
 * Shield with Exclamation Mark
 */
function ShieldAlertIcon() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 1L3 4.8V12C3 18.2 6.8 24 12 25.5C17.2 24 21 18.2 21 12V4.8L12 1Z"
        fill="#FEE2E2"
        stroke="#DC2626"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 7.5V13.5" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1.25" fill="#DC2626" />
    </svg>
  );
}

interface NotificationHistoryItem {
  id: string;
  dateTime: string;
  type: string;
  message: string;
  status: 'Sent' | 'Failed' | 'Pending';
  sentTo: string;
}

export default function AdminSsdTokensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. Global Issuing Status
  const [globalStatus, setGlobalStatus] = useState<'issuing' | 'paused' | 'closed-for-day' | 'suspended'>('closed-for-day');

  // 2. Timings & Notice Fields
  const [nextBatchTime, setNextBatchTime] = useState<string>('5:30 PM');
  const [liveNotice, setLiveNotice] = useState<string>('SSD 10K & DD 2K Tokens Quota completed');
  const [advisoryBadge, setAdvisoryBadge] = useState<string>('Quota Completed');
  const [modeBadge, setModeBadge] = useState<string>('Tokens Not Available');

  // 3. Token Details (SSD & DD)
  const [ssdTotal, setSsdTotal] = useState<string>('10K');
  const [ssdLeft, setSsdLeft] = useState<string>('0');
  const [ssdStatus, setSsdStatus] = useState<'completed' | 'issuing' | 'paused' | 'suspended'>('completed');
  const [ssdStartTime, setSsdStartTime] = useState<string>('');
  const [ssdCompletedTime, setSsdCompletedTime] = useState<string>('3:30 AM');

  const [ddTotal, setDdTotal] = useState<string>('2K');
  const [ddLeft, setDdLeft] = useState<string>('0');
  const [ddStatus, setDdStatus] = useState<'completed' | 'issuing' | 'paused' | 'suspended'>('completed');
  const [ddStartTime, setDdStartTime] = useState<string>('');
  const [ddCompletedTime, setDdCompletedTime] = useState<string>('5:25 AM');

  // 4. Push Notification Controls (Independent & OFF by default)
  const [sendSsdNotification, setSendSsdNotification] = useState<boolean>(false);
  const [sendDdNotification, setSendDdNotification] = useState<boolean>(false);
  const [sendToAllUsers, setSendToAllUsers] = useState<boolean>(true);
  const [scheduleNotification, setScheduleNotification] = useState<boolean>(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');

  // 5. Custom Notification Message & Modal
  const [isEditingNotification, setIsEditingNotification] = useState(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');

  // 6. Notification History
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([
    {
      id: 'init-1',
      dateTime: '30 Oct 2026, 5:30 PM',
      type: 'SSD + DD',
      message: 'Quota completed',
      status: 'Sent',
      sentTo: 'All Users'
    }
  ]);

  // Fetch initial live status
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const data = await safeFetchJson<any>('/api/admin/ssd-tokens');
      if (data) {
        if (data.ssdTokenStatus) setGlobalStatus(data.ssdTokenStatus);
        if (data.ssdNextTokenTime) setNextBatchTime(data.ssdNextTokenTime);
        if (data.ssdNotice !== undefined) setLiveNotice(data.ssdNotice);
        if (data.ssdAdvisoryTag !== undefined) setAdvisoryBadge(data.ssdAdvisoryTag);
        if (data.ssdModeBadge !== undefined) setModeBadge(data.ssdModeBadge);

        // Load SSD token details if available
        if (data.ssdTokenDetails) {
          if (data.ssdTokenDetails.totalTokens) setSsdTotal(data.ssdTokenDetails.totalTokens);
          if (data.ssdTokenDetails.tokensLeft !== undefined) setSsdLeft(data.ssdTokenDetails.tokensLeft);
          if (data.ssdTokenDetails.status) setSsdStatus(data.ssdTokenDetails.status);
          if (data.ssdTokenDetails.startTime) setSsdStartTime(data.ssdTokenDetails.startTime);
          if (data.ssdTokenDetails.completedTime) setSsdCompletedTime(data.ssdTokenDetails.completedTime);
        }
        // Load DD token details if available
        if (data.ddTokenDetails) {
          if (data.ddTokenDetails.totalTokens) setDdTotal(data.ddTokenDetails.totalTokens);
          if (data.ddTokenDetails.tokensLeft !== undefined) setDdLeft(data.ddTokenDetails.tokensLeft);
          if (data.ddTokenDetails.status) setDdStatus(data.ddTokenDetails.status);
          if (data.ddTokenDetails.startTime) setDdStartTime(data.ddTokenDetails.startTime);
          if (data.ddTokenDetails.completedTime) setDdCompletedTime(data.ddTokenDetails.completedTime);
        }

        // Fallback parse ssdTimingsGuide string if details were not loaded
        if (data.ssdTimingsGuide) {
          const guide = data.ssdTimingsGuide;
          const sTot = guide.match(/SSD Quota:\s*([^\s(,]+)/i);
          if (sTot && (!data.ssdTokenDetails || !data.ssdTokenDetails.totalTokens)) setSsdTotal(sTot[1]);

          const sLeft = guide.match(/SSD[^\n]*?Available:\s*([^\s,)]+)/i);
          if (sLeft && (!data.ssdTokenDetails || data.ssdTokenDetails.tokensLeft === undefined)) setSsdLeft(sLeft[1]);

          const sStart = guide.match(/SSD[^\n]*?Started at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i);
          if (sStart && (!data.ssdTokenDetails || !data.ssdTokenDetails.startTime)) setSsdStartTime(sStart[1]);

          const sComp = guide.match(/SSD[^\n]*?Completed at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i);
          if (sComp && (!data.ssdTokenDetails || !data.ssdTokenDetails.completedTime)) setSsdCompletedTime(sComp[1]);

          const sStat = guide.match(/SSD[^\n]*?Status:\s*([a-zA-Z-]+)/i);
          if (sStat && (!data.ssdTokenDetails || !data.ssdTokenDetails.status)) setSsdStatus(sStat[1].toLowerCase() as any);

          const dTot = guide.match(/DD Quota:\s*([^\s(,]+)/i);
          if (dTot && (!data.ddTokenDetails || !data.ddTokenDetails.totalTokens)) setDdTotal(dTot[1]);

          const dLeft = guide.match(/DD[^\n]*?Available:\s*([^\s,)]+)/i);
          if (dLeft && (!data.ddTokenDetails || data.ddTokenDetails.tokensLeft === undefined)) setDdLeft(dLeft[1]);

          const dStart = guide.match(/DD[^\n]*?Started at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i);
          if (dStart && (!data.ddTokenDetails || !data.ddTokenDetails.startTime)) setDdStartTime(dStart[1]);

          const dComp = guide.match(/DD[^\n]*?Completed at\s*([^\s,)]+(?:\s*(?:AM|PM|am|pm))?)/i);
          if (dComp && (!data.ddTokenDetails || !data.ddTokenDetails.completedTime)) setDdCompletedTime(dComp[1]);

          const dStat = guide.match(/DD[^\n]*?Status:\s*([a-zA-Z-]+)/i);
          if (dStat && (!data.ddTokenDetails || !data.ddTokenDetails.status)) setDdStatus(dStat[1].toLowerCase() as any);
        }

        // Derive DD status from darshans
        const dd = data.darshans?.find((d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath'));
        if (dd?.waitTime) {
          if (/issuing|open/i.test(dd.waitTime)) setDdStatus('issuing');
          else if (/paused/i.test(dd.waitTime)) setDdStatus('paused');
          else if (/suspend/i.test(dd.waitTime)) setDdStatus('suspended');
          else setDdStatus('completed');
        }
      }
    } catch (e) {
      console.error('Failed to load SSD/DD admin status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync global status buttons with defaults
  const handleGlobalStatusChange = (status: 'issuing' | 'paused' | 'closed-for-day' | 'suspended') => {
    setGlobalStatus(status);
    if (status === 'closed-for-day') {
      setSsdStatus('completed');
      setDdStatus('completed');
      setSsdLeft('0');
      setDdLeft('0');
      setLiveNotice('SSD 10K & DD 2K Tokens Quota completed');
      setAdvisoryBadge('Quota Completed');
      setModeBadge('Tokens Not Available');
    } else if (status === 'issuing') {
      setSsdStatus('issuing');
      setDdStatus('issuing');
      setLiveNotice('Tokens actively issuing at all counters');
      setAdvisoryBadge('');
      setModeBadge('Open 24/7');
    } else if (status === 'paused') {
      setSsdStatus('paused');
      setDdStatus('paused');
      setLiveNotice('Counters experiencing rush. Next batch releasing soon.');
      setAdvisoryBadge('High Rush');
      setModeBadge('Paused');
    } else if (status === 'suspended') {
      setSsdStatus('suspended');
      setDdStatus('suspended');
      setLiveNotice('SSD and DD tokens suspended for festival rush.');
      setAdvisoryBadge('Brahmotsavam');
      setModeBadge('Walk-in Only');
    }
  };

  // Dynamic notification title & body preview
  const previewNotificationType = sendSsdNotification && sendDdNotification 
    ? 'SSD & DD' 
    : sendSsdNotification 
    ? 'SSD' 
    : sendDdNotification 
    ? 'DD' 
    : 'SSD & DD';

  const previewTitle = customTitle.trim() || (
    globalStatus === 'closed-for-day'
      ? `Today's ${previewNotificationType} Token Quota Completed`
      : globalStatus === 'issuing'
      ? `${previewNotificationType} Tokens Issuing Now`
      : globalStatus === 'paused'
      ? `${previewNotificationType} Token Issuance Paused`
      : `${previewNotificationType} Tokens Suspended`
  );

  const previewBody = customBody.trim() || (
    liveNotice?.trim() || `SSD 10K & DD 2K tokens quota has been completed.`
  );

  // Core Publish Handler
  const handlePublish = async (withNotification: boolean) => {
    setSaving(true);
    setMessage(null);

    try {
      const adminToken = typeof window !== 'undefined' 
        ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026') 
        : 'saarthi_admin_token_2026';

      const payload = {
        ssdTokenStatus: globalStatus,
        ssdNextTokenTime: nextBatchTime,
        ssdNotice: liveNotice,
        ssdTimingsGuide: `SSD Quota: ${ssdTotal} (Available: ${ssdLeft}, Started at ${ssdStartTime || 'N/A'}, Completed at ${ssdCompletedTime || 'N/A'}, Status: ${ssdStatus}), DD Quota: ${ddTotal} (Available: ${ddLeft}, Started at ${ddStartTime || 'N/A'}, Completed at ${ddCompletedTime || 'N/A'}, Status: ${ddStatus})`,
        ssdAdvisoryTag: advisoryBadge,
        ssdModeBadge: modeBadge,
        ssdTokenDetails: {
          totalTokens: ssdTotal,
          tokensLeft: ssdLeft,
          status: ssdStatus,
          startTime: ssdStartTime,
          completedTime: ssdCompletedTime
        },
        ddTokenDetails: {
          totalTokens: ddTotal,
          tokensLeft: ddLeft,
          status: ddStatus,
          startTime: ddStartTime,
          completedTime: ddCompletedTime
        },
        sendSsdPush: withNotification ? sendSsdNotification : false,
        sendDdPush: withNotification ? sendDdNotification : false,
        sendToAll: sendToAllUsers,
        scheduledAt: scheduleNotification ? scheduledDateTime : null,
        customNotification: (customTitle || customBody) ? { title: customTitle, body: customBody } : null
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

        if (withNotification && data.notification) {
          setNotificationHistory(prev => [
            {
              id: `notif-${Date.now()}`,
              dateTime: data.notification.timestamp,
              type: data.notification.type,
              message: data.notification.message,
              status: data.notification.status,
              sentTo: data.notification.sentTo
            },
            ...prev
          ]);

          setMessage({
            text: `Updates published live & ${data.notification.type} Push Notification delivered! (${data.notification.status})`,
            type: 'success'
          });
        } else {
          setMessage({
            text: 'Website SSD & DD token updates published live successfully (No notification sent).',
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
        text: 'Error saving SSD & DD token updates: ' + (err?.message || 'Network error'),
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px 20px 80px 20px', fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif' }}>
      
      {/* ── TOP HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F1F5F9', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TempleIcon color="#0F172A" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              SSD & DD Token Management
            </h1>
          </div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', background: '#DCFCE7', border: '1px solid #86EFAC', padding: '4px 12px', borderRadius: '999px' }}>
          Admin
        </span>
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

      {/* ── 1. GLOBAL ISSUING STATUS CARDS ── */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '10px' }}>
          Global Issuing Status
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          
          {/* Card: Issuing Now */}
          <button
            type="button"
            onClick={() => handleGlobalStatusChange('issuing')}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: globalStatus === 'issuing' ? '2px solid #16A34A' : '1px solid #E2E8F0',
              background: globalStatus === 'issuing' ? '#F0FDF4' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <CheckCircle2 size={24} color="#16A34A" />
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>Issuing Now</span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '1px' }}>Tokens are being issued</span>
            </div>
          </button>

          {/* Card: Paused / Wait */}
          <button
            type="button"
            onClick={() => handleGlobalStatusChange('paused')}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: globalStatus === 'paused' ? '2px solid #D97706' : '1px solid #E2E8F0',
              background: globalStatus === 'paused' ? '#FFFBEB' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <PauseCircle size={24} color="#D97706" />
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>Paused / Wait</span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '1px' }}>Temporarily paused</span>
            </div>
          </button>

          {/* Card: Closed for Today */}
          <button
            type="button"
            onClick={() => handleGlobalStatusChange('closed-for-day')}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: globalStatus === 'closed-for-day' ? '2px solid #DC2626' : '1px solid #E2E8F0',
              background: globalStatus === 'closed-for-day' ? '#FEF2F2' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <XCircle size={24} color="#DC2626" />
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#991B1B', display: 'block' }}>Closed for Today</span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '1px' }}>Quota completed</span>
            </div>
          </button>

          {/* Card: Suspended (Festival) */}
          <button
            type="button"
            onClick={() => handleGlobalStatusChange('suspended')}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: globalStatus === 'suspended' ? '2px solid #DC2626' : '1px solid #E2E8F0',
              background: globalStatus === 'suspended' ? '#FEF2F2' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <AlertTriangle size={24} color="#DC2626" />
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#991B1B', display: 'block' }}>Suspended (Festival)</span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '1px' }}>Temporarily suspended</span>
            </div>
          </button>

        </div>
      </div>

      {/* ── 2. TWO-COLUMN INPUT ROWS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '14px' }}>
        {/* Next Batch Release */}
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Next Batch Release / Mode Time
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={nextBatchTime}
              onChange={(e) => setNextBatchTime(e.target.value)}
              placeholder="e.g. 5:30 PM or Tomorrow 4:00 AM"
              style={{
                width: '100%',
                padding: '10px 38px 10px 14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#0F172A',
                boxSizing: 'border-box'
              }}
            />
            <Clock size={16} color="#64748B" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Live SSD Notice */}
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Live SSD Notice / Alert (Optional)
          </label>
          <input
            type="text"
            maxLength={200}
            value={liveNotice}
            onChange={(e) => setLiveNotice(e.target.value)}
            placeholder="e.g. SSD 10K & DD 2K Tokens Quota completed"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#0F172A',
              boxSizing: 'border-box'
            }}
          />
          <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block', textAlign: 'right', marginTop: '4px' }}>
            {liveNotice.length}/200
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Advisory Badge Tag */}
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Advisory Badge Tag (e.g. Brahmotsavam)
          </label>
          <input
            type="text"
            value={advisoryBadge}
            onChange={(e) => setAdvisoryBadge(e.target.value)}
            placeholder="e.g. Quota Completed or High Rush"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#0F172A',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Mode Status Badge */}
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Mode Status Badge (e.g. Open 24/7)
          </label>
          <input
            type="text"
            value={modeBadge}
            onChange={(e) => setModeBadge(e.target.value)}
            placeholder="e.g. Tokens Not Available or Open 24/7"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#0F172A',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* ── 3. MAIN SPLIT COLUMNS (TOKEN DETAILS & NOTIFICATION CONTROLS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card: Token Details (Optional) */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0' }}>
              Token Details (Optional)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
              
              {/* SSD Tokens Subcard */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <TempleIcon color="#DC2626" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'block' }}>SSD Tokens</span>
                    <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Slotted Sarva Darshan</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Tokens Left (Available)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6534 or 0"
                      value={ssdLeft}
                      onChange={(e) => setSsdLeft(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#16A34A', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Total Quota
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10K"
                      value={ssdTotal}
                      onChange={(e) => setSsdTotal(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={ssdStatus}
                  onChange={(e) => setSsdStatus(e.target.value as any)}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 700, marginBottom: '10px', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="completed">❌ Completed</option>
                  <option value="issuing">✅ Issuing</option>
                  <option value="paused">⏸️ Paused</option>
                  <option value="suspended">⚠️ Suspended</option>
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Started Time
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. 5:00 PM"
                        value={ssdStartTime}
                        onChange={(e) => setSsdStartTime(e.target.value)}
                        style={{ width: '100%', padding: '6px 28px 6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                      />
                      <Clock size={13} color="#64748B" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Completed Time
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. 3:30 AM"
                        value={ssdCompletedTime}
                        onChange={(e) => setSsdCompletedTime(e.target.value)}
                        style={{ width: '100%', padding: '6px 28px 6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                      />
                      <Clock size={13} color="#64748B" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* DD Tokens Subcard */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <TempleIcon color="#DC2626" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'block' }}>DD Tokens</span>
                    <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Srivari Mettu Divya Darshan</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Tokens Left (Available)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1898 or 0"
                      value={ddLeft}
                      onChange={(e) => setDdLeft(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#16A34A', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Total Quota
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2K"
                      value={ddTotal}
                      onChange={(e) => setDdTotal(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={ddStatus}
                  onChange={(e) => setDdStatus(e.target.value as any)}
                  style={{ width: '100%', padding: '7px 8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 700, marginBottom: '10px', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' }}
                >
                  <option value="completed">❌ Completed</option>
                  <option value="issuing">✅ Issuing</option>
                  <option value="paused">⏸️ Paused</option>
                  <option value="suspended">⚠️ Suspended</option>
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Started Time
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. 6:00 AM"
                        value={ddStartTime}
                        onChange={(e) => setDdStartTime(e.target.value)}
                        style={{ width: '100%', padding: '6px 28px 6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                      />
                      <Clock size={13} color="#64748B" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Completed Time
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. 5:25 AM"
                        value={ddCompletedTime}
                        onChange={(e) => setDdCompletedTime(e.target.value)}
                        style={{ width: '100%', padding: '6px 28px 6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                      />
                      <Clock size={13} color="#64748B" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card: User Preview (How it will appear) */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} color="#2563EB" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                  User Preview <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748B' }}>(How it will appear)</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => loadInitialData()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  color: '#166534',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} />
                Refresh Preview
              </button>
            </div>

            {/* Inner Live User Card Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Banner */}
              <div style={{
                background: globalStatus === 'issuing' ? '#F0FDF4' : globalStatus === 'paused' ? '#FFFBEB' : '#FFF1F2',
                border: `1px solid ${globalStatus === 'issuing' ? '#BBF7D0' : globalStatus === 'paused' ? '#FDE68A' : '#FFE4E6'}`,
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlertIcon />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: globalStatus === 'issuing' ? '#14532D' : globalStatus === 'paused' ? '#92400E' : '#991B1B' }}>
                    {globalStatus === 'closed-for-day' ? "Today's SSD & DD Token Quota Completed" : globalStatus === 'issuing' ? "Tokens Being Issued Now" : "Token Issuance Paused"}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: globalStatus === 'issuing' ? '#DCFCE7' : '#FEE2E2', color: globalStatus === 'issuing' ? '#166534' : '#991B1B' }}>
                  {globalStatus === 'closed-for-day' ? 'Closed' : globalStatus === 'issuing' ? 'Issuing' : 'Paused'}
                </span>
              </div>

              {/* 2-Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #FEE2E2', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TempleIcon color="#EF4444" />
                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>SSD Tokens</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{Number(ssdTotal || 10000).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div style={{ margin: '8px 0', padding: '4px 8px', borderRadius: '8px', background: ssdStatus === 'issuing' ? '#DCFCE7' : '#FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: ssdStatus === 'issuing' ? '#16A34A' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {ssdStatus === 'issuing' ? <Check size={9} color="#FFF" /> : <X size={9} color="#FFF" />}
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: ssdStatus === 'issuing' ? '#15803D' : '#991B1B' }}>
                      {ssdStatus === 'issuing' ? 'Issuing' : 'Completed'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>Started:</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{ssdStartTime || 'Not Announced'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>{ssdStatus === 'issuing' ? 'Remaining:' : 'Completed:'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: ssdStatus === 'issuing' ? '#15803D' : '#991B1B' }}>
                        {ssdStatus === 'issuing' ? (ssdLeft ? `${ssdLeft} Left` : 'Actively Issuing') : (ssdCompletedTime || 'Completed')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #FEE2E2', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TempleIcon color="#EF4444" />
                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'block' }}>DD Tokens</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{Number(ddTotal || 2000).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div style={{ margin: '8px 0', padding: '4px 8px', borderRadius: '8px', background: ddStatus === 'issuing' ? '#DCFCE7' : '#FEE2E2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: ddStatus === 'issuing' ? '#16A34A' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {ddStatus === 'issuing' ? <Check size={9} color="#FFF" /> : <X size={9} color="#FFF" />}
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: ddStatus === 'issuing' ? '#15803D' : '#991B1B' }}>
                      {ddStatus === 'issuing' ? 'Issuing' : 'Completed'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>Started:</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>{ddStartTime || 'Not Announced'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>{ddStatus === 'issuing' ? 'Remaining:' : 'Completed:'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: ddStatus === 'issuing' ? '#15803D' : '#991B1B' }}>
                        {ddStatus === 'issuing' ? (ddLeft ? `${ddLeft} Left` : 'Actively Issuing') : (ddCompletedTime || 'Completed')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Release Banner */}
              <div style={{ background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={14} color="#FFF" />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#3B82F6', fontWeight: 600, display: 'block' }}>Next Release</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{nextBatchTime || 'Not Announced Yet'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: PUSH NOTIFICATION CONTROL & MESSAGE PREVIEW ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card: Push Notification Control */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Bell size={18} color="#D97706" />
              <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Push Notification Control
              </h3>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 16px 0' }}>
              Choose which notifications to send with this update.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Toggle 1: Send SSD Notification */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TempleIcon color="#DC2626" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block' }}>Send SSD Notification</span>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Notify users about SSD token update</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sendSsdNotification}
                  onChange={(e) => setSendSsdNotification(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#16A34A', cursor: 'pointer' }}
                />
              </div>

              {/* Toggle 2: Send DD Notification */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TempleIcon color="#DC2626" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block' }}>Send DD Notification</span>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Notify users about DD token update</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sendDdNotification}
                  onChange={(e) => setSendDdNotification(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#16A34A', cursor: 'pointer' }}
                />
              </div>

              {/* Toggle 3: Send to All Users */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#2563EB" />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block' }}>Send to All Users</span>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Send notification to all subscribers</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sendToAllUsers}
                  onChange={(e) => setSendToAllUsers(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#16A34A', cursor: 'pointer' }}
                />
              </div>

              {/* Toggle 4: Schedule Notification */}
              <div style={{ padding: '10px 12px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} color="#64748B" />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block' }}>Schedule Notification (Optional)</span>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Send at a specific time instead of now</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={scheduleNotification}
                    onChange={(e) => setScheduleNotification(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#16A34A', cursor: 'pointer' }}
                  />
                </div>

                {scheduleNotification && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #CBD5E1' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Select date & time (IST)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', color: '#0F172A', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Card: Notification Message Preview */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={16} color="#2563EB" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Notification Message Preview
              </h3>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <TempleIcon color="#DC2626" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1.25 }}>
                    {previewTitle}
                  </span>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '4px', lineHeight: 1.35 }}>
                    {previewBody}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '6px', fontWeight: 500 }}>
                    Next release: {nextBatchTime || 'Not Announced Yet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Message Inline Button */}
            {isEditingNotification ? (
              <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Custom Title</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={previewTitle}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', marginTop: '2px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Custom Body</label>
                  <input
                    type="text"
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder={previewBody}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px', marginTop: '2px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => { setCustomTitle(''); setCustomBody(''); setIsEditingNotification(false); }}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reset to Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingNotification(false)}
                    style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#0F5132', color: '#FFF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingNotification(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={13} />
                Edit Notification Message
              </button>
            )}

          </div>

        </div>

      </div>

      {/* ── 4. RECENT NOTIFICATION HISTORY TABLE ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', marginBottom: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
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
            style={{ fontSize: '11.5px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', border: '1px solid #DBEAFE', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer' }}
          >
            View All
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11.5px', fontWeight: 700 }}>
                <th style={{ padding: '8px 12px' }}>Date & Time</th>
                <th style={{ padding: '8px 12px' }}>Type</th>
                <th style={{ padding: '8px 12px' }}>Message</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px' }}>Sent To</th>
              </tr>
            </thead>
            <tbody>
              {notificationHistory.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#334155' }}>{item.dateTime}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#FEE2E2', color: '#991B1B' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#0F172A', fontWeight: 500 }}>{item.message}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: item.status === 'Sent' ? '#DCFCE7' : '#FEE2E2', color: item.status === 'Sent' ? '#166534' : '#991B1B' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748B', fontWeight: 500 }}>{item.sentTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. BOTTOM ACTION BAR (STICKY/FIXED ACTIONS) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
      }}>
        {/* Left Action: Publish Update Only */}
        <button
          type="button"
          onClick={() => handlePublish(false)}
          disabled={saving}
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            transition: 'background 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
            <FileText size={16} />
            <span>Publish Update Only</span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
            Update website without sending any notification
          </span>
        </button>

        {/* Right Action: Publish & Send Notification */}
        <button
          type="button"
          onClick={() => handlePublish(true)}
          disabled={saving || (!sendSsdNotification && !sendDdNotification)}
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            background: (sendSsdNotification || sendDdNotification) ? 'linear-gradient(135deg, #0F5132 0%, #166534 100%)' : '#94A3B8',
            color: '#FFFFFF',
            cursor: (saving || (!sendSsdNotification && !sendDdNotification)) ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            boxShadow: (sendSsdNotification || sendDdNotification) ? '0 4px 14px rgba(15, 81, 50, 0.25)' : 'none',
            transition: 'opacity 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
            <Send size={16} />
            <span>{saving ? 'Publishing...' : 'Publish & Send Notification'}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
            {(!sendSsdNotification && !sendDdNotification) 
              ? 'Select at least one notification toggle above to send push' 
              : 'Update website and send selected notification(s)'}
          </span>
        </button>
      </div>

    </div>
  );
}

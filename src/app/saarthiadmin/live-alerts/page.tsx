'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, Plus, Trash2, ShieldCheck, 
  Send, Users, Eye, HelpCircle, X, CheckCircle,
  Bell, Wifi, Battery, Settings, Clock, MapPin, AlertTriangle,
  Edit3, Sparkles
} from 'lucide-react';
import styles from './alerts.module.css';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { sendTestNotification } from '@/lib/pushClient';

interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived' | 'Scheduled';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

const ALERT_TEMPLATES = [
  {
    icon: '🌧️',
    label: 'Heavy Rain Advisory',
    title: 'Heavy Rain & Wet Roads Advisory',
    description: 'Moderate to heavy rainfall reported across Tirumala hills. Please maintain safe driving distance and avoid slippery footpath stairs during heavy spells.',
    category: 'Advisory' as const,
    severity: 'Medium' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Maps' as const,
    target_location: 'All Users' as const,
    expiry_hours: 4
  },
  {
    icon: '🚧',
    label: 'Ghat Road Fog / Closure',
    title: 'Dense Fog & Reduced Visibility on Ghat Roads',
    description: 'Thick mist and heavy fog near Mokalla Mitta curves. Drive with fog lights on and adhere strictly to the 28-minute minimum transit time between toll gates.',
    category: 'Emergency' as const,
    severity: 'High' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Maps' as const,
    target_location: 'All Users' as const,
    expiry_hours: 3
  },
  {
    icon: '🎫',
    label: 'SSD Token Quota Rush',
    title: 'SSD Offline Token Counters High Rush',
    description: 'Offline token counters at Vishnu Nivasam and Srinivasam are filling rapidly. Pilgrims arriving late afternoon are advised to plan for tomorrow morning slots.',
    category: 'High Priority' as const,
    severity: 'High' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Queue' as const,
    target_location: 'Tirupati' as const,
    expiry_hours: 2
  },
  {
    icon: '⏳',
    label: 'Sarva Darshan 24h+ Queue',
    title: 'High Crowd Alert: Sarva Darshan Queue Exceeds 24 Hours',
    description: 'Vaikuntam Queue Complexes are at peak capacity with 24-28 hours waiting time. Senior citizens and children are advised to utilize resting sheds and Annaprasadam halls.',
    category: 'Advisory' as const,
    severity: 'Medium' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Queue' as const,
    target_location: 'All Users' as const,
    expiry_hours: 8
  },
  {
    icon: '⚠️',
    label: 'VIP Protocol Darshan Pause',
    title: 'Temporary VIP Break Darshan Protocol in Effect',
    description: 'General queue movement progressing at adjusted pace during designated ceremonial sevas. Regular rapid throughput resumes promptly.',
    category: 'High Priority' as const,
    severity: 'Medium' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Queue' as const,
    target_location: 'Tirumala' as const,
    expiry_hours: 2
  },
  {
    icon: '🍛',
    label: 'Annaprasadam Special Timings',
    title: 'Free Annaprasadam & Refreshments Active Along Ring Road',
    description: 'Tarigonda Vengamamba complex and mobile food distribution points serving hot meals, baby milk, and pure drinking water continuously along queue lines.',
    category: 'Information' as const,
    severity: 'Low' as const,
    popup_type: 'Popup' as const,
    cta: 'Open Essentials' as const,
    target_location: 'Tirumala' as const,
    expiry_hours: 12
  }
];

import { useLiveRefresh } from '@/hooks/useLiveRefresh';

import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [pushStatus, setPushStatus] = useState<string>('');
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  // Realtime updates
  const { isConnected } = useLiveRefresh('alerts');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'Emergency' | 'High Priority' | 'Advisory' | 'Information'>('Advisory');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [popupType, setPopupType] = useState<'Popup' | 'Fullscreen' | 'Banner'>('Popup');
  const [cta, setCta] = useState<'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None'>('None');
  const [targetLocation, setTargetLocation] = useState<'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby'>('All Users');
  const [expiryHours, setExpiryHours] = useState<number>(24); // Default 24 hours (1 day)
  const [sendPushNotification, setSendPushNotification] = useState<boolean>(true);
  const [publishTiming, setPublishTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');

  const getAdminHeaders = () => {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026')
      : 'saarthi_admin_token_2026';
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await safeFetchJson<LiveAlert[]>('/api/v1/alerts?all=true&t=' + Date.now(), {
        headers: getAdminHeaders()
      });
      if (data && Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching admin alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await safeFetchJson<{ count: number }>('/api/push/subscribe', {
        headers: getAdminHeaders()
      });
      if (res && typeof res.count === 'number') {
        setSubscriberCount(res.count);
      }
    } catch {}
  };

  useEffect(() => {
    fetchAlerts();
    fetchSubscribers();
  }, [isConnected]); // Refetch if connection establishes/drops as a safety measure

  const handleTestPush = async () => {
    setPushStatus('Sending test notification...');
    const ok = await sendTestNotification();
    if (ok) {
      setPushStatus('Test notification sent to this device.');
    } else {
      setPushStatus('Failed or permission not granted on this device.');
    }
    setTimeout(() => setPushStatus(''), 4000);
  };

  const handleBroadcastPush = async (alertItem: LiveAlert) => {
    if (alertItem.status === 'Draft') {
      alert('Cannot broadcast push notification for a Draft alert. Please publish it first.');
      return;
    }
    if (!confirm(`Broadcast push notification for "${alertItem.title}" to all subscribers?`)) return;
    setBroadcastingId(alertItem.id);
    try {
      const res = await safeFetchJson<{ ok?: boolean; sent?: number; error?: string }>('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({
          type: 'custom',
          alert_id: alertItem.id,
          title: alertItem.title,
          body: alertItem.description,
          url: '/alerts',
          tag: `alert-${alertItem.id}`,
          target_location: alertItem.target_location || 'All Users',
          category: alertItem.category
        })
      });
      if (res && res.error) {
        alert('Push broadcast failed: ' + res.error);
      } else {
        alert(`Broadcast sent successfully${res && typeof res.sent === 'number' ? ` to ${res.sent} subscribers` : ''}!`);
      }
    } catch (err) {
      alert('Error broadcasting push notification');
    } finally {
      setBroadcastingId(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory('Advisory');
    setSeverity('Medium');
    setPopupType('Popup');
    setCta('None');
    setTargetLocation('All Users');
    setExpiryHours(24);
    setPublishTiming('immediate');
    setScheduledDateTime('');
    setEditingAlertId(null);
    setShowCreateForm(false);
  };

  const handleStartEdit = (alertItem: LiveAlert) => {
    setEditingAlertId(alertItem.id);
    setTitle(alertItem.title || '');
    setDescription(alertItem.description || '');
    setImageUrl(alertItem.image || '');
    setCategory(alertItem.category || 'Advisory');
    setSeverity(alertItem.severity || 'Medium');
    setPopupType(alertItem.popup_type === 'Fullscreen' ? 'Fullscreen' : 'Popup');
    setCta(alertItem.cta || 'None');
    setTargetLocation(alertItem.target_location || 'All Users');

    if (alertItem.start_time && new Date(alertItem.start_time).getTime() > Date.now()) {
      setPublishTiming('scheduled');
      try {
        const d = new Date(alertItem.start_time);
        const pad = (n: number) => n.toString().padStart(2, '0');
        setScheduledDateTime(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
      } catch {
        setScheduledDateTime('');
      }
    } else {
      setPublishTiming('immediate');
      setScheduledDateTime('');
    }

    if (alertItem.expiry_time) {
      const baseMs = alertItem.start_time ? new Date(alertItem.start_time).getTime() : Date.now();
      const remainingMs = new Date(alertItem.expiry_time).getTime() - baseMs;
      const remainingHours = Math.max(0.5, Math.round((remainingMs / (1000 * 60 * 60)) * 2) / 2);
      setExpiryHours(remainingHours);
    } else {
      setExpiryHours(24);
    }

    setShowCreateForm(true);
    setMobileTab('form');
  };

  const handleApplyTemplate = (tmpl: typeof ALERT_TEMPLATES[number]) => {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setCategory(tmpl.category);
    setSeverity(tmpl.severity);
    setPopupType(tmpl.popup_type);
    setCta(tmpl.cta);
    setTargetLocation(tmpl.target_location);
    setExpiryHours(tmpl.expiry_hours);
    setPublishTiming('immediate');
    setScheduledDateTime('');
  };

  const handleCreateAlert = async (e: React.FormEvent, isDraft = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    if (publishTiming === 'scheduled' && !isDraft) {
      if (!scheduledDateTime) {
        alert('Please pick a scheduled start date and time.');
        return;
      }
      if (new Date(scheduledDateTime).getTime() <= Date.now()) {
        alert('Scheduled date and time must be in the future.');
        return;
      }
    }

    const now = new Date();
    const startTime = (publishTiming === 'scheduled' && scheduledDateTime)
      ? new Date(scheduledDateTime).toISOString()
      : now.toISOString();

    const startMs = new Date(startTime).getTime();
    const expiryTime = new Date(startMs + expiryHours * 60 * 60 * 1000).toISOString();
    const isFuture = startMs > (now.getTime() + 60000);
    const alertStatus: LiveAlert['status'] = isDraft 
      ? 'Draft' 
      : (isFuture ? 'Scheduled' : 'Published');

    const isEditing = Boolean(editingAlertId);
    const method = isEditing ? 'PUT' : 'POST';

    const body = {
      ...(isEditing ? { id: editingAlertId } : {}),
      title,
      description,
      image: imageUrl.trim(),
      category,
      severity,
      popup_type: popupType,
      cta,
      status: alertStatus,
      target_location: targetLocation,
      start_time: startTime,
      expiry_time: expiryTime,
      sendPush: sendPushNotification && alertStatus === 'Published'
    };

    try {
      const resultAlert = await safeFetchJson<LiveAlert>('/api/v1/alerts', {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify(body)
      });

      if (resultAlert && resultAlert.id) {
        notifyRealtimeUpdate();
        // Optimistic UI update
        if (isEditing) {
          setAlerts(prev => prev.map(a => a.id === editingAlertId ? resultAlert : a));
        } else {
          setAlerts(prev => [resultAlert, ...prev.filter(a => a.id !== resultAlert.id)]);
        }

        if (isDraft) {
          // Capture ID so subsequent saves update this exact record instead of creating duplicates
          setEditingAlertId(resultAlert.id);
          alert('Draft saved! You can continue editing or publish when ready.');
        } else {
          resetForm();
        }
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'publish'} alert.`);
      }
    } catch (err) {
      console.error('Error saving alert:', err);
      alert('Failed to save alert. Please check your admin permissions.');
    }
  };

  const handlePublishDraft = async (alertItem: LiveAlert) => {
    if (!confirm(`Publish draft "${alertItem.title}" to the public feed?\n\nNote: This makes the alert live on the public feed without sending a push notification.`)) {
      return;
    }
    setPublishingId(alertItem.id);
    try {
      const now = new Date().toISOString();
      const res = await safeFetchJson<LiveAlert>('/api/v1/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({
          id: alertItem.id,
          status: 'Published',
          start_time: now,
          sendPush: false
        })
      });

      if (res && res.id) {
        notifyRealtimeUpdate();
        setAlerts(prev => prev.map(a => a.id === alertItem.id ? res : a));
      } else {
        alert('Failed to publish draft.');
        fetchAlerts();
      }
    } catch (err) {
      console.error('Error publishing draft:', err);
      alert('Failed to publish draft.');
      fetchAlerts();
    } finally {
      setPublishingId(null);
    }
  };

  const handleExpireAlert = async (alertItem: LiveAlert) => {
    if (!confirm(`Are you sure you want to expire "${alertItem.title}" immediately?`)) return;

    try {
      const res = await safeFetchJson<LiveAlert>('/api/v1/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({
          id: alertItem.id,
          status: 'Expired',
          expiry_time: new Date().toISOString(),
          sendPush: false
        })
      });

      if (res && res.id) {
        notifyRealtimeUpdate();
        setAlerts(prev => prev.map(a => a.id === alertItem.id ? res : a));
      } else {
        alert('Failed to expire alert.');
        fetchAlerts();
      }
    } catch (err) {
      console.error('Error expiring alert:', err);
      alert('Failed to expire alert.');
      fetchAlerts();
    }
  };

  const handleDeleteAlert = async (id: string, title?: string) => {
    if (!confirm(`Permanently delete "${title || 'this alert'}"? This cannot be undone.`)) return;

    // Optimistic UI update
    setAlerts(prev => prev.filter(a => a.id !== id));

    try {
      const res = await safeFetchJson<{ success?: boolean }>(`/api/v1/alerts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res && res.success) {
        notifyRealtimeUpdate();
      } else {
        alert('Failed to delete alert.');
        fetchAlerts();
      }
    } catch (err) {
      console.error('Error deleting alert:', err);
      alert('Failed to delete alert.');
      fetchAlerts();
    }
  };

  // Helper to color tags based on category
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Emergency': return styles.tagRed;
      case 'High Priority': return styles.tagOrange;
      case 'Advisory': return styles.tagYellow;
      case 'Information': return styles.tagGreen;
      default: return styles.tagYellow;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 className={styles.title}>Live Alerts Module</h1>
            <span className={styles.subscribersBadge}>
              <Users size={13} /> {subscriberCount} Push Subscribers
            </span>
          </div>
          <p className={styles.subtitle}>Admin Controlled Emergency &amp; Important Pilgrim Notifications</p>
          {pushStatus && (
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#0F5132', fontWeight: 600 }}>
              {pushStatus}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={styles.testPushBtn}
            onClick={handleTestPush}
            title="Trigger a test push notification on this browser"
          >
            <Bell size={14} /> Test Push on Device
          </button>
          <button 
            className={styles.createBtn} 
            onClick={() => {
              if (showCreateForm) {
                resetForm();
              } else {
                setShowCreateForm(true);
              }
            }}
          >
            {showCreateForm ? <X size={16} /> : <Plus size={16} />}
            {showCreateForm ? (editingAlertId ? 'Cancel Edit' : 'Close Form') : 'Create Alert'}
          </button>
        </div>
      </header>

      {/* Mobile Switcher Tabs */}
      <div className={styles.mobileTabs}>
        <button
          type="button"
          className={`${styles.mobileTab} ${mobileTab === 'form' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('form')}
        >
          {showCreateForm ? (editingAlertId ? 'Edit Alert' : 'Create Alert') : 'Active Alerts'}
        </button>
        <button
          type="button"
          className={`${styles.mobileTab} ${mobileTab === 'preview' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          Live Phone Preview
        </button>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Form or Active Alerts List */}
        <div className={`${styles.leftColumn} ${mobileTab === 'preview' ? styles.leftColumnHiddenMobile : ''}`}>
          {showCreateForm ? (
            <div className={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1E293B' }}>
                  {editingAlertId ? 'Edit Live Alert' : 'Create New Live Alert'}
                </h2>
                {editingAlertId && (
                  <span style={{ fontSize: '11px', background: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                    In-Place Update
                  </span>
                )}
              </div>

              {/* Editing State Notice */}
              {editingAlertId && (
                <div className={styles.editingBanner}>
                  <span className={styles.editingTitle}>
                    <Edit3 size={14} /> Editing Alert: <strong>{title || editingAlertId}</strong>
                  </span>
                  <button type="button" className={styles.cancelEditBtn} onClick={resetForm}>
                    Cancel Edit
                  </button>
                </div>
              )}

              {/* 1-Click Operational Templates */}
              <div className={styles.templatesContainer}>
                <div className={styles.templatesHeader}>
                  <span className={styles.templatesTitle}>
                    <Sparkles size={13} /> 1-Click Operational Templates
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 600 }}>Click to pre-fill</span>
                </div>
                <div className={styles.templatesGrid}>
                  {ALERT_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.templateChip}
                      onClick={() => handleApplyTemplate(tmpl)}
                      title={tmpl.description}
                    >
                      <span>{tmpl.icon}</span> {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <form onSubmit={(e) => handleCreateAlert(e, false)}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Title</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="e.g. Heavy Rain in Tirumala" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Description</label>
                  <textarea 
                    className={styles.textarea} 
                    placeholder="e.g. Heavy rainfall reported around Papavinasam. Carry umbrellas and avoid hill walking routes." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Image (Optional Image URL)</label>
                  <input 
                    type="url" 
                    className={styles.input} 
                    placeholder="e.g. /images/places/example.jpg or https://..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={imageUrl} 
                        alt="Alert Preview" 
                        style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700 }}>✓ Image attached</span>
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')} 
                        style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11.5px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Alert Category</label>
                    <select 
                      className={styles.select} 
                      value={category} 
                      onChange={(e: any) => {
                        const val = e.target.value;
                        setCategory(val);
                        if (val === 'Emergency' || val === 'High Priority') {
                          setSendPushNotification(true);
                        }
                      }}
                    >
                      <option value="Emergency">Emergency</option>
                      <option value="High Priority">High Priority</option>
                      <option value="Advisory">Advisory</option>
                      <option value="Information">Information</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Popup Style</label>
                    <select 
                      className={styles.select} 
                      value={popupType} 
                      onChange={(e: any) => setPopupType(e.target.value)}
                    >
                      <option value="Popup">Centered Popup Dialog (Priority Notice)</option>
                      <option value="Fullscreen">Fullscreen Overlay (Critical Emergency)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Alert Severity</label>
                    <div className={styles.sliderContainer}>
                      <input 
                        type="range" 
                        min="0" 
                        max="3" 
                        step="1"
                        className={styles.slider} 
                        value={
                          severity === 'Low' ? 0 : 
                          severity === 'Medium' ? 1 : 
                          severity === 'High' ? 2 : 3
                        }
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setSeverity(
                            val === 0 ? 'Low' : 
                            val === 1 ? 'Medium' : 
                            val === 2 ? 'High' : 'Critical'
                          );
                        }}
                      />
                      <div className={styles.sliderLabels}>
                        <span style={{ color: severity === 'Low' ? '#E9801D' : '#64748B' }}>Low</span>
                        <span style={{ color: severity === 'Medium' ? '#E9801D' : '#64748B' }}>Medium</span>
                        <span style={{ color: severity === 'High' ? '#E9801D' : '#64748B' }}>High</span>
                        <span style={{ color: severity === 'Critical' ? '#E9801D' : '#64748B' }}>Critical</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>CTA Target</label>
                    <select 
                      className={styles.select} 
                      value={cta} 
                      onChange={(e: any) => setCta(e.target.value)}
                    >
                      <option value="None">None</option>
                      <option value="Open Queue">Open Queue Status</option>
                      <option value="Open Essentials">Open Pilgrim Essentials</option>
                      <option value="Open Maps">Open Map Navigation</option>
                      <option value="Open Parking">Open Parking Info</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Target Location (Audience)</label>
                  <select 
                    className={styles.select} 
                    value={targetLocation} 
                    onChange={(e: any) => setTargetLocation(e.target.value)}
                  >
                    <option value="All Users">All Connected Pilgrims</option>
                    <option value="Tirumala">Only Users in Tirumala</option>
                    <option value="Tirupati">Only Users in Tirupati</option>
                    <option value="Alipiri">Only Users at Alipiri Footpath</option>
                    <option value="Nearby">Within 5 km radius</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Publish Timing</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPublishTiming('immediate')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: publishTiming === 'immediate' ? '2px solid #E9801D' : '1px solid #CBD5E1',
                        background: publishTiming === 'immediate' ? '#FFFBEB' : '#FFFFFF',
                        color: publishTiming === 'immediate' ? '#92400E' : '#475569',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Send size={14} /> Publish Immediately
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPublishTiming('scheduled');
                        if (!scheduledDateTime) {
                          const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
                          const pad = (n: number) => n.toString().padStart(2, '0');
                          setScheduledDateTime(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
                        }
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: publishTiming === 'scheduled' ? '2px solid #E9801D' : '1px solid #CBD5E1',
                        background: publishTiming === 'scheduled' ? '#FFFBEB' : '#FFFFFF',
                        color: publishTiming === 'scheduled' ? '#92400E' : '#475569',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Clock size={14} /> Schedule for Later
                    </button>
                  </div>

                  {publishTiming === 'scheduled' && (
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                        Scheduled Start Date &amp; Time (Asia/Kolkata IST)
                      </label>
                      <input
                        type="datetime-local"
                        className={styles.input}
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        required={publishTiming === 'scheduled'}
                      />
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '6px' }}>
                        🕒 Alert will automatically activate at this scheduled time and remain hidden from pilgrims until then.
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Active Duration (After Activation)</label>
                  <div className={styles.expiryGroup}>
                    {[
                      { hours: 0.5, label: '30 Mins' },
                      { hours: 1, label: '1 Hour' },
                      { hours: 2, label: '2 Hours' },
                      { hours: 8, label: '8 Hours' },
                      { hours: 24, label: '24 Hours' },
                      { hours: 48, label: '2 Days' },
                      { hours: 168, label: '7 Days' }
                    ].map((exp) => (
                      <div 
                        key={exp.hours} 
                        className={`${styles.expiryBadge} ${expiryHours === exp.hours ? styles.expiryBadgeActive : ''}`}
                        onClick={() => setExpiryHours(exp.hours)}
                      >
                        {exp.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxContainer}>
                    <input 
                      type="checkbox" 
                      checked={sendPushNotification} 
                      onChange={(e) => setSendPushNotification(e.target.checked)} 
                    />
                    <span className={styles.checkboxLabel}>
                      Dispatch Web Push Notification to active subscribers on publish
                    </span>
                  </label>
                </div>

                <div className={styles.formActions}>
                  {editingAlertId && (
                    <button 
                      type="button" 
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => handleCreateAlert(null as any, true)}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {editingAlertId ? 'Update Alert' : (publishTiming === 'scheduled' ? 'Schedule Alert' : 'Publish Alert')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#1E293B' }}>
                Active &amp; Live Alerts
              </h2>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading alerts...</div>
              ) : alerts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  No active live alerts currently running.
                </div>
              ) : (
                <div className={styles.alertList}>
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`${styles.alertItem} ${alert.status === 'Draft' ? styles.alertItemDraft : (alert.status === 'Expired' ? styles.alertItemExpired : '')}`} 
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                    >
                      {alert.image && (
                        <img 
                          src={alert.image} 
                          alt={alert.title} 
                          style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1', flexShrink: 0, marginTop: '2px' }} 
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      )}
                      <div className={styles.alertInfo} style={{ flex: 1 }}>
                        <div className={styles.alertHeader}>
                          <span className={`${styles.tag} ${getCategoryClass(alert.category)}`}>
                            {alert.category}
                          </span>
                          <span className={styles.statusBadge}>
                            {alert.severity}
                          </span>
                          <span className={`${styles.statusBadge} ${alert.status === 'Published' ? styles.statusActive : (alert.status === 'Scheduled' ? styles.statusScheduled : (alert.status === 'Expired' ? styles.statusExpired : styles.statusDraft))}`}>
                            {alert.status === 'Scheduled' ? '🕒 Scheduled' : (alert.status === 'Draft' ? '📝 Draft (Unpublished)' : (alert.status === 'Expired' ? '⏹️ Expired' : alert.status))}
                          </span>
                          <h3 className={styles.alertTitleText}>{alert.title}</h3>
                        </div>
                        <p className={styles.alertDescText}>{alert.description}</p>
                        
                        <div className={styles.alertMetaRow}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="#64748B" /> {alert.target_location}
                          </span>
                          {alert.status === 'Scheduled' && alert.start_time ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B45309', fontWeight: 700 }}>
                              <Clock size={12} color="#B45309" /> Starts: {new Date(alert.start_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} color="#64748B" /> Expires: {new Date(alert.expiry_time).toLocaleTimeString()}
                            </span>
                          )}
                          <span>Style: {alert.popup_type === 'Fullscreen' ? 'Fullscreen Emergency' : 'Centered Popup'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                        {alert.status === 'Draft' ? (
                          <>
                            <button 
                              className={styles.editBtn}
                              onClick={() => handleStartEdit(alert)}
                              title="Edit draft in form"
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                            <button 
                              className={styles.publishNowBtn}
                              disabled={publishingId === alert.id}
                              onClick={() => handlePublishDraft(alert)}
                              title="Publish this draft to public feed (no push notification)"
                            >
                              <Send size={11} /> {publishingId === alert.id ? 'Publishing...' : 'Publish Now'}
                            </button>
                            <button 
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteAlert(alert.id, alert.title)}
                              title="Permanently delete this draft"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </>
                        ) : alert.status === 'Expired' ? (
                          <>
                            <button 
                              className={styles.editBtn}
                              onClick={() => handleStartEdit(alert)}
                              title="Re-activate or edit alert"
                            >
                              <Edit3 size={11} /> Edit / Re-activate
                            </button>
                            <button 
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteAlert(alert.id, alert.title)}
                              title="Permanently delete this alert"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className={styles.editBtn}
                              onClick={() => handleStartEdit(alert)}
                              title="Edit this alert in-place"
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                            <button 
                              className={styles.broadcastBtn}
                              disabled={broadcastingId === alert.id}
                              onClick={() => handleBroadcastPush(alert)}
                              title="Broadcast push notification for this alert now"
                            >
                              <Bell size={11} /> {broadcastingId === alert.id ? 'Sending...' : 'Broadcast Push'}
                            </button>
                            <button 
                              className={styles.expireBtn}
                              onClick={() => handleExpireAlert(alert)}
                              title="Expire this alert immediately"
                            >
                              Expire
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Mockup Preview */}
        <div className={`${styles.rightColumn} ${mobileTab === 'form' ? styles.rightColumnHiddenMobile : ''}`}>
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px 0', color: '#1E293B' }}>
              Client Live Preview
            </h2>
            
            {/* iPhone Mockup Frame */}
            <div style={{ 
              width: '280px', 
              height: '500px', 
              background: '#FFF8EB', 
              border: '8px solid #1E293B', 
              borderRadius: '30px', 
              margin: '0 auto', 
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {/* iPhone Status Bar */}
              <div style={{ height: '24px', background: '#0F172A', display: 'flex', justifyContent: 'space-between', padding: '0 16px', alignItems: 'center', color: '#fff', fontSize: '10px' }}>
                <span>9:41</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Wifi size={11} />
                  <Battery size={12} />
                </span>
              </div>

              {/* Mockup Home Header */}
              <div style={{ padding: '12px 16px 4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Namaste, Pilgrim</span>
                <Settings size={12} color="#64748B" />
              </div>

              {/* Dynamic Preview Elements based on form values */}
              {title && description ? (
                <div style={{ padding: '8px 12px' }}>
                  {/* Next Best Action Placeholder */}
                  <div style={{ background: '#052e16', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '10px', textAlign: 'left', opacity: popupType === 'Fullscreen' ? 0.15 : 0.35, marginTop: '0' }}>
                    <strong>NEXT ACTION</strong>
                    <p style={{ margin: '2px 0 0 0' }}>Queue is 2 hours. Proceed now.</p>
                  </div>

                  {/* Centered Popup Style Preview */}
                  {popupType === 'Popup' && (
                    <div style={{
                      position: 'absolute',
                      top: '100px',
                      left: '16px',
                      right: '16px',
                      background: '#FFFFFF',
                      border: '2px solid #F59E0B',
                      borderRadius: '16px',
                      padding: '16px',
                      zIndex: 100,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <AlertCircle size={13} color="#D97706" />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                          Live Advisory Alert
                        </span>
                      </div>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{title}</h4>
                      <p style={{ fontSize: '10.5px', color: '#4B5563', margin: '0 0 8px 0', lineHeight: 1.4 }}>{description}</p>
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Alert preview" 
                          style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} 
                        />
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {cta !== 'None' && (
                          <button style={{ flex: 1, background: '#E9801D', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 700 }}>
                            {cta}
                          </button>
                        )}
                        <button style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 700 }}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fullscreen Overlay Style Preview */}
                  {popupType === 'Fullscreen' && (
                    <div style={{
                      position: 'absolute',
                      inset: '24px 0 0 0',
                      background: '#0F172A',
                      zIndex: 200,
                      color: '#FFFFFF',
                      padding: '24px 16px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '10px' }}>
                        <AlertTriangle size={20} color="#EF4444" />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#EF4444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        CRITICAL EMERGENCY ALERT
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>{title}</h3>
                      <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: 1.4 }}>{description}</p>
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Alert preview" 
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }} 
                        />
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        {cta !== 'None' && (
                          <button style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 800 }}>
                            {cta}
                          </button>
                        )}
                        <button style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 700 }}>
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%', color: '#94A3B8', padding: '20px' }}>
                  <AlertCircle size={32} style={{ marginBottom: '12px', color: '#CBD5E1' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Fill out the form on the left to see a live mockup preview.</span>
                </div>
              )}

              {/* iPhone Home Indicator */}
              <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '3px', backgroundColor: '#000', borderRadius: '2px' }} />
            </div>

            <div className={styles.previewBox}>
              <div className={styles.previewTitle}>Distribution Parameters</div>
              <p style={{ fontSize: '11px', margin: 0, color: '#475569', lineHeight: 1.4 }}>
                • <strong>Audience:</strong> {targetLocation}
                <br />
                • <strong>Interval:</strong> Published now, expires in {expiryHours} hours.
                <br />
                • <strong>Priority:</strong> severity level {severity}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

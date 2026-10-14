import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | Saarthi Independent Pilgrimage Guide',
  description: 'Saarthi is an independent pilgrim guide application founded by Sunil Thatra. Not affiliated with Tirumala Tirupati Devasthanams.',
};

export default function DisclaimerPage() {
  return (
    <div style={{ background: '#FAF8F5', minHeight: '100dvh', padding: '24px 16px 80px' }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 35, 45, 0.08)',
        padding: '24px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <h1 style={{ fontWeight: 700, fontSize: '22px', color: '#0F172A', margin: '0 0 14px' }}>Disclaimer</h1>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', margin: 0 }}>
          <strong>Saarthi</strong> is an independent pilgrim guide application founded by <strong>Sunil Thatra</strong>. 
          Saarthi is not affiliated with, endorsed by, or connected to Tirumala Tirupati Devasthanams or any government body. 
          All information is provided for general guidance based on community reports and original research. 
          Darshan wait times are crowdsourced and not official. Please verify critical information locally.
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Building2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HotelLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const cleanId = email.trim().toLowerCase();
      // 1. Direct Partner Check for Vamana Inn
      if (cleanId === 'vamana' || cleanId === 'vamana@saarthi.app' || cleanId.includes('vamana') || password === 'vamana123') {
        sessionStorage.setItem('hotel_authenticated', 'vamana-inn-tirupati');
        router.push('/hotel/dashboard');
        return;
      }

      // 2. Try Supabase Auth for registered users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data?.user) {
        router.push('/hotel/dashboard');
        return;
      }

      setErrorMsg(error?.message || 'Invalid Hotel ID or password.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#0F172A'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px 24px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(15, 81, 50, 0.1)',
            color: '#0F5132',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Building2 size={28} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: '#0F172A' }}>
            Hotel Partner Portal
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
            Manage room bookings for Hotel Vamana Inn
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            marginBottom: '14px'
          }}>
            {errorMsg}
          </div>
        )}

        {/* 🔑 QUICK LOGIN CREDENTIALS HELPER */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '11.5px',
          color: '#166534',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>Vamana Inn Demo Login:</div>
            <div>ID: <code style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '1px 4px', borderRadius: '4px' }}>vamana</code> | Pass: <code style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '1px 4px', borderRadius: '4px' }}>vamana123</code></div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('vamana');
              setPassword('vamana123');
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: '#0F5132',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Hotel Partner ID / Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="vamana or vamana@saarthi.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="vamana123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#0F5132',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              marginTop: '6px',
              boxShadow: '0 2px 10px rgba(15, 81, 50, 0.25)'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <Link href="/tirupati-hotels" style={{ fontSize: '12px', color: '#0F5132', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Stays
          </Link>
        </div>
      </div>
    </div>
  );
}

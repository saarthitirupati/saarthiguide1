import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TTD Divya Darshan (DD) Tokens Live Status & Footpath Counters | Saarthi',
  description: 'Live availability, counter opening timings, daily quota (2K/day), and biometric issuance rules for TTD Divya Darshan (DD) footpath tokens at Srivari Mettu and Alipiri Mettu.',
  keywords: [
    'Divya Darshan tokens',
    'DD tokens Tirumala',
    'TTD footpath tokens',
    'Srivari Mettu token counter',
    'Alipiri Mettu token counter',
    'Divya Darshan live status'
  ],
  openGraph: {
    title: 'TTD Divya Darshan (DD) Tokens Live Status | Saarthi',
    description: 'Check live status of 2K daily Divya Darshan footpath tokens, counter locations, issuing timestamps, and biometric rules.',
    url: 'https://www.saarthiguide.in/dd-tokens',
    type: 'website'
  }
};

export default function DdTokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirumala Tirupati Pilgrim Guide - 82 Sacred Places & Offline Maps',
  description: 'Complete offline guide to Tirumala and Tirupati by Sunil Thatra. Timings, entry rules, and history for Sri Venkateswara Temple and 82 holy tirthams.',
  keywords: [
    'tirupati guide', 'tirumala guide', 'tirupati travel guide',
    'offline map tirumala', 'alipiri footpath guide', 'sarva darshan waiting time',
    'srivari mettu vs alipiri', 'best place to stay near tirupati temple'
  ],
  alternates: {
    canonical: `${baseUrl}/guide`,
  },
  openGraph: {
    title: 'Tirumala Tirupati Pilgrim Guide - 82 Sacred Places & Offline Maps',
    description: 'Complete offline guide to Tirumala and Tirupati by Sunil Thatra. Timings, entry rules, and history for Sri Venkateswara Temple and 82 holy tirthams.',
    url: `${baseUrl}/guide`,
    siteName: 'Saarthi Guide',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

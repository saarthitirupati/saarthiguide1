import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirupati Cab Booking - Tirumala, Airport & Local Taxi',
  description: 'Book verified cabs from Tirupati to Tirumala ghat road, Renigunta Airport, Kanipakam, and Kalahasti. Transparent fixed rates, zero middleman commission.',
  keywords: [
    'tirupati cab', 'tirupati car rental', 'tirupati to tirumala cab',
    'tirupati airport cab', 'tirupati taxi service', 'alipiri cab',
    'ghat road cab', 'tirumala taxi fare', 'tirupati to tirumala car fare',
    'tempo traveller tirupati', 'innova cab tirupati'
  ],
  alternates: {
    canonical: `${baseUrl}/cab-booking`,
  },
  openGraph: {
    title: 'Tirupati Cab Booking - Tirumala, Airport & Local Taxi',
    description: 'Book verified cabs from Tirupati to Tirumala ghat road, Renigunta Airport, Kanipakam, and Kalahasti with zero middleman commission.',
    url: `${baseUrl}/cab-booking`,
    siteName: 'Saarthi Guide',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CabBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

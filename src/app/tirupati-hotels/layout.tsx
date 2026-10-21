import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirupati Rooms & Mutt Stays | Verified Near Station & TTD',
  description: 'Find clean, budget pilgrim rooms in Tirupati near Railway Station, Bus Stand, and Alipiri. Verified phone numbers for mutt stays, lodges, and dharamshalas with zero commission.',
  keywords: [
    'tirupati rooms', 'rooms in tirupati', 'rooms near tirupati station',
    'tirupati stay', 'pilgrim stays tirupati', 'mutt rooms tirupati',
    'budget rooms tirupati', 'srinivasam complex rooms', 'alipiri rooms',
    'dharamshala tirupati', 'rooms near bus stand tirupati', 'ttd room booking help'
  ],
  alternates: {
    canonical: `${baseUrl}/tirupati-hotels`,
  },
  openGraph: {
    title: 'Tirupati Rooms & Mutt Stays | Verified Near Station & TTD',
    description: 'Find clean, budget pilgrim rooms in Tirupati near Railway Station, Bus Stand, and Alipiri with direct verified contacts.',
    url: `${baseUrl}/tirupati-hotels`,
    siteName: 'Saarthi Guide',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TirupatiHotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

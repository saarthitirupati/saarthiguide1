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
    canonical: `${baseUrl}/rooms`,
  },
  openGraph: {
    title: 'Tirupati Rooms & Mutt Stays | Verified Near Station & TTD',
    description: 'Find clean, budget pilgrim rooms in Tirupati near Railway Station, Bus Stand, and Alipiri with direct verified contacts.',
    url: `${baseUrl}/rooms`,
    siteName: 'Saarthi Guide',
    locale: 'en_IN',
    type: 'website',
  },
};

const lodgingSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Saarthi Tirupati Pilgrim Rooms & Mutt Stays",
  "description": "Verified clean budget pilgrim stays, traditional mutt rooms, and lodges near Tirupati Central Railway Station, Bus Stand, and Alipiri with zero booking commissions.",
  "url": `${baseUrl}/rooms`,
  "telephone": "+91-9398542837",
  "priceRange": "₹500 - ₹2,000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tirupati",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "517501",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 13.6288,
    "longitude": 79.4192
  }
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
      />
      {children}
    </>
  );
}

import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'Tirumala Accommodation & Free PAC Halls | Saarthi Guide',
  description: 'Find free PAC halls, TTD room allotment counters (CRO), sub-enquiry offices, and rest houses in Tirumala. Direct map directions and verified pilgrim guidelines.',
  keywords: [
    'tirumala accommodation', 'tirumala free rooms', 'tirumala pac halls',
    'cro tirumala room allotment', 'tirumala rest houses', 'madhava nilayam pac 2',
    'venkatadri nilayam pac 5', 'ttd rooms tirumala', 'tirumala cottage allotment',
    'tirumala pilgrim amenities complex', 'arp counter tirumala'
  ],
  alternates: {
    canonical: `${baseUrl}/rooms`,
  },
  openGraph: {
    title: 'Tirumala Accommodation & Free PAC Halls | Saarthi Guide',
    description: 'Find free PAC halls, TTD room allotment counters (CRO), sub-enquiry offices, and rest houses in Tirumala. Direct map directions and verified pilgrim guidelines.',
    url: `${baseUrl}/rooms`,
    siteName: 'Saarthi Guide',
    locale: 'en_IN',
    type: 'website',
  },
};

const lodgingSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Saarthi Tirumala Accommodation & Free PAC Guide",
  "description": "Verified directory of free TTD Pilgrim Amenities Complexes (PAC 1-5), Central Reception Office room allotment counters, and rest houses on Tirumala hilltop.",
  "url": `${baseUrl}/rooms`,
  "telephone": "155257",
  "priceRange": "Free - ₹1,000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tirumala",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "517504",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 13.6828,
    "longitude": 79.3501
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

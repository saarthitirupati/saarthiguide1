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

const taxiServiceSchema = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "Saarthi Tirupati Cab Booking",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Saarthi Guide",
    "telephone": "+91-9398542837",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tirupati",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "517501",
      "addressCountry": "IN"
    }
  },
  "areaServed": [
    { "@type": "City", "name": "Tirupati" },
    { "@type": "AdministrativeArea", "name": "Tirumala" },
    { "@type": "Airport", "name": "Tirupati Airport (Renigunta)" },
    { "@type": "Place", "name": "Srikalahasti" },
    { "@type": "Place", "name": "Kanipakam" }
  ],
  "description": "Verified transparent fixed-rate cabs from Tirupati to Tirumala ghat road, Renigunta Airport, and pilgrimage circuits with zero commission.",
  "url": `${baseUrl}/cab-booking`
};

export default function CabBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }}
      />
      {children}
    </>
  );
}

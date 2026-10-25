import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'About Saarthi | Founded by Sunil Thatra',
  description: 'Saarthi is an independent Tirumala guide founded by Sunil Thatra to help pilgrims with offline maps and darshan info.',
  keywords: [
    'Sunil Thatra',
    'Sunil Thatra Saarthi',
    'Sunil Thatra Tirupati',
    'Sunil Thatra founder',
    'founder of saarthi',
    'saarthi guide founder',
    'Sunil Thatra saarthi guide',
    'who is the founder of saarthi',
    'about saarthi',
    'about saarthi guide',
    'tirupati saarthi founder'
  ],
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About Saarthi | Founded by Sunil Thatra',
    description: 'Saarthi is an independent Tirumala guide founded by Sunil Thatra to help pilgrims with offline maps and darshan info.',
    url: `${baseUrl}/about`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: '/images/places/img_1_passportsize_f7dyq3.jpg',
        width: 800,
        height: 800,
        alt: 'Sunil Thatra - Founder of Saarthi Guide'
      }
    ],
    type: 'profile'
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const jsonLdPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/about#founder`,
    name: 'Sunil Thatra',
    givenName: 'Sunil',
    familyName: 'Thatra',
    alternateName: ['Sunil Thatra Saarthi', 'Sunil Thatra Tirupati'],
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'Saarthi',
      url: baseUrl
    },
    url: `${baseUrl}/about`,
    image: '/images/places/img_1_passportsize_f7dyq3.jpg',
    sameAs: [
      'https://www.linkedin.com/in/sunil-t-39a905315/'
    ],
    knowsAbout: [
      'Tirupati Pilgrimage Guidance',
      'Tirumala Live Darshan Systems',
      'Software Architecture & Product Design',
      'Digital Pilgrimage Infrastructure'
    ],
    description: 'Founder of Saarthi, an independent pilgrimage guide for Tirupati and Tirumala.'
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Saarthi',
    alternateName: ['Saarthi Guide', 'Saarthi Tirupati', 'Saarthi App', 'Saarthi by Sunil Thatra'],
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    sameAs: [
      'https://play.google.com/store/apps/details?id=com.saarthi.guide',
      'https://www.linkedin.com/in/sunil-t-39a905315/'
    ],
    founder: {
      '@type': 'Person',
      name: 'Sunil Thatra',
      url: `${baseUrl}/about`
    },
    description: 'Saarthi is an independent digital pilgrimage guide for Tirupati and Tirumala, founded by Sunil Thatra.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      {children}
    </>
  );
}

import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  title: 'About Sunil Thatra & Saarthi Guide | Founder & Tirumala Guide Platform',
  description: 'Sunil Thatra is the Founder & Creator of Saarthi (Saarthi Guide), the #1 digital guide platform for Tirupati & Tirumala pilgrims. Learn about Sunil Thatra, our mission, story, and product engineering.',
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
    title: 'Sunil Thatra — Founder of Saarthi Guide',
    description: 'Sunil Thatra is the Founder of Saarthi, a digital platform helping pilgrims in Tirupati & Tirumala with live darshan wait times, SSD tokens, and precinct maps.',
    url: `${baseUrl}/about`,
    siteName: 'Saarthi Guide',
    images: [
      {
        url: 'https://res.cloudinary.com/kniegqlj/image/upload/v1791044338/passportsize_f7dyq3.jpg',
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
    '@id': 'https://www.saarthiguide.in/about#sunil-thatra',
    name: 'Sunil Thatra',
    alternateName: ['Sunil Thatra Saarthi', 'Sunil Thatra Tirupati'],
    jobTitle: 'Founder & Lead Creator',
    worksFor: {
      '@type': 'Organization',
      name: 'Saarthi Guide',
      url: 'https://www.saarthiguide.in'
    },
    url: 'https://www.saarthiguide.in/about',
    image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1791044338/passportsize_f7dyq3.jpg',
    knowsAbout: [
      'Tirupati Pilgrimage Guidance',
      'Tirumala Live Darshan Systems',
      'Software Architecture & Product Design',
      'Digital Pilgrimage Infrastructure'
    ],
    description: 'Sunil Thatra is the Founder and Lead Creator of Saarthi Guide, a digital platform helping visitors and pilgrims in Tirupati and Tirumala.'
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.saarthiguide.in/#organization',
    name: 'Saarthi Guide',
    url: 'https://www.saarthiguide.in',
    logo: 'https://www.saarthiguide.in/icon.png',
    founder: {
      '@type': 'Person',
      name: 'Sunil Thatra',
      url: 'https://www.saarthiguide.in/about'
    },
    description: 'Saarthi is the #1 trusted digital pilgrimage guide for Tirupati and Tirumala, founded by Sunil Thatra.'
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

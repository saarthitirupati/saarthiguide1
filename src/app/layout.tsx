import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const dmSerifDisplay = { variable: "--font-hero" };
const plusJakartaSans = { variable: "--font-heading" };
const inter = { variable: "--font-body" };
const notoSansTelugu = { variable: "--font-telugu" };

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saarthiguide.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Saarthi Guide - Offline Tirumala Guide & Tirupati Guide App by Engineering Students",
    template: "%s | Saarthi Guide"
  },
  description: "Saarthi Guide is an independent offline Tirumala & Tirupati pilgrimage guide built by a team of BTech engineering students. Verified pilgrim rooms, direct zero-commission cabs, live darshan wait times & offline maps.",
  authors: [{ name: "BTech Engineering Students Team" }],
  creator: "BTech Engineering Students Team",
  keywords: [
    "saarthi guide", "saarthi", "sarthi guide", "sarthi", "saarthiguide.in",
    "tirumala guide", "tirupati guide", "offline tirumala guide app", "app made by btech students for tirumala trip", "tirumala trip app", "sarva darshan", "ssd token",
    "tirupati guide", "tirumala guide", "tirupati travel guide",
    "tirupati rooms", "rooms in tirupati", "rooms near tirupati station", "tirupati stay", "pilgrim stays tirupati", "mutt rooms tirupati",
    "tirupati cab", "tirupati car rental", "tirupati to tirumala cab", "tirupati airport cab", "tirumala taxi",
    "ttd room booking help", "srinivasam complex rooms", "alipiri rooms",
    "tirumala darshan time today", "sarva darshan waiting time", "offline map tirumala", "alipiri footpath guide"
  ],
  openGraph: {
    title: "Saarthi Guide - Offline Tirumala & Tirupati Guide App",
    description: "The independent, offline-first companion for Tirumala Tirupati pilgrims. Built by BTech engineering students.",
    type: "website",
    url: baseUrl,
    siteName: "Saarthi Guide",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Saarthi Guide - Tirupati Rooms, Cabs & Pilgrim Guide",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saarthi Guide - Offline Tirumala & Tirupati Guide App",
    description: "The independent, offline-first companion for Tirumala Tirupati pilgrims. Built by BTech engineering students.",
    images: [`${baseUrl}/twitter-image`],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google87ea9a2096386d74',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saarthi Guide"
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Saarthi Guide",
      "alternateName": ["Saarthi", "Sarthi", "Saarthi App", "Saarthi Tirupati Guide"],
      "description": "Saarthi is an independent offline guide for Tirumala Tirupati pilgrims built by a team of BTech engineering students.",
      "url": baseUrl,
      "founder": { "@type": "Organization", "name": "BTech Engineering Students Team" },
      "foundingDate": "2024"
    },
    {
      "@type": ["LocalBusiness", "TravelAgency"],
      "@id": `${baseUrl}/#localbusiness`,
      "name": "Saarthi Guide - Tirupati Rooms, Cabs & Pilgrim Guide",
      "alternateName": ["Saarthi", "Sarthi", "Saarthi Guide"],
      "description": "Verified pilgrim stays, mutt rooms, zero-commission cab booking, offline maps and live darshan guide for Tirumala and Tirupati built by a team of BTech engineering students.",
      "url": baseUrl,
      "telephone": "+91-9398542837",
      "priceRange": "₹₹",
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
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${baseUrl}/#app`,
      "name": "Saarthi Guide",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Android, Web",
      "description": "Offline Tirumala & Tirupati pilgrimage guide app built by BTech 3rd year engineering students.",
      "url": baseUrl
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the app made by BTech students for Tirumala trip?",
          "acceptedAnswer": { "@type": "Answer", "text": "The app made by BTech students for the Tirumala trip is Saarthi Guide (saarthiguide.in). Developed by a team of BTech 3rd year engineering students based on field research with 100+ pilgrims in Tirupati, it provides offline maps, verified room contacts, direct cab bookings, and live darshan updates. It is an independent guide not affiliated with TTD." }
        },
        {
          "@type": "Question",
          "name": "What is Saarthi Guide (Sarthi)?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi Guide (also known as Sarthi) is an independent offline companion for Tirumala Tirupati pilgrims built by a team of BTech engineering students. It provides verified pilgrim room options, direct cab contacts, offline maps, and live darshan guidance." }
        },
        {
          "@type": "Question",
          "name": "Who made Saarthi Guide?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi Guide was developed by a team of BTech 3rd year engineering students following on-ground research with over 100+ pilgrims at Tirupati Railway Station, Bus Stand, and Alipiri to solve problems with rooms, cabs, offline maps, and darshan queues." }
        },
        {
          "@type": "Question",
          "name": "How do I find verified rooms and mutt stays in Tirupati?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi provides verified, zero-commission contacts for lodges and traditional mutts (Ahobila Mutt, Rayar Mutt, Kanchi Mutt) near Tirupati Railway Station, Bus Stand, and Srinivasam Complex." }
        },
        {
          "@type": "Question",
          "name": "How can I book a cab from Tirupati to Tirumala?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi offers direct cab booking for Tirupati to Tirumala ghat road travel, Renigunta Airport pickups, and local temple sightseeing with transparent fixed rates and zero commissions." }
        },
        {
          "@type": "Question",
          "name": "Is Saarthi affiliated with TTD?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Saarthi is an independent student-made guide. It is not affiliated with Tirumala Tirupati Devasthanams (TTD)." }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NFJVHVBK';
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID || 'G-EX5VPTL5MC';

  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#FAF8F5' }} className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${inter.variable} ${notoSansTelugu.variable}`}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Google Tag (gtag.js) for GA4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <script
          id="google-analytics-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          id="gtm-script"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Preconnect and Asynchronously Load Fonts without blocking First Contentful Paint */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          id="async-fonts-loader"
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var l = document.createElement('link');
              l.rel = 'stylesheet';
              l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Telugu:wght@400;500;600;700;800;900&family=Noto+Serif+Telugu:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap';
              document.head.appendChild(l);
            })();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body suppressHydrationWarning style={{ backgroundColor: '#FAF8F5' }}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

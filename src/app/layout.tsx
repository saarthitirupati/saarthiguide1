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
    default: "Saarthi - Tirumala Tirupati Guide | Offline Maps & Darshan Info",
    template: "%s | Saarthi"
  },
  description: "Saarthi is your offline Tirumala companion - darshan timings, queue maps, 82 temples, japa mala. An independent guide founded by Sunil Thatra.",
  authors: [{ name: "Sunil Thatra", url: "https://www.linkedin.com/in/sunil-t-39a905315/" }],
  creator: "Sunil Thatra",
  keywords: ["saarthi", "saarthi app", "tirumala guide", "tirupati offline map", "saarthi founder sunil thatra"],
  openGraph: {
    title: "Saarthi - Tirumala Tirupati Guide",
    description: "Offline Tirumala companion by Sunil Thatra. Maps, darshan info, essentials.",
    type: "website",
    url: baseUrl,
    siteName: "Saarthi Guide",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Saarthi: Tirupati & Tirumala Pilgrim Guide",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saarthi - Tirumala Tirupati Guide",
    description: "Offline Tirumala companion by Sunil Thatra. Maps, darshan info, essentials.",
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
      "name": "Saarthi",
      "alternateName": ["Saarthi App", "Saarthi Guide"],
      "description": "Saarthi is an independent offline guide for Tirumala Tirupati pilgrims",
      "url": baseUrl,
      "founder": { "@id": `${baseUrl}/about/#founder` },
      "foundingDate": "2024"
    },
    {
      "@type": "Person",
      "@id": `${baseUrl}/about/#founder`,
      "name": "Sunil Thatra",
      "jobTitle": "Founder",
      "description": "Founder of Saarthi",
      "url": `${baseUrl}/about`,
      "sameAs": ["https://www.linkedin.com/in/sunil-t-39a905315/"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Saarthi?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi is an independent offline guide for Tirumala Tirupati pilgrims. It helps with maps, darshan info and essentials." }
        },
        {
          "@type": "Question",
          "name": "Who founded Saarthi?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saarthi was founded by Sunil Thatra." }
        },
        {
          "@type": "Question",
          "name": "Is Saarthi an official app?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. Saarthi is an independent guide founded by Sunil Thatra. It is not affiliated with Tirumala Tirupati Devasthanams." }
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

  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#FAF8F5' }} className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} ${inter.variable} ${notoSansTelugu.variable}`}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
        {/* Preconnect and Load Crisp Google Fonts including Noto Serif Telugu and Cinzel */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Telugu:wght@400;500;600;700;800;900&family=Noto+Serif+Telugu:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
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

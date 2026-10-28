import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tirumala Darshan Entry Points & Gate Locations (All 15 Gates) | Saarthi',
  description: 'Verified guide to all 15 Tirumala darshan entry gates with exact Google Maps directions: VQC-1, VQC-2, ₹300 Special Entry, NRI & Infant, VIP Break, Senior Citizens, and Outer Rush Points.',
  keywords: [
    'Tirumala darshan entry points',
    'Vaikuntam queue complex 2 entrance',
    '₹300 special entry darshan gate location',
    'Tirumala NRI infant darshan gate',
    'VIP break darshan entry Tirumala',
    'Gogarbham circle queue line',
    'Supatham entry gate Tirumala'
  ],
  openGraph: {
    title: 'Tirumala Darshan Entry Points & Gate Locations (All 15 Gates) | Saarthi',
    description: 'Find your exact temple entry gate in Tirumala based on your ticket type. Step-by-step navigation, maps, rules, and helpline.',
    type: 'website'
  }
};

export default function DarshanEntryPointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

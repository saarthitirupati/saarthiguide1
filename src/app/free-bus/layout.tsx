import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Bus & Stations in Tirumala | APSRTC & Dharma Ratham Network',
  description: 'Complete directory of 17 Free Dharma Ratham electric bus stops and APSRTC bus stations across Tirumala hilltop with turn-by-turn navigation.',
  alternates: {
    canonical: 'https://saarthiguide.com/free-bus'
  }
};

export default function FreeBusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

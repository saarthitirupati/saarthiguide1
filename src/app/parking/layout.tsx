import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Parking in Tirumala | Hilltop Parking Bays & Directions',
  description: 'Complete directory of 13 official TTD car parking areas across Tirumala hilltop with turn-by-turn navigation and interactive map.',
  alternates: {
    canonical: 'https://saarthiguide.com/parking'
  }
};

export default function ParkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

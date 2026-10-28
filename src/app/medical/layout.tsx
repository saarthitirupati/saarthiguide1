import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Facilities & Hospitals in Tirumala | TTD Emergency Care',
  description: 'Complete directory of 24/7 TTD hospitals, clinics, and free pharmacies across Tirumala hilltop with 108 emergency dialer and turn-by-turn navigation.',
  alternates: {
    canonical: 'https://saarthiguide.com/medical'
  }
};

export default function MedicalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

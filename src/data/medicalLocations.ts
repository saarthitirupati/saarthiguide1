export interface MedicalLocation {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  type: 'hospital' | 'ayurvedic' | 'pharmacy';
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  navigationUrl: string;
  phone?: string;
}

export const MEDICAL_LOCATIONS_DATA: MedicalLocation[] = [
  {
    id: 'aswini-hospital',
    order: 1,
    name: 'Aswini Hospital (TTD)',
    subtitle: 'Main hospital in Tirumala',
    type: 'hospital',
    landmark: 'Opposite CRO Office / Near VQC-1, Tirumala',
    coordinates: { lat: 13.6814, lng: 79.3498 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Aswini+Hospital+Tirumala',
    phone: '08772277777'
  },
  {
    id: 'ayurvedic-hospital',
    order: 2,
    name: 'Ayurvedic Hospital',
    subtitle: 'TTD Ayurvedic Dispensary',
    type: 'ayurvedic',
    landmark: 'Near SV Museum / Ring Road, Tirumala',
    coordinates: { lat: 13.6842, lng: 79.3512 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=TTD+Ayurvedic+Hospital+Tirumala'
  },
  {
    id: 'pharmacy',
    order: 3,
    name: 'Pharmacy',
    subtitle: 'TTD Free 24/7 Pharmacy',
    type: 'pharmacy',
    landmark: 'Aswini Hospital Campus, Tirumala',
    coordinates: { lat: 13.6818, lng: 79.3492 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=TTD+Pharmacy+Aswini+Hospital+Tirumala'
  }
];

export const MEDICAL_EMERGENCY = {
  phone: '108',
  label: '108 Ambulance'
};

export const MEDICAL_HELPLINE = {
  phone: '155257',
  phoneFormatted: '155257',
  title: 'TTD Call Centre',
  subtitle: 'Toll-free · 24/7 · tap to call'
};

export const MEDICAL_DISCLAIMER = 'Locations: © OpenStreetMap contributors · TTD. Timings can change on festival days.';

export interface ParkingLocation {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  type: 'general' | 'vip';
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  navigationUrl: string;
}

export const PARKING_LOCATIONS_DATA: ParkingLocation[] = [
  {
    id: 'panchajanyam-parking',
    order: 1,
    name: 'Panchajanyam Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Panchajanyam Rest House Complex, Tirumala',
    coordinates: { lat: 13.6800, lng: 79.3530 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Panchajanyam+Car+Parking+Tirumala'
  },
  {
    id: 'gogarbham-circle-parking',
    order: 2,
    name: 'Gogarbham Circle Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Gogarbham Circle, Outer Ring Road, Tirumala',
    coordinates: { lat: 13.6830, lng: 79.3440 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Gogarbham+Circle+Car+Parking+Tirumala'
  },
  {
    id: 'srivari-seva-sadan-parking',
    order: 3,
    name: 'Srivari Seva Sadan Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Srivari Seva Sadan, Tirumala',
    coordinates: { lat: 13.6815, lng: 79.3490 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Srivari+Seva+Sadan+Car+Parking+Tirumala'
  },
  {
    id: 'varaha-swamy-parking',
    order: 4,
    name: 'Varaha Swamy Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Near Sri Varaha Swamy Temple / Pushkarini, Tirumala',
    coordinates: { lat: 13.6845, lng: 79.3470 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Varaha+Swamy+Car+Parking+Tirumala'
  },
  {
    id: 'vishnu-padam-parking',
    order: 5,
    name: 'Vishnu Padam Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Vishnu Padam Area, Tirumala',
    coordinates: { lat: 13.6860, lng: 79.3480 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Vishnu+Padam+Parking+Tirumala'
  },
  {
    id: 'nandakam-east-parking',
    order: 6,
    name: 'Car parking',
    subtitle: 'Near Nandakam Rest House (east)',
    type: 'general',
    landmark: 'Nandakam Rest House East Wing, Tirumala',
    coordinates: { lat: 13.6785, lng: 79.3525 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Nandakam+East+Car+Parking+Tirumala'
  },
  {
    id: 'nandakam-main-parking',
    order: 7,
    name: 'Nandakam Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Nandakam Rest House Main Parking Bay, Tirumala',
    coordinates: { lat: 13.6788, lng: 79.3518 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Nandakam+Parking+Tirumala'
  },
  {
    id: 'rbgh-vip-parking',
    order: 8,
    name: 'RBGH VIP Car Parking',
    subtitle: 'Car parking',
    type: 'vip',
    landmark: 'Rambagicha Guest House (RBGH) VIP Parking, Tirumala',
    coordinates: { lat: 13.6840, lng: 79.3515 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=RBGH+VIP+Car+Parking+Tirumala'
  },
  {
    id: 'sggh-parking',
    order: 9,
    name: 'SGGH Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Sri Govindaraja Guest House (SGGH), Tirumala',
    coordinates: { lat: 13.6855, lng: 79.3460 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=SGGH+Car+Parking+Tirumala'
  },
  {
    id: 'mullagunta-parking',
    order: 10,
    name: 'Mullagunta Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Mullagunta Ring Road Junction, Tirumala',
    coordinates: { lat: 13.6820, lng: 79.3540 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Mullagunta+Car+Parking+Tirumala'
  },
  {
    id: 'kousthubham-parking',
    order: 11,
    name: 'Kousthubham Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Kousthubham Rest House, Tirumala',
    coordinates: { lat: 13.6795, lng: 79.3505 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=Kousthubham+Car+Parking+Tirumala'
  },
  {
    id: 'svgh-parking',
    order: 12,
    name: 'SVGH Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'Sri Venkateswara Guest House (SVGH), Tirumala',
    coordinates: { lat: 13.6885, lng: 79.3470 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=SVGH+Parking+Tirumala'
  },
  {
    id: 'tbc-parking',
    order: 13,
    name: 'TBC Car Parking',
    subtitle: 'Car parking',
    type: 'general',
    landmark: 'TBC Circle Area, Tirumala',
    coordinates: { lat: 13.6865, lng: 79.3525 },
    navigationUrl: 'https://www.google.com/maps/search/?api=1&query=TBC+Car+Parking+Tirumala'
  }
];

export const PARKING_HELPLINE = {
  phone: '155257',
  phoneFormatted: '155257',
  title: 'TTD Call Centre',
  subtitle: 'Toll-free · 24/7 · tap to call'
};

export const PARKING_DISCLAIMER = 'Locations: © OpenStreetMap contributors · TTD. Timings can change on festival days.';

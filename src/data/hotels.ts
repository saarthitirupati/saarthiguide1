export interface Hotel {
  id: string;
  name: string;
  nameTe?: string;
  category: 'Hotel' | 'Lodge' | 'Guest House';
  starRating?: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  locationArea: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distanceSummary: string;
  distanceSummaryTe?: string;
  images: string[];
  features: string[];
  tags: string[];
  googleMapsUrl: string;
  whatsappPhone: string;
  policies: {
    checkIn: string;
    checkOut: string;
    rules: string[];
  };
  honestNote?: string;
  honestNoteTe?: string;
}

export const HOTELS: Hotel[] = [
  {
    id: 'vamana-inn-tirupati',
    name: 'Hotel Vamana Inn, Tirupati',
    nameTe: 'హోటల్ వామన ఇన్, తిరుపతి',
    category: 'Hotel',
    starRating: 3,
    rating: 3.8,
    reviewCount: 8,
    pricePerNight: 799,
    originalPrice: 1299,
    locationArea: 'Ramchandra Nagar / Shanthi Nagar',
    address: '18-3-64/A, Shanthi Nagar, K T Road (Tirumala Bypass Road), Beside Alipiri Police Station, Tirupati - 517501',
    coordinates: {
      lat: 13.6483611,
      lng: 79.4253116
    },
    distanceSummary: '1.2 km to Kapila Theertham · 3 km to Alipiri Mettu · Near Srinivasam',
    distanceSummaryTe: 'కపిల తీర్థం నుండి 1.2 కి.మీ · అలిపిరి మెట్టు నుండి 3 కి.మీ',
    images: [
      '/images/places/img_13_ANWiy9SQiPv-2NOPnN-DzVnbD8b3C9RuUA8n-vaOApMNdzKYFy.webp',
      '/images/places/img_14_AABkmLcpN_kDVbncV2kOClC-fm4v_YeWYOZiliEVf_a9Wzdwxm.jpg',
      '/images/places/img_15_ANWiy9QRE2fPcf-WuLw3lgzPHBsqIZ2CUOst8P3KYLayfjLIkt.webp',
      '/images/places/img_16_ANWiy9SD8253FSlIdhBi0hkjSAqLn2mlo4RZlQ6tO-e2Gy_9mf.webp'
    ],
    features: [
      'Air Conditioning',
      'Free High-Speed Wi-Fi',
      '24-Hour Room Service',
      'Attached Bathroom & Geyser',
      'Power Backup'
    ],
    tags: [
      'Near Temple',
      'Family Rooms',
      'AC Rooms',
      'Budget Friendly',
      'Free Cancellation'
    ],
    googleMapsUrl: 'https://www.google.com/maps/place/Hotel+Vamana+inn/@13.6483611,79.4253116,17z/data=!3m1!4b1!4m9!3m8!1s0x3a4d4ba400000001:0x29c9841470837235!5m2!4m1!1i2!8m2!3d13.6483611!4d79.4253116!16s%2Fg%2F11h7smxw2h',
    whatsappPhone: '919398542837',
    policies: {
      checkIn: '12:00 PM',
      checkOut: '11:00 AM',
      rules: [
        'Married couples & family travelers allowed',
        'Valid Govt ID (Aadhaar / Driving License / Passport) required for all adults',
        'Unmarried couples not allowed per hotel policy',
        'Alcohol & smoking strictly prohibited on premises'
      ]
    },
    honestNote: 'Clean, comfortable AC rooms with friendly staff. Public road-side parking available.',
    honestNoteTe: 'శుభ్రమైన ఏసీ గదులు మరియు మర్యాదపూర్వక సిబ్బంది. రోడ్‌సైడ్ పార్కింగ్ కలదు.'
  }
];

export function getHotelById(id: string): Hotel | undefined {
  return HOTELS.find(h => h.id === id);
}

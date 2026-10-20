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
      'https://res.cloudinary.com/kniegqlj/image/upload/v1792240797/ANWiy9SQiPv-2NOPnN-DzVnbD8b3C9RuUA8n-vaOApMNdzKYFynwR9wPRdqdb0wQY9Tjn6JMepGkRYt8spN3pjeh-dGsxdcCoRXetxzNIXRVU_YH4vWTyVZWYLDgD4bWpRksz1G2YKw_s680-w680-h510-rw_vxmorg.webp',
      'https://res.cloudinary.com/kniegqlj/image/upload/v1792240780/AABkmLcpN_kDVbncV2kOClC-fm4v_YeWYOZiliEVf_a9Wzdwxmp1Ob-iPakLfDgOx-dTv7c-_mGnLsVd-4nC7t4xvGOlrzB_dpr90HxIBC0P-WJN_dh3K2lPrYC7_792fGrnJEuuJYr3Eg_w324-h312-n-k-no_pp0pmu.jpg',
      'https://res.cloudinary.com/kniegqlj/image/upload/v1792240845/ANWiy9QRE2fPcf-WuLw3lgzPHBsqIZ2CUOst8P3KYLayfjLIktGc6rdDt0IQ5OaYCkmSGC3SzmtDk15DP9cXUoDlcEqxF4pwCat1UZBcKgRZJD9raQ_XsHcupc3ZHqEG318ZOAVQXjmh_s680-w680-h510-rw_og938i.webp',
      'https://res.cloudinary.com/kniegqlj/image/upload/v1792240823/ANWiy9SD8253FSlIdhBi0hkjSAqLn2mlo4RZlQ6tO-e2Gy_9mfUPyJ36_FMr1ViSLtF8eUxtCGfPepq3sLSCD82HCUbmdiIAlkMsvw2-FI8O3twsSQA2e_XjZJRkygoQdtQDBRDLT2u__s680-w680-h510-rw_kztv6y.webp'
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
    whatsappPhone: '919876543210',
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

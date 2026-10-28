export interface DarshanEntryPoint {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  category: 'free' | 'paid' | 'vip' | 'special' | 'rush';
  categoryLabel: string;
  landmark: string;
  targetDevotees: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  navigationUrl: string;
  reportingTip: string;
  dressCodeRequired: boolean;
}

export const DARSHAN_ENTRY_POINTS: DarshanEntryPoint[] = [
  {
    id: 'vqc2-main',
    order: 1,
    name: 'Vaikuntam Queue Complex 2 · main entrance',
    subtitle: 'Sarva Darshan (free) · Main entrance',
    category: 'free',
    categoryLabel: 'Free Sarva Darshan',
    landmark: 'Opposite Lepakshi Emporium / North Ring Road',
    targetDevotees: 'General walk-in pilgrims without prior online ticket or SSD token',
    coordinates: { lat: 13.6825652, lng: 79.3444292 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+Queue+Complex+-+2/@13.6825652,79.3444292,17z/data=!4m6!3m5!1s0x3bb2b5e88a621dbd:0x270c848d58e12b12!8m2!3d13.6825652!4d79.3444292!16s%2Fg%2F11fq9mcp_0',
    reportingTip: 'Deposit footwear and electronic devices at free TTD counters outside VQC-2 before entering.',
    dressCodeRequired: true
  },
  {
    id: 'vqc2-reentry',
    order: 2,
    name: 'Vaikuntam Queue Complex 2 · re-entry',
    subtitle: 'Sarva Darshan (free) · Re-entry gate',
    category: 'free',
    categoryLabel: 'Re-entry Gate',
    landmark: 'VQC-2 Side Gate, Tirumala',
    targetDevotees: 'Pilgrims holding verified exit/re-entry tokens or temporary passes',
    coordinates: { lat: 13.6825652, lng: 79.3444292 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+Queue+Complex+-+2/@13.6825652,79.3444292,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb2b5e88a621dbd:0x270c848d58e12b12!8m2!3d13.6825652!4d79.3444292!16s%2Fg%2F11fq9mcp_0',
    reportingTip: 'Keep your barcode token and government ID readily accessible for verification.',
    dressCodeRequired: true
  },
  {
    id: 'sed-300-shankar-road',
    order: 3,
    name: 'Rs.300 Special Entry Darshan (SED) entry',
    subtitle: '₹300 ticket holders · Shankar Road',
    category: 'paid',
    categoryLabel: '₹300 SED Online',
    landmark: 'Shankar Road, near ATC Car Parking',
    targetDevotees: 'Pilgrims holding advance online ₹300 Special Entry Darshan e-receipts',
    coordinates: { lat: 13.6817739, lng: 79.3464677 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+queue+complex+1/@13.6817739,79.3464677,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb2b500102f7591:0xfa5a480ad0a93297!8m2!3d13.6817739!4d79.3464677!16s%2Fg%2F11yrc8v_6p',
    reportingTip: 'Report strictly within your 1-hour allotted window printed on your ticket with matching original ID.',
    dressCodeRequired: true
  },
  {
    id: 'nri-infant-shankar-road',
    order: 4,
    name: 'NRI & infant darshan entry',
    subtitle: 'NRI darshan and parents with infants · Shankar Road',
    category: 'special',
    categoryLabel: 'NRI & Infant',
    landmark: 'Supatham entry approach, Shankar Road',
    targetDevotees: 'NRIs (with valid passport & visa) and parents with infants under 1 year of age',
    coordinates: { lat: 13.6824161, lng: 79.3477797 },
    navigationUrl: 'https://www.google.com/maps/place/Steps+to+Supatham/@13.6825616,79.3475822,19.99z/data=!4m6!3m5!1s0x3bb2b500734c2d8f:0xde745d328f92d9dc!8m2!3d13.6824161!4d79.3477797!16s%2Fg%2F11x8bhz70k',
    reportingTip: 'Carry child birth certificate / passport + visa stamps. Allowed during designated daily slots (usually 12 PM - 6 PM).',
    dressCodeRequired: true
  },
  {
    id: 'vip-break-atc',
    order: 5,
    name: 'VIP break darshan entry',
    subtitle: 'Near ATC Circle',
    category: 'vip',
    categoryLabel: 'VIP Break',
    landmark: 'ATC Circle, Tirumala',
    targetDevotees: 'Protocol dignitaries, VIP letter approval holders, and designated privilege passes',
    coordinates: { lat: 13.6817739, lng: 79.3464677 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+queue+complex+1/@13.6817739,79.3464677,17z/data=!4m6!3m5!1s0x3bb2b500102f7591:0xfa5a480ad0a93297!8m2!3d13.6817739!4d79.3464677!16s%2Fg%2F11yrc8v_6p',
    reportingTip: 'Report 30 minutes before your allotted Break Darshan time with original biometric ID.',
    dressCodeRequired: true
  },
  {
    id: 'vqc1-main',
    order: 6,
    name: 'VQC-1 main entrance',
    subtitle: 'Vaikuntam Queue Complex 1',
    category: 'vip',
    categoryLabel: 'VQC-1 Main',
    landmark: 'South of Srivari Temple, near VQC-1 arch',
    targetDevotees: 'VQC-1 compartment pilgrims, protocol visitors, and special privilege queues',
    coordinates: { lat: 13.6817739, lng: 79.3464677 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+queue+complex+1/@13.6817739,79.3464677,17z/data=!4m6!3m5!1s0x3bb2b500102f7591:0xfa5a480ad0a93297!8m2!3d13.6817739!4d79.3464677!16s%2Fg%2F11yrc8v_6p',
    reportingTip: 'Ensure phones and electronic devices are deposited in external cloakrooms beforehand.',
    dressCodeRequired: true
  },
  {
    id: 'protocol-donor-vqc1',
    order: 7,
    name: 'Protocol & donor darshan entry',
    subtitle: 'Protocol and ₹1 crore donors · at VQC-1',
    category: 'vip',
    categoryLabel: 'Protocol & Donors',
    landmark: 'VQC-1 Dedicated Donor Lounge gate',
    targetDevotees: 'State protocol VIPs and registered TTD Trust donors (₹1 Cr & above passes)',
    coordinates: { lat: 13.6817739, lng: 79.3464677 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+queue+complex+1/@13.6817739,79.3464677,17z/data=!4m6!3m5!1s0x3bb2b500102f7591:0xfa5a480ad0a93297!8m2!3d13.6817739!4d79.3464677!16s%2Fg%2F11yrc8v_6p',
    reportingTip: 'Carry your official TTD Donor passbook, identity card, and allocation slip.',
    dressCodeRequired: true
  },
  {
    id: 'srivani-vqc1',
    order: 8,
    name: 'Srivani darshan entry',
    subtitle: 'Srivani Trust ticket holders · near VQC-1',
    category: 'paid',
    categoryLabel: 'Srivani Trust',
    landmark: 'Near VQC-1 approach / Gokulam Road',
    targetDevotees: 'Devotees holding ₹10,000 Srivani Trust donation + ₹500 VIP break tickets',
    coordinates: { lat: 13.6817739, lng: 79.3464677 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+queue+complex+1/@13.6817739,79.3464677,17z/data=!4m6!3m5!1s0x3bb2b500102f7591:0xfa5a480ad0a93297!8m2!3d13.6817739!4d79.3464677!16s%2Fg%2F11yrc8v_6p',
    reportingTip: 'Report at the printed slot time. Srivani tickets entitle devotees to morning or afternoon VIP break darshan.',
    dressCodeRequired: true
  },
  {
    id: 'senior-differently-abled',
    order: 9,
    name: 'Senior citizens & differently-abled entry',
    subtitle: 'South Mada Street',
    category: 'special',
    categoryLabel: 'Seniors & Differently Abled',
    landmark: 'South Mada Street, near Temple wall',
    targetDevotees: 'Senior citizens (age 65+), differently-abled devotees, and severe medical cases with 1 attendant',
    coordinates: { lat: 13.6825141, lng: 79.3475475 },
    navigationUrl: 'https://www.google.com/maps/place/Sri+Tirumala+Nambi+Sannidhi/@13.6824618,79.347656,20.39z/data=!4m6!3m5!1s0x3bb2b5d95ce973e7:0xddf2b3a91db930e6!8m2!3d13.6825141!4d79.3475475!16s%2Fg%2F11k3r65jyt',
    reportingTip: 'Report at 10:00 AM or 3:00 PM slot. Carry original age proof (Aadhaar) or medical disability certificate.',
    dressCodeRequired: true
  },
  {
    id: 'sd-seva-supadham',
    order: 10,
    name: 'SD Seva & Arjitha Brahmotsavam entry',
    subtitle: 'Arjitha seva ticket holders · Supadham',
    category: 'special',
    categoryLabel: 'Arjitha Seva',
    landmark: 'Supadham Gate, between VQC-1 and Temple',
    targetDevotees: 'Arjitha Seva ticket holders (Kalyanotsavam, Unjal Seva, Arjitha Brahmotsavam, Vasantotsavam)',
    coordinates: { lat: 13.6824161, lng: 79.3477797 },
    navigationUrl: 'https://www.google.com/maps/place/Steps+to+Supatham/@13.6823803,79.347791,20.8z/data=!4m6!3m5!1s0x3bb2b500734c2d8f:0xde745d328f92d9dc!8m2!3d13.6824161!4d79.3477797!16s%2Fg%2F11x8bhz70k',
    reportingTip: 'Report 1 to 2 hours prior to the scheduled seva time. Traditional dress code strictly enforced.',
    dressCodeRequired: true
  },
  {
    id: 'biometric-pushkarini',
    order: 11,
    name: 'Biometric entry point',
    subtitle: 'Near Srivari Pushkarini',
    category: 'free',
    categoryLabel: 'Biometric Gate',
    landmark: 'East of Srivari Pushkarini / Varahaswamy temple path',
    targetDevotees: 'Pilgrims with biometric footpath tokens (Divya Darshan) & slotted Sarva Darshan (SSD)',
    coordinates: { lat: 13.6843976, lng: 79.3478989 },
    navigationUrl: 'https://www.google.com/maps/place/Srivari+Pushkarini/@13.6845227,79.3475479,18.87z/data=!4m6!3m5!1s0x3bb2ca9d5d48e667:0x279880e4eda37467!8m2!3d13.6843976!4d79.3478989!16s%2Fg%2F1trqfnjy',
    reportingTip: 'Scan your footpath or SSD token barcode along with biometric fingerprint verification here.',
    dressCodeRequired: true
  },
  {
    id: 'gogarbham-circle-rush',
    order: 12,
    name: 'Gogarbham Circle · Sarva Darshan entry',
    subtitle: 'Sarva Darshan line on rush days',
    category: 'rush',
    categoryLabel: 'Rush Day Queue Point',
    landmark: 'Gogarbham Circle, Tirumala Outer Ring Road',
    targetDevotees: 'Sarva Darshan general pilgrims when internal VQC-2 compartments reach 100% capacity',
    coordinates: { lat: 13.6825652, lng: 79.3444292 },
    navigationUrl: 'https://www.google.com/maps/place/Vaikuntam+Queue+Complex+-+2/@13.6833375,79.3446278,16.31z/data=!4m6!3m5!1s0x3bb2b5e88a621dbd:0x270c848d58e12b12!8m2!3d13.6825652!4d79.3444292!16s%2Fg%2F11fq9mcp_0',
    reportingTip: 'Active during Brahmotsavam, Vaikunta Ekadasi, summer vacations & long weekends. Follow TTD volunteer signboards.',
    dressCodeRequired: true
  },
  {
    id: 'bata-gangamma-rush',
    order: 13,
    name: 'Bata Gangamma · Sarva Darshan entry',
    subtitle: 'Sarva Darshan line on rush days · Near Hathiram Babaji Circle',
    category: 'rush',
    categoryLabel: 'Rush Day Queue Point',
    landmark: 'Near Hathiram Babaji Circle & Bata Gangamma Temple',
    targetDevotees: 'General queue extension during major temple festivals and massive devotee turnout',
    coordinates: { lat: 13.6890565, lng: 79.3473702 },
    navigationUrl: 'https://www.google.com/maps/place/Baata+Gangamma+Temple/@13.6889522,79.3480323,19.71z/data=!4m6!3m5!1s0x3bb2ca9ca89f3f47:0x9b119c4b2dfc577d!8m2!3d13.6890565!4d79.3473702!16s%2Fg%2F11fz7jw1sd',
    reportingTip: 'Water and Annaprasadam packets are distributed continuously along this roadside queue shed.',
    dressCodeRequired: true
  },
  {
    id: 'silathoranam-circle-rush',
    order: 14,
    name: 'Sarva Darshan entry · Silathoranam Circle',
    subtitle: 'Sarva Darshan line on rush days',
    category: 'rush',
    categoryLabel: 'Rush Day Queue Point',
    landmark: 'Silathoranam Road / Rock Garden Circle',
    targetDevotees: 'Outer queue overflow point when lines spill over beyond Bata Gangamma and Gogarbham',
    coordinates: { lat: 13.6890731, lng: 79.3510837 },
    navigationUrl: 'https://www.google.com/maps/place/Octopus+Thirumala/@13.6889468,79.3506566,17.62z/data=!4m6!3m5!1s0x3bb2ca9c0e417633:0xfd1032ef0c77e88f!8m2!3d13.6890731!4d79.3510837!16s%2Fg%2F11c1sjks7q',
    reportingTip: 'Free TTD electric buses connect Tirumala bus stand to Silathoranam circle during peak rush days.',
    dressCodeRequired: true
  },
  {
    id: 'krishna-teja-circle-rush',
    order: 15,
    name: 'Sarva Darshan entry · Krishna Teja Circle',
    subtitle: 'Sarva Darshan line on rush days',
    category: 'rush',
    categoryLabel: 'Rush Day Queue Point',
    landmark: 'Krishna Teja Rest House Junction, Outer Tirumala',
    targetDevotees: 'Ultimate peripheral queue buffer point during unprecedented crowd peaks',
    coordinates: { lat: 13.6828515, lng: 79.3437217 },
    navigationUrl: 'https://www.google.com/maps/place/Krishna+Teja+Circle/@13.6828515,79.3437217,18z/data=!4m6!3m5!1s0x3bb2b5106c4d2233:0x41f209d9bd440145!8m2!3d13.6828515!4d79.3437217!16s%2Fg%2F11tp850jmh',
    reportingTip: 'Follow police and Srivari Sevak public address announcements before walking towards inner temple.',
    dressCodeRequired: true
  }
];

export const GOOD_TO_KNOW_TIPS = [
  {
    step: 1,
    title: 'Match Your Ticket Gate',
    description: 'Check the exact entry gate on your ticket before heading out.'
  },
  {
    step: 2,
    title: 'Original Photo ID',
    description: 'Carry the original physical photo ID used during ticket booking.'
  },
  {
    step: 3,
    title: 'Free Cloakrooms & Footwear',
    description: 'Deposit phones, smartwatches, and footwear at free counters before queuing.'
  },
  {
    step: 4,
    title: 'Festival Rush Lines',
    description: 'On peak rush days, the Sarva line starts from outer circles (Gogarbham / Silathoranam).'
  }
];

export const COMMON_QUESTIONS = [
  {
    question: 'Where do I enter for ₹300 Special Entry Darshan (SED)?',
    answer: 'At Shankar Road, near ATC Car Parking. Report only within your ticket time window.'
  },
  {
    question: 'Where do senior citizens and differently-abled devotees enter?',
    answer: 'Dedicated entry gate on South Mada Street with daily slots at 10:00 AM and 3:00 PM.'
  },
  {
    question: 'Where does the free Sarva Darshan line start?',
    answer: 'At VQC-2 main entrance. On peak rush days, it starts at outer circles (Gogarbham / Silathoranam).'
  },
  {
    question: 'Where is the entry for NRI and infant darshan?',
    answer: 'Supatham entry on Shankar Road near ATC. Bring child’s birth proof or NRI passport with visa.'
  },
  {
    question: 'Can I carry mobile phones or smartwatches into the queue?',
    answer: 'No. Strictly prohibited. Deposit them at free TTD barcode counters outside VQC and ATC.'
  }
];

export const TTD_HELPLINE = {
  phone: '155257',
  phoneFormatted: '155257 / 1800-425-4141',
  dialNumber: '155257',
  title: 'TTD Call Centre',
  subtitle: 'Toll-free · 24/7 · tap to call',
  alternatePhone: '1800-425-4141'
};

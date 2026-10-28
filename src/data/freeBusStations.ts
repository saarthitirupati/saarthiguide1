export interface BusStationStop {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  type: 'apsrtc' | 'dharma-ratham';
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  navigationUrl: string;
}

export const BUS_STATIONS_DATA: BusStationStop[] = [
  {
    id: 'rambhageecha-apsrtc',
    order: 1,
    name: 'Rambhageecha bus station (APSRTC)',
    subtitle: 'Buses to Tirupati',
    type: 'apsrtc',
    landmark: 'Rambagicha Bus Stand, Tirumala',
    coordinates: { lat: 13.6839474, lng: 79.3519447 },
    navigationUrl: 'https://www.google.com/maps/place/Rambagicha+Bus+Stand/@13.6839474,79.3519447,17z/data=!4m14!1m7!3m6!1s0x3bb2cb095e8cc143:0xa6afc4a40607134!2sRambagicha+Bus+Stand!8m2!3d13.6839474!4d79.3519447!16s%2Fg%2F11v6src6gt!3m5!1s0x3bb2cb095e8cc143:0xa6afc4a40607134!8m2!3d13.6839474!4d79.3519447!16s%2Fg%2F11v6src6gt?hl=en'
  },
  {
    id: 'balaji-apsrtc',
    order: 2,
    name: 'Balaji bus station (APSRTC)',
    subtitle: 'APSRTC Bus Station',
    type: 'apsrtc',
    landmark: 'Balaji Bus Stand Complex, Tirumala',
    coordinates: { lat: 13.6771141, lng: 79.3502304 },
    navigationUrl: 'https://www.google.com/maps/place/Balaji+Bus+Stand,+Tirumala/@13.6771141,79.3502304,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb2b5994cdf6003:0x993f8156c24d46d0!8m2!3d13.6771141!4d79.3502304!16s%2Fg%2F11j1mh5_4x'
  },
  {
    id: 'cro-stop',
    order: 3,
    name: 'CRO Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Central Reception Office (CRO), Tirumala',
    coordinates: { lat: 13.6822, lng: 79.3515 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b5966096e17d:0x74ee45a0f4308616&hl=en'
  },
  {
    id: 'lepakshi-stop',
    order: 4,
    name: 'Lepakshi Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Lepakshi Circle, Tirumala',
    coordinates: { lat: 13.6808821, lng: 79.3509826 },
    navigationUrl: 'https://www.google.com/maps/place/Lepakshi+Cir,+Tirumala,+Tirupati+Urban,+Andhra+Pradesh+517504/@13.6808821,79.3509826,17z/data=!4m15!1m8!3m7!1s0x3bb2b563cbda5869:0xe30fa77af617f8d2!2sLepakshi+Cir,+Tirumala,+Tirupati+Urban,+Andhra+Pradesh+517504!3b1!8m2!3d13.6808821!4d79.3509826!16s%2Fg%2F11c487m_wl!3m5!1s0x3bb2b563cbda5869:0xe30fa77af617f8d2!8m2!3d13.6808821!4d79.3509826!16s%2Fg%2F11c487m_wl'
  },
  {
    id: 'filter-house-stop',
    order: 5,
    name: 'Filter House Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Filter House Junction, Ring Road, Tirumala',
    coordinates: { lat: 13.6872, lng: 79.3482 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b508f0efb455:0x8cdc6d3064ddbe3a&hl=en'
  },
  {
    id: 'smc-stop',
    order: 6,
    name: 'SMC Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Sapthagiri Mutts & Cottages (SMC) Area, Tirumala',
    coordinates: { lat: 13.680183, lng: 79.348786 },
    navigationUrl: 'https://www.google.com/maps/place/SMC+Bus+Stop/@13.680183,79.348786,17z/data=!4m14!1m7!3m6!1s0x3bb2b563056268a3:0x81cd6451bc85f375!2sSMC+Bus+Stop!8m2!3d13.680183!4d79.348786!16s%2Fg%2F1pyqqr7hk!3m5!1s0x3bb2b563056268a3:0x81cd6451bc85f375!8m2!3d13.680183!4d79.348786!16s%2Fg%2F1pyqqr7hk?hl=en'
  },
  {
    id: 'balaji-bus-stand-stop',
    order: 7,
    name: 'Balaji Bus Stand Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Balaji Bus Stand Entrance, Tirumala',
    coordinates: { lat: 13.6811, lng: 79.3510 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b563b682d009:0x36fb7a77cbe52d8f&hl=en'
  },
  {
    id: 'spgh-stop',
    order: 8,
    name: 'SPGH Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Sri Padmavathi Guest House (SPGH), Tirumala',
    coordinates: { lat: 13.6865, lng: 79.3441 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b563b682d009:0x36fb7a77cbe52d8f&hl=en'
  },
  {
    id: 'pac2-stop',
    order: 9,
    name: 'PAC-2 (Madhava Nilayam) Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Pilgrim Amenities Centre 2 (Madhava Nilayam), Tirumala',
    coordinates: { lat: 13.6802, lng: 79.3501 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b56408b6d749:0x34346fc354bf21b8&hl=en'
  },
  {
    id: 'pac5-stop',
    order: 10,
    name: 'PAC-5 Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Pilgrim Amenities Centre 5 (Venkatadri Nilayam), Tirumala',
    coordinates: { lat: 13.6821, lng: 79.3489 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2cb168d7cb8a1:0x8f3ab790be7a4880&hl=en'
  },
  {
    id: 'annamayya-bhavan-stop',
    order: 11,
    name: 'Annamayya Bhavan Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Annamayya Bhavan Administrative Complex, Tirumala',
    coordinates: { lat: 13.6848, lng: 79.3472 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b563c1f06b41:0x8bbac813014fdf9b&hl=en'
  },
  {
    id: 'gnc-stop',
    order: 12,
    name: 'GNC Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Govinda Nilayam Cottages (GNC) Toll Gate Junction, Tirumala',
    coordinates: { lat: 13.6795, lng: 79.3486 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b53dbdef215b:0x19367730b63afb48&hl=en'
  },
  {
    id: 'hvc-stop',
    order: 13,
    name: 'HVC Free Bus Stop',
    subtitle: 'Free bus stop',
    type: 'dharma-ratham',
    landmark: 'Heritage / Higher Value Cottages (HVC) Ring Road, Tirumala',
    coordinates: { lat: 13.6818, lng: 79.3435 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2b5002ff71ccd:0x6967730e134cf09b&hl=en'
  },
  {
    id: 'nandakam-stop',
    order: 14,
    name: 'Free bus stop',
    subtitle: 'Near Nandakam Rest House',
    type: 'dharma-ratham',
    landmark: 'Nandakam Rest House, Outer Ring Road, Tirumala',
    coordinates: { lat: 13.6788, lng: 79.3522 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2cb8ab863e4ed:0x2b55873fe2e1d836&hl=en'
  },
  {
    id: 'vengamamba-stop',
    order: 15,
    name: 'Free bus stop',
    subtitle: 'Near Vengamamba Annaprasadam',
    type: 'dharma-ratham',
    landmark: 'Tarigonda Vengamamba Annaprasadam Complex, Tirumala',
    coordinates: { lat: 13.6864866, lng: 79.350041 },
    navigationUrl: 'https://www.google.com/maps/place/Matrusri+Vakulamatha+Circle+-+Tirumala/@13.6864866,79.350041,21z/data=!4m14!1m7!3m6!1s0x3bb2b563b682d009:0x36fb7a77cbe52d8f!2sFree+Bus+Stop!8m2!3d13.6806037!4d79.3505627!16s%2Fg%2F1tmg9wpp!3m5!1s0x3bb2cb00271a1e71:0xc60ebb1c030b021b!8m2!3d13.6864866!4d79.350041!16s%2Fg%2F11vxjgnk9n?hl=en'
  },
  {
    id: 'varaha-swamy-stop',
    order: 16,
    name: 'Free bus stop',
    subtitle: 'Near Varaha Swamy Temple',
    type: 'dharma-ratham',
    landmark: 'North Bank of Srivari Pushkarini, Varaha Swamy Temple, Tirumala',
    coordinates: { lat: 13.6806037, lng: 79.3505627 },
    navigationUrl: 'https://www.google.com/maps/place/Free+Bus+Stop/@13.6806037,79.3505627,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb2b563b682d009:0x36fb7a77cbe52d8f!8m2!3d13.6806037!4d79.3505627!16s%2Fg%2F1tmg9wpp?hl=en'
  },
  {
    id: 'sv-museum-stop',
    order: 17,
    name: 'Free bus stop',
    subtitle: 'Near SV Museum',
    type: 'dharma-ratham',
    landmark: 'Sri Venkateswara Museum Complex, Tirumala',
    coordinates: { lat: 13.6852, lng: 79.3491 },
    navigationUrl: 'https://www.google.com/maps?ftid=0x3bb2cb168d7cb8a1:0x8f3ab790be7a4880&hl=en'
  }
];

export const BUS_HELPLINE = {
  phone: '155257',
  phoneFormatted: '155257',
  title: 'TTD Call Centre',
  subtitle: 'Toll-free · 24/7 · tap to call'
};

export const BUS_DISCLAIMER = 'Locations: © OpenStreetMap contributors · TTD. Timings can change on festival days.';

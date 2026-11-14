'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ClipboardCheck, Check, 
  ChevronRight, HelpCircle, ChevronDown, ChevronUp, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, ShieldAlert, Phone, AlertTriangle, Bell, Info,
  Navigation, Compass, Ticket,
  LayoutGrid, SquareParking, Bus, BriefcaseMedical
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS } from '@/content/knowledge';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS: Record<string, Record<string, string>> = {
  en: {
    headerTitle: 'Pilgrim Essentials',
    searchTitle: 'What are you looking for?',
    searchPlaceholder: 'Search lockers, food, rooms, tonsure...',
    todaysNotice: "Today's Notice",
    allFacilitiesTitle: 'All facilities',
    readinessTitle: 'Pre-Darshan Readiness',
    hideChecklist: 'Hide Checklist',
    searchResults: 'Search Results',
    noFacilitiesFound: 'No facilities found matching',
    trySearching: 'Try searching for "Phone", "Locker", "Food", "Room", or "Hair"',
    viewDetails: 'View Details →',
    whatDoYouNeed: 'What do you need right now?',
    instantGuidance: 'Instant guidance before entering the temple',
    darshanEntryTitle: 'Darshan Entry Points',
    darshanEntrySub: '15 Active Gates · VQC-1, VQC-2, ₹300 SED, NRI, Seniors & Rush Lines with Google Maps directions.',
    findGates: 'Find your gate & directions →',
    secureBelongingsTitle: 'Secure Belongings & Free Lockers',
    secureBelongingsSub: 'Deposit mobile phones, backpacks & shoes safely before entering queue scanners. 100% free with exit pickup.',
    findLocker: 'Find a locker →',
    freeMealsTitle: 'Free Meals',
    freeMealsSub: 'Annaprasadam Complex',
    findMeals: 'Find meal locations →',
    hairOfferingTitle: 'Hair Offering',
    hairOfferingSub: 'Kalyana Katta 24/7',
    findHair: 'Find Kalyanakatta →',
    accommodationTitle: 'Accommodation',
    accommodationSub: 'PAC Halls & Rooms',
    findRooms: 'Find rooms & PAC →',
    shoppingTitle: 'Official Shopping',
    shoppingSub: 'TTD Books & Laddus',
    viewStores: 'View stores →',
    supportEmergency: 'Support & Emergency',
    helpdeskTitle: 'TTD Helpdesk',
    helpdeskSub: 'Official 24/7 Pilgrim Enquiry',
    callHelpdesk: 'Call 155257 →',
    emergencyTitle: 'Emergency Help',
    emergencySub: 'Police & Medical Services',
    callEmergency: 'Call 108 →',
    faqTitle: 'Frequently Asked Questions'
  },
  te: {
    headerTitle: 'యాత్రా అవసరాలు',
    searchTitle: 'మీరు దేనికోసం వెతుకుతున్నారు?',
    searchPlaceholder: 'లాకర్లు, అన్నప్రసాదం, గదులు, కళ్యాణకట్ట శోధించండి...',
    todaysNotice: 'నేటి ముఖ్యాంశం',
    allFacilitiesTitle: 'అన్ని సదుపాయాలు',
    readinessTitle: 'దర్శన సూచిక సరిచూసుకోండి',
    hideChecklist: 'జాబితా దాచు',
    searchResults: 'శోధన ఫలితాలు',
    noFacilitiesFound: 'సరిపోలే సదుపాయాలు లభించలేదు:',
    trySearching: '"ఫోన్", "లాకర్", "ఆహారం", "గది" వంటి పదాలతో శోధించండి',
    viewDetails: 'వివరాలు చూడండి →',
    whatDoYouNeed: 'మీకు ఇప్పుడు ఏమి కావాలో ఎంచుకోండి',
    instantGuidance: 'ఆలయంలోనికి వెళ్లేముందు అత్యవసర సమాచారం',
    darshanEntryTitle: 'దర్శన ప్రవేశ ద్వారాలు',
    darshanEntrySub: '15 ప్రవేశ గేట్లు · VQC-1, VQC-2, ₹300, ఎన్నారై, వృద్ధులు మరియు రద్దీ లైన్లు (గూగుల్ మ్యాప్స్ దారులు).',
    findGates: 'మీ గేట్ & దారి చూడండి →',
    secureBelongingsTitle: 'వస్తువుల భద్రత & ఉచిత లాకర్లు',
    secureBelongingsSub: 'క్యూ కాంప్లెక్స్ వెళ్లేముందు ఫోన్లు, లగేజీ, చెప్పులు భద్రపరచండి. 100% ఉచిత సర్వీస్.',
    findLocker: 'లాకర్ కేంద్రాలు →',
    freeMealsTitle: 'ఉచిత అన్నప్రసాదం',
    freeMealsSub: 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాద భవనం',
    findMeals: 'అన్నప్రసాదం వివరాలు →',
    hairOfferingTitle: 'తలనీలాలు సమర్పణ',
    hairOfferingSub: 'కళ్యాణకట్ట (24/7 ఉచిత సేవ)',
    findHair: 'కళ్యాణకట్ట వివరాలు →',
    accommodationTitle: 'వసతి & గదులు',
    accommodationSub: 'పిఎసి హాల్స్ మరియు కాటేజీలు',
    findRooms: 'వసతి కేంద్రాలు →',
    shoppingTitle: 'అధికారిక షాపింగ్',
    shoppingSub: 'టిటిడి పుస్తకాలు మరియు లడ్డూ కౌంటర్లు',
    viewStores: 'అంగళ్ళు చూడండి →',
    supportEmergency: 'సహాయం & అత్యవసరం',
    helpdeskTitle: 'టిటిడి హెల్ప్‌డెస్క్',
    helpdeskSub: '24/7 భక్తుల విచారణ కేంద్రం',
    callHelpdesk: 'కాల్ చేయండి 155257 →',
    emergencyTitle: 'అత్యవసర సహాయం',
    emergencySub: 'పోలీస్ & వైద్యాధికారులు',
    callEmergency: 'కాల్ చేయండి 108 →',
    faqTitle: 'తరచూ అడిగే ప్రశ్నలు'
  },
  hi: {
    headerTitle: 'तीर्थयात्री आवश्यकताएं',
    searchTitle: 'आप क्या खोज रहे हैं?',
    searchPlaceholder: 'लॉकर, भोजन, कमरे, मुंडन खोजें...',
    todaysNotice: 'आज का नोटिस',
    allFacilitiesTitle: 'सभी सुविधाएं',
    readinessTitle: 'दर्शन तैयारी चेकलिस्ट',
    hideChecklist: 'सूची छिपाएं',
    searchResults: 'खोज परिणाम',
    noFacilitiesFound: 'कोई सुविधा नहीं मिली:',
    trySearching: '"फोन", "लॉकर", "भोजन", "कमरा" खोज कर देखें',
    viewDetails: 'विवरण देखें →',
    whatDoYouNeed: 'आपको अभी क्या चाहिए?',
    instantGuidance: 'मंदिर में प्रवेश करने से पहले त्वरित मार्गदर्शन',
    darshanEntryTitle: 'दर्शन प्रवेश द्वार',
    darshanEntrySub: '15 प्रवेश द्वार · VQC-1, VQC-2, ₹300, एनआरआई, वरिष्ठ नागरिक व रश लाइनें (गूगल मैप्स दिशा निर्देश)।',
    findGates: 'गेट और दिशा देखें →',
    secureBelongingsTitle: 'सामान सुरक्षा और मुफ्त लॉकर',
    secureBelongingsSub: 'क्यू कॉम्प्लेक्स में प्रवेश से पहले फोन, बैग और जूते सुरक्षित जमा करें। 100% मुफ्त।',
    findLocker: 'लॉकर खोजें →',
    freeMealsTitle: 'मुफ्त भोजन',
    freeMealsSub: 'अन्नप्रसादम कॉम्प्लेक्स',
    findMeals: 'भोजन स्थल खोजें →',
    hairOfferingTitle: 'मुंडन सेवा',
    hairOfferingSub: 'कल्याण कट्टा 24/7',
    findHair: 'कल्याण कट्टा खोजें →',
    accommodationTitle: 'आवास और कमरे',
    accommodationSub: 'पीएसी हॉल और कमरे',
    findRooms: 'कमरे और पीएसी खोजें →',
    shoppingTitle: 'आधिकारिक खरीदारी',
    shoppingSub: 'टीटीडी पुस्तकें और लड्डू काउंटर',
    viewStores: 'दुकानें देखें →',
    supportEmergency: 'सहायता और आपातकालीन',
    helpdeskTitle: 'टीटीडी हेल्पडेस्क',
    helpdeskSub: 'आधिकारिक 24/7 पूछताछ',
    callHelpdesk: 'कॉल करें 155257 →',
    emergencyTitle: 'आपातकालीन सहायता',
    emergencySub: 'पुलिस और चिकित्सा सेवाएं',
    callEmergency: 'कॉल करें 108 →',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न'
  },
  ta: {
    headerTitle: 'பயணத் தேவைகள்',
    searchTitle: 'நீங்கள் எதைத் தேடுகிறீர்கள்?',
    searchPlaceholder: 'லாக்கர், உணவு, அறைகள், மொட்டை தேடுக...',
    todaysNotice: 'இன்றைய அறிவிப்பு',
    allFacilitiesTitle: 'அனைத்து வசதிகள்',
    readinessTitle: 'தரிசன தயாரிப்பு பட்டியல்',
    hideChecklist: 'பட்டியலை மறைக்க',
    searchResults: 'தேடல் முடிவுகள்',
    noFacilitiesFound: 'பொருந்தும் வசதிகள் இல்லை:',
    trySearching: '"போன்", "லாக்கர்", "உணவு", "அறை" எனத் தேடவும்',
    viewDetails: 'விவரங்களை காண்க →',
    whatDoYouNeed: 'உங்களுக்கு இப்போது என்ன தேவை?',
    instantGuidance: 'கோவிலுக்குள் நுழைவதற்கு முன் உடனடி வழிகாட்டுதல்',
    darshanEntryTitle: 'தரிசன நுழைவு வாயில்கள்',
    darshanEntrySub: '15 நுழைவு வாயில்கள் · VQC-1, VQC-2, ₹300, என்ஆர்ஐ, முதியோர் மற்றும் நெரிசல் வரிசைகள்.',
    findGates: 'நுழைவு வாயிலைக் காண்க →',
    secureBelongingsTitle: 'பொருட்கள் பாதுகாப்பு & இலவச லாக்கர்கள்',
    secureBelongingsSub: 'க்யூவில் நுழைவதற்கு முன் போன், பேக் மற்றும் காலணிகளை பாதுகாப்பாக வைக்கவும். 100% இலவசம்.',
    findLocker: 'லாக்கரை காண்க →',
    freeMealsTitle: 'இலவச உணவு',
    freeMealsSub: 'அன்னப்ரசாதம் மையம்',
    findMeals: 'உணவு இடங்கள் →',
    hairOfferingTitle: 'முடி காணிக்கை',
    hairOfferingSub: 'கல்யாண கட்டா 24/7',
    findHair: 'கல்யாண கட்டா காண்க →',
    accommodationTitle: 'தங்கும் இடம்',
    accommodationSub: 'பிஏசி ஹால் & அறைகள்',
    findRooms: 'அறைகள் காண்க →',
    shoppingTitle: 'அதிகாரப்பூர்வ ஷாப்பிங்',
    shoppingSub: 'டிடிடி புத்தகங்கள் & லட்டு',
    viewStores: 'கடைகளை காண்க →',
    supportEmergency: 'உதவி & அவசரம்',
    helpdeskTitle: 'டிடிடி உதவி மையம்',
    helpdeskSub: '24/7 பக்தர்கள் உதவி மையம்',
    callHelpdesk: 'அழைக்க 155257 →',
    emergencyTitle: 'அவசர உதவி',
    emergencySub: 'போலீஸ் & மருத்துவ சேவைகள்',
    callEmergency: 'அழைக்க 108 →',
    faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள்'
  },
  kn: {
    headerTitle: 'ಯಾತ್ರಿಕರ ಅಗತ್ಯಗಳು',
    searchTitle: 'ನೀವು ಏನನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಿ?',
    searchPlaceholder: 'ಲಾಕರ್‌ಗಳು, ಊಟ, ಕೊಠಡಿಗಳು, ಕಲ್ಯಾಣಕಟ್ಟ ಹುಡುಕಿ...',
    todaysNotice: 'ಇಂದಿನ ಪ್ರಮುಖ ಸೂಚನೆ',
    allFacilitiesTitle: 'ಎಲ್ಲಾ ಸೌಲಭ್ಯಗಳು',
    readinessTitle: 'ದರ್ಶನ ಪೂರ್ವ ಸಿದ್ಧತೆ ಚೆಕ್‌ಲಿಸ್ಟ್',
    hideChecklist: 'ಪಟ್ಟಿ ಮರೆಮಾಡಿ',
    searchResults: 'ಹುಡುಕಾಟದ ಫಲಿತಾಂಶಗಳು',
    noFacilitiesFound: 'ಹೊಂದಿಕೆಯಾಗುವ ಸೌಲಭ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ:',
    trySearching: '"ಫೋನ್", "ಲಾಕರ್", "ಊಟ", "ಕೊಠಡಿ", "ಕಲ್ಯಾಣಕಟ್ಟ" ಎಂದು ಹುಡುಕಿ',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ →',
    whatDoYouNeed: 'ನಿಮಗೆ ಈಗ ಏನು ಬೇಕು?',
    instantGuidance: 'ದೇವಸ್ಥಾನ ಪ್ರವೇಶಿಸುವ ಮುನ್ನ ತಕ್ಷಣದ ಮಾರ್ಗದರ್ಶನ',
    darshanEntryTitle: 'ದರ್ಶನ ಪ್ರವೇಶ ದ್ವಾರಗಳು',
    darshanEntrySub: '15 ಸಕ್ರಿಯ ದ್ವಾರಗಳು · VQC-1, VQC-2, ₹300 SED, ಅನಿವಾಸಿ, ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ರಶ್ ಲೈನ್‌ಗಳು (ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಮಾರ್ಗಗಳು).',
    findGates: 'ನಿಮ್ಮ ಗೇಟ್ & ಮಾರ್ಗ ಹುಡುಕಿ →',
    secureBelongingsTitle: 'ವಸ್ತುಗಳ ರಕ್ಷಣೆ & ಉಚಿತ ಲಾಕರ್‌ಗಳು',
    secureBelongingsSub: 'ಕ್ಯೂ ಸ್ಕ್ಯಾನರ್‌ಗೆ ಪ್ರವೇಶಿಸುವ ಮೊದಲು ಮೊಬೈಲ್, ಬ್ಯಾಗ್ ಮತ್ತು ಪಾದರಕ್ಷೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಿ. 100% ಉಚಿತ ಸೇವೆ.',
    findLocker: 'ಲಾಕರ್ ಕೇಂದ್ರಗಳು →',
    freeMealsTitle: 'ಉಚಿತ ಅನ್ನಪ್ರಸಾದ',
    freeMealsSub: 'ಮಾತೃಶ್ರೀ ತರಿಗೊಂಡ ವೆಂಗಮಾಂಬ ಅನ್ನಪ್ರಸಾದ ಸಂಕೀರ್ಣ',
    findMeals: 'ಅನ್ನಪ್ರಸಾದ ವಿವರಗಳು →',
    hairOfferingTitle: 'ಮುಡಿ ಸಮರ್ಪಣೆ',
    hairOfferingSub: 'ಕಲ್ಯಾಣಕಟ್ಟ (24/7 ಉಚಿತ ಸೇವೆ)',
    findHair: 'ಕಲ್ಯಾಣಕಟ್ಟ ವಿವರಗಳು →',
    accommodationTitle: 'ವಸತಿ & ಕೊಠಡಿಗಳು',
    accommodationSub: 'ಪಿಎಸಿ ಹಾಲ್‌ಗಳು ಮತ್ತು ಕೊಠಡಿಗಳು',
    findRooms: 'ಕೊಠಡಿಗಳು & ಪಿಎಸಿ ಹುಡುಕಿ →',
    shoppingTitle: 'ಅಧಿಕೃತ ಶಾಪಿಂಗ್',
    shoppingSub: 'ಟಿಟಿಡಿ ಪುಸ್ತಕಗಳು ಮತ್ತು ಲಡ್ಡು ಕೌಂಟರ್‌ಗಳು',
    viewStores: 'ಅಂಗಡಿಗಳನ್ನು ನೋಡಿ →',
    supportEmergency: 'ಸಹಾಯ & ತುರ್ತು ಸೇವೆ',
    helpdeskTitle: 'ಟಿಟಿಡಿ ಸಹಾಯವಾಣಿ',
    helpdeskSub: 'ಅಧಿಕೃತ 24/7 ಭಕ್ತರ ವಿಚಾರಣಾ ಕೇಂದ್ರ',
    callHelpdesk: 'ಕರೆ ಮಾಡಿ 155257 →',
    emergencyTitle: 'ತುರ್ತು ಸಹಾಯ',
    emergencySub: 'ಪೊಲೀಸ್ & ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು',
    callEmergency: 'ಕರೆ ಮಾಡಿ 108 →',
    faqTitle: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು'
  }
};

interface FacilityTileItem {
  id: string;
  name: { en: string; te: string; hi: string; ta: string; kn?: string };
  count: number;
  bg: string;
  color: string;
  border?: string;
  icon: any;
  action: { type: 'route'; path: string } | { type: 'filter'; query: string };
}

const ALL_FACILITIES_TILES: FacilityTileItem[] = [
  {
    id: 'parking',
    name: { en: 'Parking', te: 'పార్కింగ్', hi: 'पार्किंग', ta: 'பார்க்கிங்', kn: 'ಪಾರ್ಕಿಂಗ್' },
    count: 13,
    bg: '#F1F5F9',
    color: '#475569',
    border: '#E2E8F0',
    icon: SquareParking,
    action: { type: 'route', path: '/parking' }
  },
  {
    id: 'free-bus-stations',
    name: { en: 'Free bus & stations', te: 'ఉచిత బస్సు & స్టేషన్లు', hi: 'मुफ्त बस और स्टेशन', ta: 'இலவச பஸ் & நிலையங்கள்', kn: 'ಉಚಿತ ಬಸ್ & ನಿಲ್ದಾಣಗಳು' },
    count: 17,
    bg: '#FFEDD5',
    color: '#C2410C',
    border: '#FED7AA',
    icon: Bus,
    action: { type: 'route', path: '/free-bus' }
  },
  {
    id: 'medical',
    name: { en: 'Medical', te: 'వైద్య సేవలు', hi: 'चिकित्सा', ta: 'மருத்துவம்', kn: 'ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು' },
    count: 3,
    bg: '#FFE4E6',
    color: '#E11D48',
    border: '#FECDD3',
    icon: BriefcaseMedical,
    action: { type: 'route', path: '/medical' }
  },
  {
    id: 'free-pac',
    name: { en: 'Free PACs', te: 'ఉచిత పిఎసి', hi: 'मुफ्त पीएसी', ta: 'இலவச பிஏசி', kn: 'ಉಚಿತ ಪಿಎಸಿ' },
    count: 5,
    bg: '#ECFDF5',
    color: '#047857',
    border: '#A7F3D0',
    icon: Bed,
    action: { type: 'route', path: '/rooms?category=free_pac' }
  },
  {
    id: 'room-allotment',
    name: { en: 'Room Allotment', te: 'గదుల కేటాయింపు', hi: 'कमरा आवंटन', ta: 'அறை ஒதுக்கீடு', kn: 'ಕೊಠಡಿ ಹಂಚಿಕೆ' },
    count: 19,
    bg: '#FFFBEB',
    color: '#B45309',
    border: '#FDE68A',
    icon: Ticket,
    action: { type: 'route', path: '/rooms?category=allotment_counter' }
  }
];

export default function PilgrimEssentialsPage() {
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS.en;
  const { status } = useRealtimeStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);

  const noticeText = status?.notice || 'Ghat Road traffic is normal. Luggage Locker Complexes open 24/7 at PAC-1 to PAC-5.';

  const noticeTimeStr = useMemo(() => {
    if (!status?.lastUpdated) return 'Updated 1h ago';
    const diffMins = Math.max(1, Math.round((Date.now() - new Date(status.lastUpdated).getTime()) / 60000));
    if (diffMins < 60) return `Updated ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Updated ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }, [status?.lastUpdated]);

  // Initialize client states
  useEffect(() => {
    setIsMounted(true);
    
    // Load checklist state from localStorage
    const savedState: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      const val = localStorage.getItem(item.localStorageKey);
      savedState[item.id] = val === 'true';
    });
    setChecklistState(savedState);
  }, []);

  // Update checklist item
  const handleToggleCheck = (itemId: string, storageKey: string) => {
    const newState = !checklistState[itemId];
    setChecklistState(prev => ({ ...prev, [itemId]: newState }));
    localStorage.setItem(storageKey, String(newState));
  };

  // Calculate checklist progress
  const checklistStats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = Object.values(checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, pct };
  }, [checklistState]);

  // Filter items by search query & natural language aliases
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    
    return KNOWLEDGE_ITEMS.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const aliasMatch = item.searchAliases?.some(alias => alias.includes(query) || query.includes(alias));
      return nameMatch || descMatch || aliasMatch;
    });
  }, [searchQuery]);

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS.slice(0, 4);
    const query = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter(faq => {
      const qMatch = faq.question.toLowerCase().includes(query);
      const aMatch = faq.answer.toLowerCase().includes(query);
      const aliasMatch = faq.searchAliases?.some(alias => alias.includes(query));
      return qMatch || aMatch || aliasMatch;
    });
  }, [searchQuery]);

  if (!isMounted) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #0F5132',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleCardClick = (id: string) => {
    if (id === 'darshan-entry-points') {
      router.push('/darshan/entry-points');
      return;
    }
    if (id === 'free-bus' || id === 'free-bus-stations') {
      router.push('/free-bus');
      return;
    }
    if (id === 'parking') {
      router.push('/parking');
      return;
    }
    if (id === 'medical') {
      router.push('/medical');
      return;
    }
    if (id === 'accommodation') {
      router.push('/rooms');
      return;
    }
    if (id === 'free-pac') {
      router.push('/rooms?category=free_pac');
      return;
    }
    if (id === 'room-allotment') {
      router.push('/rooms?category=allotment_counter');
      return;
    }
    router.push(`/essentials/${id}`);
  };

  const handleFacilityClick = (facility: FacilityTileItem) => {
    if (facility.action.type === 'route') {
      router.push(facility.action.path);
    } else {
      setSearchQuery(facility.action.query);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerTitleContainer}>
          <h1 className={styles.headerTitle}>
            {t.headerTitle}
          </h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/alerts" aria-label="Notifications" className={styles.iconButton}>
            <Bell size={18} />
          </Link>
          <button 
            className={styles.iconButton} 
            onClick={() => setShowChecklist(p => !p)} 
            aria-label="Checklist"
          >
            <ClipboardCheck size={18} color={showChecklist ? '#0F5132' : '#0F172A'} />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className={styles.scrollArea} style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 20px))', gap: '16px' }}>
        
        {/* Search Bar ("What are you looking for?") */}
        <div className={styles.searchContainer}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            {t.searchTitle}
          </div>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748B" />
            <input 
              type="text"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                aria-label="Clear search"
              >
                <X size={16} color="#64748B" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Emergency & Helpdesks Strip (Tap-to-Call) */}
        {!searchQuery && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '8px',
            marginTop: '-4px'
          }}>
            <a
              href="tel:155257"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
                border: '1px solid #BBF7D0',
                borderRadius: '14px',
                padding: '9px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 1px 3px rgba(15, 81, 50, 0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={14} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {lang === 'te' ? 'టిటిడి హెల్ప్‌లైన్' : 'TTD Enquiry'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '1px', lineHeight: 1.2 }}>
                  155257
                </div>
              </div>
            </a>

            <a
              href="tel:108"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 100%)',
                border: '1px solid #FECACA',
                borderRadius: '14px',
                padding: '9px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 1px 3px rgba(220, 38, 38, 0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldAlert size={15} strokeWidth={2.4} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {lang === 'te' ? 'వైద్య / అత్యవసరం' : 'Medical / Emergency'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', marginTop: '1px', lineHeight: 1.2 }}>
                  108
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Today's Notice (Clean Amber Container) */}
        {!dismissedNotice && !searchQuery && noticeText && (
          <motion.div 
            className={styles.noticeBanner}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FEF3C7',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.noticeHeader}>
                <span className={styles.pulseDot} />
                <span>{t.todaysNotice}</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: '#FDE68A', color: '#78350F', marginLeft: 'auto' }}>
                  LIVE
                </span>
              </div>
              <p className={styles.noticeContent}>
                {noticeText}
              </p>
              <div className={styles.noticeTime}>{noticeTimeStr}</div>
            </div>
            <button 
              onClick={() => setDismissedNotice(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex' }}
              aria-label="Dismiss notice"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Stateful Darshan Checklist Drawer */}
        <AnimatePresence>
          {showChecklist && (
            <motion.section 
              className={styles.checklistCard}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.checklistHeader}>
                <h3 className={styles.checklistTitle}>
                  <ClipboardCheck size={18} color="#0F5132" />
                  {t.readinessTitle}
                </h3>
                <span className={styles.checklistProgress}>{checklistStats.checked} / {checklistStats.total} ({checklistStats.pct}%)</span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${checklistStats.pct}%` }} />
              </div>

              <div className={styles.checklistItems}>
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checklistState[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={styles.checkItem}
                      onClick={() => handleToggleCheck(item.id, item.localStorageKey)}
                    >
                      <div className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                        {isChecked && <Check size={14} color="#FFFFFF" />}
                      </div>
                      <span className={`${styles.checkItemText} ${isChecked ? styles.checkItemChecked : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className={styles.minimizeBtn} onClick={() => setShowChecklist(false)}>
                {t.hideChecklist}
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SEARCH RESULTS VIEW (IF USER IS SEARCHING) */}
        {searchResults ? (
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '17px' }}>
                {t.searchResults} ({searchResults.length})
              </h2>
            </div>
            {searchResults.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                <HelpCircle size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>{t.noFacilitiesFound} "{searchQuery}"</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>{t.trySearching}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.utilityDecisionCard}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <div className={styles.utilityDecisionTop}>
                      <h4 className={styles.utilityDecisionName}>{item.name}</h4>
                      <span className={styles.utilityDecisionBadge}>{item.status}</span>
                    </div>
                    <p className={styles.utilityDecisionLoc}>{item.shortDescription}</p>
                    <div className={styles.utilityDecisionActionRow}>
                      <span className={styles.secondaryCardAction}>
                        {t.viewDetails}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ALL FACILITIES (DARK THEME JEWEL GRID MATCHING SCREENSHOT 1) */}
            <section className={styles.allFacilitiesContainer}>
              <div className={styles.allFacilitiesHeader}>
                <div className={styles.allFacilitiesHeaderIcon}>
                  <LayoutGrid size={22} />
                </div>
                <h2 className={styles.allFacilitiesTitle}>
                  {t.allFacilitiesTitle}
                </h2>
              </div>
              <div className={styles.allFacilitiesGrid}>
                {ALL_FACILITIES_TILES.map((fac) => {
                  const IconComp = fac.icon;
                  const label = fac.name[lang as 'en' | 'te' | 'hi' | 'ta' | 'kn'] || fac.name.en;
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      className={styles.facilityItem}
                      onClick={() => handleFacilityClick(fac)}
                      aria-label={`${label} (${fac.count})`}
                    >
                      <div 
                        className={styles.facilityTile} 
                        style={{ 
                          backgroundColor: fac.bg, 
                          border: `1px solid ${fac.border || '#E2E8F0'}` 
                        }}
                      >
                        <span className={styles.facilityBadge}>{fac.count}</span>
                        <IconComp size={25} color={fac.color} strokeWidth={2.2} />
                      </div>
                      <span className={styles.facilityLabel}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* WHAT DO YOU NEED RIGHT NOW? (1 PRIMARY FEATURED + COMPACT SECONDARY CARDS) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h2 className={styles.sectionTitle} style={{ fontSize: '18px', margin: 0 }}>
                  {t.whatDoYouNeed}
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                  {t.instantGuidance}
                </p>
              </div>

            {/* FEATURED: DARSHAN ENTRY POINTS (ALL 15 GATES) */}
            <div 
              className={styles.featuredServiceCard}
              style={{
                border: '1.5px solid #BBF7D0',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
                cursor: 'pointer'
              }}
              onClick={() => router.push('/darshan/entry-points')}
            >
              <div 
                className={styles.featuredBanner}
                style={{ 
                  backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.7) 100%), url('/images/places/tirumala_temple_night.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 40%',
                  height: '136px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '12px 14px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#FFFFFF',
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}>
                  <Navigation size={13} color="#4ADE80" />
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2px' }}>
                    Tirumala Hill Entry Gates
                  </span>
                </div>
                <div 
                  className={styles.featuredBadge} 
                  style={{ 
                    position: 'static',
                    background: 'rgba(15, 23, 42, 0.72)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)'
                  }}
                >
                  <span className={styles.pulseDot} />
                  <span>15 Gates Active</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div>
                  <h3 className={styles.featuredTitle}>{t.darshanEntryTitle}</h3>
                  <p className={styles.featuredSub}>
                    {t.darshanEntrySub}
                  </p>
                </div>
                <button 
                  className={styles.featuredActionBtn}
                  style={{ background: '#0F5132', color: '#FFFFFF' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/darshan/entry-points');
                  }}
                >
                  <Compass size={15} />
                  <span>{t.findGates}</span>
                </button>
              </div>
            </div>

            {/* PRIMARY FEATURED CARD: SECURE BELONGINGS */}
            <div 
              className={styles.featuredServiceCard}
              onClick={() => handleCardClick('secure-belongings')}
            >
              <div 
                className={styles.featuredBanner}
                style={{ backgroundImage: `url('/images/places/img_2_IMG_6992_cq6gls.jpg')` }}
              >
                <div className={styles.featuredBadge}>
                  <span className={styles.pulseDot} />
                  <span>6 Locations Open · 24/7</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div>
                  <h3 className={styles.featuredTitle}>{t.secureBelongingsTitle}</h3>
                  <p className={styles.featuredSub}>
                    {t.secureBelongingsSub}
                  </p>
                </div>
                <button className={styles.featuredActionBtn}>
                  <Lock size={15} />
                  <span>{t.findLocker}</span>
                </button>
              </div>
            </div>

            {/* COMPACT 2x2 SECONDARY CARDS WITH IMAGES */}
            <div className={styles.secondaryCategoryGrid}>
              {/* 1. Food */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('free-meals')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/images/places/img_3_Annaprasadam-4-copy_lyo86v.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.freeMealsTitle}</h4>
                    <p className={styles.secondarySub}>{t.freeMealsSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findMeals}</span>
                  </div>
                </div>
              </div>

              {/* 2. Hair Offering */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('hair-offering')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/images/places/img_4_painted-sign-board-of-kalyanakatta-balaji-temple-t.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.hairOfferingTitle}</h4>
                    <p className={styles.secondarySub}>{t.hairOfferingSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findHair}</span>
                  </div>
                </div>
              </div>

              {/* 3. Accommodation */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('accommodation')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/images/places/img_5_maxresdefault_fwmwke.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.accommodationTitle}</h4>
                    <p className={styles.secondarySub}>{t.accommodationSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.findRooms}</span>
                  </div>
                </div>
              </div>

              {/* 4. Official Shopping */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('shopping')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/assets/leisure/tirupati-market.png')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>{t.shoppingTitle}</h4>
                    <p className={styles.secondarySub}>{t.shoppingSub}</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>{t.viewStores}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT & EMERGENCY SECTION (CLEAN CARDS, SUBTLE RED) */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                {t.supportEmergency}
              </h3>
              <div className={styles.supportEmergencyGrid}>
                {/* Official Shopping / Helpdesk */}
                <div 
                  className={styles.supportCard}
                  onClick={() => window.location.href = 'tel:155257'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="#0F5132" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{t.helpdeskTitle}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                    {t.helpdeskSub}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132' }}>
                    {t.callHelpdesk}
                  </span>
                </div>

                {/* Emergency Assistance */}
                <div 
                  className={styles.emergencySubtleCard}
                  onClick={() => window.location.href = 'tel:108'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} color="#DC2626" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#991B1B' }}>{t.emergencyTitle}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#991B1B', margin: 0 }}>
                    {t.emergencySub}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
                    {t.callEmergency}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

        {/* FREQUENTLY ASKED QUESTIONS (CLEAN PROGRESSIVE DISCLOSURE) */}
        <section className={styles.faqSection} style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HelpCircle size={17} color="#475569" />
            <h2 className={styles.sectionTitle} style={{ fontSize: '16px' }}>{t.faqTitle}</h2>
          </div>
          
          <div className={styles.faqList}>
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <div 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span style={{ fontSize: '13.5px' }}>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#64748B" />}
                  </div>
                  {isExpanded && (
                    <div className={styles.faqAnswer} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

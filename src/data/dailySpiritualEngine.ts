export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
  category: string;
}

export interface DynamicSeva {
  id: string;
  label: string;
  iconName: 'heart' | 'droplets' | 'users' | 'shield' | 'check-circle' | 'sparkles' | 'footprints' | 'sun';
  category: 'preparation' | 'queue' | 'gratitude' | 'community' | 'safety';
}

export interface TodaysCompanionData {
  priorityLevel: number; // 1: Festival, 2: Temple Day, 3: Weekday Theme, 4: General Reflection
  priorityReason: string;
  priorityReasonTe?: string;
  priorityReasonKn?: string;
  priorityReasonHi?: string;
  priorityReasonTa?: string;
  theme: string;
  themeTe?: string;
  themeKn?: string;
  themeHi?: string;
  themeTa?: string;
  headline: string;
  divineMoment: {
    quote: string;
    quoteTe?: string;
    quoteKn?: string;
    quoteHi?: string;
    quoteTa?: string;
    author: string;
    authorTe?: string;
    authorKn?: string;
    authorHi?: string;
    authorTa?: string;
    duration: string;
    durationTe?: string;
    durationKn?: string;
    durationHi?: string;
    durationTa?: string;
    reflectionTip: string;
  };
  significance: {
    title: string;
    category: 'Temple' | 'History' | 'Architecture' | 'Festivals' | 'Rituals' | 'Prasadam' | 'Annamayya' | 'TTD';
    description: string;
  };
  sevas: DynamicSeva[];
  audio: AudioTrack;
  journeyMessage: {
    stage: 'before' | 'queue' | 'after' | 'general';
    title: string;
    actionableAdvice: string;
  };
  moodPrompt: {
    question: string;
    options: { id: string; iconName: string; label: string; feedback: string }[];
  };
  habitPrompt: {
    text: string;
  };
}

export const AUDIO_CATALOG: AudioTrack[] = [
  { id: 'suprabhatam', title: 'Sri Venkateswara Suprabhatam', artist: 'Traditional Chanting', duration: '30 sec', category: 'Morning Wakeup' },
  { id: 'govinda-namalu', title: 'Govinda Namalu (108 Names)', artist: 'Annamayya Choral', duration: '45 sec', category: 'Devotional Chanting' },
  { id: 'ashtakam', title: 'Venkateswara Ashtakam', artist: 'Traditional Stotram', duration: '35 sec', category: 'Praise & Chanting' },
  { id: 'annamayya', title: 'Nigama Nigamanta (Annamayya Keerthana)', artist: 'Carnatic Vocal', duration: '40 sec', category: 'Annamayya Legend' },
  { id: 'bell-meditation', title: 'Tirumala Temple Bell Chime Meditation', artist: 'Temple Atmosphere', duration: '30 sec', category: 'Peaceful Meditation' },
];

export interface DayThemeEntry {
  theme: string;
  themeTe: string;
  themeKn: string;
  themeHi: string;
  themeTa: string;
  deity: string;
  deityTe: string;
  deityKn: string;
  deityHi: string;
  deityTa: string;
  priorityReason: string;
  priorityReasonTe: string;
  priorityReasonKn: string;
  priorityReasonHi: string;
  priorityReasonTa: string;
  quote: string;
  quoteTe: string;
  quoteKn: string;
  quoteHi: string;
  quoteTa: string;
  author: string;
  authorTe: string;
  authorKn: string;
  authorHi: string;
  authorTa: string;
  triviaCategory: 'Temple' | 'History' | 'Architecture' | 'Festivals' | 'Rituals' | 'Prasadam' | 'Annamayya' | 'TTD';
  triviaTitle: string;
  trivia: string;
}

export const DAY_OF_WEEK_THEMES: Record<number, DayThemeEntry> = {
  0: { // Sunday - Sun / Surya & Sri Hari
    theme: 'Vitality & Divine Radiance',
    themeTe: 'దివ్య తేజస్సు & చైతన్యం',
    themeKn: 'ದಿವ್ಯ ತೇಜಸ್ಸು & ಚೈತನ್ಯ',
    themeHi: 'दिव्य तेज व ऊर्जा',
    themeTa: 'தெய்வீக பிரகாசம் & சக்தி',
    deity: 'Surya Narayana',
    deityTe: 'సూర్యనారాయణ స్వామి',
    deityKn: 'ಸೂರ್ಯನಾರಾಯಣ ಸ್ವಾಮಿ',
    deityHi: 'सूर्यनारायण स्वामी',
    deityTa: 'சூரிய நாராயண சுவாமி',
    priorityReason: 'Surya Sunday',
    priorityReasonTe: 'సూర్యనారాయణ ఆదివారం',
    priorityReasonKn: 'ಸೂರ್ಯನಾರಾಯಣ ಭಾನುವಾರ',
    priorityReasonHi: 'सूर्यनारायण रविवार',
    priorityReasonTa: 'சூரிய நாராயண ஞாயிறு',
    quote: 'Like the morning sun illuminating Swami Pushkarini, true faith dissolves every shadow of doubt.',
    quoteTe: 'స్వామి పుష్కరిణిని వెలిగించే ప్రభాత భానుని వలె, నిష్కల్మషమైన భక్తి మనస్సులోని సందేహాలను పటాపంచలు చేస్తుంది.',
    quoteKn: 'ಸ್ವಾಮಿ ಪುಷ್ಕರಿಣಿಯನ್ನು ಬೆಳಗಿಸುವ ಪ್ರಾತಃ ಸೂರ್ಯನಂತೆ, ಪರಿಶುದ್ಧ ಭಕ್ತಿಯು ಮನಸ್ಸಿನ ಎಲ್ಲಾ ಸಂದೇಹಗಳನ್ನು ನಿವಾರಿಸುತ್ತದೆ.',
    quoteHi: 'स्वामी पुष्करिणी को आलोकित करते प्रातः सूर्य की भांति, सच्ची निष्ठा मन के प्रत्येक संशय को मिटा देती है।',
    quoteTa: 'சுவாமி புஷ்கரிணியை ஒளிரச் செய்யும் விடியற்காலை சூரியனைப் போல, தூய பக்தி மனதின் சந்தேகங்களை அகற்றிவிடும்.',
    author: 'Sri Ramanujacharya Wisdom',
    authorTe: 'శ్రీ రామానుజాచార్యుల దివ్యోక్తి',
    authorKn: 'ಶ್ರೀ ರಾಮಾನುಜಾಚಾರ್ಯರ ಬೋಧನೆ',
    authorHi: 'श्री रामानुजाचार्य सद्विचार',
    authorTa: 'ஸ்ரீ ராமானுஜரின் உபதேசம்',
    triviaCategory: 'Architecture',
    triviaTitle: 'Ananda Nilayam Golden Vimanam',
    trivia: 'The golden tower above the main shrine absorbs the morning sunlight, radiating divine warmth over the Seven Hills.'
  },
  1: { // Monday - Lord Shiva & Sri Kapileswara
    theme: 'Inner Calmness & Sacred Patience',
    themeTe: 'ఆంతరంగిక ప్రశాంతత & పవిత్ర ఓర్పు',
    themeKn: 'ಆಂತರಿಕ ಶಾಂತಿ & ಪವಿತ್ರ ಸಹನೆ',
    themeHi: 'आंतरिक शांति व धैर्य',
    themeTa: 'மன அமைதி & பொறுமை',
    deity: 'Lord Shiva',
    deityTe: 'శ్రీ పరమేశ్వరుడు',
    deityKn: 'ಶ್ರೀ ಪರಮೇಶ್ವರ',
    deityHi: 'भगवान शिव',
    deityTa: 'சிவபெருமான்',
    priorityReason: 'Shiva Monday',
    priorityReasonTe: 'శివుని సోమవారం',
    priorityReasonKn: 'ಶಿವನ ಸೋಮವಾರ',
    priorityReasonHi: 'शिव सोमवार',
    priorityReasonTa: 'சிவ சோமவாரம்',
    quote: 'Silence in queue is not empty waiting; it is the deepest prayer of a tranquil mind.',
    quoteTe: 'క్యూలో మౌనంగా ఉండటం వృథా వేచి ఉండటం కాదు; అది ప్రశాంత మనస్సు చేసే అత్యున్నత ప్రార్థన.',
    quoteKn: 'ಸರತಿ ಸಾಲಿನಲ್ಲಿ ಮೌನವಾಗಿರುವುದು ಕೇವಲ ಕಾಯುವಿಕೆಯಲ್ಲ; ಅದು ಶಾಂತ ಮನಸ್ಸಿನ ಅತ್ಯುನ್ನತ ಪ್ರಾರ್ಥನೆ.',
    quoteHi: 'कतार में मौन रहना व्यर्थ प्रतीक्षा नहीं; यह शांत मन की गहनतम प्रार्थना है।',
    quoteTa: 'வரிசையில் மௌனமாக இருப்பது வீண் காத்திருப்பு அல்ல; அது அமைதியான மனதின் ஆழமான பிரார்த்தனை.',
    author: 'Kapila Maharshi Teaching',
    authorTe: 'కపిల మహర్షి బోధన',
    authorKn: 'ಕಪಿಲ ಮಹರ್ಷಿಗಳ ಬೋಧನೆ',
    authorHi: 'कपिल महर्षि उपदेश',
    authorTa: 'கபில மகரிஷியின் போதனை',
    triviaCategory: 'Temple',
    triviaTitle: 'Kapila Theertham Cave Temple',
    trivia: 'Located at the foot of Tirumala, Kapila Theertham is the only Lord Shiva temple in the entire Tirupati region.'
  },
  2: { // Tuesday - Lord Subrahmanya / Hanuman & Protection
    theme: 'Strength & Fearless Devotion',
    themeTe: 'ఆధ్యాత్మిక బలం & నిర్భయ భక్తి',
    themeKn: 'ಆಧ್ಯಾತ್ಮಿಕ ಬಲ & ನಿರ್ಭಯ ಭಕ್ತಿ',
    themeHi: 'आत्मिक बल व निर्भय भक्ति',
    themeTa: 'ஆத்ம பலம் & அஞ்சா பக்தி',
    deity: 'Hanuman',
    deityTe: 'హనుమంతుడు',
    deityKn: 'ಆಂಜನೇಯ ಸ್ವಾಮಿ',
    deityHi: 'श्री हनुमान',
    deityTa: 'ஸ்ரீ ஆஞ்சநேயர்',
    priorityReason: 'Hanuman Tuesday',
    priorityReasonTe: 'హనుమాన్ మంగళవారం',
    priorityReasonKn: 'ಹನುಮಾನ್ ಮಂಗಳವಾರ',
    priorityReasonHi: 'हनुमान मंगलवार',
    priorityReasonTa: 'அனுமன் செவ்வாய்க்கிழமை',
    quote: 'When you take a step towards the Lord with courage, divine grace protects your entire journey.',
    quoteTe: 'భక్తి విశ్వాసాలతో భగవంతుని వైపు అడుగు వేస్తే, దివ్య కృప మీ సమస్త యాత్రను రక్షిస్తుంది.',
    quoteKn: 'ಧೈರ್ಯ ಮತ್ತು ಭಕ್ತಿಯಿಂದ ಭಗವಂತನತ್ತ ಒಂದು ಹೆಜ್ಜೆ ಇಟ್ಟರೆ, ದೈವಿಕ ಕೃಪೆಯು ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಯಾತ್ರೆಯನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',
    quoteHi: 'जब आप साहस और भक्ति के साथ प्रभु की ओर कदम बढ़ाते हैं, तो ईश्वरीय कृपा आपकी संपूर्ण यात्रा की रक्षा करती है।',
    quoteTa: 'நம்பிக்கையுடன் இறைவனை நோக்கி ஓரடி எடுத்து வைத்தால், தெய்வ அருள் உங்கள் முழுப் பயணத்தையும் பாதுகாக்கும்.',
    author: 'Bedi Anjaneya Tradition',
    authorTe: 'బేడి ఆంజనేయ సంప్రదాయం',
    authorKn: 'ಬೇಡಿ ಆಂಜನೇಯ ಸಂಪ್ರದಾಯ',
    authorHi: 'बेड़ी आंजनेय परंपरा',
    authorTa: 'பேடி ஆஞ்சநேயர் பாரம்பரியம்',
    triviaCategory: 'History',
    triviaTitle: 'Bedi Anjaneya Shrine Legend',
    trivia: 'Bedi Anjaneya stands right opposite the main temple with bound hands to ensure he remains forever protecting Tirumala.'
  },
  3: { // Wednesday - Lord Vishnu / Rama & Truthfulness
    theme: 'Righteous Conduct & Dharma',
    themeTe: 'ధర్మ మార్గం & సదాచారం',
    themeKn: 'ಧರ್ಮ ಮಾರ್ಗ & ಸದಾಚಾರ',
    themeHi: 'धर्माचरण व सत्य',
    themeTa: 'தர்ம நெறி & நன்னடத்தை',
    deity: 'Lord Kodandarama',
    deityTe: 'శ్రీ కోదండరామ స్వామి',
    deityKn: 'ಶ್ರೀ ಕೋದಂಡರಾಮ',
    deityHi: 'श्री कोदंडराम',
    deityTa: 'ஸ்ரீ கோதண்டராமர்',
    priorityReason: 'Rama Wednesday',
    priorityReasonTe: 'శ్రీరామ బుధవారం',
    priorityReasonKn: 'ಶ್ರೀರಾಮ ಬುಧವಾರ',
    priorityReasonHi: 'श्रीराम बुधवार',
    priorityReasonTa: 'ஸ்ரீராமர் புதன்கிழமை',
    quote: 'Walk the path of Truth and kindness; every tired step uphill is recorded as a noble deed.',
    quoteTe: 'సత్యం, దయ గల మార్గంలో నడవండి; కొండపై వేసే ప్రతి అలసిన అడుగు ఒక సత్కార్యంగా నమోదవుతుంది.',
    quoteKn: 'ಸತ್ಯ ಮತ್ತು ಕರುಣೆಯ ಹಾದಿಯಲ್ಲಿ ಸಾಗಿ; ಗಿರಿಯ ಮೇಲೆ ಇಡುವ ಪ್ರತಿಯೊಂದು ದಣಿದ ಹೆಜ್ಜೆಯೂ ಪುಣ್ಯ ಕಾರ್ಯವಾಗುತ್ತದೆ.',
    quoteHi: 'सत्य और करुणा के मार्ग पर चलें; पहाड़ी पर चढ़ते समय उठाया गया हर थका हुआ कदम पुण्य कर्म बन जाता है।',
    quoteTa: 'சத்தியமும் கருணையும் நிறைந்த வழியில் நடங்கள்; மலையேறும் ஒவ்வொரு களைப்பான அடியும் புண்ணியச் செயலாகிறது.',
    author: 'Sri Rama Charitam',
    authorTe: 'శ్రీరామ చరిత్రం',
    authorKn: 'ಶ್ರೀರಾಮ ಚರಿತಂ',
    authorHi: 'श्रीराम चरित',
    authorTa: 'ஸ்ரீராம சரிதம்',
    triviaCategory: 'Rituals',
    triviaTitle: 'Srivari Archana Tradition',
    trivia: 'Exact Vedic rituals established over 1,000 years ago by Saint Ramanuja are strictly followed without fail every morning.'
  },
  4: { // Thursday - Guru & Saint Annamayya / Wisdom
    theme: 'Gratitude & Divine Music',
    themeTe: 'కృతజ్ఞత & దివ్య సంకీర్తన',
    themeKn: 'ಕೃತಜ್ಞತೆ & ದಿವ್ಯ ಸಂಕೀರ್ತನೆ',
    themeHi: 'कृतज्ञता व दिव्य संकीर्तन',
    themeTa: 'நன்றியுணர்வு & திவ்ய கீர்த்தனை',
    deity: 'Guru & Annamayya',
    deityTe: 'గురుదేవులు & అన్నమయ్య',
    deityKn: 'ಗುರು & ಅನ್ನಮಯ್ಯ',
    deityHi: 'गुरु व संत अन्नमय्या',
    deityTa: 'குரு & அன்னமய்யா',
    priorityReason: 'Guru Thursday',
    priorityReasonTe: 'గురు గురువారం',
    priorityReasonKn: 'ಗುರು ಗುರುವಾರ',
    priorityReasonHi: 'गुरुवार साधना',
    priorityReasonTa: 'குரு வியாழக்கிழமை',
    quote: 'He who surrendered his heart at the Lotus Feet of Venkateswara knows no fear and no lack.',
    quoteTe: 'వేంకటేశ్వరుని పాదపద్మాలకు హృదయాన్ని అర్పించిన భక్తునికి ఎలాంటి భయము, లోటూ ఉండదు.',
    quoteKn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರನ ಚರಣ ಕಮಲಗಳಲ್ಲಿ ಮನಸ್ಸನ್ನು ಅರ್ಪಿಸಿದವನಿಗೆ ಯಾವುದೇ ಭಯ ಮತ್ತು ಕೊರತೆಯಿರುವುದಿಲ್ಲ.',
    quoteHi: 'जिसने अपना हृदय भगवान वेंकटेश्वर के चरण कमलों में समर्पित कर दिया, उसे कोई भय और अभाव नहीं रहता।',
    quoteTa: 'வேங்கடேஸ்வரரின் பாத கமலங்களில் மனதை அர்ப்பணித்த பக்தனுக்கு எந்தப் பயமும் குறையும் இல்லை.',
    author: 'Saint Annamayya Sankeertana',
    authorTe: 'తాళ్లపాక అన్నమాచార్య సంకీర్తన',
    authorKn: 'ಸಂತ ಅನ್ನಮಾಚಾರ್ಯರ ಸಂಕೀರ್ತನೆ',
    authorHi: 'संत अन्नमाचार्य संकीर्तन',
    authorTa: 'அன்னமாச்சாரியாரின் சங்கீர்த்தனம்',
    triviaCategory: 'Annamayya',
    triviaTitle: '32,000 Sacred Sankeertanas',
    trivia: 'Saint Annamayya composed 32,000 songs on copper plates dedicated solely to Lord Venkateswara in Tirumala.'
  },
  5: { // Friday - Goddess Lakshmi & Padmavathi / Prosperity & Grace
    theme: 'Divine Grace & Compassion',
    themeTe: 'దివ్య కృప & కరుణామయ హృదయం',
    themeKn: 'ದಿವ್ಯ ಕೃಪೆ & ಕರುಣೆ',
    themeHi: 'दिव्य कृपा व करुणा',
    themeTa: 'தெய்வீக அருள் & கருணை',
    deity: 'Goddess Lakshmi',
    deityTe: 'శ్రీ పద్మావతి అమ్మవారు',
    deityKn: 'ಶ್ರೀ ಪದ್ಮಾವತಿ ಅಮ್ಮನವರು',
    deityHi: 'माता पद्मावती',
    deityTa: 'ஸ்ரீ பத்மாவதி தாயார்',
    priorityReason: 'Lakshmi Friday',
    priorityReasonTe: 'లక్ష్మీదేవి శుక్రవారం',
    priorityReasonKn: 'ಲಕ್ಷ್ಮೀದೇవి ಶುಕ್ರವಾರ',
    priorityReasonHi: 'महालक्ष्मी शुक्रवार',
    priorityReasonTa: 'மகாலட்சுமி வெள்ளிக்கிழமை',
    quote: 'Darshan is complete only when your heart is filled with compassion for every fellow pilgrim.',
    quoteTe: 'తోటి భక్తులందరి పట్ల మీ హృదయం కరుణతో నిండినప్పుడే దర్శనం పరిపూర్ణమవుతుంది.',
    quoteKn: 'ಸಹ ಯಾತ್ರಿಕರ ಬಗ್ಗೆ ನಿಮ್ಮ ಹೃದಯವು ಪ್ರೀತಿ ಮತ್ತು ಕರುಣೆಯಿಂದ ತುಂಬಿದಾಗ ಮಾತ್ರ ದರ್ಶನವು ಪರಿಪೂರ್ಣವಾಗುತ್ತದೆ.',
    quoteHi: 'दर्शन तभी पूर्ण होता है जब आपका हृदय प्रत्येक सह-यात्री के प्रति करुणा से परिपूर्ण हो।',
    quoteTa: 'அனைத்து சக பக்தர்களிடமும் உங்கள் இதயம் கருணையுடன் இருக்கும்போதே தரிசனம் முழுமை பெறுகிறது.',
    author: 'Tiruchanoor Temple Tradition',
    authorTe: 'తిరుచానూరు అమ్మవారి సంప్రదాయం',
    authorKn: 'ತಿರುಚಾನೂರು ಅಮ್ಮನವರ ಸಂಪ್ರದಾಯ',
    authorHi: 'तिरुचानूर मंदिर परंपरा',
    authorTa: 'திருச்சானூர் தாயார் பாரம்பரியம்',
    triviaCategory: 'Prasadam',
    triviaTitle: 'Tirupati Laddu GI Tag',
    trivia: 'The famous Tirupati Laddu prasadam, prepared with pure ghee and cardamom, holds a global Geographical Indication (GI) tag.'
  },
  6: { // Saturday - Lord Venkateswara & Hanuman / Kali Yuga Varada
    theme: 'Complete Surrender & Yatra Joy',
    themeTe: 'సంపూర్ణ శరణాగతి & యాత్రానందం',
    themeKn: 'ಸಂಪೂರ್ಣ ಶರಣಾಗತಿ & ಯಾತ್ರಾ ಆನಂದ',
    themeHi: 'पूर्ण शरणागति व यात्रा आनंद',
    themeTa: 'முழுமையான சரணாகதி & யாத்திரை ஆனந்தம்',
    deity: 'Lord Venkateswara',
    deityTe: 'శ్రీ వేంకటేశ్వర స్వామి',
    deityKn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಸ್ವಾಮಿ',
    deityHi: 'भगवान श्री वेंकटेश्वर',
    deityTa: 'ஸ்ரீ வேங்கடேஸ்வர சுவாமி',
    priorityReason: 'Srivari Saturday',
    priorityReasonTe: 'శ్రీవారి శనివారం',
    priorityReasonKn: 'ಶ್ರೀವಾರಿ ಶನಿವಾರ',
    priorityReasonHi: 'श्रीवारी शनिवार',
    priorityReasonTa: 'ஸ்ரீவாரி சனிக்கிழமை',
    quote: 'In this Kali Yuga, simply uttering "Govinda! Govinda!" with love grants supreme peace of mind.',
    quoteTe: 'కలియుగంలో ప్రేమతో "గోవిందా! గోవిందా!" అని స్మరిస్తేనే పరమ శాంతి లభిస్తుంది.',
    quoteKn: 'ಕಲಿಯುಗದಲ್ಲಿ ಪ್ರೇಮದಿಂದ "ಗೋವಿಂದಾ! ಗೋವಿಂದಾ!" ಎಂದು ಸ್ಮರಿಸಿದಾಗ ಪರಮ ಶಾಂತಿ ಪ್ರಾಪ್ತಿಯಾಗುತ್ತದೆ.',
    quoteHi: 'कलियुग में प्रेमपूर्वक "गोविंदा! गोविंदा!" का स्मरण करने मात्र से परम शांति प्राप्त होती है।',
    quoteTa: 'கலியுகத்தில் அன்புடன் "கோவிந்தா! கோவிந்தா!" என்று உச்சரித்தாலே பரம சாந்தி கிட்டும்.',
    author: 'Sri Venkateswara Mahatmyam',
    authorTe: 'శ్రీ వేంకటేశ్వర మహత్యం',
    authorKn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಮಹಾತ್ಮೆ',
    authorHi: 'श्री वेंकटेश्वर महात्म्य',
    authorTa: 'ஸ்ரீ வெங்கடேஸ்வர மகாத்மியம்',
    triviaCategory: 'TTD',
    triviaTitle: 'Free Annadanam Facility',
    trivia: 'TTD serves free hot nutritious meals to over 100,000 pilgrims daily at the Tarigonda Vengamamba Complex.'
  }
};

export function getTodaysCompanion(
  date: Date = new Date(),
  liveStatus?: any,
  journeyStage: 'before' | 'queue' | 'after' | 'general' = 'general',
  todayFestival?: any
): TodaysCompanionData {
  const dayOfWeek = date.getDay();
  const dayTheme = DAY_OF_WEEK_THEMES[dayOfWeek] || DAY_OF_WEEK_THEMES[6];
  const audioTrack = AUDIO_CATALOG[dayOfWeek % AUDIO_CATALOG.length];

  let priorityLevel = 3; // Default: Weekday Theme (Priority 3)
  let priorityReason = `${dayTheme.deity} Day`;
  let theme = dayTheme.theme;
  let headline = `Today's Divine Guidance for ${dayTheme.deity}`;
  let quote = dayTheme.quote;
  let author = dayTheme.author;
  let triviaCategory = dayTheme.triviaCategory;
  let triviaTitle = dayTheme.triviaTitle;
  let trivia = dayTheme.trivia;

  // PRIORITY 1: Festival Calendar Override
  if (todayFestival && (todayFestival.isToday || todayFestival.isLive)) {
    priorityLevel = 1;
    priorityReason = todayFestival.name || todayFestival.title || 'Festival Day';
    theme = `${todayFestival.name || todayFestival.title} Utsavam`;
    headline = `Sacred Festival Guidance: ${todayFestival.name || todayFestival.title}`;
    quote = todayFestival.shortDescription || todayFestival.description || `On this sacred day of ${todayFestival.name}, meditating on the Lord brings boundless spiritual merit.`;
    author = 'Tirumala Festival Calendar';
    triviaCategory = 'Festivals';
    triviaTitle = `${todayFestival.name || todayFestival.title} Significance`;
    trivia = todayFestival.longDescription || todayFestival.description || `Celebrated with immense grandness at Tirumala, drawing thousands of devotees to behold the divine procession.`;
  } 
  // PRIORITY 2: Important Temple Day (Saturdays & Fridays or High Crowd Queue Context)
  else if (dayOfWeek === 6 || dayOfWeek === 5) {
    priorityLevel = 2;
    priorityReason = dayOfWeek === 6 ? 'Srivari Saturday' : 'Lakshmi Friday';
  }

  // Live Queue / Weather Context Override if Crowd or Rain is Active
  if (liveStatus?.crowdLevel === 'heavy' || (liveStatus?.waitTimeMinutes && liveStatus.waitTimeMinutes > 180)) {
    theme = 'Patience is Supreme Worship';
    headline = 'Today\'s Guidance: Waiting with Patience';
    quote = 'When the queue moves slowly, turn your waiting time into silent chanting of Govinda Namalu.';
    author = 'Tirumala Yatra Wisdom';
    triviaCategory = 'TTD';
    triviaTitle = 'Vaikuntam Queue Complex Comforts';
    trivia = 'TTD provides free milk, food, water, and medical care continuously to pilgrims in all queue compartments.';
  } else if (liveStatus?.isRaining || liveStatus?.weatherCondition?.toLowerCase().includes('rain')) {
    theme = 'Safety & Care on Holy Hills';
    headline = 'Today\'s Guidance: Safety is Devotion';
    quote = 'Walk gently on sacred stone paths; helping a slipping pilgrim is equal to performing a holy ritual.';
    author = 'Srivari Seva Principle';
    triviaCategory = 'Temple';
    triviaTitle = 'Swami Pushkarini Holy Waters';
    trivia = 'The sacred lake Swami Pushkarini is believed to contain waters from all 68,000 holy rivers of India.';
  }

  // Determine dynamic sevas based on time of day & context
  const hour = date.getHours();
  let sevas: DynamicSeva[] = [];

  if (journeyStage === 'queue' || (liveStatus?.waitTimeMinutes && liveStatus.waitTimeMinutes > 60)) {
    sevas = [
      { id: 'queue-1', label: 'Help elderly or families in line', iconName: 'users', category: 'queue' },
      { id: 'queue-2', label: 'Keep queue surroundings clean', iconName: 'shield', category: 'safety' },
      { id: 'queue-3', label: 'Stay calm & chant Govinda Namalu', iconName: 'heart', category: 'gratitude' }
    ];
  } else if (hour < 11) { // Morning
    sevas = [
      { id: 'morn-1', label: 'Drink water before starting walk', iconName: 'droplets', category: 'preparation' },
      { id: 'morn-2', label: 'Keep entry ticket & ID ready', iconName: 'check-circle', category: 'preparation' },
      { id: 'morn-3', label: 'Offer morning gratitude prayer', iconName: 'heart', category: 'gratitude' }
    ];
  } else if (hour > 18) { // Evening / Night
    sevas = [
      { id: 'eve-1', label: 'Reflect on peaceful darshan moments', iconName: 'sparkles', category: 'gratitude' },
      { id: 'eve-2', label: 'Share food or prasadam with someone', iconName: 'users', category: 'community' },
      { id: 'eve-3', label: 'Rest well for tomorrow\'s yatra', iconName: 'sun', category: 'preparation' }
    ];
  } else { // Afternoon / General
    sevas = [
      { id: 'gen-1', label: 'Stay hydrated during warm hours', iconName: 'droplets', category: 'preparation' },
      { id: 'gen-2', label: 'Yield way to walking pilgrims', iconName: 'footprints', category: 'community' },
      { id: 'gen-3', label: 'Keep sacred hills plastic-free', iconName: 'shield', category: 'safety' }
    ];
  }

  // Determine journey message
  let journeyAdvice = 'Prepare your mind and body with pure devotion before entering the queue.';
  if (journeyStage === 'queue') {
    journeyAdvice = 'Patience in queue is worship itself. Listen to Suprabhatam or chant silently.';
  } else if (journeyStage === 'after') {
    journeyAdvice = 'Take your sacred darshan peace home and share joy with your family and neighbors.';
  }

  return {
    priorityLevel,
    priorityReason,
    priorityReasonTe: (dayOfWeek === 6 ? 'శ్రీవారి శనివారం' : dayOfWeek === 5 ? 'లక్ష్మీదేవి శుక్రవారం' : dayTheme.priorityReasonTe) || priorityReason,
    priorityReasonKn: (dayOfWeek === 6 ? 'ಶ್ರೀವಾರಿ ಶನಿವಾರ' : dayOfWeek === 5 ? 'ಲಕ್ಷ್ಮೀದೇವಿ ಶುಕ್ರವಾರ' : dayTheme.priorityReasonKn) || priorityReason,
    priorityReasonHi: (dayOfWeek === 6 ? 'श्रीवारी शनिवार' : dayOfWeek === 5 ? 'महालक्ष्मी शुक्रवार' : dayTheme.priorityReasonHi) || priorityReason,
    priorityReasonTa: (dayOfWeek === 6 ? 'ஸ்ரீவாரி சனிக்கிழமை' : dayOfWeek === 5 ? 'மகாலட்சுமி வெள்ளிக்கிழமை' : dayTheme.priorityReasonTa) || priorityReason,
    theme,
    themeTe: dayTheme.themeTe || theme,
    themeKn: dayTheme.themeKn || theme,
    themeHi: dayTheme.themeHi || theme,
    themeTa: dayTheme.themeTa || theme,
    headline,
    divineMoment: {
      quote,
      quoteTe: dayTheme.quoteTe || quote,
      quoteKn: dayTheme.quoteKn || quote,
      quoteHi: dayTheme.quoteHi || quote,
      quoteTa: dayTheme.quoteTa || quote,
      author,
      authorTe: dayTheme.authorTe || author,
      authorKn: dayTheme.authorKn || author,
      authorHi: dayTheme.authorHi || author,
      authorTa: dayTheme.authorTa || author,
      duration: '30-Sec Reflection',
      durationTe: '30-సెకన్ల ధ్యానం',
      durationKn: '30-ಸೆಕೆಂಡ್ ಚಿಂತನೆ',
      durationHi: '30-सेकंड चिंतन',
      durationTa: '30-விநாடி சிந்தனை',
      reflectionTip: 'Take three deep breaths and silently chant "Om Namo Venkatesaya".'
    },
    significance: {
      title: triviaTitle,
      category: triviaCategory,
      description: trivia
    },
    sevas,
    audio: audioTrack,
    journeyMessage: {
      stage: journeyStage,
      title: journeyStage === 'queue' ? 'Waiting in Queue' : journeyStage === 'after' ? 'Post-Darshan Blessings' : 'Before Your Darshan',
      actionableAdvice: journeyAdvice
    },
    moodPrompt: {
      question: 'How are you feeling today on your yatra?',
      options: [
        { id: 'peaceful', iconName: 'heart', label: 'Peaceful', feedback: 'May Lord Venkateswara bless you with enduring serenity.' },
        { id: 'excited', iconName: 'smile', label: 'Excited', feedback: 'Your joyful devotion brings warmth to the entire pilgrimage!' },
        { id: 'grateful', iconName: 'sparkles', label: 'Grateful', feedback: 'Gratitude opens the gateway to divine grace.' },
        { id: 'patient', iconName: 'shield', label: 'Patient', feedback: 'Patience transforms every waiting moment into sacred seva.' }
      ]
    },
    habitPrompt: {
      text: 'Come back tomorrow for a new story, divine guidance, and daily seva.'
    }
  };
}

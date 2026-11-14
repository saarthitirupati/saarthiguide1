export interface GitaShloka {
  id: string;
  chapter: number;
  verse: number;
  referenceEn: string;
  referenceTe: string;
  referenceKn?: string;
  referenceHi?: string;
  referenceTa?: string;
  themeEn: string;
  themeTe: string;
  themeKn?: string;
  themeHi?: string;
  themeTa?: string;
  shlokaSanskrit: string;
  shlokaTelugu: string;
  shlokaKannada?: string;
  shlokaTamil?: string;
  transliteration: string;
  meaningEn: string;
  meaningTe: string;
  meaningKn?: string;
  meaningHi?: string;
  meaningTa?: string;
  pilgrimReflectionEn: string;
  pilgrimReflectionTe: string;
  pilgrimReflectionKn?: string;
  pilgrimReflectionHi?: string;
  pilgrimReflectionTa?: string;
}

export const GITA_SHLOKAS: GitaShloka[] = [
  {
    id: 'gita-2-47',
    chapter: 2,
    verse: 47,
    referenceEn: 'Bhagavad Gita • Chapter 2, Verse 47',
    referenceTe: 'శ్రీమద్భగవద్గీత • సాంఖ్య యోగం (2.47)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಸಾಂಖ್ಯ ಯೋಗ (2.47)',
    referenceHi: 'श्रीमद्भगवद्गीता • सांख्य योग (2.47)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • சாங்கிய யோகம் (2.47)',
    themeEn: 'Selfless Duty & Peace',
    themeTe: 'నిష్కామ కర్మ & కర్తవ్య నిర్వహణ',
    themeKn: 'ನಿಷ್ಕಾಮ ಕರ್ಮ & ಕರ್ತವ್ಯ ನಿಷ್ಠೆ',
    themeHi: 'निष्काम कर्म व कर्तव्य',
    themeTa: 'நிஷ்காம கர்மம் & கடமை',
    shlokaSanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    shlokaTelugu: 'కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన ।\nమా కర్మఫలహేతుర్భూర్మా తే సఙ్గోఽస్త్వకర్మణి ॥',
    shlokaKannada: 'ಕರ್ಮಣ್ಯೇವಾಧಿಕಾರಸ್ತೇ ಮಾ ಫಲೇಷು ಕದಾಚನ |\nಮಾ ಕರ್ಮಫಲಹೇತುರ್ಭೂರ್ಮಾ ತೇ ಸಙ್ಗೋಽಸ್ತ್ವಕರ್ಮಣಿ ||',
    shlokaTamil: 'கர்மண்யேவாதிகாரஸ்தே மா பலேஷு கதாசன |\nமா கர்மபலஹேதுர்பூர்மா தே ஸங்கோஸ்த்வகர்மணி ||',
    transliteration: 'karmaṇy-evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi ||',
    meaningEn: 'You have a right to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of results, nor be attached to inaction.',
    meaningTe: 'కర్మలను ఆచరించుట యందే నీకు అధికారము కలదు, ఫలితములపై ఎన్నడూ లేదు. కర్మఫలమునకు నీవు కారణము కాకుము, అలాగని కర్మలు చేయకుండుట యందునూ ఆసక్తి చూపకుము.',
    meaningKn: 'ಕರ್ಮವನ್ನು ಆಚರಿಸುವುದರಲ್ಲೇ ನಿನಗೆ ಅಧಿಕಾರವಿದೆ, ಆದರೆ ಅದರ ಫಲಗಳಲ್ಲಲ್ಲ. ಕರ್ಮಫಲಕ್ಕೆ ನೀನು ಕಾರಣನಾಗಬೇಡ, ಹಾಗೆಯೇ ಕರ್ಮ ಮಾಡದೇ ಇರುವುದರಲ್ಲೂ ಆಸಕ್ತಿ ವಹಿಸಬೇಡ.',
    meaningHi: 'तुम्हारा केवल कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल के हेतु मत बनो और न ही कर्म न करने में तुम्हारी आसक्ति हो।',
    meaningTa: 'செயல்களைச் செய்வதில் மட்டுமே உனக்கு அதிகாரம் உண்டு, ஒருபோதும் அதன் பலன்களில் இல்லை. செயல்களின் பலனுக்கு நீ காரணமாகாதே; செயலற்றிருப்பதிலும் பற்று கொள்ளாதே.',
    pilgrimReflectionEn: 'When waiting in queue lines or planning your journey, do your best with sincere devotion and leave the timing and outcome peacefully to Lord Srinivasa.',
    pilgrimReflectionTe: 'దర్శనం క్యూలలో లేదా యాత్రలో ఉన్నప్పుడు సమయం మరియు ఫలితం గురించి ఆందోళన చెందక, మనసును భగవంతునిపై ఉంచి ప్రశాంతంగా వేచి ఉండండి.',
    pilgrimReflectionKn: 'ದರ್ಶನದ ಸರತಿಯಲ್ಲಿ ಅಥವಾ ಪ್ರಯಾಣದಲ್ಲಿ ಇರುವಾಗ, ಕರ್ತವ್ಯವನ್ನು ಶ್ರದ್ಧೆಯಿಂದ ನಿರ್ವಹಿಸಿ ಫಲ ಮತ್ತು ಸಮಯವನ್ನು ಶ್ರೀ ಶ್ರೀನಿವಾಸನ ಪಾದಗಳಿಗೆ ಅರ್ಪಿಸಿ.',
    pilgrimReflectionHi: 'दर्शन कतार या यात्रा के दौरान, अपना कर्तव्य पूरी निष्ठा से करें और समय व फल को श्री श्रीनिवास के चरणों में समर्पित कर दें।',
    pilgrimReflectionTa: 'தரிசன வரிசையிலோ அல்லது பயணத்திலோ இருக்கும்போது, கடமையைச் செய்துவிட்டு நேரம் மற்றும் பலனை ஸ்ரீனிவாசனிடம் அமைதியாக ஒப்படையுங்கள்.'
  },
  {
    id: 'gita-6-5',
    chapter: 6,
    verse: 5,
    referenceEn: 'Bhagavad Gita • Chapter 6, Verse 5',
    referenceTe: 'శ్రీమద్భగవద్గీత • ఆత్మసంయమ యోగం (6.5)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಆತ್ಮಸಂಯಮ ಯೋಗ (6.5)',
    referenceHi: 'श्रीमद्भगवद्गीता • आत्मसंयम योग (6.5)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • ஆத்மசம்யம யோகம் (6.5)',
    themeEn: 'Mind Mastery & Self-Elevation',
    themeTe: 'మనో నిగ్రహం & ఆత్మోద్ధరణ',
    themeKn: 'ಮನೋನಿಗ್ರಹ & ಆತ್ಮೋದ್ಧಾರ',
    themeHi: 'मन का संयम व आत्मोद्धार',
    themeTa: 'மனக்கட்டுப்பாடு & சுய முன்னேற்றம்',
    shlokaSanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    shlokaTelugu: 'ఉద్ధరేదాత్మనాత్మానం నాత్మానమవసాదయేత్ ।\nఆత్మైవ హ్యాత్మనో బంధురాత్మైవ రిపురాత్మనః ॥',
    shlokaKannada: 'ಉದ್ಧರೇದಾತ್ಮನಾತ್ಮಾನಂ ನಾತ್ಮಾನಮವಸಾದಯೇತ್ |\nಆತ್ಮೈವ ಹ್ಯಾತ್ಮನೋ ಬಂಧುರಾತ್ಮೈವ ರಿಪುರಾತ್ಮನಃ ||',
    shlokaTamil: 'உத்தரேதாத்மனாத்மானம் நாத்மானமவஸாதயேத் |\nஆத்மைவ ஹ்யாத்மனோ பந்துராத்மைவ ரிபுராத்மன: ||',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
    meaningEn: 'Elevate yourself through the power of your mind, and do not degrade yourself. For the mind is the greatest friend of the self, and the mind is also its greatest foe.',
    meaningTe: 'తన మనస్సు ద్వారా తనను తాను ఉద్ధరించుకోవాలి గాని పతనం చేసుకోకూడదు. ఎందుకంటే మనిషికి తన మనస్సే మిత్రుడు, ఆ మనస్సే శత్రువు కూడా.',
    meaningKn: 'ತನ್ನ ಮನಸ್ಸಿನ ಮೂಲಕ ತಾನೇ ತನ್ನನ್ನು ಉದ್ಧಾರ ಮಾಡಿಕೊಳ್ಳಬೇಕು, ಪತನ ಹೊಂದಬಾರದು. ಏಕೆಂದರೆ ಮನಸ್ಸೇ ಮಾನವನಿಗೆ ಪರಮ ಮಿತ್ರ ಹಾಗೂ ಮನಸ್ಸೇ ಪರಮ ಶತ್ರು.',
    meaningHi: 'मनुष्य को अपने मन के द्वारा अपना उद्धार करना चाहिए, अपना पतन नहीं। क्योंकि मन ही मनुष्य का मित्र है और मन ही उसका शत्रु है।',
    meaningTa: 'மனிதன் தன் மனதினால் தன்னை உயர்த்திக் கொள்ள வேண்டுமே தவிர தாழ்த்திக் கொள்ளக்கூடாது. ஏனெனில் மனமே தனக்கு உற்ற நண்பன், மனமே தனக்கு எதிரியும் ஆகும்.',
    pilgrimReflectionEn: 'During travel and long waiting hours, keep your thoughts serene. A disciplined, patient mind turns ordinary waiting into deep spiritual meditation.',
    pilgrimReflectionTe: 'ప్రయాణ అలసట మరియు రద్దీలో మనస్సును ప్రశాంతంగా ఉంచుకుంటే ప్రతి క్షణం ధ్యానంలా మారుతుంది.',
    pilgrimReflectionKn: 'ಪ್ರಯಾಣದ ಆಯಾಸ ಮತ್ತು ಜನದಟ್ಟಣೆಯಲ್ಲಿ ಮನಸ್ಸನ್ನು ಪ್ರಶಾಂತವಾಗಿ ಇಟ್ಟುಕೊಳ್ಳಿ. ನಿಯಂತ್ರಿತ ಮನಸ್ಸು ಕಾಯುವಿಕೆಯನ್ನೂ ಧ್ಯಾನವನ್ನಾಗಿ ಮಾಡುತ್ತದೆ.',
    pilgrimReflectionHi: 'यात्रा की थकान और प्रतीक्षा के समय अपने मन को शांत रखें। संयमित मन हर प्रतीक्षा को ध्यान में बदल देता है।',
    pilgrimReflectionTa: 'பயணக் களைப்பு மற்றும் நீண்ட காத்திருப்பில் மனதை அமைதியாக வையுங்கள்; கட்டுப்பாடான மனம் காத்திருப்பையும் தவமாக மாற்றும்.'
  },
  {
    id: 'gita-9-22',
    chapter: 9,
    verse: 22,
    referenceEn: 'Bhagavad Gita • Chapter 9, Verse 22',
    referenceTe: 'శ్రీమద్భగవద్గీత • రాజవిద్యారాజగుహ్య యోగం (9.22)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ರಾಜವಿದ್ಯಾರಾಜಗುಹ್ಯ ಯೋಗ (9.22)',
    referenceHi: 'श्रीमद्भगवद्गीता • राजविद्याराजगुह्य योग (9.22)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • ராஜவித்யா ராஜகுஹ்ய யோகம் (9.22)',
    themeEn: 'Divine Protection & Assurance',
    themeTe: 'యోగక్షేమ వహనం & అనన్య భక్తి',
    themeKn: 'ಯೋಗಕ್ಷೇಮ & ಅನನ್ಯ ಭಕ್ತಿ',
    themeHi: 'योगक्षेम व अनन्य भक्ति',
    themeTa: 'யோகக்ஷேமம் & முழு பக்தி',
    shlokaSanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    shlokaTelugu: 'అనన్యాశ్చిన్తయన్తో మాం యే జనాః పర్యుపాసతే ।\nతేషాం నిత్యాభియుక్తానాం యోగక్షేమం వహామ్యహమ్ ॥',
    shlokaKannada: 'ಅನನ್ಯಾಶ್ಚಿನ್ತಯನ್ತೋ ಮಾಂ ಯೇ ಜನಾಃ ಪರ್ಯುಪಾಸತೇ |\nತೇಷಾಂ ನಿತ್ಯಾಭಿಯುಕ್ತಾನಾಂ ಯೋಗಕ್ಷೇಮಂ ವಹಾಮ್ಯಹಮ್ ||',
    shlokaTamil: 'அனன்யாஶ்சிந்தயந்தோ மாம் யே ஜனா: பர்யுபாஸதே |\nதேஷாம் நித்யாபியுக்தானாம் யோகக்ஷேமம் வஹாம்யஹம் ||',
    transliteration: 'ananyāś cintayanto māṁ ye janāḥ paryupāsate |\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham ||',
    meaningEn: 'For those who always worship Me with exclusive devotion, meditating on My transcendental form—to them I carry what they lack, and preserve what they have.',
    meaningTe: 'ఏకాగ్ర చిత్తముతో నన్నే ధ్యానించుచు, నిరంతరము నన్ను సేవించు భక్తుల యోగక్షేమములను నేనే స్వయముగా వహింతును.',
    meaningKn: 'ಅನನ್ಯ ಭಕ್ತಿಯಿಂದ ನನ್ನನ್ನೇ ಧ್ಯಾನಿಸುತ್ತಾ ಸದಾ ನನ್ನ ಆರಾಧನೆಯಲ್ಲಿ ನಿರತರಾಗಿರುವ ಭಕ್ತರ ಯೋಗಕ್ಷೇಮವನ್ನು ನಾನೇ ಸ್ವತಃ ವಹಿಸುತ್ತೇನೆ.',
    meaningHi: 'जो अनन्य भक्त केवल मेरा ही चिंतन करते हुए मुझे भजते हैं, उन नित्य युक्त भक्तों के योगक्षेम (आवश्यकताओं की पूर्ति व रक्षा) का वहन मैं स्वयं करता हूँ।',
    meaningTa: 'வேறெந்த சிந்தனையுமின்றி என்னையே தியானித்து வணங்கும் பக்தர்களின் தேவைகளையும் பாதுகாப்பையும் நானே நேரில் ஏற்றுக்கொள்கிறேன்.',
    pilgrimReflectionEn: 'Travel with complete faith. When you surrender your worries to Lord Srinivasa, the Divine takes care of your every need throughout the sacred pilgrimage.',
    pilgrimReflectionTe: 'నిండు నమ్మకంతో శ్రీవారిని స్మరించండి; మీ యాత్రను, సమస్త బాధ్యతలను భగవంతుడే స్వయంగా నడిపిస్తాడు.',
    pilgrimReflectionKn: 'ಪೂರ್ಣ ವಿಶ್ವಾಸದಿಂದ ಶ್ರೀವರಿಯನ್ನು ಸ್ಮರಿಸಿ; ನಿಮ್ಮ ಯಾತ್ರೆಯ ಎಲ್ಲಾ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಭಗವಂತನೇ ಸ್ವತಃ ನೋಡಿಕೊಳ್ಳುತ್ತಾನೆ.',
    pilgrimReflectionHi: 'पूर्ण विश्वास के साथ श्रीवारी का स्मरण करें; आपकी यात्रा और दायित्वों की रक्षा स्वयं प्रभु करते हैं।',
    pilgrimReflectionTa: 'முழு நம்பிக்கையுடன் ஸ்ரீவாரி நாமத்தை உச்சரியுங்கள்; உங்கள் யாத்திரையின் அனைத்து பொறுப்புகளையும் இறைவனே ஏற்று நடத்துவார்.'
  },
  {
    id: 'gita-12-15',
    chapter: 12,
    verse: 15,
    referenceEn: 'Bhagavad Gita • Chapter 12, Verse 15',
    referenceTe: 'శ్రీమద్భగవద్గీత • భక్తి యోగం (12.15)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಭಕ್ತಿ ಯೋಗ (12.15)',
    referenceHi: 'श्रीमद्भगवद्गीता • भक्ति योग (12.15)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • பக்தி யோகம் (12.15)',
    themeEn: 'Patience & Inner Equanimity',
    themeTe: 'ఓర్పు & మనశ్శాంతి',
    themeKn: 'ಸಹನೆ & ಆಂತರಿಕ ಸಮಚಿತ್ತತೆ',
    themeHi: 'धैर्य व समभाव',
    themeTa: 'பொறுமை & மன அமைதி',
    shlokaSanskrit: 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः॥',
    shlokaTelugu: 'యస్మాన్నోద్విజతే లోకో లోకాన్నోద్విజతే చ యః ।\nహర్షామర్షభయోద్వేగైర్ముక్తో యః స చ మే ప్రియః ॥',
    shlokaKannada: 'ಯಸ್ಮಾನ್ನೋದ್ವಿಜತೇ ಲೋಕೋ ಲೋಕಾನ್ನೋದ್ವಿಜತೇ ಚ ಯಃ |\nಹರ್ಷಾಮರ್ಷಭಯೋದ್ವೇಗೈರ್ಮುಕ್ತೋ ಯಃ ಸ ಚ ಮೇ ಪ್ರಿಯಃ ||',
    shlokaTamil: 'யஸ்மான்னோத்விஜதே லோகோ லோகான்னோத்விஜதே ச ய: |\nஹர்ஷாமர்ஷபயோத்வேகைர்முக்தோ ய: ஸ ச மே ப்ரிய: ||',
    transliteration: 'yasmān nodvijate loko lokān nodvijate ca yaḥ |\nharṣāmarṣa-bhayodvegair mukto yaḥ sa ca me priyaḥ ||',
    meaningEn: 'He by whom no one is disturbed and who is not disturbed by the world, who is free from excessive excitement, impatience, fear, and agitation, is very dear to Me.',
    meaningTe: 'ఎవరి వలన లోకము కలత చెందదో, లోకము వలన ఎవరు కలత చెందరు, సంతోషము, అసూయ, భయము, ఆందోళనల నుండి విముక్తుడైనవాడు నాకు అత్యంత ప్రియమైన భక్తుడు.',
    meaningKn: 'ಯಾರಿಂದ ಜಗತ್ತು ಕ್ಷೋಭೆಗೆ ಒಳಗಾಗುವುದಿಲ್ಲವೋ, ಯಾರು ಜಗತ್ತಿನಿಂದ ಕ್ಷೋಭೆಗೊಳ್ಳುವುದಿಲ್ಲವೋ, ಅತಿ ಹರ್ಷ, ಅಸೂಯೆ, ಭಯ ಹಾಗೂ ಉದ್ವೇಗಗಳಿಂದ ಮುಕ್ತನಾದವನೇ ನನಗೆ ಪ್ರಿಯನಾದ ಭಕ್ತ.',
    meaningHi: 'जिससे किसी को क्षोभ नहीं होता और जो स्वयं किसी से क्षुब्ध नहीं होता, जो हर्ष, ईर्ष्या, भय और उद्वेग से मुक्त है, वह मुझे अत्यंत प्रिय है।',
    meaningTa: 'யாரால் உலகிற்கு துன்பம் ஏற்படாதோ, யாரை உலகம் துன்புறுத்த முடியாதோ, மகிழ்ச்சி, பொறாமை, பயம், கவலைகளில் இருந்து விடுபட்டவரே எனக்கு மிகவும் பிரியமானவர்.',
    pilgrimReflectionEn: 'Treat fellow pilgrims in the compartments with kindness and patience. Avoid agitation or rush; maintaining inner sweetness brings you closest to Govinda.',
    pilgrimReflectionTe: 'తోటి భక్తుల పట్ల సహనంతో, దయతో వ్యవహరించండి; ప్రశాంతంగా ఉండేవారే భగవంతునికి ప్రీతిపాత్రులు.',
    pilgrimReflectionKn: 'ಸರತಿ ಸಾಲಿನಲ್ಲಿರುವ ಸಹ ಯಾತ್ರಿಕರೊಂದಿಗೆ ಪ್ರೀತಿ ಮತ್ತು ಸಹನೆಯಿಂದ ವರ್ತಿಸಿ; ಶಾಂತ ಮನಸ್ಸಿನವರೇ ಗೋವಿಂದನಿಗೆ ಅತ್ಯಂತ ಪ್ರಿಯರು.',
    pilgrimReflectionHi: 'कतार में साथी श्रद्धालुओं के साथ प्रेम व धैर्य का व्यवहार करें; शांत चित्त वाले ही प्रभु के प्रिय होते हैं।',
    pilgrimReflectionTa: 'வரிசையிலுள்ள சக பக்தர்களிடம் பொறுமையுடனும் அன்போடும் நடந்துகொள்ளுங்கள்; அமைதியான மனமே கோவிந்தனுக்கு உகந்தது.'
  },
  {
    id: 'gita-18-66',
    chapter: 18,
    verse: 66,
    referenceEn: 'Bhagavad Gita • Chapter 18, Verse 66',
    referenceTe: 'శ్రీమద్భగవద్గీత • మోక్షసంన్యాస యోగం (18.66)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಮೋಕ್ಷಸಂನ್ಯಾಸ ಯೋಗ (18.66)',
    referenceHi: 'श्रीमद्भगवद्गीता • मोक्षसंन्यास योग (18.66)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • மோக்ஷ சன்னியாச யோகம் (18.66)',
    themeEn: 'Ultimate Surrender (Charama Shloka)',
    themeTe: 'చరమ శ్లోకం • సంపూర్ణ శరణాగతి',
    themeKn: 'ಚರಮ ಶ್ಲೋಕ • ಸಂಪೂರ್ಣ ಶರಣಾಗತಿ',
    themeHi: 'चरम श्लोक • संपूर्ण शरणागति',
    themeTa: 'சரம ஸ்லோகம் • முழு சரணாகதி',
    shlokaSanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    shlokaTelugu: 'సర్వధర్మాన్పరిత్యజ్య మామేకం శరణం వ్రజ ।\nఅహం త్వాం సర్వపాపేభ్యో మోక్షయిష్యామి మా శుచః ॥',
    shlokaKannada: 'ಸರ್ವಧರ್ಮಾನ್ಪರಿತ್ಯಜ್ಯ ಮಾಮೇಕಂ ಶರಣಂ ವ್ರಜ |\nಅಹಂ ತ್ವಾಂ ಸರ್ವಪಾಪೇಭ್ಯೋ ಮೋಕ್ಷಯಿಷ್ಯಾಮಿ ಮಾ ಶುಚಃ ||',
    shlokaTamil: 'ஸர்வதர்மான்பரித்யஜ்ய மாமேகம் ஶரணம் வ்ரஜ |\nஅஹம் த்வாம் ஸர்வபாபேப்யோ மோக்ஷயிஷ்யாமி மா ஶுச: ||',
    transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
    meaningEn: 'Abandon all varieties of dharma and take refuge in Me alone. I shall free you from all sins. Do not grieve.',
    meaningTe: 'సర్వ ధర్మములను సమర్పించి, నన్ను ఒక్కడినే శరణు వేడుము. నేను నిన్ను సమస్త పాపముల నుండి విముక్తుడిని చేస్తాను. శోకింపకుము.',
    meaningKn: 'ಎಲ್ಲಾ ಧರ್ಮಗಳನ್ನು ತ್ಯಜಿಸಿ ನನ್ನೊಬ್ಬನನ್ನೇ ಶರಣು ಹೊಂದು. ನಾನು ನಿನ್ನನ್ನು ಸಮಸ್ತ ಪಾಪಗಳಿಂದ ಮುಕ್ತಗೊಳಿಸುತ್ತೇನೆ. ಶೋಕಿಸಬೇಡ.',
    meaningHi: 'सम्पूर्ण धर्मों को मुझमें समर्पित करके केवल मेरी ही शरण में आ जाओ। मैं तुम्हें समस्त पापों से मुक्त कर दूंगा, शोक मत करो।',
    meaningTa: 'எல்லா தர்மங்களையும் என்னிடம் சமர்ப்பித்துவிட்டு, என்னை மட்டுமே சரணடை. நான் உன்னை அனைத்து பாவங்களிலிருந்தும் விடுவிக்கிறேன், வருந்தாதே.',
    pilgrimReflectionEn: 'As you stand before Lord Venkateswara in the main temple, offer your burdens, doubts, and ego at His lotus feet. In complete surrender, the heart finds lasting peace.',
    pilgrimReflectionTe: 'శ్రీ వేంకటేశ్వర స్వామివారి సన్నిధిలో మీ భారాలు, సందేహాలు, అహంకారాన్ని స్వామి పాదపద్మాలకు సమర్పించండి; సంపూర్ణ శరణాగతిలో హృదయానికి శాశ్వత శాంతి లభిస్తుంది.',
    pilgrimReflectionKn: 'ಶ್ರೀ ವೆಂಕಟೇಶ್ವರ ಸ್ವಾಮಿಯ ಸನ್ನಿಧಿಯಲ್ಲಿ ನಿಂತಾಗ, ನಿಮ್ಮ ಚಿಂತೆಗಳು ಮತ್ತು ಅಹಂಕಾರವನ್ನು ಆತನ ಚರಣ ಕಮಲಗಳಲ್ಲಿ ಸಮರ್ಪಿಸಿ; ಪರಿಪೂರ್ಣ ಶಾಂತಿ ನಿಮ್ಮದಾಗುತ್ತದೆ.',
    pilgrimReflectionHi: 'श्री वेंकटेश्वर स्वामी के सम्मुख खड़े होकर अपने समस्त संशय व भार उनके श्रीचरणों में अर्पित करें; पूर्ण शरणागति में ही परम शांति है।',
    pilgrimReflectionTa: 'ஸ்ரீ வேங்கடேஸ்வர சுவாமியின் சன்னதியில் நிற்கும்போது, உங்கள் பாரங்களையும் கவலைகளையும் அவன் திருவடிகளில் சமர்ப்பியுங்கள்; முழு சரணாகதியில் அமைதி கிடைக்கும்.'
  },
  {
    id: 'gita-2-70',
    chapter: 2,
    verse: 70,
    referenceEn: 'Bhagavad Gita • Chapter 2, Verse 70',
    referenceTe: 'శ్రీమద్భగవద్గీత • సాంఖ్య యోగం (2.70)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಸಾಂಖ್ಯ ಯೋಗ (2.70)',
    referenceHi: 'श्रीमद्भगवद्गीता • सांख्य योग (2.70)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • சாங்கிய யோகம் (2.70)',
    themeEn: 'Oceanic Serenity in All Circumstances',
    themeTe: 'సముద్ర సమాన ప్రశాంతత',
    themeKn: 'ಸಾಗರ ಸಮಾನ ಪ್ರಶಾಂತತೆ',
    themeHi: 'समुद्र समान अगाध शांति',
    themeTa: 'கடல் போன்ற அமைதி',
    shlokaSanskrit: 'आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत्।\nतद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमाप्नोति न कामकामी॥',
    shlokaTelugu: 'ఆపూర్యమాణమచలప్రతిష్ఠం సముద్రమాపః ప్రవిశన్తి యద్వత్ ।\nతద్వత్కామా యం ప్రవిశన్తి సర్వే స శాన్తిమాప్నోతి న కామకామీ ॥',
    shlokaKannada: 'ಆಪೂರ್ಯಮಾಣಮಚಲಪ್ರತಿಷ್ಠಂ ಸಮುದ್ರಮಾಪಃ ಪ್ರವಿಶನ್ತಿ ಯದ್ವತ್ |\nತದ್ವತ್ಕಾಮಾ ಯಂ ಪ್ರವಿಶನ್ತಿ ಸರ್ವೇ ಸ ಶಾನ್ತಿಮಾಪ್ನೋತಿ ನ ಕಾಮಕಾಮೀ ||',
    shlokaTamil: 'ஆபூர்யமாணமசலப்ரதிஷ்டம் ஸமுத்ரமாப: ப்ரவிஶந்தி யத்வத் |\nதத்வத்காமா யம் ப்ரவிஶந்தி ஸர்வே ஸ ஶாந்திமாப்னோதி ந காமகாமீ ||',
    transliteration: 'āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat |\ntadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī ||',
    meaningEn: 'As the ocean remains tranquil and undisturbed though many rivers continuously flow into it, so a person undisturbed by the incessant flow of desires attains peace.',
    meaningTe: 'అన్నివైపుల నుండి నదులు వచ్చి కలిసినా సముద్రము ఎలా నిశ్చలంగా ఉంటుందో, అలాగే కోరికలు మనస్సులోకి ప్రవేశించినా చలించని వాడే నిజమైన శాంతిని పొందుతాడు.',
    meaningKn: 'ಸುತ್ತಲಿನ ನದಿಗಳು ಸದಾ ಬಂದು ಸೇರಿದರೂ ಸಾಗರವು ಹೇಗೆ ನಿಶ್ಚಲವಾಗಿರುತ್ತದೋ, ಹಾಗೆಯೇ ಕೋರಿಕೆಗಳು ಬಂದರೂ ಚಲಿಸದವನೇ ನಿಜವಾದ ಶಾಂತಿಯನ್ನು ಪಡೆಯುತ್ತಾನೆ.',
    meaningHi: 'जैसे निरंतर जल भरने पर भी समुद्र अपनी मर्यादा में अचल रहता है, वैसे ही समस्त कामनाओं के आने पर भी जो अविचलित रहता है, वही परम शांति को प्राप्त करता है।',
    meaningTa: 'எல்லா நதிகளும் தொடர்ந்து கலந்தாலும் கடல் எவ்வாறு அமைதியாக நிலைபெற்றிருக்கிறதோ, அதுபோல் ஆசைகள் வந்தாலும் அமைதி குலையாதவனே உண்மையான சாந்தியை அடைகிறான்.',
    pilgrimReflectionEn: 'Let external noises, delays, or crowds wash past you like waves. Anchor your core in peace like the deep ocean.',
    pilgrimReflectionTe: 'బయటి రద్దీ, శబ్దాలు మనస్సును తాకినా, సముద్రంలా నిశ్చలమైన భక్తితో శాంతంగా ఉండండి.',
    pilgrimReflectionKn: 'ಹೊರಗಿನ ಜನದಟ್ಟಣೆ, ಗದ್ದಲ ನಿಮ್ಮನ್ನು ತಾಗಿದರೂ, ಸಾಗರದಂತೆ ಆಳವಾದ ಭಕ್ತಿಯೊಂದಿಗೆ ಶಾಂತರಾಗಿರಿ.',
    pilgrimReflectionHi: 'बाहरी भीड़ और शोर के बीच, समुद्र की भांति अपनी अंतरात्मा को भक्ति में शांत और स्थिर रखें।',
    pilgrimReflectionTa: 'வெளிப்புறக் கூட்டமும் கூச்சலும் உங்களைச் சூழ்ந்தாலும், பெருங்கடலைப் போல அமைதியான பக்தியில் நிலைத்திருங்கள்.'
  },
  {
    id: 'gita-7-8',
    chapter: 7,
    verse: 8,
    referenceEn: 'Bhagavad Gita • Chapter 7, Verse 8',
    referenceTe: 'శ్రీమద్భగవద్గీత • జ్ఞానవిజ్ఞాన యోగం (7.8)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ಜ್ಞಾನವಿಜ್ಞಾನ ಯೋಗ (7.8)',
    referenceHi: 'श्रीमद्भगवद्गीता • ज्ञानविज्ञान योग (7.8)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • ஞானவிஞ்ஞான யோகம் (7.8)',
    themeEn: 'Seeing Divinity in Nature',
    themeTe: 'ప్రకృతిలో భగవత్ దర్శనం',
    themeKn: 'ಪ್ರಕೃತಿಯಲ್ಲಿ ಭಗವದ್ ದರ್ಶನ',
    themeHi: 'प्रकृति में ईश्वरीय दर्शन',
    themeTa: 'இயற்கையில் இறைவன் தரிசனம்',
    shlokaSanskrit: 'रसोऽहमप्सु कौन्तेय प्रभास्मि शशिसूर्ययोः।\nप्रणवः सर्ववेदेषु शब्दः खे पौरुषं नृषु॥',
    shlokaTelugu: 'రసోఽహమప్సు కౌన్తేయ ప్రభాస్మి శశిసూర్యయోః ।\nప్రణవః సర్వవేదేషు శబ్దః ఖే పౌరుషం నృషు ॥',
    shlokaKannada: 'ರಸೋಽಹಮಪ್ಸು ಕೌನ್ತೇಯ ಪ್ರಭಾಸ್ಮಿ ಶಶಿಸೂರ್ಯಯೋಃ |\nಪ್ರಣವಃ ಸರ್ವವೇದೇಷು ಶಬ್ದಃ ಖೇ ಪೌರುಷಂ ನೃಷು ||',
    shlokaTamil: 'ரஸோஹமப்ஸு கெளந்தேய ப்ரபாஸ்மி ஶஶிஸூர்யயோ: |\nப்ரணவ: ஸர்வவேதேஷு ஶப்த: கே பௌருஷம் ந்ருஷு ||',
    transliteration: 'raso \'ham apsu kaunteya prabhāsmi śaśi-sūryayoḥ |\npraṇavaḥ sarva-vedeṣu śabdaḥ khe pauruṣaṁ nṛṣu ||',
    meaningEn: 'O Arjuna, I am the taste in water, the radiance in the sun and moon, the sacred syllable Om in all the Vedas, sound in the ether, and ability in humanity.',
    meaningTe: 'ఓ అర్జునా! నీటి యందలి రుచిని నేనే, సూర్యచంద్రుల యందలి కాంతిని నేనే, సర్వవేదముల యందలి ప్రణవ నాదము (ఓంకారం) నేనే, ఆకాశమున శబ్దమును నేనే.',
    meaningKn: 'ಎಲೈ ಅರ್ಜುನಾ! ನೀರಿನಲ್ಲಿರುವ ರಸ (ರುಚಿ) ನಾನೇ, ಸೂರ್ಯ-ಚಂದ್ರರಲ್ಲಿರುವ ಕಾಂತಿ ನಾನೇ, ಸಮಸ್ತ ವೇದಗಳಲ್ಲಿರುವ ಪ್ರಣವ (ಓಂಕಾರ) ನಾನೇ, ಆಕಾಶದಲ್ಲಿನ ಶಬ್ದ ಹಾಗೂ ಮಾನವರಲ್ಲಿರುವ ಸಾಮರ್ಥ್ಯವೂ ನಾನೇ.',
    meaningHi: 'हे कुन्तीपुत्र अर्जुन! जल में रस मैं हूँ, सूर्य और चन्द्रमा में प्रकाश मैं हूँ, सम्पूर्ण वेदों में ओंकार मैं हूँ, आकाश में शब्द और पुरुषों में पौरुष मैं हूँ।',
    meaningTa: 'அர்ஜுனா! தண்ணீரில் உள்ள சுவை நான், சூரிய சந்திரர்களில் உள்ள ஒளி நான், அனைத்து வேதங்களிலும் உள்ள பிரணவ மந்திரம் (ஓம்) நான், ஆகாயத்தில் சப்தமும், மனிதர்களில் திறமையும் நானே.',
    pilgrimReflectionEn: 'When sipping Pushkarini water or watching the sunrise over Seshachalam hills, feel the living presence of Lord Govinda in every breath of nature.',
    pilgrimReflectionTe: 'పుష్కరిణి తీర్థం సేవించినా, శేషాచల కొండల్లో సూర్యోదయం చూసినా ప్రకృతిలోని ప్రతి అణువులోనూ శ్రీవారి దివ్యత్వాన్ని అనుభవించండి.',
    pilgrimReflectionKn: 'ಪುಷ್ಕರಿಣಿ ತೀರ್ಥ ಸೇವಿಸುವಾಗ ಅಥವಾ ಶೇಷಾಚಲ ಗಿರಿಯಲ್ಲಿ ಸೂರ್ಯೋದಯವನ್ನು ನೋಡುವಾಗ, ಪ್ರಕೃತಿಯ ಪ್ರತಿಯೊಂದು ಅಣುವಿನಲ್ಲೂ ಶ್ರೀ ಗೋವಿಂದನ ಸನ್ನಿಧಿಯನ್ನು ಅನುಭವಿಸಿ.',
    pilgrimReflectionHi: 'पुष्करिणी का पावन जल ग्रहण करते समय अथवा शेषाचल पर सूर्योदय देखते समय, प्रकृति के कण-कण में भगवान गोविंदा की दिव्यता का अनुभव करें।',
    pilgrimReflectionTa: 'புஷ்கரிணி தீர்த்தம் அருந்தும்போதும், சேஷாசல மலையில் சூரிய உதயத்தைக் காணும்போதும், இயற்கையின் ஒவ்வொரு அணுவிலும் ஸ்ரீ கோவிந்தனின் இருப்பை உணருங்கள்.'
  },
  {
    id: 'gita-10-41',
    chapter: 10,
    verse: 41,
    referenceEn: 'Bhagavad Gita • Chapter 10, Verse 41',
    referenceTe: 'శ్రీమద్భగవద్గీత • విభూతి యోగం (10.41)',
    referenceKn: 'ಶ್ರೀಮದ್ಭಗವದ್ಗೀತಾ • ವಿಭೂತಿ ಯೋಗ (10.41)',
    referenceHi: 'श्रीमद्भगवद्गीता • विभूति योग (10.41)',
    referenceTa: 'ஸ்ரீமத் பகவத் கீதை • விபூதி யோகம் (10.41)',
    themeEn: 'Recognizing Divine Splendor',
    themeTe: 'దివ్య విభూతి దర్శనం',
    themeKn: 'ದಿವ್ಯ ವೈಭವದ ದರ್ಶನ',
    themeHi: 'दिव्य विभूति दर्शन',
    themeTa: 'தெய்வீக மகிமை தரிசனம்',
    shlokaSanskrit: 'यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा।\nतत्तदेवावगच्छ त्वं मम तेजोंऽशसम्भवम्॥',
    shlokaTelugu: 'యద్యద్విభూతిమత్సత్త్వం శ్రీమదూర్జితమేవ వా ।\nతత్తదేవావగచ్ఛ త్వం మమ తేజోంఽశసమ్భవమ్ ॥',
    shlokaKannada: 'ಯದ್ಯದ್ವಿಭೂತಿಮತ್ಸತ್ತ್ವಂ ಶ್ರೀಮದೂರ್ಜಿತಮೇವ ವಾ |\nತತ್ತದೇವಾಗವಚ್ಛ ತ್ವಂ ಮಮ ತೇಜೋಂಽಶಸಮ್ಭವಮ್ ||',
    shlokaTamil: 'யத்யத்விபூதிமத்ஸத்த்வம் ஶ்ரீமதூர்ஜிதமேவ வா |\nதத்ததேவாவகச்ச த்வம் மம தேஜோம்ஶஸம்பவம் ||',
    transliteration: 'yad yad vibhūtimat sattvaṁ śrīmad ūrjitam eva vā |\ntat tad evāvagaccha tvaṁ mama tejo-\'ṁśa-sambhavam ||',
    meaningEn: 'Know that whatever is glorious, beautiful, or mighty in this creation springs from but a spark of My divine splendor.',
    meaningTe: 'ఈ సృష్టిలో మహిమాన్వితమైనది, కాంతివంతమైనది, శక్తివంతమైనది ఏదైననూ నా దివ్య తేజస్సు యొక్క అంశతోనే ఉద్భవించినదని తెలుసుకో.',
    meaningKn: 'ಈ ಸೃಷ್ಟಿಯಲ್ಲಿ ಮಹಿಮಾನ್ವಿತವಾದದ್ದು, ಸುಂದರವಾದದ್ದು ಹಾಗೂ ಶಕ್ತಿಶಾಲಿಯಾದದ್ದು ಎಲ್ಲವೂ ನನ್ನ ದಿವ್ಯ ತೇಜಸ್ಸಿನ ಒಂದು ಅಂಶದಿಂದಲೇ ಉದ್ಭವಿಸಿದೆ ಎಂದು ತಿಳಿ.',
    meaningHi: 'जो भी ऐश्वर्ययुक्त, कान्तियुक्त और शक्ति सम्पन्न वस्तु है, उसे तुम मेरे ही तेज के एक अंश से उत्पन्न जानो।',
    meaningTa: 'எதுவெல்லாம் பெருமை, அழகு மற்றும் ஆற்றலுடன் விளங்குகிறதோ, அவையெல்லாம் என் தெய்வீக ஒளியின் சிறு பகுதியிலிருந்தே தோன்றியவை என அறிவாய்.',
    pilgrimReflectionEn: 'The majestic Gopurams, ancient granite pillars, and golden vimanam at Tirumala are sacred reflections of the Lord\'s infinite cosmic beauty.',
    pilgrimReflectionTe: 'తిరుమల ఆలయ రాజగోపురాలు, ఆనంద నిలయ బంగారు శిఖరం భగవంతుని దివ్య తేజస్సుకు ప్రతీకలు.',
    pilgrimReflectionKn: 'ತಿರುಮಲ ಗಿರಿಯ ರಾಜಗೋಪುರಗಳು, ಪ್ರಾಚೀನ ಕಲ್ಲಿನ ಕಂಬಗಳು ಹಾಗೂ ಆನಂದ ನಿಲಯ ಸುವರ್ಣ ಗೋಪುರಗಳು ಭಗವಂತನ ಅನಂತ ಸೌಂದರ್ಯದ ದಿವ್ಯ ಪ್ರತಿಬಿಂಬಗಳು.',
    pilgrimReflectionHi: 'तिरुमला के भव्य गोपुरम, प्राचीन शिला स्तंभ और स्वर्ण विमानम प्रभु के अनंत वैभव के पावन प्रतीक हैं।',
    pilgrimReflectionTa: 'திருமலையின் கம்பீர கோபுரங்கள், பழமையான கற்றூண்கள் மற்றும் ஆனந்த நிலைய தங்க விமானம் இறைவனின் எல்லையற்ற அழகின் புனிதப் பிரதிபலிப்புகள்.'
  }
];

/**
 * Returns today's Bhagavad Gita shloka deterministically based on day-of-year.
 * Refreshes automatically every morning at 12:00 AM.
 */
export function getDailyGitaShloka(date: Date = new Date()): GitaShloka {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = Math.abs(dayOfYear) % GITA_SHLOKAS.length;
  return GITA_SHLOKAS[index];
}
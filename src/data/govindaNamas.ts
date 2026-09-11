/**
 * 📿 Srivari Sacred Govinda Namavali & Pilgrimage Blessings
 * Authentic Tirumala Govinda Namas and uplifting blessings in Telugu & English
 * Aligned with the 108 Japa Mala Sadhana.
 */

export interface GovindaNama {
  namaTe: string;
  namaEn: string;
  blessingTe: string;
  blessingEn: string;
  theme: 'peace' | 'health' | 'protection' | 'prosperity' | 'grace';
}

export const GOVINDA_NAMAVALI: GovindaNama[] = [
  {
    namaTe: 'శ్రీనివాసా గోవిందా • శ్రీ వేంకటేశా గోవిందా',
    namaEn: 'Srinivasa Govinda • Sri Venkatesa Govinda',
    blessingTe: 'గోవిందా! శ్రీవారి దివ్య కృపాకటాక్షాలతో మీ ఇంట ఆనందం, సంపూర్ణ ఆయురారోగ్యాలు వర్ధిల్లుగాక.',
    blessingEn: 'Govinda! May Lord Venkateswara shower boundless peace, radiant health, and auspicious blessings upon you and your family.',
    theme: 'grace'
  },
  {
    namaTe: 'ఆపద్బాంధవ గోవిందా • అనాథరక్షక గోవిందా',
    namaEn: 'Apadbandhava Govinda • Anatha Rakshaka Govinda',
    blessingTe: 'సర్వదా రక్షకుడైన శ్రీ వేంకటేశ్వరుడు మీ ప్రయాణంలో మరియు జీవితంలో ఎదురయ్యే ఆపదలన్నింటినీ తొలగించుగాక.',
    blessingEn: 'May the compassionate Lord of the Seven Hills protect you in all endeavors and dispel every obstacle from your path.',
    theme: 'protection'
  },
  {
    namaTe: 'భక్తవత్సల గోవిందా • భాగవతప్రియ గోవిందా',
    namaEn: 'Bhakta Vatsala Govinda • Bhagavata Priya Govinda',
    blessingTe: 'భక్తుల మనోరథాలను ఈడేర్చే స్వామివారి అనుగ్రహంతో మీ సంకల్పాలన్నీ విజయవంతమగుగాక.',
    blessingEn: 'May the benevolent Lord fulfill your noble prayers and grant heartfelt contentment and inner strength.',
    theme: 'peace'
  },
  {
    namaTe: 'సంకటహరణ గోవిందా • వేంకటరమణ గోవిందా',
    namaEn: 'Sankataharana Govinda • Venkataramana Govinda',
    blessingTe: 'సమస్త సంకటాలను నివారించే శ్రీవారి దివ్య సన్నిధి మీకు మనశ్శాంతిని, ధైర్యాన్ని ప్రసాదించుగాక.',
    blessingEn: 'May Lord Govinda dissolve all distress and worries, filling your heart with serene calmness and courage.',
    theme: 'peace'
  },
  {
    namaTe: 'గోవిందా హరి గోవిందా • గోకులనందన గోవిందా',
    namaEn: 'Govinda Hari Govinda • Gokula Nandana Govinda',
    blessingTe: 'శ్రీనివాసుని పవిత్ర నామస్మరణ మీ నివాసంలో సుఖసంతోషాలను, దైవిక వెలుగును నింపుగాక.',
    blessingEn: 'May the divine vibration of the sacred Govinda Nama bring harmony, warmth, and light to your home.',
    theme: 'grace'
  },
  {
    namaTe: 'నిత్యకల్యాణ గోవిందా • నిరుపమరూప గోవిందా',
    namaEn: 'Nitya Kalyana Govinda • Nirupama Rupa Govinda',
    blessingTe: 'నిత్య కల్యాణ చక్రవర్తి శ్రీవారి కృపతో మీ కుటుంబంలో నిరంతరం శుభకార్యాలు, ఐశ్వర్యం వెల్లివిరియుగాక.',
    blessingEn: 'May the Lord of Eternal Auspiciousness bless your home with harmony, prosperity, and continuous progress.',
    theme: 'prosperity'
  },
  {
    namaTe: 'తిరుమలవాసా గోవిందా • ఏడుకొండలవాడ గోవిందా',
    namaEn: 'Tirumala Vasa Govinda • Edukondalavada Govinda',
    blessingTe: 'సప్తగిరీశుని పవిత్ర పాదారవిందాల చెంత మీ తీర్థయాత్ర అత్యంత ఫలప్రదమై శాంతిని చేకూర్చుగాక.',
    blessingEn: 'May your sacred pilgrimage to Tirumala be deeply fulfilling, refreshing your spirit with divine grace.',
    theme: 'grace'
  },
  {
    namaTe: 'ధర్మసంరక్షక గోవిందా • దయానిధే గోవిందా',
    namaEn: 'Dharma Samrakshaka Govinda • Dayanidhe Govinda',
    blessingTe: 'ధర్మాన్ని కాపాడే కరుణామయుడు మీ జీవిత మార్గాన్ని ఎల్లప్పుడూ సన్మార్గంలో నడిపించుగాక.',
    blessingEn: 'May the treasure-house of mercy illuminate your path with wisdom, truth, and spiritual clarity.',
    theme: 'protection'
  },
  {
    namaTe: 'అమృతభాషణ గోవిందా • ఆనందరూప గోవిందా',
    namaEn: 'Amrita Bhashana Govinda • Ananda Rupa Govinda',
    blessingTe: 'దివ్య అమృత తుల్యమైన స్వామివారి కటాక్షం మీకు దీర్ఘాయువును, నిత్య ఆరోగ్యాన్ని ప్రసాదించుగాక.',
    blessingEn: 'May Lord Venkateswara bestow long life, vitality, and enduring wellness upon you and your loved ones.',
    theme: 'health'
  },
  {
    namaTe: 'శాంతిప్రదాయక గోవిందా • సర్వేశ్వర శ్రీ గోవిందా',
    namaEn: 'Shanti Pradayaka Govinda • Sarveshwara Sri Govinda',
    blessingTe: 'లోక రక్షకుడైన శ్రీ గోవిందుడు సర్వత్ర మీకు మరియు మీ బంధుమిత్రులకు శాంతిసౌభాగ్యాలు ప్రసాదించుగాక.',
    blessingEn: 'May the Supreme Protector bless your entire family with abundant prosperity, tranquility, and joy.',
    theme: 'peace'
  },
  {
    namaTe: 'పరమపావన గోవిందా • పద్మావతీప్రియ గోవిందా',
    namaEn: 'Parama Pavana Govinda • Padmavathi Priya Govinda',
    blessingTe: 'శ్రీ పద్మావతీ సమేత వేంకటేశ్వరుని ఆశీస్సులతో మీ జీవితంలో ఆనంద సంపదలు నిండారగా ప్రకాశించుగాక.',
    blessingEn: 'May the divine grace of Goddess Padmavathi and Lord Venkateswara enrich your life with joy and abundance.',
    theme: 'prosperity'
  },
  {
    namaTe: 'మోక్షదాయక గోవిందా • ముకుంద కృష్ణ గోవిందా',
    namaEn: 'Moksha Dayaka Govinda • Mukunda Krishna Govinda',
    blessingTe: 'భక్తిముక్తుల ప్రదాత అయిన శ్రీనివాసుని దివ్య కృప మీకు నిరంతరం తోడుగా ఉండుగాక.',
    blessingEn: 'May the gracious Lord ever remain your companion, guiding your soul toward highest peace and realization.',
    theme: 'grace'
  }
];

/**
 * Returns the Govinda Nama corresponding to the current bead (1..108)
 */
export function getGovindaNamaForBead(beadNumber: number): GovindaNama {
  const index = Math.max(0, (beadNumber - 1) % GOVINDA_NAMAVALI.length);
  return GOVINDA_NAMAVALI[index];
}

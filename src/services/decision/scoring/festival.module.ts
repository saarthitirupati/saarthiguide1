import { Place } from '@/data/places';
import { DerivedContext } from '../context.builder';
import { FESTIVALS_2026 } from '@/data/festivals';

export function calculateFestivalScore(place: Place, context: DerivedContext): { score: number; reason?: string; source?: string } {
  if (!context.featureFlags.festivalActive) return { score: 0 };

  const festivalsToCheck = (context.activeFestivals && context.activeFestivals.length > 0)
    ? context.activeFestivals
    : (context.activeFestival
        ? FESTIVALS_2026.filter(f => f.name.toLowerCase().includes(context.activeFestival!.toLowerCase()) || context.activeFestival!.toLowerCase().includes(f.name.toLowerCase()))
        : []);

  if (festivalsToCheck.length === 0) return { score: 0 };

  let bestScore = 0;
  let bestReason: string | undefined = undefined;
  let bestSource: string | undefined = undefined;

  for (const festival of festivalsToCheck) {
    const baseWeight = festival.scoreWeight ?? (festival.dateEnd && festival.dateEnd !== festival.date ? 30 : 60);

    // 1. Direct match: place is the primary festival venue
    if (festival.placeId === place.id) {
      if (baseWeight > bestScore) {
        bestScore = baseWeight;
        bestReason = `${festival.name} — Primary Sacred Celebrations & Pujas`;
        bestSource = 'Festival Calendar';
      }
    }

    // 2. Related temples match (e.g. Kapila Theertham & Srikalahasti on Shiva festivals, Tiruchanur on Lakshmi festivals)
    if (festival.relatedTemples && festival.relatedTemples.includes(place.id)) {
      const relatedScore = Math.round(baseWeight * 0.6);
      if (relatedScore > bestScore) {
        bestScore = relatedScore;
        bestReason = `${festival.name} — Connected Holy Shrine Festivities`;
        bestSource = 'Telugu Calendar';
      }
    }
  }

  if (bestScore > 0) {
    return { score: bestScore, reason: bestReason, source: bestSource };
  }

  // Fallback for deity/tradition heuristics
  const activeName = (context.activeFestival || '').toLowerCase();
  if (activeName.includes('shivaratri') && (place.id === 'kapila-theertham' || place.id === 'srikalahasti' || place.id === 'parasurameswara-temple')) {
    return { score: 50, reason: 'Special Maha Shivaratri Darshan & Festivities', source: 'Festival Calendar' };
  }

  return { score: 0 };
}


export interface Festival {
  id: string; // UUID or string id
  name: string;
  slug?: string;
  date: string; // ISO format 'YYYY-MM-DD'
  dateEnd?: string;
  location: string;
  importance?: string;
  description?: string;
  rituals?: string[];
  crowdPrediction?: string;
  parking?: string;
  parkingStatus?: string; // DB mapping
  alternateRoutes?: string[];
  recommendedTime: string;
  dressCode: string;
  specialTips: string;
  gravityScore: number; // 1-10
  expectedCrowd?: 'Low' | 'Moderate' | 'High' | 'Very High';
  coverImage?: string;
  relatedTemples?: string[]; // IDs
  placeId?: string; // Target temple/destination ID in places.ts
  scoreWeight?: number; // Explicit override for decision scoring (e.g. 30 for multi-day, 60 for single-day peak)
  isActive?: boolean;
  createdAt?: string;
}

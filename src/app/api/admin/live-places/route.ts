import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

let mockLivePlaces = [
  { id: 'uuid-1', name: 'Tirumala Venkateswara Temple', time: '2-3', crowd: 'HIGH', parking: 'AVAILABLE', updated: '2 mins ago' },
  { id: 'uuid-2', name: 'Kapila Theertham', time: '1', crowd: 'HIGH', parking: 'AVAILABLE', updated: '15 mins ago' },
  { id: 'uuid-3', name: 'Sri Govindaraja Swamy Temple', time: '0.5', crowd: 'MEDIUM', parking: 'AVAILABLE', updated: '1 hour ago' },
];

function normalizeCrowd(level: string | undefined): 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' {
  if (!level) return 'MEDIUM';
  const norm = level.toLowerCase().trim();
  if (norm === 'low') return 'LOW';
  if (norm === 'medium' || norm === 'moderate') return 'MEDIUM';
  if (norm === 'high') return 'HIGH';
  if (norm === 'extreme' || norm === 'very-high' || norm === 'very_high') return 'EXTREME';
  return 'MEDIUM';
}

export async function GET() {
  const globalStatus = await readStatus();
  
  // Sync the mock array with the true global status for Tirumala so it's accurate on load
  mockLivePlaces = mockLivePlaces.map(place => {
    if (place.id === 'uuid-1') {
      return {
        ...place,
        time: globalStatus.waitTime,
        crowd: normalizeCrowd(globalStatus.crowdLevel),
        parking: globalStatus.accommodationStatus === 'full' ? 'FULL' : 'AVAILABLE'
      };
    }
    return place;
  });

  return NextResponse.json({ places: mockLivePlaces });
}

export async function POST(req: Request) {
  try {
    const { id, updates } = await req.json();
    mockLivePlaces = mockLivePlaces.map(place => {
      if (place.id === id) {
        return {
          ...place,
          ...updates,
          updated: 'Just now'
        };
      }
      return place;
    });
    return NextResponse.json({ success: true, places: mockLivePlaces });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

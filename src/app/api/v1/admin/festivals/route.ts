import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('festivals').select('*').order('date', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ festivals: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug) body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    const doc = {
      slug: body.slug,
      name: body.name,
      description: body.description || '',
      festival_type: body.festival_type || body.category || 'Spiritual',
      date: body.date,
      gravity_score: Number(body.gravity_score) || 5,
      crowd_level: body.crowd_level || body.expectedCrowd || 'Moderate',
      recommended_time: body.recommended_time || body.recommendedTime || '',
      dress_code: body.dress_code || body.dressCode || '',
      parking_status: body.parking_status || body.parking || 'Available',
      visitor_notes: body.visitor_notes || body.specialTips || '',
      is_major: body.is_major !== undefined ? !!body.is_major : true,
      image_url: body.image_url || body.coverImage || '',
      status: body.status || 'Upcoming'
    };

    const { data, error } = await supabase.from('festivals').insert([doc]).select();
    if (error) throw error;

    // Guaranteed push notification for newly scheduled festival
    const { pushNotifyAll } = await import('@/lib/pushNotify');
    await pushNotifyAll({
      title: `🪔 ${doc.name}`,
      body: doc.visitor_notes || doc.description || `Upcoming festival at Tirumala — ${doc.date}. Check special rituals & crowd guidance.`,
      url: `/festivals/${doc.slug}`,
      tag: `festival-${doc.slug}-${Date.now()}`,
      category: 'High Priority'
    }).catch((err) => {
      console.error('[PushNotify] Error broadcasting new festival:', err);
    });

    return NextResponse.json({ festival: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

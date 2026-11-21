import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const query = supabase.from('places').select('*');
    const { data, error } = isUuid 
      ? await query.eq('id', id).maybeSingle()
      : await query.eq('slug', id).maybeSingle();

    if (!error && data) {
      return NextResponse.json({ place: data });
    }
  } catch (err) {
    console.error('Failed to fetch place from Supabase:', err);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const { data: schemaRow } = await supabase.from('places').select('*').limit(1);
    const validKeys = schemaRow && schemaRow.length > 0 ? new Set(Object.keys(schemaRow[0])) : null;

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(body)) {
      if (v !== undefined && (!validKeys || validKeys.has(k)) && k !== 'id' && k !== 'created_at' && k !== 'updated_at') {
        cleanUpdates[k] = v;
      }
    }
    
    // Check if the record already exists by UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let existingId: string | null = null;
    
    if (isUuid) {
      const { data: existing } = await supabase.from('places').select('id').eq('id', id).maybeSingle();
      if (existing?.id) existingId = existing.id;
    } else {
      const { data: existing } = await supabase.from('places').select('id').eq('slug', id).maybeSingle();
      if (existing?.id) existingId = existing.id;
    }

    if (existingId) {
      cleanUpdates.id = existingId;
    } else if (isUuid) {
      cleanUpdates.id = id;
    } else {
      delete cleanUpdates.id;
    }

    if (validKeys && validKeys.has('slug') && !cleanUpdates.slug) {
      cleanUpdates.slug = id;
    }

    if (validKeys) {
      if (validKeys.has('_dynamic')) cleanUpdates._dynamic = true;
      if (validKeys.has('updated_at')) cleanUpdates.updated_at = new Date().toISOString();
    } else {
      delete cleanUpdates._dynamic;
    }

    let resultData: any = null;
    if (existingId) {
      const { data, error } = await supabase
        .from('places')
        .update(cleanUpdates)
        .eq('id', existingId)
        .select();
      if (error) throw error;
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('places')
        .insert(cleanUpdates)
        .select();
      if (error) throw error;
      resultData = data;
    }

    return NextResponse.json({ place: resultData?.[0] || cleanUpdates });
  } catch (e: any) {
    console.error('[v1 Admin Places PUT Catch]', e);
    return NextResponse.json({ error: e.message || 'Failed to update place' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  try {
    const query = supabase.from('places');
    const { error } = isUuid
      ? await query.delete().eq('id', id)
      : await query.delete().eq('slug', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

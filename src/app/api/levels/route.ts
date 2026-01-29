import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { levelSchema } from '@/lib/validations/level';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = levelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('levels')
      .insert({
        title: validation.data.title,
        description: validation.data.description,
        order_index: validation.data.order_index,
        is_active: validation.data.is_active,
        content: validation.data.content,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: 'Database error', 
        message: error.message,
        code: error.code,
        details: error.details 
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[LEVEL_POST]', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


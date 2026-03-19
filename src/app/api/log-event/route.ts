import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ExerciseType } from '@/types';
import { formatInTimeZone } from 'date-fns-tz';

const VALID_TYPES: ExerciseType[] = ['gym', 'running', 'crossfit', 'boxing', 'pilates', 'yoga'];

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { exercise_type, logged_date } = body as {
    exercise_type: ExerciseType;
    logged_date: string;
  };

  if (!VALID_TYPES.includes(exercise_type)) {
    return NextResponse.json({ error: 'Invalid exercise type' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .single();

  const tz = profile?.timezone ?? 'UTC';
  const todayInUserTz = formatInTimeZone(new Date(), tz, 'yyyy-MM-dd');

  if (logged_date !== todayInUserTz) {
    return NextResponse.json(
      { error: 'Past records are locked. You can only log today.' },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from('tracked_events')
    .upsert(
      { user_id: user.id, exercise_type, logged_date },
      { onConflict: 'user_id,logged_date' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

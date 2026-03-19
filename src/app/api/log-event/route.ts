import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ExerciseType } from '@/types';
import { formatInTimeZone } from 'date-fns-tz';

const VALID_TYPES: ExerciseType[] = ['gym', 'running', 'crossfit', 'boxing', 'pilates', 'yoga'];

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error('[log-event] Auth failed:', authError?.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { exercise_type, logged_date } = body as {
    exercise_type: ExerciseType;
    logged_date: string;
  };

  if (!VALID_TYPES.includes(exercise_type)) {
    console.error('[log-event] Invalid exercise type:', exercise_type);
    return NextResponse.json({ error: 'Invalid exercise type' }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[log-event] Failed to fetch user profile:', profileError.message);
  }

  const tz = profile?.timezone ?? 'UTC';
  const todayInUserTz = formatInTimeZone(new Date(), tz, 'yyyy-MM-dd');
  console.log('[log-event] user=%s tz=%s today=%s logged_date=%s', user.id, tz, todayInUserTz, logged_date);

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
    console.error('[log-event] Upsert failed:', error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { logged_date } = await request.json() as { logged_date: string };

  const { data: profile } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', user.id)
    .maybeSingle();

  const tz = profile?.timezone ?? 'UTC';
  const todayInUserTz = formatInTimeZone(new Date(), tz, 'yyyy-MM-dd');

  if (logged_date !== todayInUserTz) {
    return NextResponse.json({ error: 'Past records are locked.' }, { status: 403 });
  }

  const { error } = await supabase
    .from('tracked_events')
    .delete()
    .eq('user_id', user.id)
    .eq('logged_date', logged_date);

  if (error) {
    console.error('[log-event] Delete failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

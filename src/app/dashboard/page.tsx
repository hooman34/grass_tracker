import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import DashboardClient from './DashboardClient';
import FeedList from '@/components/feed/FeedList';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) console.error('[dashboard] getUser error:', authError.message);
  if (!user) {
    console.log('[dashboard] No user, redirecting to login');
    redirect('/login');
  }

  const startOfThisYear = new Date(new Date().getFullYear(), 0, 1);
  const cutoff = startOfThisYear.toISOString().split('T')[0];

  const [
    { data: events, error: eventsError },
    { data: profile, error: profileError },
    { data: allUsers },
  ] = await Promise.all([
    supabase
      .from('tracked_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_date', cutoff)
      .order('logged_date', { ascending: true }),
    supabase
      .from('users')
      .select('username, timezone')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('users')
      .select('id, username, timezone')
      .neq('id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const feedUserIds = (allUsers ?? []).map(u => u.id);
  const { data: allEvents } = feedUserIds.length
    ? await supabase
        .from('tracked_events')
        .select('*')
        .in('user_id', feedUserIds)
        .gte('logged_date', cutoff)
    : { data: [] as typeof events };

  if (eventsError) console.error('[dashboard] events fetch error:', eventsError.message);
  if (profileError) console.error('[dashboard] profile fetch error:', profileError.message);

  if (!profile) {
    console.log('[dashboard] No profile found, creating fallback profile for user:', user.id);
    const { error: insertError } = await supabase.from('users').upsert({
      id: user.id,
      username: user.email?.split('@')[0] ?? `user_${user.id.slice(0, 8)}`,
      timezone: 'UTC',
    }, { onConflict: 'id' });
    if (insertError) console.error('[dashboard] Profile creation failed:', insertError.message);
  }

  console.log('[dashboard] user=%s events=%d profile=%s', user.id, events?.length ?? 0, profile?.username);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {profile?.username ?? 'Your'} Activity
        </h1>
        <DashboardClient
          initialEvents={events ?? []}
          userId={user.id}
          currentTimezone={profile?.timezone ?? 'UTC'}
        />

        {(allUsers ?? []).length > 0 && (
          <>
            <hr className="my-10 border-gray-200 dark:border-gray-800" />
            <FeedList users={allUsers ?? []} events={allEvents ?? []} />
          </>
        )}
      </main>
    </>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) console.error('[dashboard] getUser error:', authError.message);
  if (!user) {
    console.log('[dashboard] No user, redirecting to login');
    redirect('/login');
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const [
    { data: events, error: eventsError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    supabase
      .from('tracked_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_date', oneYearAgo.toISOString().split('T')[0])
      .order('logged_date', { ascending: true }),
    supabase
      .from('users')
      .select('username, timezone')
      .eq('id', user.id)
      .single(),
  ]);

  if (eventsError) console.error('[dashboard] events fetch error:', eventsError.message);
  if (profileError) console.error('[dashboard] profile fetch error:', profileError.message);

  console.log('[dashboard] user=%s events=%d profile=%s', user.id, events?.length ?? 0, profile?.username);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {profile?.username ?? 'Your'} Activity
        </h1>
        <DashboardClient initialEvents={events ?? []} />
      </main>
    </>
  );
}

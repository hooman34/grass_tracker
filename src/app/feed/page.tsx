import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import FeedList from '@/components/feed/FeedList';

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const cutoff = oneYearAgo.toISOString().split('T')[0];

  const [{ data: users }, { data: events }] = await Promise.all([
    supabase
      .from('users')
      .select('id, username, timezone')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('tracked_events')
      .select('*')
      .gte('logged_date', cutoff),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Community Feed</h1>
        <FeedList users={users ?? []} events={events ?? []} />
      </main>
    </>
  );
}

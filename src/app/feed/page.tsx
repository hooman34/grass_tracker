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

  const { data: users } = await supabase
    .from('users')
    .select('id, username, timezone')
    .order('created_at', { ascending: false })
    .limit(50);

  const userIds = (users ?? []).map(u => u.id);
  const { data: events } = userIds.length
    ? await supabase
        .from('tracked_events')
        .select('*')
        .in('user_id', userIds)
        .gte('logged_date', cutoff)
    : { data: [] as never[] };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Community Feed</h1>
        <FeedList users={users ?? []} events={events ?? []} />
      </main>
    </>
  );
}

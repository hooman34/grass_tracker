import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) console.error('[home] getUser error:', error.message);
  console.log('[home] user:', user?.id ?? 'none');

  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}

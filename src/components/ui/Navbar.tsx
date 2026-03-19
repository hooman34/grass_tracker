'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const linkClass = (href: string) =>
    `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
      pathname === href
        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight">
          Grass Tracker
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <button
            onClick={handleSignOut}
            className="ml-2 text-sm font-medium px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

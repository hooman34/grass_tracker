'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Check your email — a reset link has been sent to <strong>{email}</strong>.
        </p>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-2 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="text-blue-600 hover:underline">Back to sign in</Link>
      </p>
    </form>
  );
}

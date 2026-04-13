'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import WorkoutPicker from '@/components/tracker/WorkoutPicker';
import ContributionGraph from '@/components/graph/ContributionGraph';
import GraphLegend from '@/components/graph/GraphLegend';
import { ExerciseType, TrackedEvent } from '@/types';

interface Props {
  initialEvents: TrackedEvent[];
  userId: string;
  currentTimezone: string;
}

export default function DashboardClient({ initialEvents, userId, currentTimezone }: Props) {
  const [events, setEvents] = useState<TrackedEvent[]>(initialEvents);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Sync browser timezone to DB on mount, but only if it's still UTC (unset)
  useEffect(() => {
    if (currentTimezone !== 'UTC') return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz || tz === 'UTC') return;
    const supabase = createClient();
    supabase.from('users').update({ timezone: tz }).eq('id', userId).then(() => {});
  }, [userId, currentTimezone]);
  const todayEvent = events.find(e => e.logged_date === today);

  const handleLog = async (exercise_type: ExerciseType) => {
    // Tapping the same type again → delete
    if (todayEvent?.exercise_type === exercise_type) {
      const res = await fetch('/api/log-event', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logged_date: today }),
      });
      if (!res.ok) {
        const body = await res.json();
        console.error('[delete] failed:', res.status, body);
        return;
      }
      setEvents(prev => prev.filter(e => e.logged_date !== today));
      return;
    }

    const res = await fetch('/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise_type, logged_date: today }),
    });
    if (!res.ok) return;

    const { data: newEvent } = await res.json();
    setEvents(prev => [
      ...prev.filter(e => e.logged_date !== today),
      newEvent,
    ]);
  };

  return (
    <>
      <div className="sm:hidden">
        <ContributionGraph events={events} size="sm" />
      </div>
      <div className="hidden sm:block">
        <ContributionGraph events={events} />
      </div>
      <GraphLegend />
      <div className="mt-6 sm:mt-8">
        <WorkoutPicker
          currentSelection={todayEvent?.exercise_type ?? null}
          onLog={handleLog}
        />
      </div>
    </>
  );
}

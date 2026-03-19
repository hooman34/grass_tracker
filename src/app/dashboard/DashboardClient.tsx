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
}

export default function DashboardClient({ initialEvents }: Props) {
  const [events, setEvents] = useState<TrackedEvent[]>(initialEvents);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Sync browser timezone to DB on mount
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const supabase = createClient();
    supabase.from('users').update({ timezone: tz }).eq('timezone', 'UTC').then(() => {});
  }, []);
  const todayEvent = events.find(e => e.logged_date === today);

  const handleLog = async (exercise_type: ExerciseType) => {
    // Tapping the same type again → delete
    if (todayEvent?.exercise_type === exercise_type) {
      const res = await fetch('/api/log-event', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logged_date: today }),
      });
      if (!res.ok) return;
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
      <ContributionGraph events={events} />
      <GraphLegend />
      <div className="mt-8">
        <WorkoutPicker
          currentSelection={todayEvent?.exercise_type ?? null}
          onLog={handleLog}
        />
      </div>
    </>
  );
}

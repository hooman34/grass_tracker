'use client';

import { useState } from 'react';
import { format } from 'date-fns';
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
  const todayEvent = events.find(e => e.logged_date === today);

  const handleLog = async (exercise_type: ExerciseType) => {
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

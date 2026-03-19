'use client';

import { useEffect, useRef } from 'react';
import { TrackedEvent } from '@/types';
import { generateYearGrid, groupIntoWeeks } from '@/lib/utils';
import GraphSquare from './GraphSquare';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Props {
  events: TrackedEvent[];
  size?: 'sm' | 'md';
}

export default function ContributionGraph({ events, size = 'md' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const days = generateYearGrid();
  const weeks = groupIntoWeeks(days);
  const eventMap = new Map(events.map(e => [e.logged_date, e.exercise_type]));
  const gap = size === 'sm' ? 'gap-[2px]' : 'gap-[3px]';
  const cellClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  const labelClass = 'text-[10px] text-gray-400 leading-none';
  const cellSize = size === 'sm' ? 8 : 12;

  return (
    <div ref={scrollRef} className="overflow-x-auto">
      <div className={`flex ${gap}`}>
        {size === 'md' && (
          <div className={`flex flex-col ${gap} mr-1`}>
            {DAY_LABELS.map(label => (
              <div key={label} style={{ height: cellSize }} className={`flex items-center ${labelClass}`}>
                {label}
              </div>
            ))}
          </div>
        )}
        {weeks.map((week, wi) => (
          <div key={wi} className={`flex flex-col ${gap}`}>
            {week.map((date, di) =>
              date ? (
                <GraphSquare
                  key={date}
                  date={date}
                  exerciseType={eventMap.get(date) ?? null}
                  size={size}
                />
              ) : (
                <div key={`empty-${wi}-${di}`} className={cellClass} />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

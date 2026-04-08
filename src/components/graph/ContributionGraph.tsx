'use client';

import { useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { TrackedEvent } from '@/types';
import { generateYearGrid, groupIntoWeeks } from '@/lib/utils';
import { EXERCISE_COLORS } from '@/lib/constants';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Props {
  events: TrackedEvent[];
  size?: 'sm' | 'md';
  /** If set, only render the last N weeks ending with today's week. */
  lastNWeeks?: number;
}

export default function ContributionGraph({ events, size = 'md', lastNWeeks }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const cell = size === 'sm' ? 8 : 12;
  const gap = size === 'sm' ? 2 : 3;
  const step = cell + gap;
  // Drop the day-label gutter on the windowed view to save horizontal space.
  const showDayLabels = size === 'md' && !lastNWeeks;
  const labelWidth = showDayLabels ? 28 : 0;

  const { weeks, eventMap } = useMemo(() => {
    const allWeeks = groupIntoWeeks(generateYearGrid());
    let visibleWeeks = allWeeks;
    if (lastNWeeks) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      let todayIdx = allWeeks.findIndex(w => w.includes(todayStr));
      if (todayIdx === -1) todayIdx = allWeeks.length - 1;
      const start = Math.max(0, todayIdx - lastNWeeks + 1);
      visibleWeeks = allWeeks.slice(start, todayIdx + 1);
    }
    return {
      weeks: visibleWeeks,
      eventMap: new Map(events.map(e => [e.logged_date, e.exercise_type])),
    };
  }, [events, lastNWeeks]);

  const width = labelWidth + weeks.length * step - gap;
  const height = 7 * step - gap;

  return (
    <div ref={scrollRef} className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Workout activity, ${events.length} active days`}
        shapeRendering="crispEdges"
      >
        {showDayLabels &&
          DAY_LABELS.map((label, i) => (
            <text
              key={label}
              x={0}
              y={i * step + cell - 1}
              fontSize={10}
              fill="#9ca3af"
            >
              {label}
            </text>
          ))}
        {weeks.map((week, wi) =>
          week.map((date, di) => {
            if (!date) return null;
            const type = eventMap.get(date);
            const fill = type ? EXERCISE_COLORS[type] : EXERCISE_COLORS.empty;
            return (
              <rect
                key={date}
                x={labelWidth + wi * step}
                y={di * step}
                width={cell}
                height={cell}
                rx={1.5}
                fill={fill}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

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
}

export default function ContributionGraph({ events, size = 'md' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<SVGRectElement>(null);

  const cell = size === 'sm' ? 8 : 12;
  const gap = size === 'sm' ? 2 : 3;
  const step = cell + gap;
  const showDayLabels = size === 'md';
  const labelWidth = showDayLabels ? 28 : 0;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const { weeks, eventMap } = useMemo(() => {
    const allWeeks = groupIntoWeeks(generateYearGrid());
    return {
      weeks: allWeeks,
      eventMap: new Map(events.map(e => [e.logged_date, e.exercise_type])),
    };
  }, [events]);

  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const rect = todayRef.current;
      // Scroll so today's cell is near the right side of the visible area
      const cellLeft = rect.x.baseVal.value;
      container.scrollLeft = cellLeft - container.clientWidth + step * 2;
    }
  }, [weeks, step]);

  const width = labelWidth + weeks.length * step - gap;
  const height = 7 * step - gap;

  return (
    <div ref={scrollRef} className="overflow-x-auto max-w-full">
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
            const isToday = date === todayStr;
            return (
              <rect
                key={date}
                ref={isToday ? todayRef : undefined}
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

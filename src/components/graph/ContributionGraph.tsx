import { TrackedEvent } from '@/types';
import { generate365DayGrid, getLeadingEmptyCells } from '@/lib/utils';
import GraphSquare from './GraphSquare';

interface Props {
  events: TrackedEvent[];
  size?: 'sm' | 'md';
}

export default function ContributionGraph({ events, size = 'md' }: Props) {
  const days = generate365DayGrid();
  const leadingEmpties = getLeadingEmptyCells(days);
  const eventMap = new Map(events.map(e => [e.logged_date, e.exercise_type]));
  const gap = size === 'sm' ? 'gap-[2px]' : 'gap-[3px]';

  return (
    <div className="overflow-x-auto">
      <div
        className={`grid grid-rows-7 grid-flow-col ${gap}`}
        style={{ gridTemplateRows: 'repeat(7, 1fr)' }}
      >
        {Array.from({ length: leadingEmpties }).map((_, i) => (
          <div key={`empty-${i}`} className={size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} />
        ))}
        {days.map(date => (
          <GraphSquare
            key={date}
            date={date}
            exerciseType={eventMap.get(date) ?? null}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

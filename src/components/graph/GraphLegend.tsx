import { EXERCISE_CATEGORIES, EXERCISE_COLORS, EXERCISE_LABELS } from '@/lib/constants';

export default function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600 dark:text-gray-400">
      {EXERCISE_CATEGORIES.map(type => (
        <span key={type} className="flex items-center gap-1">
          <span className={`inline-block w-3 h-3 rounded-sm ${EXERCISE_COLORS[type]}`} />
          {EXERCISE_LABELS[type]}
        </span>
      ))}
      <span className="flex items-center gap-1">
        <span className={`inline-block w-3 h-3 rounded-sm ${EXERCISE_COLORS.empty}`} />
        None
      </span>
    </div>
  );
}

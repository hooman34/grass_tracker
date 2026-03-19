import { ExerciseType } from '@/types';
import { EXERCISE_COLORS, EXERCISE_LABELS } from '@/lib/constants';

interface Props {
  date: string;
  exerciseType: ExerciseType | null;
  size?: 'sm' | 'md';
}

export default function GraphSquare({ date, exerciseType, size = 'md' }: Props) {
  const colorClass = exerciseType
    ? EXERCISE_COLORS[exerciseType]
    : EXERCISE_COLORS.empty;

  const tooltip = exerciseType
    ? `${EXERCISE_LABELS[exerciseType]} — ${date}`
    : date;

  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div
      title={tooltip}
      className={`${sizeClass} rounded-sm cursor-default transition-opacity hover:opacity-75 ${colorClass}`}
      aria-label={tooltip}
    />
  );
}

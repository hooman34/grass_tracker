'use client';

import { useState } from 'react';
import { ExerciseType } from '@/types';
import { EXERCISE_CATEGORIES, EXERCISE_COLORS, EXERCISE_LABELS } from '@/lib/constants';

interface Props {
  currentSelection: ExerciseType | null;
  onLog: (type: ExerciseType) => Promise<void>;
}

export default function WorkoutPicker({ currentSelection, onLog }: Props) {
  const [loading, setLoading] = useState<ExerciseType | null>(null);

  const handleClick = async (type: ExerciseType) => {
    setLoading(type);
    await onLog(type);
    setLoading(null);
  };

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {currentSelection
          ? `Today: ${EXERCISE_LABELS[currentSelection]} — tap to change or deselect`
          : 'What did you do today?'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {EXERCISE_CATEGORIES.map(type => {
          const isSelected = currentSelection === type;
          const isLoading = loading === type;
          const color = EXERCISE_COLORS[type];
          const isLight = ['#C6AC8F', '#F6BD60'].includes(color);

          return (
            <button
              key={type}
              onClick={() => handleClick(type)}
              disabled={!!loading}
              style={{ backgroundColor: color }}
              className={[
                'px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-150',
                isLight ? 'text-gray-900' : 'text-white',
                isSelected ? 'ring-2 ring-offset-2 ring-gray-400 opacity-100' : 'opacity-80 hover:opacity-100',
                isLoading ? 'animate-pulse' : '',
                'disabled:cursor-wait',
              ].join(' ')}
            >
              {isLoading ? '…' : EXERCISE_LABELS[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

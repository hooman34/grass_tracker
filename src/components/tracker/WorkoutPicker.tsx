'use client';

import { useState } from 'react';
import { ExerciseType } from '@/types';
import { EXERCISE_CATEGORIES, EXERCISE_COLORS, EXERCISE_RING_COLORS, EXERCISE_LABELS } from '@/lib/constants';

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
          ? `Today: ${EXERCISE_LABELS[currentSelection]} — tap to change`
          : 'What did you do today?'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {EXERCISE_CATEGORIES.map(type => {
          const isSelected = currentSelection === type;
          const isLoading = loading === type;
          return (
            <button
              key={type}
              onClick={() => handleClick(type)}
              disabled={!!loading}
              className={[
                'px-4 py-3 rounded-lg font-semibold text-white text-sm',
                'transition-all duration-150 ring-offset-2',
                EXERCISE_COLORS[type],
                isSelected ? `ring-2 ${EXERCISE_RING_COLORS[type]} opacity-100` : 'opacity-80 hover:opacity-100',
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

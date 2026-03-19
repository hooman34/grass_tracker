import { ExerciseType } from '@/types';

export const EXERCISE_CATEGORIES: ExerciseType[] = [
  'gym', 'running', 'crossfit', 'boxing', 'pilates', 'yoga'
];

export const EXERCISE_COLORS: Record<ExerciseType | 'empty', string> = {
  gym:      'bg-blue-500',
  running:  'bg-orange-500',
  crossfit: 'bg-red-500',
  boxing:   'bg-purple-500',
  pilates:  'bg-pink-400',
  yoga:     'bg-teal-500',
  empty:    'bg-gray-200 dark:bg-gray-700',
};

export const EXERCISE_RING_COLORS: Record<ExerciseType, string> = {
  gym:      'ring-blue-500',
  running:  'ring-orange-500',
  crossfit: 'ring-red-500',
  boxing:   'ring-purple-500',
  pilates:  'ring-pink-400',
  yoga:     'ring-teal-500',
};

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  gym:      'Gym',
  running:  'Running',
  crossfit: 'CrossFit',
  boxing:   'Boxing',
  pilates:  'Pilates',
  yoga:     'Yoga',
};

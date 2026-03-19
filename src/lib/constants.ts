import { ExerciseType } from '@/types';

export const EXERCISE_CATEGORIES: ExerciseType[] = [
  'gym', 'running', 'crossfit', 'boxing', 'pilates', 'yoga'
];

export const EXERCISE_COLORS: Record<ExerciseType | 'empty', string> = {
  running:  '#CE6D8B',
  gym:      '#3DA35D',
  crossfit: '#2274A5',
  boxing:   '#C6AC8F',
  pilates:  '#5E503F',
  yoga:     '#F6BD60',
  empty:    '#E5E7EB',
};

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  gym:      'Gym',
  running:  'Running',
  crossfit: 'CrossFit',
  boxing:   'Boxing',
  pilates:  'Pilates',
  yoga:     'Yoga',
};

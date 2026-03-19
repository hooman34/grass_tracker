export type ExerciseType = 'gym' | 'running' | 'crossfit' | 'boxing' | 'pilates' | 'yoga';

export interface TrackedEvent {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  logged_date: string; // 'YYYY-MM-DD'
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  timezone: string;
}

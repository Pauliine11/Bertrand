export type LevelStatus = 'locked' | 'unlocked' | 'completed';

export interface StoryLevel {
  id: string;
  title: string;
  description: string;
  status: LevelStatus;
  order: number;
}


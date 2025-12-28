export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface SoundTrack {
  id: string;
  title: string;
  url: string; // Embed URL
}
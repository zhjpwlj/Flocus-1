export enum AppModule {
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  TIMER = 'TIMER',
  POMODORO = 'POMODORO',
  JOURNAL = 'JOURNAL',
  SOCIAL = 'SOCIAL',
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  project: string;
  dueDate?: string;
}

export interface TimeEntry {
  id: string;
  description: string;
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  project: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'happy' | 'neutral' | 'focused' | 'tired';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

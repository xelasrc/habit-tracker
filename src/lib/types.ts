export interface Habit {
  id: string;
  name: string;
  createdAt: string; // local "YYYY-MM-DD" — habit only counts on/after this date
  archivedAt: string | null; // local "YYYY-MM-DD", or null if active
  completedDates: string[]; // local "YYYY-MM-DD" dates this habit was ticked
}

export interface HabitGroup {
  id: string;
  name: string;
  goalDays: number; // target streak length; a milestone, not a cap
  createdAt: string;
  habits: Habit[];
}

export interface StoredData {
  version: 1;
  groups: HabitGroup[];
}

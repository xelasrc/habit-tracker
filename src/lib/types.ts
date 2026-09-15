export interface Habit {
  id: string;
  name: string;
  color: string; // hex, from lib/colors.ts PALETTE
  completedDates: string[]; // local "YYYY-MM-DD" dates this habit was ticked
}

export interface Routine {
  id: string;
  name: string;
  color: string; // hex, from lib/colors.ts PALETTE
  habits: Habit[];
}

export interface StoredData {
  version: 1;
  routines: Routine[];
}

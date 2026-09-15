export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // local "YYYY-MM-DD" dates this habit was ticked
}

export interface Routine {
  id: string;
  name: string;
  habits: Habit[];
}

export interface StoredData {
  version: 1;
  routines: Routine[];
}

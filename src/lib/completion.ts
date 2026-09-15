import { toLocalISODate } from "./date";
import type { Routine } from "./types";

export const MAP_COLUMNS = 14;
export const MAP_ROWS = 4;
export const MAP_DAYS = MAP_COLUMNS * MAP_ROWS;

export function lastNDates(n: number, referenceDate: Date = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    dates.push(toLocalISODate(d));
  }
  return dates;
}

export function isRoutineDayComplete(routine: Routine, dateISO: string): boolean {
  if (routine.habits.length === 0) return false;
  return routine.habits.every((h) => h.completedDates.includes(dateISO));
}

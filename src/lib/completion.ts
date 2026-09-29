import { toLocalISODate } from "./date";
import type { Habit, Routine } from "./types";

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

// A day only counts against a routine's daily-frequency habits — weekly
// habits aren't required every day, so they're excluded from this check.
// If a routine has no daily habits at all (rare, all-weekly), fall back to
// requiring every habit that day as an honest "perfect day" indicator;
// there's no streak counter to reconcile against, so this doesn't need to
// be more sophisticated than that. Paused habits are excluded entirely —
// they aren't currently being tracked, so they shouldn't be able to make a
// day (past or present) read as incomplete.
export function isRoutineDayComplete(routine: Routine, dateISO: string): boolean {
  const active = routine.habits.filter((h) => h.pausedAt === null);
  const daily = active.filter((h) => h.frequency.type === "daily");
  const toCheck = daily.length > 0 ? daily : active;
  return toCheck.length > 0 && toCheck.every((h) => h.completedDates.includes(dateISO));
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun..6=Sat
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); // shift back to Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeeklyProgress(
  habit: Habit,
  referenceDate: Date = new Date()
): { done: number; target: number } {
  if (habit.frequency.type !== "weekly") return { done: 0, target: 0 };
  const start = startOfWeek(referenceDate);
  const startISO = toLocalISODate(start);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const endISO = toLocalISODate(end);
  // Plain string comparison is safe here: "YYYY-MM-DD" sorts lexicographically
  // in the same order as chronologically, same assumption the rest of this
  // file already relies on.
  const done = habit.completedDates.filter((d) => d >= startISO && d <= endISO).length;
  return { done, target: habit.frequency.timesPerWeek };
}

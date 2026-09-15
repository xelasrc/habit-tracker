import { addDaysISO, toLocalISODate } from "./date";
import type { Habit, Routine } from "./types";

function activeHabitsOn(routine: Routine, dateISO: string): Habit[] {
  return routine.habits.filter(
    (h) => h.createdAt <= dateISO && (h.archivedAt === null || dateISO < h.archivedAt)
  );
}

export function isDayComplete(routine: Routine, dateISO: string): boolean {
  const active = activeHabitsOn(routine, dateISO);
  if (active.length === 0) return false;
  return active.every((h) => h.completedDates.includes(dateISO));
}

export function computeStreak(routine: Routine, referenceDate: Date = new Date()): number {
  const todayISODate = toLocalISODate(referenceDate);
  // Today "not yet ticked" isn't a failure — the day isn't over yet. Only start
  // counting from today if it's already complete; otherwise begin from yesterday
  // so an in-progress day doesn't zero the streak before it's decided.
  let cursor = isDayComplete(routine, todayISODate) ? todayISODate : addDaysISO(todayISODate, -1);
  let streak = 0;
  while (activeHabitsOn(routine, cursor).length > 0 && isDayComplete(routine, cursor)) {
    streak++;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

export function getTodayProgress(
  routine: Routine,
  referenceDate: Date = new Date()
): { done: number; total: number; isComplete: boolean } {
  const todayISODate = toLocalISODate(referenceDate);
  const active = activeHabitsOn(routine, todayISODate);
  const done = active.filter((h) => h.completedDates.includes(todayISODate)).length;
  return { done, total: active.length, isComplete: active.length > 0 && done === active.length };
}

export function activeHabits(routine: Routine, dateISO: string): Habit[] {
  return activeHabitsOn(routine, dateISO);
}

import { addDaysISO, toLocalISODate } from "./date";
import type { Habit, HabitGroup } from "./types";

function activeHabitsOn(group: HabitGroup, dateISO: string): Habit[] {
  return group.habits.filter(
    (h) => h.createdAt <= dateISO && (h.archivedAt === null || dateISO < h.archivedAt)
  );
}

export function isDayComplete(group: HabitGroup, dateISO: string): boolean {
  const active = activeHabitsOn(group, dateISO);
  if (active.length === 0) return false;
  return active.every((h) => h.completedDates.includes(dateISO));
}

export function computeStreak(group: HabitGroup, referenceDate: Date = new Date()): number {
  const todayISODate = toLocalISODate(referenceDate);
  // Today "not yet ticked" isn't a failure — the day isn't over yet. Only start
  // counting from today if it's already complete; otherwise begin from yesterday
  // so an in-progress day doesn't zero the streak before it's decided.
  let cursor = isDayComplete(group, todayISODate) ? todayISODate : addDaysISO(todayISODate, -1);
  let streak = 0;
  while (activeHabitsOn(group, cursor).length > 0 && isDayComplete(group, cursor)) {
    streak++;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

export function getTodayProgress(
  group: HabitGroup,
  referenceDate: Date = new Date()
): { done: number; total: number; isComplete: boolean } {
  const todayISODate = toLocalISODate(referenceDate);
  const active = activeHabitsOn(group, todayISODate);
  const done = active.filter((h) => h.completedDates.includes(todayISODate)).length;
  return { done, total: active.length, isComplete: active.length > 0 && done === active.length };
}

export function activeHabits(group: HabitGroup, dateISO: string): Habit[] {
  return activeHabitsOn(group, dateISO);
}

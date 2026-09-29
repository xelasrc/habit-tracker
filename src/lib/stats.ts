import { toLocalISODate } from "./date";
import { isRoutineDayComplete } from "./completion";
import type { Habit, Routine } from "./types";

export function ticksInWindow(
  habit: Habit,
  days: number,
  referenceDate: Date = new Date()
): number {
  const dates = new Set(habit.completedDates);
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    if (dates.has(toLocalISODate(d))) count++;
  }
  return count;
}

// Consecutive days ending today, where "today not yet ticked" isn't treated
// as a break (the day isn't over) -- same nuance the app's earlier streak
// logic used before it was removed; this is a standalone stats-page metric,
// not a revival of that feature (no goal, no reset messaging elsewhere).
export function currentStreak(habit: Habit, referenceDate: Date = new Date()): number {
  const dates = new Set(habit.completedDates);
  const todayISODate = toLocalISODate(referenceDate);
  const cursor = new Date(referenceDate);
  if (!dates.has(todayISODate)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (dates.has(toLocalISODate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function longestStreak(habit: Habit): number {
  if (habit.completedDates.length === 0) return 0;
  const sorted = [...new Set(habit.completedDates)].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diffDays = Math.round(
      (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86_400_000
    );
    current = diffDays === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
  }
  return longest;
}

export function routineCompletionCount(
  routine: Routine,
  days: number,
  referenceDate: Date = new Date()
): number {
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    if (isRoutineDayComplete(routine, toLocalISODate(d))) count++;
  }
  return count;
}

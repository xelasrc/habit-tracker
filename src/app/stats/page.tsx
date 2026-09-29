"use client";

import Link from "next/link";
import { useRoutines } from "@/context/RoutinesContext";
import { EmptyState } from "@/components/EmptyState";
import { ticksInWindow, currentStreak, longestStreak, routineCompletionCount } from "@/lib/stats";
import { tintBorder, tintBadge } from "@/lib/colors";

const WINDOW_DAYS = 30;

export default function StatsPage() {
  const { routines, hydrated } = useRoutines();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 pb-10 sm:p-6">
      <Link
        href="/"
        className="flex min-h-11 w-fit items-center text-sm font-medium text-foreground/60"
      >
        &larr; Back
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>

      {!hydrated ? null : routines.length === 0 ? (
        <EmptyState
          title="No stats yet"
          description="Create a routine and start ticking off habits to see your stats here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {routines.map((routine) => {
            const activeHabits = routine.habits.filter((h) => h.pausedAt === null);
            const routineDays = routineCompletionCount(routine, WINDOW_DAYS);
            return (
              <div
                key={routine.id}
                className="flex flex-col gap-3 rounded-2xl border bg-surface p-4"
                style={{ borderColor: tintBorder(routine.color) }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      style={{ backgroundColor: routine.color }}
                      className="size-2.5 shrink-0 rounded-full"
                    />
                    <span className="truncate text-base font-semibold">{routine.name}</span>
                  </div>
                  <span
                    style={{ backgroundColor: tintBadge(routine.color), color: routine.color }}
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                  >
                    {routineDays}/{WINDOW_DAYS} full days
                  </span>
                </div>

                {activeHabits.length === 0 ? (
                  <p className="text-sm text-foreground/50">No active habits.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-border">
                    {activeHabits.map((habit) => {
                      const ticks = ticksInWindow(habit, WINDOW_DAYS);
                      const best = longestStreak(habit);
                      const streak = habit.frequency.type === "daily" ? currentStreak(habit) : null;
                      return (
                        <div key={habit.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden
                              style={{ backgroundColor: habit.color }}
                              className="size-2 shrink-0 rounded-full"
                            />
                            <span className="truncate text-sm font-medium">{habit.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-4 text-xs text-foreground/50">
                            {habit.frequency.type === "daily" ? (
                              <span>
                                {ticks}/{WINDOW_DAYS} days ({Math.round((ticks / WINDOW_DAYS) * 100)}%)
                              </span>
                            ) : (
                              <span>
                                {ticks} times in the last {WINDOW_DAYS} days
                              </span>
                            )}
                            {streak !== null && <span>Current streak: {streak}d</span>}
                            <span>Best streak: {best}d</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

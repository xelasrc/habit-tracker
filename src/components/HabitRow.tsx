"use client";

import { todayISO } from "@/lib/date";
import { lastNDates, MAP_DAYS } from "@/lib/completion";
import type { Habit } from "@/lib/types";
import { useRoutines } from "@/context/RoutinesContext";
import { HabitMap } from "./HabitMap";

export function HabitRow({
  routineId,
  habit,
  showDelete = true,
}: {
  routineId: string;
  habit: Habit;
  showDelete?: boolean;
}) {
  const { toggleHabitToday, deleteHabit } = useRoutines();
  const today = todayISO();
  const checked = habit.completedDates.includes(today);
  const dates = lastNDates(MAP_DAYS);

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-medium">{habit.name}</span>
          {showDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${habit.name}"?`)) {
                  deleteHabit(routineId, habit.id);
                }
              }}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-foreground/30 transition-colors active:bg-foreground/10 active:text-danger"
              aria-label={`Delete ${habit.name}`}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-label={
            checked ? `Mark ${habit.name} as not done today` : `Mark ${habit.name} as done today`
          }
          onClick={() => toggleHabitToday(routineId, habit.id)}
          className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            checked
              ? "border-accent bg-accent text-accent-foreground"
              : "border-foreground/20 text-transparent active:border-accent"
          }`}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <HabitMap dates={dates} isDone={(d) => habit.completedDates.includes(d)} />
    </div>
  );
}

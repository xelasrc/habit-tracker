"use client";

import { todayISO } from "@/lib/date";
import { activeHabits } from "@/lib/streak";
import type { Routine } from "@/lib/types";
import { useRoutines } from "@/context/RoutinesContext";

export function HabitChecklist({ routine }: { routine: Routine }) {
  const { toggleHabitToday, archiveHabit } = useRoutines();
  const today = todayISO();
  const habits = activeHabits(routine, today);

  if (habits.length === 0) return null;

  return (
    <ul className="flex flex-col divide-y divide-border">
      {habits.map((habit) => {
        const checked = habit.completedDates.includes(today);
        return (
          <li key={habit.id} className="flex items-center gap-1">
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 py-2.5">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleHabitToday(routine.id, habit.id)}
                className="size-5 shrink-0 accent-accent"
              />
              <span
                className={
                  checked
                    ? "text-foreground/40 line-through"
                    : "text-foreground"
                }
              >
                {habit.name}
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Archive "${habit.name}"? Past history is kept.`)) {
                  archiveHabit(routine.id, habit.id);
                }
              }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/30 transition-colors active:bg-foreground/10 active:text-danger"
              aria-label={`Archive ${habit.name}`}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

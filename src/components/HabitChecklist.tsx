"use client";

import { todayISO } from "@/lib/date";
import type { Routine } from "@/lib/types";
import { useRoutines } from "@/context/RoutinesContext";

export function HabitChecklist({
  routine,
  showDelete = true,
}: {
  routine: Routine;
  showDelete?: boolean;
}) {
  const { toggleHabitToday, deleteHabit } = useRoutines();
  const today = todayISO();
  const habits = routine.habits;

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
            {showDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${habit.name}"?`)) {
                    deleteHabit(routine.id, habit.id);
                  }
                }}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/30 transition-colors active:bg-foreground/10 active:text-danger"
                aria-label={`Delete ${habit.name}`}
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
            )}
          </li>
        );
      })}
    </ul>
  );
}

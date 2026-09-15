"use client";

import { todayISO } from "@/lib/date";
import { activeHabits } from "@/lib/streak";
import type { HabitGroup } from "@/lib/types";
import { useHabits } from "@/context/HabitsContext";

export function HabitChecklist({ group }: { group: HabitGroup }) {
  const { toggleHabitToday, archiveHabit } = useHabits();
  const today = todayISO();
  const habits = activeHabits(group, today);

  if (habits.length === 0) return null;

  return (
    <ul className="flex flex-col divide-y divide-foreground/10">
      {habits.map((habit) => {
        const checked = habit.completedDates.includes(today);
        return (
          <li key={habit.id} className="flex items-center gap-2">
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 py-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleHabitToday(group.id, habit.id)}
                className="size-6 shrink-0 accent-foreground"
              />
              <span className={checked ? "text-foreground/50 line-through" : ""}>
                {habit.name}
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Archive "${habit.name}"? Past history is kept.`)) {
                  archiveHabit(group.id, habit.id);
                }
              }}
              className="min-h-11 px-2 text-sm text-foreground/40"
              aria-label={`Archive ${habit.name}`}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}

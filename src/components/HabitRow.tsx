"use client";

import { useState } from "react";
import { todayISO } from "@/lib/date";
import { lastNDates, MAP_DAYS } from "@/lib/completion";
import { DEFAULT_COLOR } from "@/lib/colors";
import type { Habit } from "@/lib/types";
import { useRoutines } from "@/context/RoutinesContext";
import { HabitMap } from "./HabitMap";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

export function HabitRow({
  routineId,
  habit,
  showActions = true,
}: {
  routineId: string;
  habit: Habit;
  showActions?: boolean;
}) {
  const { toggleHabitToday, deleteHabit, setHabitColor } = useRoutines();
  const [pickerOpen, setPickerOpen] = useState(false);
  const today = todayISO();
  const checked = habit.completedDates.includes(today);
  const dates = lastNDates(MAP_DAYS);
  const color = habit.color ?? DEFAULT_COLOR;

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          {showActions && (
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              style={{ backgroundColor: color }}
              className="size-3.5 shrink-0 rounded-full"
              aria-label={`Change color for ${habit.name}`}
            />
          )}
          <span className="truncate font-medium">{habit.name}</span>
          {showActions && (
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
          style={{
            borderColor: color,
            backgroundColor: checked ? color : "transparent",
            color: checked ? "#fff" : color,
          }}
          className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        >
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" aria-hidden>
            {checked ? (
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {pickerOpen && (
        <ColorSwatchPicker
          value={color}
          size="sm"
          onChange={(c) => {
            setHabitColor(routineId, habit.id, c);
            setPickerOpen(false);
          }}
        />
      )}

      <HabitMap dates={dates} color={color} isDone={(d) => habit.completedDates.includes(d)} />
    </div>
  );
}

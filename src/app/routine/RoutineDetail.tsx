"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutines } from "@/context/RoutinesContext";
import { HabitChecklist } from "@/components/HabitChecklist";
import { HabitMap } from "@/components/HabitMap";
import { AddHabitForm } from "@/components/AddHabitForm";
import { EmptyState } from "@/components/EmptyState";
import { ColorSwatchPicker } from "@/components/ColorSwatchPicker";
import { lastNDates, MAP_DAYS, isRoutineDayComplete } from "@/lib/completion";
import { tintBorder, tintBadge } from "@/lib/colors";

export function RoutineDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    getRoutine,
    deleteRoutine,
    setRoutineColor,
    renameRoutine,
    unpauseHabit,
    deleteHabit,
    hydrated,
  } = useRoutines();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const id = searchParams.get("id");
  const routine = id ? getRoutine(id) : undefined;

  if (!hydrated) return null;

  if (!routine) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <EmptyState
          title="Routine not found"
          description="This routine doesn't exist or may have been deleted."
          action={
            <Link
              href="/"
              className="flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground shadow-sm"
            >
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  const dates = lastNDates(MAP_DAYS);
  const color = routine.color;
  const activeHabits = routine.habits.filter((h) => h.pausedAt === null);
  const pausedHabits = routine.habits.filter((h) => h.pausedAt !== null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 p-4 pb-10 sm:p-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center text-sm font-medium text-foreground/60"
        >
          &larr; Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            style={{ backgroundColor: color }}
            className="size-4 shrink-0 rounded-full"
            aria-label="Change routine color"
          />
          {renaming ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={() => {
                renameRoutine(routine.id, draftName);
                setRenaming(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  renameRoutine(routine.id, draftName);
                  setRenaming(false);
                } else if (e.key === "Escape") {
                  setRenaming(false);
                }
              }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-2 py-1 text-2xl font-semibold tracking-tight outline-none focus:border-accent"
            />
          ) : (
            <h1
              onClick={() => {
                setDraftName(routine.name);
                setRenaming(true);
              }}
              className="cursor-pointer text-2xl font-semibold tracking-tight"
            >
              {routine.name}
            </h1>
          )}
        </div>
        {pickerOpen && (
          <ColorSwatchPicker
            value={color}
            size="sm"
            onChange={(c) => {
              setRoutineColor(routine.id, c);
              setPickerOpen(false);
            }}
          />
        )}
      </div>

      {activeHabits.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
            Consistency
          </h2>
          <div
            className="rounded-2xl border bg-surface p-4"
            style={{ borderColor: tintBorder(color) }}
          >
            <HabitMap dates={dates} color={color} isDone={(d) => isRoutineDayComplete(routine, d)} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
          Habits
        </h2>
        <div
          className="rounded-2xl border bg-surface p-2"
          style={{ borderColor: tintBorder(color) }}
        >
          {activeHabits.length === 0 ? (
            <EmptyState
              title="No habits yet"
              description="Add a habit below to get started."
            />
          ) : (
            <div className="px-2">
              <HabitChecklist routine={routine} />
            </div>
          )}
        </div>
        <AddHabitForm routineId={routine.id} defaultColor={color} />
      </div>

      {pausedHabits.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
            Paused
          </h2>
          <div className="flex flex-col gap-2">
            {pausedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-2 rounded-xl bg-foreground/4 p-3"
              >
                <span
                  aria-hidden
                  style={{ backgroundColor: habit.color }}
                  className="size-2.5 shrink-0 rounded-full opacity-50"
                />
                <span className="min-w-0 flex-1 truncate text-foreground/50">{habit.name}</span>
                <button
                  type="button"
                  onClick={() => unpauseHabit(routine.id, habit.id)}
                  style={{ backgroundColor: tintBadge(habit.color), color: habit.color }}
                  className="min-h-8 shrink-0 rounded-full px-3 text-sm font-medium"
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${habit.name}"?`)) {
                      deleteHabit(routine.id, habit.id);
                    }
                  }}
                  aria-label={`Delete ${habit.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/30 active:bg-foreground/10 active:text-danger"
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
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${routine.name}"? This can't be undone.`)) {
            deleteRoutine(routine.id);
            router.push("/");
          }
        }}
        className="min-h-11 self-start text-sm font-medium text-danger"
      >
        Delete routine
      </button>
    </div>
  );
}

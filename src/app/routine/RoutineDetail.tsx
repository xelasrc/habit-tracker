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
import { DEFAULT_COLOR, tintBorder } from "@/lib/colors";

export function RoutineDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getRoutine, deleteRoutine, setRoutineColor, hydrated } = useRoutines();
  const [pickerOpen, setPickerOpen] = useState(false);
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
  const color = routine.color ?? DEFAULT_COLOR;

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
          <h1 className="text-2xl font-semibold tracking-tight">{routine.name}</h1>
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

      {routine.habits.length > 0 && (
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
          {routine.habits.length === 0 ? (
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
        <AddHabitForm routineId={routine.id} existingHabitCount={routine.habits.length} />
      </div>

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

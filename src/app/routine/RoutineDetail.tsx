"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoutines } from "@/context/RoutinesContext";
import { StreakBadge } from "@/components/StreakBadge";
import { HabitChecklist } from "@/components/HabitChecklist";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HistoryGrid } from "@/components/HistoryGrid";
import { EmptyState } from "@/components/EmptyState";

export function RoutineDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getRoutine, deleteRoutine, hydrated } = useRoutines();
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

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 p-4 pb-10 sm:p-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex min-h-11 w-fit items-center text-sm font-medium text-foreground/60"
        >
          &larr; Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{routine.name}</h1>
        <div>
          <StreakBadge routine={routine} size="lg" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
          Today
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-2">
          {routine.habits.filter((h) => h.archivedAt === null).length === 0 ? (
            <EmptyState
              title="No habits yet"
              description="Add a habit below to start tracking your streak."
            />
          ) : (
            <div className="px-2">
              <HabitChecklist routine={routine} />
            </div>
          )}
        </div>
        <AddHabitForm routineId={routine.id} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
          History
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <HistoryGrid routine={routine} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${routine.name}" and all its history? This can't be undone.`)) {
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

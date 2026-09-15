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
              className="min-h-11 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-foreground/60">
          &larr; Back
        </Link>
        <h1 className="text-xl font-semibold">{routine.name}</h1>
        <StreakBadge routine={routine} size="lg" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">Today</h2>
        {routine.habits.filter((h) => h.archivedAt === null).length === 0 ? (
          <EmptyState
            title="No habits yet"
            description="Add a habit below to start tracking your streak."
          />
        ) : (
          <HabitChecklist routine={routine} />
        )}
        <AddHabitForm routineId={routine.id} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">History</h2>
        <HistoryGrid routine={routine} />
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${routine.name}" and all its history? This can't be undone.`)) {
            deleteRoutine(routine.id);
            router.push("/");
          }
        }}
        className="min-h-11 self-start text-sm text-red-600 dark:text-red-400"
      >
        Delete routine
      </button>
    </div>
  );
}

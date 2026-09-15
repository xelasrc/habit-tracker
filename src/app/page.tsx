"use client";

import Link from "next/link";
import { useRoutines } from "@/context/RoutinesContext";
import { RoutineCard } from "@/components/RoutineCard";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { routines, hydrated } = useRoutines();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 pb-10 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Routines</h1>
        <Link
          href="/routines/new"
          className="flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition-transform active:scale-95"
        >
          + New Routine
        </Link>
      </div>

      {!hydrated ? null : routines.length === 0 ? (
        <EmptyState
          title="No routines yet"
          description="Create a routine like “Health and Fitness”, set a day goal, and add the habits you want to stay consistent with."
          action={
            <Link
              href="/routines/new"
              className="flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground shadow-sm"
            >
              Create your first routine
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      )}
    </div>
  );
}

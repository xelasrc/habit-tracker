"use client";

import Link from "next/link";
import { useRoutines } from "@/context/RoutinesContext";
import { RoutineCard } from "@/components/RoutineCard";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { routines, hydrated } = useRoutines();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 pb-24 sm:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Routines</h1>

      {!hydrated ? null : routines.length === 0 ? (
        <EmptyState
          title="No routines yet"
          description="Create a routine like “Health and Fitness” and add the habits you want to stay consistent with."
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

      <Link
        href="/routines/new"
        aria-label="New routine"
        className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform active:scale-95"
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      </Link>
    </div>
  );
}

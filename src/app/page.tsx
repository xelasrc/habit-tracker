"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRoutines } from "@/context/RoutinesContext";
import { RoutineCard } from "@/components/RoutineCard";
import { EmptyState } from "@/components/EmptyState";

const VIEW_MODE_KEY = "habit-tracker:view-mode";

export default function Home() {
  const { routines, hydrated } = useRoutines();
  const [compact, setCompact] = useState(false);
  const [modeHydrated, setModeHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompact(stored === "compact");
    setModeHydrated(true);
  }, []);

  useEffect(() => {
    if (!modeHydrated) return;
    window.localStorage.setItem(VIEW_MODE_KEY, compact ? "compact" : "detailed");
  }, [compact, modeHydrated]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Routines</h1>
        <div className="flex rounded-full bg-foreground/5 p-1">
          <button
            type="button"
            onClick={() => setCompact(false)}
            aria-pressed={!compact}
            className={`min-h-9 rounded-full px-3 text-xs font-medium transition-colors ${
              !compact ? "bg-surface text-foreground shadow-sm" : "text-foreground/50"
            }`}
          >
            Detailed
          </button>
          <button
            type="button"
            onClick={() => setCompact(true)}
            aria-pressed={compact}
            className={`min-h-9 rounded-full px-3 text-xs font-medium transition-colors ${
              compact ? "bg-surface text-foreground shadow-sm" : "text-foreground/50"
            }`}
          >
            Compact
          </button>
        </div>
      </div>

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
            <RoutineCard key={routine.id} routine={routine} compact={compact} />
          ))}
          <Link
            href="/routines/new"
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-accent text-sm font-medium text-accent-foreground shadow-sm"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </svg>
            New Routine
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRoutines } from "@/context/RoutinesContext";
import type { Routine } from "@/lib/types";
import { tintBorder, colorGradient } from "@/lib/colors";
import { HabitChecklist } from "./HabitChecklist";

export function RoutineCard({
  routine,
  compact = false,
  isFirst = false,
  isLast = false,
}: {
  routine: Routine;
  compact?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const { moveRoutine } = useRoutines();
  const hasHabits = routine.habits.some((h) => h.pausedAt === null);
  const color = routine.color;

  return (
    <div
      className="rounded-lg border bg-surface p-4 shadow-sm"
      style={{ borderColor: tintBorder(color) }}
    >
      <div className="flex items-center gap-1">
        <Link
          href={`/routine?id=${routine.id}`}
          className="-m-1 flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md p-1 transition-colors active:bg-foreground/5 sm:hover:bg-foreground/5"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              style={{ backgroundImage: colorGradient(color) }}
              className="size-3 shrink-0 rounded-full"
            />
            <span className="truncate text-base font-semibold">{routine.name}</span>
          </span>
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0 text-foreground/30"
            aria-hidden
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="flex shrink-0 flex-col">
          <button
            type="button"
            onClick={() => moveRoutine(routine.id, "up")}
            disabled={isFirst}
            aria-label="Move routine up"
            className="flex size-8 items-center justify-center rounded-md text-foreground/40 transition-colors active:bg-foreground/5 disabled:opacity-20"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 15l6-6 6 6"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => moveRoutine(routine.id, "down")}
            disabled={isLast}
            aria-label="Move routine down"
            className="flex size-8 items-center justify-center rounded-md text-foreground/40 transition-colors active:bg-foreground/5 disabled:opacity-20"
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {hasHabits ? (
        <div className="mt-3">
          <HabitChecklist routine={routine} showActions={false} compact={compact} />
        </div>
      ) : (
        <p className="mt-1 text-sm text-foreground/50">No habits yet</p>
      )}
    </div>
  );
}

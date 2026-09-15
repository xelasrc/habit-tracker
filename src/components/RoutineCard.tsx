import Link from "next/link";
import type { Routine } from "@/lib/types";
import { HabitChecklist } from "./HabitChecklist";

export function RoutineCard({ routine }: { routine: Routine }) {
  const hasHabits = routine.habits.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <Link
        href={`/routine?id=${routine.id}`}
        className="-m-1 flex items-center justify-between gap-3 rounded-lg p-1 transition-colors active:bg-foreground/5 sm:hover:bg-foreground/5"
      >
        <span className="truncate text-base font-semibold">{routine.name}</span>
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

      {hasHabits ? (
        <div className="mt-3 border-t border-border pt-1">
          <HabitChecklist routine={routine} showDelete={false} />
        </div>
      ) : (
        <p className="mt-1 text-sm text-foreground/50">No habits yet</p>
      )}
    </div>
  );
}

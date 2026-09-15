import Link from "next/link";
import type { Routine } from "@/lib/types";
import { StreakBadge } from "./StreakBadge";
import { HabitChecklist } from "./HabitChecklist";

export function RoutineCard({ routine }: { routine: Routine }) {
  const hasHabits = routine.habits.some((h) => h.archivedAt === null);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <Link
        href={`/routine?id=${routine.id}`}
        className="-m-1 flex items-center justify-between gap-3 rounded-lg p-1 transition-colors active:bg-foreground/5 sm:hover:bg-foreground/5"
      >
        <span className="truncate text-base font-semibold">{routine.name}</span>
        <StreakBadge routine={routine} size="sm" />
      </Link>

      {hasHabits ? (
        <div className="mt-3 border-t border-border pt-1">
          <HabitChecklist routine={routine} />
        </div>
      ) : (
        <p className="mt-1 text-sm text-foreground/50">No habits yet</p>
      )}
    </div>
  );
}

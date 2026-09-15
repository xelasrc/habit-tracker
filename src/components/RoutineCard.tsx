import Link from "next/link";
import type { Routine } from "@/lib/types";
import { StreakBadge } from "./StreakBadge";
import { HabitChecklist } from "./HabitChecklist";

export function RoutineCard({ routine }: { routine: Routine }) {
  const hasHabits = routine.habits.some((h) => h.archivedAt === null);

  return (
    <div className="rounded-xl border border-foreground/10 p-4">
      <Link
        href={`/routine?id=${routine.id}`}
        className="-m-1 flex items-center justify-between gap-3 rounded-lg p-1 transition-colors active:bg-foreground/5 sm:hover:bg-foreground/5"
      >
        <span className="truncate text-base font-medium">{routine.name}</span>
        <StreakBadge routine={routine} size="sm" />
      </Link>

      {hasHabits ? (
        <div className="mt-2">
          <HabitChecklist routine={routine} />
        </div>
      ) : (
        <p className="mt-1 text-sm text-foreground/60">No habits yet</p>
      )}
    </div>
  );
}

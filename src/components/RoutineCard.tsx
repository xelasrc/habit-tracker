import Link from "next/link";
import type { Routine } from "@/lib/types";
import { getTodayProgress } from "@/lib/streak";
import { StreakBadge } from "./StreakBadge";

export function RoutineCard({ routine }: { routine: Routine }) {
  const progress = getTodayProgress(routine);

  return (
    <Link
      href={`/routine?id=${routine.id}`}
      className="block rounded-xl border border-foreground/10 p-4 transition-colors active:bg-foreground/5 sm:hover:bg-foreground/5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-base font-medium">{routine.name}</span>
        <StreakBadge routine={routine} size="sm" />
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        {progress.total === 0
          ? "No habits yet"
          : `Today: ${progress.done} / ${progress.total} habits`}
      </p>
    </Link>
  );
}

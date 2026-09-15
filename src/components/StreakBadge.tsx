import type { Routine } from "@/lib/types";
import { computeStreak } from "@/lib/streak";

export function StreakBadge({
  routine,
  size = "md",
}: {
  routine: Routine;
  size?: "sm" | "md" | "lg";
}) {
  const streak = computeStreak(routine);
  const reachedGoal = streak >= routine.goalDays;

  const sizeClasses =
    size === "lg"
      ? "text-3xl font-bold"
      : size === "sm"
        ? "text-sm font-medium"
        : "text-lg font-semibold";

  return (
    <span
      className={`${sizeClasses} ${reachedGoal ? "text-emerald-600 dark:text-emerald-400" : ""}`}
    >
      {streak} / {routine.goalDays} days
    </span>
  );
}

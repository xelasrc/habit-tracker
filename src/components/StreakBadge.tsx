import type { HabitGroup } from "@/lib/types";
import { computeStreak } from "@/lib/streak";

export function StreakBadge({
  group,
  size = "md",
}: {
  group: HabitGroup;
  size?: "sm" | "md" | "lg";
}) {
  const streak = computeStreak(group);
  const reachedGoal = streak >= group.goalDays;

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
      {streak} / {group.goalDays} days
    </span>
  );
}

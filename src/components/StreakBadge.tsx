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
  const onStreak = streak > 0;

  const sizeClasses =
    size === "lg"
      ? "gap-1.5 rounded-full px-3.5 py-1.5 text-lg font-bold"
      : size === "sm"
        ? "gap-1 rounded-full px-2.5 py-1 text-sm font-semibold"
        : "gap-1 rounded-full px-3 py-1 text-base font-semibold";

  const iconSize = size === "lg" ? 18 : 14;

  return (
    <span
      className={`inline-flex shrink-0 items-center tabular-nums ${sizeClasses} ${
        onStreak ? "bg-success/15 text-success" : "bg-foreground/5 text-foreground/80"
      }`}
    >
      {onStreak && (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2c1 3-2 4.5-2 7a3 3 0 0 0 6 0c1.5 1.5 2 3.5 2 5a6 6 0 1 1-12 0c0-4 3-7 4-8 1-1 1.5-2.5 2-4Z" />
        </svg>
      )}
      {streak} {streak === 1 ? "day" : "days"}
    </span>
  );
}

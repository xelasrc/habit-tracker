import type { Routine } from "@/lib/types";
import { HabitRow } from "./HabitRow";

export function HabitChecklist({
  routine,
  showActions = true,
  compact = false,
}: {
  routine: Routine;
  showActions?: boolean;
  compact?: boolean;
}) {
  const activeHabits = routine.habits.filter((h) => h.pausedAt === null);
  if (activeHabits.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {activeHabits.map((habit, index) => (
        <HabitRow
          key={habit.id}
          routineId={routine.id}
          habit={habit}
          showActions={showActions}
          compact={compact}
          isFirst={index === 0}
          isLast={index === activeHabits.length - 1}
        />
      ))}
    </div>
  );
}

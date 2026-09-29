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
  if (routine.habits.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {routine.habits.map((habit, index) => (
        <HabitRow
          key={habit.id}
          routineId={routine.id}
          habit={habit}
          showActions={showActions}
          compact={compact}
          isFirst={index === 0}
          isLast={index === routine.habits.length - 1}
        />
      ))}
    </div>
  );
}

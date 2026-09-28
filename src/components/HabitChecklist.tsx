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
      {routine.habits.map((habit) => (
        <HabitRow
          key={habit.id}
          routineId={routine.id}
          habit={habit}
          showActions={showActions}
          compact={compact}
        />
      ))}
    </div>
  );
}

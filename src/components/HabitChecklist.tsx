import type { Routine } from "@/lib/types";
import { HabitRow } from "./HabitRow";

export function HabitChecklist({
  routine,
  showActions = true,
}: {
  routine: Routine;
  showActions?: boolean;
}) {
  if (routine.habits.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {routine.habits.map((habit) => (
        <HabitRow key={habit.id} routineId={routine.id} habit={habit} showActions={showActions} />
      ))}
    </div>
  );
}

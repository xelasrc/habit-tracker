import type { Routine } from "@/lib/types";
import { HabitRow } from "./HabitRow";

export function HabitChecklist({
  routine,
  showDelete = true,
}: {
  routine: Routine;
  showDelete?: boolean;
}) {
  if (routine.habits.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-border">
      {routine.habits.map((habit) => (
        <HabitRow key={habit.id} routineId={routine.id} habit={habit} showDelete={showDelete} />
      ))}
    </div>
  );
}

import { addDaysISO, todayISO } from "@/lib/date";
import { activeHabits, isDayComplete } from "@/lib/streak";
import type { HabitGroup } from "@/lib/types";

const DAYS_SHOWN = 35;

export function HistoryGrid({ group }: { group: HabitGroup }) {
  const today = todayISO();
  const dates = Array.from({ length: DAYS_SHOWN }, (_, i) =>
    addDaysISO(today, -(DAYS_SHOWN - 1 - i))
  );

  return (
    <div className="grid grid-cols-7 gap-1">
      {dates.map((date) => {
        const hasActiveHabits = activeHabits(group, date).length > 0;
        const complete = hasActiveHabits && isDayComplete(group, date);
        return (
          <div
            key={date}
            title={date}
            className={`aspect-square rounded-sm ${
              complete
                ? "bg-emerald-500"
                : hasActiveHabits
                  ? "border border-foreground/20"
                  : "bg-foreground/5"
            }`}
          />
        );
      })}
    </div>
  );
}

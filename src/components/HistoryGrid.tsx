import { addDaysISO, todayISO } from "@/lib/date";
import { activeHabits, isDayComplete } from "@/lib/streak";
import type { Routine } from "@/lib/types";

const DAYS_SHOWN = 35;

export function HistoryGrid({ routine }: { routine: Routine }) {
  const today = todayISO();
  const dates = Array.from({ length: DAYS_SHOWN }, (_, i) =>
    addDaysISO(today, -(DAYS_SHOWN - 1 - i))
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map((date) => {
          const hasActiveHabits = activeHabits(routine, date).length > 0;
          const complete = hasActiveHabits && isDayComplete(routine, date);
          const isToday = date === today;
          return (
            <div
              key={date}
              title={date}
              className={`aspect-square rounded-md ${
                complete
                  ? "bg-success"
                  : hasActiveHabits
                    ? "border-2 border-foreground/15"
                    : "bg-foreground/5"
              } ${isToday ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : ""}`}
            />
          );
        })}
      </div>
      <p className="mt-2 text-xs text-foreground/40">Last {DAYS_SHOWN} days</p>
    </div>
  );
}

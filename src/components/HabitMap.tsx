export function HabitMap({
  dates,
  isDone,
}: {
  dates: string[];
  isDone: (date: string) => boolean;
}) {
  const today = dates[dates.length - 1];

  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
      {dates.map((date) => {
        const done = isDone(date);
        const isToday = date === today;
        return (
          <div
            key={date}
            title={date}
            className={`aspect-square rounded-[3px] ${done ? "bg-accent" : "bg-foreground/8"} ${
              isToday ? "ring-2 ring-inset ring-foreground/50" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

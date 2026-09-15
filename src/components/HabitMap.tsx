export function HabitMap({
  dates,
  isDone,
  color,
}: {
  dates: string[];
  isDone: (date: string) => boolean;
  color: string;
}) {
  const today = dates[dates.length - 1];

  return (
    <div className="grid w-full grid-cols-14 gap-1.5">
      {dates.map((date) => {
        const done = isDone(date);
        const isToday = date === today;
        return (
          <div
            key={date}
            title={date}
            style={done ? { backgroundColor: color } : undefined}
            className={`aspect-square rounded-xs ${done ? "" : "bg-foreground/8"} ${
              isToday ? "ring-1 ring-inset ring-foreground/50" : ""
            }`}
          />
        );
      })}
    </div>
  );
}

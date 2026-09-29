export function HabitMap({
  dates,
  isDone,
  color,
  onToggle,
}: {
  dates: string[];
  isDone: (date: string) => boolean;
  color: string;
  onToggle?: (date: string) => void;
}) {
  const today = dates[dates.length - 1];

  return (
    <div className="grid w-full grid-cols-14 gap-1.5">
      {dates.map((date) => {
        const done = isDone(date);
        const isToday = date === today;
        const className = `aspect-square rounded-xs ${done ? "" : "bg-foreground/8"} ${
          isToday ? "ring-1 ring-inset ring-foreground/50" : ""
        }`;
        const style = done ? { backgroundColor: color } : undefined;

        if (!onToggle) {
          return <div key={date} title={date} style={style} className={className} />;
        }

        return (
          <button
            key={date}
            type="button"
            title={date}
            aria-label={`${done ? "Unmark" : "Mark"} ${date}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(date);
            }}
            style={style}
            className={className}
          />
        );
      })}
    </div>
  );
}

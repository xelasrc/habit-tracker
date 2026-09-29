"use client";

import type { HabitFrequency } from "@/lib/types";

export function FrequencyPicker({
  value,
  onChange,
}: {
  value: HabitFrequency;
  onChange: (frequency: HabitFrequency) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-full bg-foreground/5 p-1">
        <button
          type="button"
          onClick={() => onChange({ type: "daily" })}
          aria-pressed={value.type === "daily"}
          className={`min-h-8 rounded-full px-3 text-xs font-medium transition-colors ${
            value.type === "daily" ? "bg-surface text-foreground shadow-sm" : "text-foreground/50"
          }`}
        >
          Daily
        </button>
        <button
          type="button"
          onClick={() => onChange({ type: "weekly", timesPerWeek: 3 })}
          aria-pressed={value.type === "weekly"}
          className={`min-h-8 rounded-full px-3 text-xs font-medium transition-colors ${
            value.type === "weekly" ? "bg-surface text-foreground shadow-sm" : "text-foreground/50"
          }`}
        >
          Weekly
        </button>
      </div>

      {value.type === "weekly" && (
        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
          <button
            type="button"
            onClick={() =>
              onChange({ type: "weekly", timesPerWeek: Math.max(1, value.timesPerWeek - 1) })
            }
            className="flex size-7 items-center justify-center rounded-full bg-foreground/5 font-medium text-foreground"
            aria-label="Decrease times per week"
          >
            −
          </button>
          <span className="min-w-[5.5rem] text-center">{value.timesPerWeek}x per week</span>
          <button
            type="button"
            onClick={() =>
              onChange({ type: "weekly", timesPerWeek: Math.min(6, value.timesPerWeek + 1) })
            }
            className="flex size-7 items-center justify-center rounded-full bg-foreground/5 font-medium text-foreground"
            aria-label="Increase times per week"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

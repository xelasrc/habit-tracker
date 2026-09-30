"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRoutines } from "@/context/RoutinesContext";
import { DEFAULT_COLOR } from "@/lib/colors";
import type { HabitFrequency } from "@/lib/types";
import { ColorSwatchPicker } from "./ColorSwatchPicker";
import { FrequencyPicker } from "./FrequencyPicker";

const inputClass =
  "min-h-12 rounded-md border border-border bg-surface px-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

interface HabitRowDraft {
  name: string;
  frequency: HabitFrequency;
}

function emptyHabitRow(): HabitRowDraft {
  return { name: "", frequency: { type: "daily" } };
}

export function NewRoutineForm() {
  const { addRoutine } = useRoutines();
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [habitRows, setHabitRows] = useState<HabitRowDraft[]>([emptyHabitRow()]);

  function updateHabitName(index: number, value: string) {
    setHabitRows((prev) => prev.map((h, i) => (i === index ? { ...h, name: value } : h)));
  }

  function updateHabitFrequency(index: number, frequency: HabitFrequency) {
    setHabitRows((prev) => prev.map((h, i) => (i === index ? { ...h, frequency } : h)));
  }

  function removeHabitRow(index: number) {
    setHabitRows((prev) => prev.filter((_, i) => i !== index));
  }

  function addHabitRow() {
    setHabitRows((prev) => [...prev, emptyHabitRow()]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const routineId = addRoutine(
      trimmedName,
      color,
      habitRows
        .filter((h) => h.name.trim())
        .map((h) => ({ name: h.name.trim(), frequency: h.frequency }))
    );
    router.push(`/routine?id=${routineId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="routine-name" className="text-sm font-medium text-foreground/70">
          Routine name
        </label>
        <input
          id="routine-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Health and Fitness"
          className={inputClass}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">Color</span>
        <ColorSwatchPicker value={color} onChange={setColor} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">Habits</span>
        <div className="flex flex-col gap-3">
          {habitRows.map((habitRow, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-md border border-border p-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={habitRow.name}
                  onChange={(e) => updateHabitName(index, e.target.value)}
                  placeholder="e.g. Workout"
                  className={`flex-1 ${inputClass}`}
                />
                {habitRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHabitRow(index)}
                    className="flex size-12 shrink-0 items-center justify-center rounded-md text-foreground/40 transition-colors active:bg-foreground/10 active:text-danger"
                    aria-label="Remove habit"
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <FrequencyPicker
                value={habitRow.frequency}
                onChange={(freq) => updateHabitFrequency(index, freq)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addHabitRow}
          className="min-h-12 self-start text-sm font-semibold text-accent"
        >
          + Add another habit
        </button>
        <p className="text-xs text-foreground/40">
          Habits default to the routine&apos;s color — you can change any of them later.
        </p>
      </div>

      <button
        type="submit"
        className="min-h-12 rounded-md bg-linear-to-br from-accent to-accent-2 px-4 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity disabled:opacity-40"
        disabled={!name.trim()}
      >
        Create routine
      </button>
    </form>
  );
}

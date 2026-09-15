"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRoutines } from "@/context/RoutinesContext";

const inputClass =
  "min-h-11 rounded-lg border border-border bg-surface px-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function NewRoutineForm() {
  const { addRoutine } = useRoutines();
  const router = useRouter();
  const [name, setName] = useState("");
  const [goalDays, setGoalDays] = useState("30");
  const [habitNames, setHabitNames] = useState<string[]>([""]);

  function updateHabitName(index: number, value: string) {
    setHabitNames((prev) => prev.map((h, i) => (i === index ? value : h)));
  }

  function removeHabitRow(index: number) {
    setHabitNames((prev) => prev.filter((_, i) => i !== index));
  }

  function addHabitRow() {
    setHabitNames((prev) => [...prev, ""]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const goal = Number(goalDays);
    if (!trimmedName || !Number.isFinite(goal) || goal <= 0) return;
    const routineId = addRoutine(
      trimmedName,
      Math.round(goal),
      habitNames.filter((h) => h.trim())
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
        <label htmlFor="goal-days" className="text-sm font-medium text-foreground/70">
          Goal (consecutive days)
        </label>
        <input
          id="goal-days"
          type="number"
          min={1}
          value={goalDays}
          onChange={(e) => setGoalDays(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">Habits</span>
        <div className="flex flex-col gap-2">
          {habitNames.map((habitName, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={habitName}
                onChange={(e) => updateHabitName(index, e.target.value)}
                placeholder="e.g. Workout"
                className={`flex-1 ${inputClass}`}
              />
              {habitNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHabitRow(index)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition-colors active:bg-foreground/10 active:text-danger"
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
          ))}
        </div>
        <button
          type="button"
          onClick={addHabitRow}
          className="min-h-11 self-start text-sm font-semibold text-accent"
        >
          + Add another habit
        </button>
      </div>

      <button
        type="submit"
        className="min-h-11 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition-opacity disabled:opacity-40"
        disabled={!name.trim() || !goalDays}
      >
        Create routine
      </button>
    </form>
  );
}

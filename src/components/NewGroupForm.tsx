"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHabits } from "@/context/HabitsContext";

export function NewGroupForm() {
  const { addGroup } = useHabits();
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
    const groupId = addGroup(
      trimmedName,
      Math.round(goal),
      habitNames.filter((h) => h.trim())
    );
    router.push(`/group?id=${groupId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="group-name" className="text-sm font-medium">
          Group name
        </label>
        <input
          id="group-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Health and Fitness"
          className="min-h-11 rounded-lg border border-foreground/15 bg-transparent px-3 text-base"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="goal-days" className="text-sm font-medium">
          Goal (consecutive days)
        </label>
        <input
          id="goal-days"
          type="number"
          min={1}
          value={goalDays}
          onChange={(e) => setGoalDays(e.target.value)}
          className="min-h-11 rounded-lg border border-foreground/15 bg-transparent px-3 text-base"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Habits</span>
        <div className="flex flex-col gap-2">
          {habitNames.map((habitName, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={habitName}
                onChange={(e) => updateHabitName(index, e.target.value)}
                placeholder="e.g. Workout"
                className="min-h-11 flex-1 rounded-lg border border-foreground/15 bg-transparent px-3 text-base"
              />
              {habitNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHabitRow(index)}
                  className="min-h-11 px-2 text-sm text-foreground/40"
                  aria-label="Remove habit"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addHabitRow}
          className="min-h-11 self-start text-sm font-medium text-foreground/70"
        >
          + Add another habit
        </button>
      </div>

      <button
        type="submit"
        className="min-h-11 rounded-lg bg-foreground px-4 text-sm font-medium text-background disabled:opacity-40"
        disabled={!name.trim() || !goalDays}
      >
        Create group
      </button>
    </form>
  );
}

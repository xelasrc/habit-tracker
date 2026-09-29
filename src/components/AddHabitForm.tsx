"use client";

import { useState } from "react";
import { useRoutines } from "@/context/RoutinesContext";
import type { HabitFrequency } from "@/lib/types";
import { ColorSwatchPicker } from "./ColorSwatchPicker";
import { FrequencyPicker } from "./FrequencyPicker";

export function AddHabitForm({
  routineId,
  defaultColor,
}: {
  routineId: string;
  defaultColor: string;
}) {
  const { addHabit } = useRoutines();
  const [name, setName] = useState("");
  const [color, setColor] = useState(defaultColor);
  const [frequency, setFrequency] = useState<HabitFrequency>({ type: "daily" });
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(routineId, name, color, frequency);
    setName("");
    setColor(defaultColor);
    setFrequency({ type: "daily" });
    setPickerOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          style={{ backgroundColor: color }}
          className="size-11 shrink-0 rounded-lg"
          aria-label="Choose habit color"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a habit"
          className="min-h-11 flex-1 rounded-lg border border-border bg-surface px-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-40"
          disabled={!name.trim()}
        >
          Add
        </button>
      </div>
      {pickerOpen && <ColorSwatchPicker value={color} onChange={setColor} size="sm" />}
      <FrequencyPicker value={frequency} onChange={setFrequency} />
    </form>
  );
}

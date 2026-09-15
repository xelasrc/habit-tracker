"use client";

import { useState } from "react";
import { useRoutines } from "@/context/RoutinesContext";
import { colorForIndex } from "@/lib/colors";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

export function AddHabitForm({
  routineId,
  existingHabitCount,
}: {
  routineId: string;
  existingHabitCount: number;
}) {
  const { addHabit } = useRoutines();
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorForIndex(existingHabitCount));
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(routineId, name, color);
    setName("");
    setColor(colorForIndex(existingHabitCount + 1));
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
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRoutines } from "@/context/RoutinesContext";

export function AddHabitForm({ routineId }: { routineId: string }) {
  const { addHabit } = useRoutines();
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(routineId, name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
    </form>
  );
}

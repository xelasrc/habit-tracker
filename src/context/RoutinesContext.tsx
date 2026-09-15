"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { todayISO } from "@/lib/date";
import { loadStoredData, saveStoredData } from "@/lib/storage";
import type { Routine } from "@/lib/types";

interface RoutinesContextValue {
  routines: Routine[];
  hydrated: boolean;
  addRoutine: (name: string, goalDays: number, initialHabitNames: string[]) => string;
  deleteRoutine: (routineId: string) => void;
  addHabit: (routineId: string, name: string) => void;
  archiveHabit: (routineId: string, habitId: string) => void;
  toggleHabitToday: (routineId: string, habitId: string) => void;
  getRoutine: (routineId: string) => Routine | undefined;
}

const RoutinesContext = createContext<RoutinesContextValue | null>(null);

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function RoutinesProvider({ children }: { children: ReactNode }) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage (an external system) on mount, after the initial
    // SSR-matching render, is intentional — it avoids a hydration mismatch
    // between the server-rendered empty state and the client's real data.
    const data = loadStoredData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoutines(data.routines);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStoredData({ version: 1, routines });
  }, [routines, hydrated]);

  function addRoutine(name: string, goalDays: number, initialHabitNames: string[]): string {
    const routineId = createId();
    const now = todayISO();
    const habits = initialHabitNames
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => ({
        id: createId(),
        name: n,
        createdAt: now,
        archivedAt: null,
        completedDates: [],
      }));
    const newRoutine: Routine = {
      id: routineId,
      name: name.trim(),
      goalDays,
      createdAt: now,
      habits,
    };
    setRoutines((prev) => [...prev, newRoutine]);
    return routineId;
  }

  function deleteRoutine(routineId: string) {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }

  function addHabit(routineId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? {
              ...r,
              habits: [
                ...r.habits,
                {
                  id: createId(),
                  name: trimmed,
                  createdAt: todayISO(),
                  archivedAt: null,
                  completedDates: [],
                },
              ],
            }
          : r
      )
    );
  }

  function archiveHabit(routineId: string, habitId: string) {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? {
              ...r,
              habits: r.habits.map((h) =>
                h.id === habitId ? { ...h, archivedAt: todayISO() } : h
              ),
            }
          : r
      )
    );
  }

  function toggleHabitToday(routineId: string, habitId: string) {
    const today = todayISO();
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? {
              ...r,
              habits: r.habits.map((h) => {
                if (h.id !== habitId) return h;
                const has = h.completedDates.includes(today);
                return {
                  ...h,
                  completedDates: has
                    ? h.completedDates.filter((d) => d !== today)
                    : [...h.completedDates, today],
                };
              }),
            }
          : r
      )
    );
  }

  function getRoutine(routineId: string): Routine | undefined {
    return routines.find((r) => r.id === routineId);
  }

  return (
    <RoutinesContext.Provider
      value={{
        routines,
        hydrated,
        addRoutine,
        deleteRoutine,
        addHabit,
        archiveHabit,
        toggleHabitToday,
        getRoutine,
      }}
    >
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines(): RoutinesContextValue {
  const ctx = useContext(RoutinesContext);
  if (!ctx) throw new Error("useRoutines must be used within a RoutinesProvider");
  return ctx;
}

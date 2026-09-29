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
import { createId } from "@/lib/id";
import type { Habit, HabitFrequency, Routine, StoredData } from "@/lib/types";

type PendingUndo =
  | { type: "routine"; routine: Routine; index: number }
  | { type: "habit"; routineId: string; habit: Habit; index: number };

interface RoutinesContextValue {
  routines: Routine[];
  hydrated: boolean;
  addRoutine: (
    name: string,
    color: string,
    initialHabits: { name: string; frequency: HabitFrequency }[]
  ) => string;
  deleteRoutine: (routineId: string) => void;
  setRoutineColor: (routineId: string, color: string) => void;
  renameRoutine: (routineId: string, name: string) => void;
  moveRoutine: (routineId: string, direction: "up" | "down") => void;
  addHabit: (routineId: string, name: string, color: string, frequency: HabitFrequency) => void;
  deleteHabit: (routineId: string, habitId: string) => void;
  setHabitColor: (routineId: string, habitId: string, color: string) => void;
  renameHabit: (routineId: string, habitId: string, name: string) => void;
  moveHabit: (routineId: string, habitId: string, direction: "up" | "down") => void;
  pauseHabit: (routineId: string, habitId: string) => void;
  unpauseHabit: (routineId: string, habitId: string) => void;
  toggleHabitToday: (routineId: string, habitId: string) => void;
  getRoutine: (routineId: string) => Routine | undefined;
  replaceAllData: (data: StoredData) => void;
  pendingUndo: PendingUndo | null;
  undoDelete: () => void;
  dismissUndo: () => void;
}

const RoutinesContext = createContext<RoutinesContextValue | null>(null);

function swapAdjacent<T>(arr: T[], index: number, direction: "up" | "down"): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= arr.length) return arr;
  const copy = [...arr];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export function RoutinesProvider({ children }: { children: ReactNode }) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [pendingUndo, setPendingUndo] = useState<PendingUndo | null>(null);

  useEffect(() => {
    if (!pendingUndo) return;
    const timer = setTimeout(() => setPendingUndo(null), 6000);
    return () => clearTimeout(timer);
  }, [pendingUndo]);

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

  function addRoutine(
    name: string,
    color: string,
    initialHabits: { name: string; frequency: HabitFrequency }[]
  ): string {
    const routineId = createId();
    const habits = initialHabits
      .map((h) => ({ name: h.name.trim(), frequency: h.frequency }))
      .filter((h) => h.name)
      .map((h) => ({
        id: createId(),
        name: h.name,
        color,
        frequency: h.frequency,
        completedDates: [],
        pausedAt: null,
      }));
    const newRoutine: Routine = {
      id: routineId,
      name: name.trim(),
      color,
      habits,
    };
    setRoutines((prev) => [...prev, newRoutine]);
    return routineId;
  }

  function deleteRoutine(routineId: string) {
    const index = routines.findIndex((r) => r.id === routineId);
    if (index === -1) return;
    setPendingUndo({ type: "routine", routine: routines[index], index });
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }

  function setRoutineColor(routineId: string, color: string) {
    setRoutines((prev) => prev.map((r) => (r.id === routineId ? { ...r, color } : r)));
  }

  function renameRoutine(routineId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoutines((prev) => prev.map((r) => (r.id === routineId ? { ...r, name: trimmed } : r)));
  }

  function moveRoutine(routineId: string, direction: "up" | "down") {
    setRoutines((prev) => {
      const index = prev.findIndex((r) => r.id === routineId);
      if (index === -1) return prev;
      return swapAdjacent(prev, index, direction);
    });
  }

  function addHabit(routineId: string, name: string, color: string, frequency: HabitFrequency) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? {
              ...r,
              habits: [
                ...r.habits,
                { id: createId(), name: trimmed, color, frequency, completedDates: [], pausedAt: null },
              ],
            }
          : r
      )
    );
  }

  function deleteHabit(routineId: string, habitId: string) {
    const routine = routines.find((r) => r.id === routineId);
    const index = routine?.habits.findIndex((h) => h.id === habitId) ?? -1;
    if (!routine || index === -1) return;
    setPendingUndo({ type: "habit", routineId, habit: routine.habits[index], index });
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, habits: r.habits.filter((h) => h.id !== habitId) } : r
      )
    );
  }

  function setHabitColor(routineId: string, habitId: string, color: string) {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, habits: r.habits.map((h) => (h.id === habitId ? { ...h, color } : h)) }
          : r
      )
    );
  }

  function renameHabit(routineId: string, habitId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, habits: r.habits.map((h) => (h.id === habitId ? { ...h, name: trimmed } : h)) }
          : r
      )
    );
  }

  function pauseHabit(routineId: string, habitId: string) {
    const today = todayISO();
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, habits: r.habits.map((h) => (h.id === habitId ? { ...h, pausedAt: today } : h)) }
          : r
      )
    );
  }

  function unpauseHabit(routineId: string, habitId: string) {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, habits: r.habits.map((h) => (h.id === habitId ? { ...h, pausedAt: null } : h)) }
          : r
      )
    );
  }

  function moveHabit(routineId: string, habitId: string, direction: "up" | "down") {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        const index = r.habits.findIndex((h) => h.id === habitId);
        if (index === -1) return r;
        return { ...r, habits: swapAdjacent(r.habits, index, direction) };
      })
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

  // No validation here -- callers (the backup import flow) already run the
  // parsed file through normalizeStoredData before this is ever called.
  function replaceAllData(data: StoredData) {
    setRoutines(data.routines);
  }

  function undoDelete() {
    const pending = pendingUndo;
    if (!pending) return;
    if (pending.type === "routine") {
      setRoutines((prev) => {
        const copy = [...prev];
        copy.splice(Math.min(pending.index, copy.length), 0, pending.routine);
        return copy;
      });
    } else {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id !== pending.routineId) return r;
          const copy = [...r.habits];
          copy.splice(Math.min(pending.index, copy.length), 0, pending.habit);
          return { ...r, habits: copy };
        })
      );
    }
    setPendingUndo(null);
  }

  function dismissUndo() {
    setPendingUndo(null);
  }

  return (
    <RoutinesContext.Provider
      value={{
        routines,
        hydrated,
        addRoutine,
        deleteRoutine,
        setRoutineColor,
        renameRoutine,
        moveRoutine,
        addHabit,
        deleteHabit,
        setHabitColor,
        renameHabit,
        moveHabit,
        pauseHabit,
        unpauseHabit,
        toggleHabitToday,
        getRoutine,
        replaceAllData,
        pendingUndo,
        undoDelete,
        dismissUndo,
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

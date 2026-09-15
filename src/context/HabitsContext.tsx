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
import type { HabitGroup } from "@/lib/types";

interface HabitsContextValue {
  groups: HabitGroup[];
  hydrated: boolean;
  addGroup: (name: string, goalDays: number, initialHabitNames: string[]) => string;
  deleteGroup: (groupId: string) => void;
  addHabit: (groupId: string, name: string) => void;
  archiveHabit: (groupId: string, habitId: string) => void;
  toggleHabitToday: (groupId: string, habitId: string) => void;
  getGroup: (groupId: string) => HabitGroup | undefined;
}

const HabitsContext = createContext<HabitsContextValue | null>(null);

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<HabitGroup[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage (an external system) on mount, after the initial
    // SSR-matching render, is intentional — it avoids a hydration mismatch
    // between the server-rendered empty state and the client's real data.
    const data = loadStoredData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroups(data.groups);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStoredData({ version: 1, groups });
  }, [groups, hydrated]);

  function addGroup(name: string, goalDays: number, initialHabitNames: string[]): string {
    const groupId = createId();
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
    const newGroup: HabitGroup = {
      id: groupId,
      name: name.trim(),
      goalDays,
      createdAt: now,
      habits,
    };
    setGroups((prev) => [...prev, newGroup]);
    return groupId;
  }

  function deleteGroup(groupId: string) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  function addHabit(groupId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              habits: [
                ...g.habits,
                {
                  id: createId(),
                  name: trimmed,
                  createdAt: todayISO(),
                  archivedAt: null,
                  completedDates: [],
                },
              ],
            }
          : g
      )
    );
  }

  function archiveHabit(groupId: string, habitId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              habits: g.habits.map((h) =>
                h.id === habitId ? { ...h, archivedAt: todayISO() } : h
              ),
            }
          : g
      )
    );
  }

  function toggleHabitToday(groupId: string, habitId: string) {
    const today = todayISO();
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              habits: g.habits.map((h) => {
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
          : g
      )
    );
  }

  function getGroup(groupId: string): HabitGroup | undefined {
    return groups.find((g) => g.id === groupId);
  }

  return (
    <HabitsContext.Provider
      value={{
        groups,
        hydrated,
        addGroup,
        deleteGroup,
        addHabit,
        archiveHabit,
        toggleHabitToday,
        getGroup,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within a HabitsProvider");
  return ctx;
}

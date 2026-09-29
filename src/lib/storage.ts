import { createId } from "./id";
import { DEFAULT_COLOR } from "./colors";
import type { Habit, Routine, StoredData } from "./types";

const STORAGE_KEY = "habit-tracker:data";
const CURRENT_VERSION = 1 as const;

function emptyData(): StoredData {
  return { version: CURRENT_VERSION, routines: [] };
}

function normalizeHabit(h: unknown): Habit {
  const o = h as Partial<Habit> & Record<string, unknown>;
  return {
    id: typeof o?.id === "string" ? o.id : createId(),
    name: typeof o?.name === "string" ? o.name : "Untitled habit",
    color: typeof o?.color === "string" ? o.color : DEFAULT_COLOR,
    completedDates: Array.isArray(o?.completedDates)
      ? o.completedDates.filter((d): d is string => typeof d === "string")
      : [],
  };
}

function normalizeRoutine(r: unknown): Routine {
  const o = r as Partial<Routine> & Record<string, unknown>;
  return {
    id: typeof o?.id === "string" ? o.id : createId(),
    name: typeof o?.name === "string" ? o.name : "Untitled routine",
    color: typeof o?.color === "string" ? o.color : DEFAULT_COLOR,
    habits: Array.isArray(o?.habits) ? o.habits.map(normalizeHabit) : [],
  };
}

// Normalizes any parsed JSON (from localStorage or an imported backup file)
// into a valid StoredData, defaulting every field rather than trusting the
// shape or a version number alone. This app previously shipped a crash when
// a stored field was renamed without validating old data against the new
// shape — normalizing every field centrally here (instead of scattered `??`
// fallbacks at each call site) is the fix, and it also means a corrupted or
// hand-edited file (e.g. a missing `id`) can't produce broken React keys or
// break lookups that match on `.id` elsewhere in the app.
export function normalizeStoredData(parsed: unknown): StoredData {
  const obj = parsed as { routines?: unknown } | null;
  if (!obj || !Array.isArray(obj.routines)) return emptyData();
  return { version: CURRENT_VERSION, routines: obj.routines.map(normalizeRoutine) };
}

export function loadStoredData(): StoredData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return normalizeStoredData(JSON.parse(raw));
  } catch {
    return emptyData();
  }
}

export function saveStoredData(data: StoredData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

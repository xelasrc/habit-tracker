import type { StoredData } from "./types";

const STORAGE_KEY = "habit-tracker:data";
const CURRENT_VERSION = 1 as const;

function emptyData(): StoredData {
  return { version: CURRENT_VERSION, groups: [] };
}

function migrate(parsed: unknown): StoredData {
  const obj = parsed as { version?: number } | null;
  if (obj?.version === CURRENT_VERSION) return parsed as StoredData;
  // No prior versions exist yet; future migrations get a branch here keyed on obj.version.
  return emptyData();
}

export function loadStoredData(): StoredData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyData();
  }
}

export function saveStoredData(data: StoredData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

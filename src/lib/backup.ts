import { todayISO } from "./date";
import { normalizeStoredData } from "./storage";
import type { StoredData } from "./types";

export function downloadBackup(data: StoredData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `habit-tracker-backup-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Returns null only when the file isn't valid JSON at all -- distinct from a
// validly-shaped file that just happens to contain zero routines, which
// normalizeStoredData returns as a normal (empty) StoredData rather than
// throwing, since it's built to never crash on a malformed shape.
export function parseBackupFile(text: string): StoredData | null {
  try {
    return normalizeStoredData(JSON.parse(text));
  } catch {
    return null;
  }
}

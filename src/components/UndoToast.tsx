"use client";

import { useRoutines } from "@/context/RoutinesContext";

export function UndoToast() {
  const { pendingUndo, undoDelete, dismissUndo } = useRoutines();

  if (!pendingUndo) return null;

  const message =
    pendingUndo.type === "routine"
      ? `Deleted "${pendingUndo.routine.name}"`
      : `Deleted "${pendingUndo.habit.name}"`;

  return (
    <div className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
      <div className="flex max-w-md items-center gap-3 rounded-full bg-foreground px-4 py-2 text-background shadow-lg">
        <span className="min-w-0 truncate text-sm">{message}</span>
        <button
          type="button"
          onClick={undoDelete}
          className="shrink-0 text-sm font-semibold text-accent"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={dismissUndo}
          aria-label="Dismiss"
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-background/60"
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

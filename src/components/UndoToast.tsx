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
      <div className="flex max-w-md items-center gap-2 rounded-md bg-foreground py-1.5 pr-1.5 pl-4 text-background shadow-lg">
        <span className="min-w-0 truncate text-sm">{message}</span>
        <button
          type="button"
          onClick={undoDelete}
          className="min-h-9 shrink-0 rounded-sm px-2 text-sm font-semibold text-accent active:bg-background/10"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={dismissUndo}
          aria-label="Dismiss"
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-background/60 active:bg-background/10"
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

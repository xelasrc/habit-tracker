"use client";

import { useState } from "react";
import { todayISO } from "@/lib/date";
import { lastNDates, MAP_DAYS, getWeeklyProgress } from "@/lib/completion";
import { tintBadge, colorGradient } from "@/lib/colors";
import type { Habit } from "@/lib/types";
import { useRoutines } from "@/context/RoutinesContext";
import { HabitMap } from "./HabitMap";
import { ColorSwatchPicker } from "./ColorSwatchPicker";

export function HabitRow({
  routineId,
  habit,
  showActions = true,
  compact = false,
  editMode = false,
  isFirst = false,
  isLast = false,
}: {
  routineId: string;
  habit: Habit;
  showActions?: boolean;
  compact?: boolean;
  editMode?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const { toggleHabitOnDate, deleteHabit, pauseHabit, setHabitColor, renameHabit, moveHabit } =
    useRoutines();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const today = todayISO();
  const checked = habit.completedDates.includes(today);
  const dates = lastNDates(MAP_DAYS);
  const color = habit.color;

  function handleToggle() {
    toggleHabitOnDate(routineId, habit.id, today);
  }

  function commitRename() {
    renameHabit(routineId, habit.id, draftName);
    setRenaming(false);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-pressed={checked}
      aria-label={
        checked ? `Mark ${habit.name} as not done today` : `Mark ${habit.name} as done today`
      }
      className={`flex cursor-pointer flex-col gap-2 rounded-lg bg-foreground/4 transition-colors active:bg-foreground/8 ${
        compact ? "p-2.5" : "p-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          {showActions && editMode && (
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  moveHabit(routineId, habit.id, "up");
                }}
                disabled={isFirst}
                aria-label={`Move ${habit.name} up`}
                className="flex size-7 items-center justify-center rounded-md text-foreground/40 transition-colors active:bg-foreground/5 disabled:opacity-20"
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 15l6-6 6 6"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  moveHabit(routineId, habit.id, "down");
                }}
                disabled={isLast}
                aria-label={`Move ${habit.name} down`}
                className="flex size-7 items-center justify-center rounded-md text-foreground/40 transition-colors active:bg-foreground/5 disabled:opacity-20"
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
          {showActions && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPickerOpen((o) => !o);
              }}
              aria-label={`Change color for ${habit.name}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-md active:bg-foreground/5"
            >
              <span
                aria-hidden
                style={{ backgroundImage: colorGradient(color) }}
                className="size-3.5 rounded-full"
              />
            </button>
          )}
          {renaming ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={commitRename}
              onKeyDown={(e) => {
                // Must stop propagation: the row's own onKeyDown toggles
                // completion on Enter/Space, which would otherwise also
                // fire while typing into this input.
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename();
                } else if (e.key === "Escape") {
                  setRenaming(false);
                }
              }}
              className="min-w-0 flex-1 rounded-md border border-border bg-surface px-1.5 py-0.5 font-medium outline-none focus:border-accent"
            />
          ) : showActions ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDraftName(habit.name);
                setRenaming(true);
              }}
              className="min-h-8 truncate rounded-md px-1 text-left font-medium active:bg-foreground/5"
            >
              {habit.name}
            </button>
          ) : (
            <span className="truncate px-1 font-medium">{habit.name}</span>
          )}
          {habit.frequency.type === "weekly" && (
            <span
              style={{ backgroundColor: tintBadge(color), color }}
              className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold"
            >
              {getWeeklyProgress(habit).done}/{habit.frequency.timesPerWeek} this week
            </span>
          )}
          {showActions && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-foreground/30 transition-colors active:bg-foreground/10"
              aria-label={`More actions for ${habit.name}`}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
        <div
          aria-hidden
          style={
            checked
              ? { backgroundImage: colorGradient(color), borderColor: color, color: "#fff" }
              : { backgroundColor: "transparent", borderColor: color, color }
          }
          className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            {checked ? (
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>
      </div>

      {pickerOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <ColorSwatchPicker
            value={color}
            size="sm"
            onChange={(c) => {
              setHabitColor(routineId, habit.id, c);
              setPickerOpen(false);
            }}
          />
        </div>
      )}

      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-2 rounded-md border border-border bg-surface p-1.5"
        >
          <button
            type="button"
            onClick={() => {
              pauseHabit(routineId, habit.id);
              setMenuOpen(false);
            }}
            className="min-h-9 flex-1 rounded-sm px-2 text-sm font-medium text-foreground active:bg-foreground/10"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${habit.name}"?`)) {
                deleteHabit(routineId, habit.id);
              }
              setMenuOpen(false);
            }}
            className="min-h-9 flex-1 rounded-sm px-2 text-sm font-medium text-danger active:bg-danger/10"
          >
            Delete
          </button>
        </div>
      )}

      {!compact && (
        <HabitMap
          dates={dates}
          color={color}
          isDone={(d) => habit.completedDates.includes(d)}
          onToggle={editMode ? (d) => toggleHabitOnDate(routineId, habit.id, d) : undefined}
        />
      )}
    </div>
  );
}

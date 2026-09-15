"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useHabits } from "@/context/HabitsContext";
import { StreakBadge } from "@/components/StreakBadge";
import { HabitChecklist } from "@/components/HabitChecklist";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HistoryGrid } from "@/components/HistoryGrid";
import { EmptyState } from "@/components/EmptyState";

export function GroupDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getGroup, deleteGroup, hydrated } = useHabits();
  const id = searchParams.get("id");
  const group = id ? getGroup(id) : undefined;

  if (!hydrated) return null;

  if (!group) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <EmptyState
          title="Group not found"
          description="This habit group doesn't exist or may have been deleted."
          action={
            <Link
              href="/"
              className="min-h-11 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-foreground/60">
          &larr; Back
        </Link>
        <h1 className="text-xl font-semibold">{group.name}</h1>
        <StreakBadge group={group} size="lg" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">Today</h2>
        {group.habits.filter((h) => h.archivedAt === null).length === 0 ? (
          <EmptyState
            title="No habits yet"
            description="Add a habit below to start tracking your streak."
          />
        ) : (
          <HabitChecklist group={group} />
        )}
        <AddHabitForm groupId={group.id} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground/60">History</h2>
        <HistoryGrid group={group} />
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${group.name}" and all its history? This can't be undone.`)) {
            deleteGroup(group.id);
            router.push("/");
          }
        }}
        className="min-h-11 self-start text-sm text-red-600 dark:text-red-400"
      >
        Delete group
      </button>
    </div>
  );
}

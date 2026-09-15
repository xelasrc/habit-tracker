"use client";

import Link from "next/link";
import { useHabits } from "@/context/HabitsContext";
import { GroupCard } from "@/components/GroupCard";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { groups, hydrated } = useHabits();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Habit Groups</h1>
        <Link
          href="/groups/new"
          className="flex min-h-11 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background"
        >
          New Group
        </Link>
      </div>

      {!hydrated ? null : groups.length === 0 ? (
        <EmptyState
          title="No habit groups yet"
          description="Create a group like “Health and Fitness”, set a day goal, and add the habits you want to stay consistent with."
          action={
            <Link
              href="/groups/new"
              className="min-h-11 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
            >
              Create your first group
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

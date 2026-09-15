"use client";

import { NewRoutineForm } from "@/components/NewRoutineForm";

export default function NewRoutinePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 pb-10 sm:p-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Routine</h1>
      <NewRoutineForm />
    </div>
  );
}

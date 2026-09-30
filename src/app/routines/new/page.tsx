"use client";

import Link from "next/link";
import { NewRoutineForm } from "@/components/NewRoutineForm";

export default function NewRoutinePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 pb-10 sm:p-6">
      <Link
        href="/"
        className="-mx-1 flex min-h-10 w-fit items-center rounded-md px-1 text-sm font-medium text-foreground/60 active:bg-foreground/5"
      >
        &larr; Back
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">New Routine</h1>
      <NewRoutineForm />
    </div>
  );
}

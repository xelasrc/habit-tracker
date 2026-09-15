"use client";

import Link from "next/link";
import { NewRoutineForm } from "@/components/NewRoutineForm";

export default function NewRoutinePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <Link href="/" className="text-sm text-foreground/60">
        &larr; Back
      </Link>
      <h1 className="text-xl font-semibold">New Routine</h1>
      <NewRoutineForm />
    </div>
  );
}

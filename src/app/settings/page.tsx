"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoutines } from "@/context/RoutinesContext";
import { downloadBackup, parseBackupFile } from "@/lib/backup";

export default function SettingsPage() {
  const router = useRouter();
  const { routines, replaceAllData } = useRoutines();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    downloadBackup({ version: 1, routines });
  }

  function handleImportClick() {
    setError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseBackupFile(reader.result as string);
      if (!parsed) {
        setError("That file isn't valid JSON.");
        return;
      }
      const confirmed = window.confirm(
        `Import will replace all current routines and habits with the ${parsed.routines.length} routine(s) from this file. Continue?`
      );
      if (!confirmed) return;
      replaceAllData(parsed);
      router.push("/");
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsText(file);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 pb-10 sm:p-6">
      <Link
        href="/"
        className="flex min-h-11 w-fit items-center text-sm font-medium text-foreground/60"
      >
        &larr; Back
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Export backup</h2>
        <p className="text-sm text-foreground/60">
          Download all your routines and habits as a JSON file you can keep somewhere safe.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="mt-1 flex min-h-11 w-fit items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground shadow-sm"
        >
          Export backup
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold">Import backup</h2>
        <p className="text-sm text-foreground/60">
          Restore from a previously exported file. This replaces all current routines and
          habits — it can&apos;t be undone.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleImportClick}
          className="mt-1 flex min-h-11 w-fit items-center rounded-full border border-border px-5 text-sm font-medium"
        >
          Import backup
        </button>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}

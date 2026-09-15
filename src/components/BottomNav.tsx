"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function PlaceholderIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-2xl border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-16 max-w-2xl items-center">
        <Link
          href="/"
          aria-label="Dashboard"
          className={`flex flex-1 items-center justify-center transition-colors ${
            isDashboard ? "text-accent" : "text-foreground/50"
          }`}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div
          aria-disabled="true"
          aria-label="Placeholder"
          className="flex flex-1 cursor-not-allowed items-center justify-center text-foreground/30"
        >
          <PlaceholderIcon />
        </div>

        <div className="flex flex-1 justify-center">
          <Link
            href="/routines/new"
            aria-label="New routine"
            className="-mt-8 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform active:scale-95"
          >
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>

        <div
          aria-disabled="true"
          aria-label="Placeholder"
          className="flex flex-1 cursor-not-allowed items-center justify-center text-foreground/30"
        >
          <PlaceholderIcon />
        </div>

        <div
          aria-disabled="true"
          aria-label="Placeholder"
          className="flex flex-1 cursor-not-allowed items-center justify-center text-foreground/30"
        >
          <PlaceholderIcon />
        </div>
      </div>
    </nav>
  );
}

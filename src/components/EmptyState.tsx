import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
        </svg>
      </div>
      <p className="text-base font-semibold">{title}</p>
      <p className="max-w-xs text-sm text-foreground/60">{description}</p>
      {action}
    </div>
  );
}

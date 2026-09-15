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
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/15 px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      <p className="max-w-xs text-sm text-foreground/60">{description}</p>
      {action}
    </div>
  );
}

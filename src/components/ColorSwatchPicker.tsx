"use client";

import { PALETTE } from "@/lib/colors";

export function ColorSwatchPicker({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (color: string) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-6" : "size-8";

  return (
    <div className="flex flex-wrap gap-2">
      {PALETTE.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.value)}
          aria-label={c.label}
          aria-pressed={value === c.value}
          style={{ backgroundColor: c.value }}
          className={`${dim} shrink-0 rounded-full ring-offset-2 ring-offset-surface transition-transform ${
            value === c.value ? "scale-110 ring-2 ring-foreground" : ""
          }`}
        />
      ))}
    </div>
  );
}

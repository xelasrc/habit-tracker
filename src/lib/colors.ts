export interface PaletteColor {
  id: string;
  label: string;
  value: string;
}

export const PALETTE: PaletteColor[] = [
  { id: "indigo", label: "Indigo", value: "#6366f1" },
  { id: "blue", label: "Blue", value: "#3b82f6" },
  { id: "emerald", label: "Emerald", value: "#10b981" },
  { id: "amber", label: "Amber", value: "#f59e0b" },
  { id: "rose", label: "Rose", value: "#f43f5e" },
  { id: "purple", label: "Purple", value: "#a855f7" },
  { id: "teal", label: "Teal", value: "#14b8a6" },
  { id: "pink", label: "Pink", value: "#ec4899" },
];

export const DEFAULT_COLOR = PALETTE[0].value;

export function colorForIndex(index: number): string {
  return PALETTE[index % PALETTE.length].value;
}

export function tintBorder(color: string, amount = 18): string {
  return `color-mix(in srgb, ${color} ${amount}%, var(--border))`;
}

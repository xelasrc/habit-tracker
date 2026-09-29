"use client";

import type { ReactNode } from "react";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { UndoToast } from "@/components/UndoToast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoutinesProvider>
      {children}
      <UndoToast />
    </RoutinesProvider>
  );
}

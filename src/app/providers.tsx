"use client";

import type { ReactNode } from "react";
import { RoutinesProvider } from "@/context/RoutinesContext";

export function Providers({ children }: { children: ReactNode }) {
  return <RoutinesProvider>{children}</RoutinesProvider>;
}

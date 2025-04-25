"use client";

import { ReactNode } from "react";
import { useAuthEventStore } from "@hooks/event/useAuthEventStore";

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  useAuthEventStore();

  return <>{children}</>;
}

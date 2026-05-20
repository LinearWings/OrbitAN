"use client";

import { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AppProvider>{children}</AppProvider>
    </ErrorBoundary>
  );
}

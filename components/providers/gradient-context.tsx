"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type GradientVariant =
  | "default"
  | "available"
  | "upcoming-soon"
  | "ongoing"
  | "unavailable";

type GradientContextType = {
  variant: GradientVariant;
  setVariant: (v: GradientVariant) => void;
};

const GradientContext = createContext<GradientContextType | null>(null);

export function GradientProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<GradientVariant>("default");

  return (
    <GradientContext.Provider value={{ variant, setVariant }}>
      {children}
    </GradientContext.Provider>
  );
}

export function useGradientContext() {
  const ctx = useContext(GradientContext);
  if (!ctx) throw new Error("useGradientContext must be used within GradientProvider");
  return ctx;
}

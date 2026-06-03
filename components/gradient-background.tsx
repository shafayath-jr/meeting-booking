"use client";

import { ReactNode } from "react";
import {
  useGradientContext,
  GradientVariant,
} from "@/components/providers/gradient-context";
import { cn } from "@/lib/utils";

const variantClassMap: Record<GradientVariant, string> = {
  default: "gradient-mesh",
  available: "gradient-grain bg-linear-to-t from-[#085E94] via-[#3B91C7] to-[#F3F8FC]",
  "upcoming-soon": "gradient-mesh-yellow",
  ongoing: "gradient-mesh-red",
  unavailable: "gradient-mesh-red",
};

export default function GradientBackground({ children }: { children: ReactNode }) {
  const { variant } = useGradientContext();

  return (
    <div
      className={cn(variantClassMap[variant], "relative min-h-screen overflow-hidden")}
    >
      {children}
    </div>
  );
}

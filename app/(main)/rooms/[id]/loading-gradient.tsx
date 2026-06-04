"use client";

import { useGradientContext } from "@/components/providers/gradient-context";
import { useEffect } from "react";

export default function LoadingGradient() {
  const { setVariant } = useGradientContext();

  useEffect(() => {
    setVariant("available");
    return () => setVariant("default");
  }, [setVariant]);

  return null;
}

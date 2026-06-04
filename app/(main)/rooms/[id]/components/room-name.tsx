"use client";

import { useGradientContext } from "@/components/providers/gradient-context";
import { cn } from "@/lib/utils";

export default function RoomName({ name }: { name: string }) {
  const { variant } = useGradientContext();
  const isBooked = variant === "ongoing" || variant === "unavailable";
  const isUpcoming = variant === "upcoming-soon";

  return (
    <h3
      className={cn(
        "font-serif text-2xl font-semibold tracking-tight",
        isBooked ? "text-[#2D0808]" : isUpcoming ? "text-[#3D1800]" : "text-[#042F4A]"
      )}
    >
      {name}
    </h3>
  );
}

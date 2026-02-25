"use client";

import { Button } from "@/components/ui/button";
import { Room } from "@/types/room";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  room: Room;
  index?: number;
};

// Array of gradient combinations for visual variety
const gradients = [
  "from-violet-500/20 via-fuchsia-500/10 to-pink-500/20",
  "from-cyan-500/20 via-blue-500/10 to-indigo-500/20",
  "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
  "from-rose-500/20 via-pink-500/10 to-fuchsia-500/20",
  "from-indigo-500/20 via-purple-500/10 to-violet-500/20",
];

// Accent versions (higher opacity) — must be static for Tailwind to include them
const accentGradients = [
  "from-violet-500/60 via-fuchsia-500/40 to-pink-500/60",
  "from-cyan-500/60 via-blue-500/40 to-indigo-500/60",
  "from-emerald-500/60 via-teal-500/40 to-cyan-500/60",
  "from-orange-500/60 via-amber-500/40 to-yellow-500/60",
  "from-rose-500/60 via-pink-500/40 to-fuchsia-500/60",
  "from-indigo-500/60 via-purple-500/40 to-violet-500/60",
];

export default function RoomCard({ room, index = 0 }: Props) {
  const gradientIndex = index % gradients.length;
  const gradient = gradients[gradientIndex];
  const accentGradient = accentGradients[gradientIndex];

  return (
    <div className="group relative h-full">
      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute -inset-1 rounded-3xl bg-linear-to-r opacity-0 blur-xl transition-all duration-500 group-hover:opacity-60",
          gradient
        )}
      />

      {/* Card */}
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl",
          "bg-white/70 backdrop-blur-xl dark:bg-white/5",
          "border border-white/50 dark:border-white/10",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          "transition-all duration-300",
          "group-hover:border-white/80 dark:group-hover:border-white/20",
          "group-hover:shadow-xl"
        )}
      >
        {/* Top gradient accent */}
        <div
          className={cn(
            "absolute top-0 right-0 left-0 h-1 bg-linear-to-r",
            accentGradient
          )}
        />

        {/* Decorative background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20">
          <div
            className={cn(
              "absolute top-4 right-4 h-32 w-32 rounded-full bg-linear-to-br blur-2xl",
              gradient
            )}
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col p-6">
          {/* Room Name */}
          <h3 className="mb-3 text-xl font-bold tracking-tight">{room.name}</h3>

          {/* Status indicator */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Available
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          <Button
            asChild
            className={cn(
              "h-12 w-full rounded-xl font-semibold",
              "bg-linear-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary/80",
              "shadow-lg shadow-primary/20",
              "transition-all duration-300",
              "group-hover:shadow-xl group-hover:shadow-primary/30"
            )}
          >
            <Link
              href={`/rooms/${room.id}`}
              className="flex items-center justify-center gap-2"
            >
              <span>Book Room</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

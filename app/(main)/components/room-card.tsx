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

export default function RoomCard({ room, index = 0 }: Props) {
  const gradientIndex = index % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div className="group relative h-full">
      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-0 blur-xl transition-all duration-500 group-hover:opacity-60",
        gradient
      )} />

      {/* Card */}
      <div className={cn(
        "relative h-full flex flex-col overflow-hidden rounded-2xl",
        "bg-white/70 dark:bg-white/5 backdrop-blur-xl",
        "border border-white/50 dark:border-white/10",
        "shadow-lg shadow-black/5 dark:shadow-black/20",
        "transition-all duration-300",
        "group-hover:border-white/80 dark:group-hover:border-white/20",
        "group-hover:shadow-xl group-hover:scale-[1.02]"
      )}>
        {/* Top gradient accent */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          gradient.replace(/\/20/g, "/60").replace(/\/10/g, "/40")
        )} />

        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className={cn("absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br blur-2xl", gradient)} />
        </div>

        {/* Content */}
        <div className="relative flex-1 p-6 flex flex-col">
          {/* Room Name */}
          <h3 className="text-xl font-bold mb-3 tracking-tight">
            {room.name}
          </h3>

          {/* Status indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Available</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          <Button
            asChild
            className={cn(
              "w-full h-12 rounded-xl font-semibold",
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary/80",
              "shadow-lg shadow-primary/20",
              "transition-all duration-300",
              "group-hover:shadow-xl group-hover:shadow-primary/30"
            )}
          >
            <Link href={`/rooms/${room.id}`} className="flex items-center justify-center gap-2">
              <span>Book Room</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

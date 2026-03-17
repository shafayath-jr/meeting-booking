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

export default function RoomCard({ room, index = 0 }: Props) {
  const roomNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative h-full">
      {/* Card */}
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl",
          "bg-[#d4e2db]",
          "border border-white/20",
          "shadow-lg shadow-black/15",
          "transition-all duration-300",
          "group-hover:-translate-y-1",
          "group-hover:shadow-xl group-hover:shadow-black/20"
        )}
      >
        {/* Giant watermark number — the signature element */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 font-serif leading-none font-light text-black/[0.07] select-none"
          style={{ fontSize: "clamp(100px, 18vw, 160px)" }}
        >
          {roomNumber}
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col p-6">
          {/* Room number label */}
          <div className="mb-3 text-[10px] font-bold tracking-[0.22em] text-foreground/40 uppercase">
            Room {roomNumber}
          </div>

          {/* Room Name */}
          <h3 className="mb-5 text-xl leading-tight font-bold tracking-tight text-foreground">
            {room.name}
          </h3>

          {/* Status indicator */}
          <div className="mb-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"
                style={{ animationDuration: "2.5s" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase">
              Available
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          <Button
            asChild
            className={cn(
              "h-11 w-full rounded-xl font-semibold",
              "bg-primary hover:bg-primary/90",
              "shadow-md shadow-primary/20",
              "transition-all duration-200"
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

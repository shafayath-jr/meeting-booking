"use client";

import { Room } from "@/types/room";
import RoomCard from "./room-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Props = {
  rooms: Room[];
};

export default function RoomsSection({ rooms }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const scrollTo =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="my-10">
      {/* heading */}
      <div className="glass-subtle p-4 rounded-2xl mb-6 backdrop-blur-xl">
        <h3 className="text-xl text-center font-semibold">Available Rooms</h3>
      </div>

      {/* rooms slider */}
      {rooms.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No rooms available
        </p>
      ) : (
        <div className="relative">
          {/* Left navigation button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg glass border-white/20 hover:border-white/30 backdrop-blur-xl"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 px-12"
          >
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex-shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[360px]"
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>

          {/* Right navigation button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg glass border-white/20 hover:border-white/30 backdrop-blur-xl"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

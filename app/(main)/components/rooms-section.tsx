"use client";

import { Room } from "@/types/room";
import RoomCard from "./room-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DoorOpen } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Props = {
  rooms: Room[];
};

export default function RoomsSection({ rooms }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cardWidth = 320;
  const gap = 20;

  const updateScrollState = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate active index based on scroll position
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, rooms.length - 1));
    }
  }, [rooms.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollState);
      updateScrollState();
      return () => container.removeEventListener("scroll", updateScrollState);
    }
  }, [updateScrollState]);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const scrollTo = index * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left" 
      ? Math.max(0, activeIndex - 1)
      : Math.min(rooms.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  if (rooms.length === 0) {
    return (
      <div className="mt-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/30 dark:to-teal-500/30">
            <DoorOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Available Rooms</h2>
            <p className="text-sm text-muted-foreground">No rooms available</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-white/5 dark:via-white/2 dark:to-transparent backdrop-blur-xl border border-white/40 dark:border-white/10 p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
              <DoorOpen className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No rooms available</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no meeting rooms configured for this building. Please select another building or contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/30 dark:to-teal-500/30">
            <DoorOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Available Rooms</h2>
            <p className="text-sm text-muted-foreground">
              {rooms.length} room{rooms.length !== 1 ? "s" : ""} ready for booking
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          {/* Dot indicators */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  index === activeIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to room ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              className={cn(
                "h-10 w-10 rounded-xl",
                "bg-white/80 dark:bg-white/10 backdrop-blur-xl",
                "border border-white/60 dark:border-white/10",
                "shadow-lg shadow-black/5 dark:shadow-black/20",
                "transition-all duration-300",
                "hover:bg-white dark:hover:bg-white/20 hover:scale-105",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
              onClick={() => scroll("left")}
              aria-label="Previous room"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              className={cn(
                "h-10 w-10 rounded-xl",
                "bg-white/80 dark:bg-white/10 backdrop-blur-xl",
                "border border-white/60 dark:border-white/10",
                "shadow-lg shadow-black/5 dark:shadow-black/20",
                "transition-all duration-300",
                "hover:bg-white dark:hover:bg-white/20 hover:scale-105",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
              onClick={() => scroll("right")}
              aria-label="Next room"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4"
          style={{ scrollPaddingLeft: "16px" }}
        >
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={cn(
                "flex-shrink-0 snap-start transition-all duration-500",
                index === activeIndex 
                  ? "scale-100 opacity-100" 
                  : "scale-[0.97] opacity-80"
              )}
              style={{ width: `${cardWidth}px` }}
            >
              <RoomCard room={room} index={index} />
            </div>
          ))}
        </div>

        {/* Edge fade gradients */}
        <div className={cn(
          "absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity duration-300",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300",
          canScrollRight ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Mobile dot indicators */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
        {rooms.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              index === activeIndex
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to room ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

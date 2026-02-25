"use client";

import { Room } from "@/types/room";
import RoomCard from "./room-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DoorOpen } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 320;
const CARD_GAP = 20;

const NAV_BUTTON_CLASS = cn(
  "h-10 w-10 rounded-xl",
  "bg-white/80 backdrop-blur-xl dark:bg-white/10",
  "border border-white/60 dark:border-white/10",
  "shadow-lg shadow-black/5 dark:shadow-black/20",
  "transition-all duration-300",
  "hover:scale-105 hover:bg-white dark:hover:bg-white/20",
  "disabled:opacity-40 disabled:hover:scale-100"
);

type Props = {
  rooms: Room[];
};

function SectionHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 p-2.5 dark:from-emerald-500/30 dark:to-teal-500/30">
        <DoorOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">Available Rooms</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function DotIndicators({
  count,
  activeIndex,
  onDotClick,
}: {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            "rounded-full transition-all duration-300",
            index === activeIndex
              ? "h-2 w-6 bg-primary"
              : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
          )}
          aria-label={`Go to room ${index + 1}`}
        />
      ))}
    </>
  );
}

export default function RoomsSection({ rooms }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(rooms.length > 1);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    setActiveIndex(
      Math.min(Math.round(scrollLeft / (CARD_WIDTH + CARD_GAP)), rooms.length - 1)
    );
  }, [rooms.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => container.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollToIndex = (index: number) => {
    scrollContainerRef.current?.scrollTo({
      left: index * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  };

  const scroll = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(rooms.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  };

  if (rooms.length === 0) {
    return (
      <div className="mt-10">
        <div className="mb-6">
          <SectionHeader subtitle="No rooms available" />
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-linear-to-br from-white/60 via-white/40 to-white/20 p-16 text-center backdrop-blur-xl dark:border-white/10 dark:from-white/5 dark:via-white/2 dark:to-transparent">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent" />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-muted/30 to-muted/10">
              <DoorOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No rooms available</h3>
            <p className="mx-auto max-w-md text-muted-foreground">
              There are no meeting rooms configured for this building. Please select
              another building or contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-8 flex items-center justify-between">
        <SectionHeader
          subtitle={`${rooms.length} room${rooms.length !== 1 ? "s" : ""} ready for booking`}
        />

        <div className="flex items-center gap-3">
          <div className="mr-2 hidden items-center gap-1.5 sm:flex">
            <DotIndicators
              count={rooms.length}
              activeIndex={activeIndex}
              onDotClick={scrollToIndex}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              className={NAV_BUTTON_CLASS}
              onClick={() => scroll("left")}
              aria-label="Previous room"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              className={NAV_BUTTON_CLASS}
              onClick={() => scroll("right")}
              aria-label="Next room"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4"
          style={{ scrollPaddingLeft: "16px" }}
        >
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={cn(
                "shrink-0 snap-start transition-all duration-500",
                index === activeIndex
                  ? "scale-100 opacity-100"
                  : "scale-[0.97] opacity-80"
              )}
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <RoomCard room={room} index={index} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden">
        <DotIndicators
          count={rooms.length}
          activeIndex={activeIndex}
          onDotClick={scrollToIndex}
        />
      </div>
    </div>
  );
}

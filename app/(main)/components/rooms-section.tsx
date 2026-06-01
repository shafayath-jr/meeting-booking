"use client";

import { Room } from "@/types/room";
import RoomCard from "./room-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const NAV_BUTTON_CLASS = cn(
  "h-10 w-10 rounded-xl",
  "bg-white/12 backdrop-blur-xl",
  "border border-white/15",
  "transition-all duration-300",
  "hover:scale-105 hover:bg-white/20 hover:border-white/25",
  "disabled:opacity-30 disabled:hover:scale-100"
);

type Props = {
  rooms: Room[];
};

function SectionHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
        <DoorOpen className="h-5 w-5 text-emerald-400" />
      </div>
      <div>
        {/* <p className="mb-0.5 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
          Inventory
        </p> */}
        <h2 className="text-xl font-semibold tracking-tight text-secondary">
          Available Rooms
        </h2>
        <p className="text-xs text-secondary/55">{subtitle}</p>
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
              ? "h-1.5 w-6 bg-emerald-400"
              : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
          )}
          aria-label={`Go to room ${index + 1}`}
        />
      ))}
    </>
  );
}

export default function RoomsSection({ rooms }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(rooms.length > 1);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setActiveIndex(api.selectedScrollSnap());
      setCanScrollLeft(api.canScrollPrev());
      setCanScrollRight(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  const scrollToIndex = (index: number) => api?.scrollTo(index);
  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      api?.scrollPrev();
    } else {
      api?.scrollNext();
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="mt-10">
        <div className="mb-6">
          <SectionHeader subtitle="No rooms available" />
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-linear-to-br from-white/60 via-white/40 to-white/20 p-16 text-center backdrop-blur-xl">
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
              <ChevronLeft className="h-5 w-5 text-white/80" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              className={NAV_BUTTON_CLASS}
              onClick={() => scroll("right")}
              aria-label="Next room"
            >
              <ChevronRight className="h-5 w-5 text-white/80" />
            </Button>
          </div>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: false }}
        className="-mx-4"
      >
        <CarouselContent className="px-4 pb-4">
          {rooms.map((room, index) => (
            <CarouselItem
              key={room.id}
              className={cn("basis-xs transition-all duration-500")}
            >
              <RoomCard room={room} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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

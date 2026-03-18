"use client";

import { Button } from "@/components/ui/button";
import { Building } from "@/types/building";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  buildings: Building[];
  currentBuildingId: string;
};

export default function PlaceCycle({ buildings, currentBuildingId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const currentBuilding =
    buildings.find((building) => building.id === currentBuildingId) || buildings[0];

  const currentIndex = buildings.findIndex(
    (building) => building.id === currentBuilding?.id
  );

  const updateBuildingInUrl = (buildingId: string) => {
    router.push(`${pathname}?building=${buildingId}`);
  };

  const handlePrevBuilding = () => {
    const prevIndex = currentIndex === 0 ? buildings.length - 1 : currentIndex - 1;
    updateBuildingInUrl(buildings[prevIndex].id);
  };

  const handleNextBuilding = () => {
    const nextIndex = currentIndex === buildings.length - 1 ? 0 : currentIndex + 1;
    updateBuildingInUrl(buildings[nextIndex].id);
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/60 bg-linear-to-br from-[#0C170F] to-[#18502E]">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb-drift-a absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/12 blur-3xl" />
          <div className="orb-drift-b absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              onClick={handlePrevBuilding}
              size="icon"
              variant="ghost"
              disabled={buildings.length <= 1}
              className={cn(
                "h-12 w-12 rounded-xl md:h-14 md:w-14",
                "bg-white/10 hover:bg-white/20",
                "border border-white/15 hover:border-white/30",
                "shadow-lg shadow-black/5",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
            >
              <ChevronLeft className="h-6 w-6 text-white/80" />
            </Button>

            {/* Building Info */}
            <div className="flex-1 text-center">
              {/* Location badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-emerald-400 uppercase">
                <MapPin className="h-3 w-3" />
                <span>Current Location</span>
              </div>

              {/* Building name */}
              <h2 className="font-serif text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
                {currentBuilding?.name || "No Building"}
              </h2>

              {/* Building indicator dots + count */}
              <div className="mt-4 flex flex-col items-center gap-2">
                {buildings.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {buildings.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          idx === currentIndex
                            ? "h-1.5 w-6 bg-emerald-400"
                            : "h-1.5 w-1.5 bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                )}
                <p className="text-[11px] font-semibold tracking-[0.2em] text-white/30 uppercase">
                  {currentIndex + 1} / {buildings.length}
                </p>
              </div>
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNextBuilding}
              size="icon"
              variant="ghost"
              disabled={buildings.length <= 1}
              className={cn(
                "h-12 w-12 rounded-xl md:h-14 md:w-14",
                "bg-white/10 hover:bg-white/20",
                "border border-white/15 hover:border-white/30",
                "shadow-lg shadow-black/5",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
            >
              <ChevronRight className="h-6 w-6 text-white/80" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-white/80 via-white/60 to-white/40 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent dark:shadow-black/20">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-violet-500/5" />

        <div className="relative p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              onClick={handlePrevBuilding}
              size="icon"
              variant="ghost"
              disabled={buildings.length <= 1}
              className={cn(
                "h-12 w-12 rounded-xl md:h-14 md:w-14",
                "bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20",
                "border border-white/60 dark:border-white/10",
                "shadow-lg shadow-black/5 dark:shadow-black/20",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Building Info */}
            <div className="flex-1 text-center">
              {/* Building indicator dots */}
              {buildings.length > 1 && (
                <div className="mb-3 flex items-center justify-center gap-1.5">
                  {buildings.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        idx === currentIndex
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Location badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20">
                <MapPin className="h-3 w-3" />
                <span>Current Location</span>
              </div>

              {/* Building name */}
              <h2 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-4xl lg:text-5xl">
                {currentBuilding?.name || "No Building"}
              </h2>

              {/* Building count */}
              <p className="mt-2 text-sm text-muted-foreground">
                {currentIndex + 1} of {buildings.length} building
                {buildings.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNextBuilding}
              size="icon"
              variant="ghost"
              disabled={buildings.length <= 1}
              className={cn(
                "h-12 w-12 rounded-xl md:h-14 md:w-14",
                "bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20",
                "border border-white/60 dark:border-white/10",
                "shadow-lg shadow-black/5 dark:shadow-black/20",
                "transition-all duration-300 hover:scale-105 active:scale-95",
                "disabled:opacity-40 disabled:hover:scale-100"
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

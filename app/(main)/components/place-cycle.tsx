"use client";

import { Button } from "@/components/ui/button";
import { Building } from "@/types/building";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  buildings: Building[];
  currentBuildingId: string;
};

export default function PlaceCycle({ buildings, currentBuildingId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const currentBuilding =
    buildings.find((building) => building.id === currentBuildingId) ||
    buildings[0];

  const currentIndex = buildings.findIndex(
    (building) => building.id === currentBuilding?.id
  );

  const updateBuildingInUrl = (buildingId: string) => {
    router.push(`${pathname}?building=${buildingId}`);
  };

  const handlePrevBuilding = () => {
    const prevIndex =
      currentIndex === 0 ? buildings.length - 1 : currentIndex - 1;
    updateBuildingInUrl(buildings[prevIndex].id);
  };

  const handleNextBuilding = () => {
    const nextIndex =
      currentIndex === buildings.length - 1 ? 0 : currentIndex + 1;
    updateBuildingInUrl(buildings[nextIndex].id);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <Button onClick={handlePrevBuilding} size="icon-lg" disabled={buildings.length <= 1}>
        <ChevronsLeft />
      </Button>

      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {currentBuilding?.name || "No Building"}
        </h2>
      </div>

      <Button onClick={handleNextBuilding} size="icon-lg" disabled={buildings.length <= 1}>
        <ChevronsRight />
      </Button>
    </div>
  );
}

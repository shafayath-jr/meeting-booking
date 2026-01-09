"use client";

import { Button } from "@/components/ui/button";
import { Building } from "@/types/building";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

type Props = {
  buildings: Building[];
};

export default function PlaceCycle({ buildings }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const buildingId = searchParams.get("building");
  const currentBuildingId = buildingId || (buildings[0]?.id ?? "");

  const currentBuilding =
    buildings.find((building) => building.id === currentBuildingId) ||
    buildings[0];

  useEffect(() => {
    if (!buildingId && buildings.length > 0 && buildings[0]?.id) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("building", buildings[0].id);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [buildingId, buildings, pathname, router, searchParams]);

  const currentIndex = buildings.findIndex(
    (building) => building.id === currentBuilding?.id
  );

  const updateBuildingInUrl = (buildingId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("building", buildingId);
    router.push(`${pathname}?${params.toString()}`);
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
      <Button onClick={handlePrevBuilding} size="icon-lg">
        <ChevronsLeft />
      </Button>

      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {currentBuilding.name}
        </h2>
      </div>

      <Button onClick={handleNextBuilding} size="icon-lg">
        <ChevronsRight />
      </Button>
    </div>
  );
}

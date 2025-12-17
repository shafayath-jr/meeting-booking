"use client";

import { Button } from "@/components/ui/button";
import { MEETING_PLACES } from "@/lib/constants";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function PlaceCycle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const placeId = searchParams.get("place");
  const currentPlaceId = placeId ? parseInt(placeId, 10) : MEETING_PLACES[0].id;

  const currentPlace =
    MEETING_PLACES.find((place) => place.id === currentPlaceId) ||
    MEETING_PLACES[0];

  const currentIndex = MEETING_PLACES.findIndex(
    (place) => place.id === currentPlace.id
  );

  const updatePlaceInUrl = (placeId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("place", placeId.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrevPlace = () => {
    const prevIndex =
      currentIndex === 0 ? MEETING_PLACES.length - 1 : currentIndex - 1;
    updatePlaceInUrl(MEETING_PLACES[prevIndex].id);
  };

  const handleNextPlace = () => {
    const nextIndex =
      currentIndex === MEETING_PLACES.length - 1 ? 0 : currentIndex + 1;
    updatePlaceInUrl(MEETING_PLACES[nextIndex].id);
  };
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <Button onClick={handlePrevPlace} size="icon-lg">
        <ChevronsLeft />
      </Button>

      <div className="text-center">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {currentPlace.name}
        </h2>
      </div>

      <Button onClick={handleNextPlace} size="icon-lg">
        <ChevronsRight />
      </Button>
    </div>
  );
}

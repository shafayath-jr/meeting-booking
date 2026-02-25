import PlaceCycle from "./components/place-cycle";
import RoomsSection from "./components/rooms-section";
import { getAllBuildings } from "@/actions/building";
import { getRoomsByBuilding } from "@/actions/room";
import { Building } from "@/types/building";
import { Building2 } from "lucide-react";

type Props = {
  searchParams: Promise<{ building?: string }>;
};

async function HomePage({ searchParams }: Props) {
  const { building: buildingId } = await searchParams;
  const { buildings } = await getAllBuildings();

  const selectedBuildingId = buildingId || buildings?.[0]?.id || "";

  const { rooms } = selectedBuildingId
    ? await getRoomsByBuilding(selectedBuildingId)
    : { rooms: [] };

  return (
    <div>
      {/* Building Selection Section */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 dark:bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Select Building</h2>
              <p className="text-sm text-muted-foreground">
                Choose your location to view available rooms
              </p>
            </div>
          </div>

          {/* Place Cycle */}
          <PlaceCycle
            buildings={(buildings as Building[]) || []}
            currentBuildingId={selectedBuildingId}
          />
        </div>
      </div>

      {/* Rooms Section */}
      <div className="px-6">
        <div className="mx-auto max-w-5xl">
          <RoomsSection rooms={rooms || []} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

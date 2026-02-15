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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-linear-to-tr from-violet-500/15 via-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow [animation-delay:1s]" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-linear-to-tl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow [animation-delay:2s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Building Selection Section */}
        <div className="px-6 pt-10 pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20">
                <Building2 className="w-5 h-5 text-primary" />
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
        <div className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <RoomsSection rooms={rooms || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

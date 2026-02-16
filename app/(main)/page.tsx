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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-primary/20 via-primary/10 animate-pulse-slow absolute -top-40 -right-40 h-96 w-96 rounded-full bg-linear-to-br to-transparent blur-3xl" />
        <div className="animate-pulse-slow absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-linear-to-tr from-violet-500/15 via-fuchsia-500/10 to-transparent blur-3xl [animation-delay:1s]" />
        <div className="animate-pulse-slow absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-linear-to-tl from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl [animation-delay:2s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Building Selection Section */}
        <div className="px-6 pt-10 pb-8">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-2">
                <Building2 className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Select Building</h2>
                <p className="text-muted-foreground text-sm">
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
          <div className="mx-auto max-w-5xl">
            <RoomsSection rooms={rooms || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

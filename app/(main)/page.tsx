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
    <div className="py-10">
      {/* Building Selection Section */}
      <div className="animate-fade-in-up px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-6 flex items-center gap-5">
            <div>
              <p className="mb-0.5 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
                Location
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-secondary">
                Select Building
              </h2>
            </div>
            <div className="h-px flex-1 bg-white/10" />
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
              <Building2 className="h-5 w-5 text-emerald-400" />
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
      <div className="animate-fade-in-up px-6" style={{ animationDelay: "120ms" }}>
        <div className="mx-auto max-w-5xl">
          <RoomsSection rooms={rooms || []} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

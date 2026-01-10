import PageContainer from "@/components/page-container";
import PlaceCycle from "./components/place-cycle";
import RoomsSection from "./components/rooms-section";
import PageTitle from "@/components/page-title";
import { getAllBuildings } from "@/actions/building";
import { getRoomsByBuilding } from "@/actions/room";
import { Building } from "@/types/building";

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
    <PageContainer>
      {/* title */}

      <PageTitle title="Booking System" />

      {/* place cycle */}
      <div className="max-w-4xl mx-auto">
        <PlaceCycle
          buildings={(buildings as Building[]) || []}
          currentBuildingId={selectedBuildingId}
        />

        {/* rooms */}

        <RoomsSection rooms={rooms || []} />
      </div>
    </PageContainer>
  );
}

export default HomePage;

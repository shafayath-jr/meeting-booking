import PageContainer from "@/components/page-container";
import PlaceCycle from "./components/place-cycle";
import RoomsSection from "./components/rooms-section";
import PageTitle from "@/components/page-title";
import { getAllBuildings } from "@/actions/building";
import { Building } from "@/types/building";

async function HomePage() {
  const { buildings } = await getAllBuildings();

  return (
    <PageContainer>
      {/* title */}

      <PageTitle title="Booking System" />

      {/* place cycle */}
      <div className="max-w-4xl mx-auto">
        <PlaceCycle buildings={buildings as Building[]} />

        {/* rooms */}

        <RoomsSection />
      </div>
    </PageContainer>
  );
}

export default HomePage;

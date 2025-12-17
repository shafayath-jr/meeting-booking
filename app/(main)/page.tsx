import PageContainer from "@/components/page-container";
import PlaceCycle from "./components/place-cycle";
import RoomsSection from "./components/rooms-section";
import PageTitle from "@/components/page-title";

async function HomePage() {
  return (
    <PageContainer>
      {/* title */}

      <PageTitle title="Booking System" />

      {/* place cycle */}
      <div className="max-w-4xl mx-auto">
        <PlaceCycle />

        {/* rooms */}

        <RoomsSection />
      </div>
    </PageContainer>
  );
}

export default HomePage;

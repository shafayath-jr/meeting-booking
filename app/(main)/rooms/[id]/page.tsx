import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { MEETING_ROOMS } from "@/lib/constants";

type Props = {
  params: Promise<{ id: string }>;
};

async function RoomPage({ params }: Props) {
  const { id } = await params;

  const currentRoom = MEETING_ROOMS.find((room) => room.id === Number(id));

  return (
    <PageContainer>
      <div className="">
        {/* title */}
        <PageTitle title="Meeting Room" />

        {/* room name */}

        <div className="flex items-center justify-center mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-primary font-bold mb-4">
            {currentRoom?.name}
          </h1>
        </div>
      </div>
    </PageContainer>
  );
}

export default RoomPage;

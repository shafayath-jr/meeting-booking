import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { MEETING_ROOMS } from "@/lib/constants";
import { getMeetingsByRoom, getNextMeetingByRoom } from "@/actions/meeting";
import DateCycle from "@/components/date-cycle";
import ActionButtons from "./components/action-buttons";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

async function RoomPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { date } = await searchParams;
  const currentRoom = MEETING_ROOMS.find((room) => room.id === Number(id));
  const { meetings } = await getMeetingsByRoom(currentRoom?.name, date);

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

        {/* date cycle */}
        <DateCycle />

        {/* actions */}

        <ActionButtons />
      </div>
    </PageContainer>
  );
}

export default RoomPage;

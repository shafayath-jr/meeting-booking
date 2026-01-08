import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { getMeetingsByRoom } from "@/actions/meeting";
import DateCycle from "@/components/date-cycle";
import ActionButtons from "./components/action-buttons";
import { getRoomById } from "@/actions/room";
import MeetingCard from "../../components/meeting-card";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

async function RoomPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { date } = await searchParams;
  const { room: currentRoom } = await getRoomById(id);
  const { meetings } = await getMeetingsByRoom(id, date);

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

      {/* list */}

      <div className="grid grid-cols-4 gap-4 my-10">
        {meetings?.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </PageContainer>
  );
}

export default RoomPage;

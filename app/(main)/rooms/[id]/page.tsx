import { MeetingsProvider } from "@/components/providers/meetings-provider";
import PageContainer from "@/components/page-container";
import Clock from "@/app/(main)/components/clock";
import { getRoomById } from "@/actions/room";
import { getMeetingsByRoom } from "@/actions/meeting";
import BookingSection from "./components/booking-section";
import MeetingList from "./components/meeting-list";
import MeetingRoomImage from "./components/booking-section/meeting-room-image";
import { BookingProvider } from "./components/booking-section/booking-context";

type Props = {
  params: Promise<{ id: string }>;
};

async function RoomPage({ params }: Props) {
  const { id } = await params;
  const [{ room }, { meetings }] = await Promise.all([
    getRoomById(id),
    getMeetingsByRoom(id),
  ]);

  return (
    <MeetingsProvider>
      <BookingProvider roomId={id} initialMeetings={meetings ?? []}>
        <PageContainer>
          <div className="flex justify-between gap-10">
            <div className="w-3/5 space-y-10">
              {/* clock  */}

              <Clock />

              {/* room details */}

              <div className="flex flex-col gap-4">
                <MeetingRoomImage />

                <h3 className="text-4xl font-semibold text-secondary uppercase">
                  {room?.name}
                </h3>

                {/* booking section */}

                <BookingSection />
              </div>
            </div>

            <div className="w-2/5 space-y-10">
              <h5 className="text-2xl font-semibold text-secondary">
                Today&apos;s schedule
              </h5>

              {/* meeting list */}

              <MeetingList />
            </div>
          </div>
        </PageContainer>
      </BookingProvider>
    </MeetingsProvider>
  );
}

export default RoomPage;

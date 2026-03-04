import ActionButtons from "./components/action-buttons";
import CalendarWrapper from "./components/calendar-wrapper";
import { MeetingsProvider } from "@/components/providers/meetings-provider";
import PageContainer from "@/components/page-container";
import Clock from "@/app/(main)/components/clock";
import { getRoomById } from "@/actions/room";
import BookingSection from "./components/booking-section";

type Props = {
  params: Promise<{ id: string }>;
};

async function RoomPage({ params }: Props) {
  const { id } = await params;
  const { room } = await getRoomById(id);

  return (
    <MeetingsProvider>
      <PageContainer>
        <div className="flex justify-between gap-4">
          <div className="w-3/4 space-y-10">
            {/* clock  */}

            <Clock />

            {/* room details */}

            <h3 className="text-4xl font-semibold text-secondary">{room?.name}</h3>

            {/* booking section */}

            <BookingSection roomId={id} />
          </div>

          <div className="w-1/4">Lorem, ipsum dolor.</div>
        </div>
        {/* Action buttons */}
        {/* <ActionButtons /> */}

        {/* Calendar */}
        {/* <CalendarWrapper /> */}
      </PageContainer>
    </MeetingsProvider>
  );
}

export default RoomPage;

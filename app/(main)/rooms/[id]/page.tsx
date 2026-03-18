import { MeetingsProvider } from "@/components/providers/meetings-provider";
import PageContainer from "@/components/page-container";
import { getRoomById } from "@/actions/room";
import { getMeetingsByRoom } from "@/actions/meeting";
import BookingSection from "./components/booking-section";
import MeetingList from "./components/meeting-list";
import MeetingRoomImage from "./components/booking-section/meeting-room-image";
import { BookingProvider } from "./components/booking-section/booking-context";
import Image from "next/image";
import Clock from "@/app/(main)/components/clock";

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
              {/* logo  */}

              <Image
                src="/pen-logo.svg"
                alt="Pen Logo"
                width={200}
                height={100}
                className="mb-16 h-20 w-auto"
              />

              {/* room details */}

              <div className="flex flex-col gap-4">
                <MeetingRoomImage />

                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
                    Meeting Room
                  </p>
                  <h3 className="font-serif text-4xl font-light tracking-tight text-secondary">
                    {room?.name}
                  </h3>
                </div>

                {/* booking section */}

                <BookingSection />
              </div>
            </div>

            <div className="w-2/5 space-y-3">
              {/* clock */}

              <Clock />

              <div>
                <p className="mb-0.5 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
                  Schedule
                </p>
                <h5 className="text-xl font-semibold text-secondary">
                  Today&apos;s Meetings
                </h5>
              </div>

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

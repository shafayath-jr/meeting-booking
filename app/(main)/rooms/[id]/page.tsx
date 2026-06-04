import { getMeetingsByRoom } from "@/actions/meeting";
import { getRoomById } from "@/actions/room";
import Clock from "@/app/(main)/components/clock";
import PageContainer from "@/components/page-container";
import { MeetingsProvider } from "@/components/providers/meetings-provider";
import Image from "next/image";
import BookingSection from "./components/booking-section";
import { BookingProvider } from "./components/booking-section/booking-context";
import MeetingRoomImage from "./components/booking-section/meeting-room-image";
import MeetingList from "./components/meeting-list";
import RoomName from "./components/room-name";

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
        <Image
          src="/pen_pattern.svg"
          alt=""
          width={241}
          height={249}
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 -z-10"
        />
        <Image
          src="/pattern-right.svg"
          alt=""
          width={201}
          height={416}
          aria-hidden
          className="pointer-events-none fixed top-1/2 right-0 -z-10 -translate-y-1/2"
        />
        <PageContainer>
          <div className="flex justify-between gap-10">
            <div className="w-1/2 space-y-10">
              {/* logo  */}

              <Image
                src="/pen-master-logo.svg"
                alt="Pen Logo"
                width={200}
                height={100}
                className="mb-16 h-20 w-auto"
              />

              {/* room details */}

              <div className="flex flex-col gap-4">
                <MeetingRoomImage />

                <div>
                  <RoomName name={room?.name ?? ""} />
                </div>

                {/* booking section */}

                <BookingSection />
              </div>
            </div>

            <div className="w-1/2 space-y-3">
              {/* clock */}

              <Clock />

              <div>
                <p className="text-black`/35 mb-0.5 text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Schedule
                </p>
                <h5 className="text-xl font-semibold text-black">
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

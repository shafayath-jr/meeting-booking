import ActionButtons from "./components/action-buttons";
import CalendarWrapper from "./components/calendar-wrapper";
import { MeetingsProvider } from "@/components/providers/meetings-provider";
import PageContainer from "@/components/page-container";

type Props = {
  params: Promise<{ id: string }>;
};

async function RoomPage({ params }: Props) {
  await params;

  return (
    <MeetingsProvider>
      <PageContainer>
        {/* Action buttons */}
        <ActionButtons />

        {/* Calendar */}
        <CalendarWrapper />
      </PageContainer>
    </MeetingsProvider>
  );
}

export default RoomPage;

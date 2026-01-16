import PageContainer from "@/components/page-container";
import ActionButtons from "./components/action-buttons";
import CalendarWrapper from "./components/calendar-wrapper";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

async function RoomPage({ params, searchParams }: Props) {
  await params;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Action buttons */}
        <ActionButtons />

        {/* Calendar */}
        <CalendarWrapper />
      </div>
    </PageContainer>
  );
}

export default RoomPage;

import ActionButtons from "./components/action-buttons";
import CalendarWrapper from "./components/calendar-wrapper";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

async function RoomPage({ params, searchParams }: Props) {
  await params;

  return (
    <div>
      <div className="container mx-auto py-10 px-6">
        <div className="space-y-6">
          {/* Action buttons */}
          <ActionButtons />

          {/* Calendar */}
          <CalendarWrapper />
        </div>
      </div>
    </div>
  );
}

export default RoomPage;

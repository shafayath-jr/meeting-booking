import PageContainer from "@/components/page-container";
import Clock from "@/app/(main)/components/clock";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoomLoading() {
  return (
    <PageContainer>
      <div className="flex justify-between gap-10">
        {/* Left column */}
        <div className="w-3/5 space-y-10">
          <Clock />
          <Skeleton className="h-10 w-64" /> {/* room name */}
          <Skeleton className="h-64 w-full" /> {/* BookingSection */}
        </div>

        {/* Right column */}
        <div className="w-2/5 space-y-10">
          <h5 className="text-2xl font-semibold text-secondary">Today&apos;s schedule</h5>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

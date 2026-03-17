import PageContainer from "@/components/page-container";
import Clock from "@/app/(main)/components/clock";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function RoomLoading() {
  return (
    <PageContainer>
      <div className="flex justify-between gap-10">
        {/* Left column */}
        <div className="w-3/5 space-y-10">
          <Image
            src="/pen-logo.svg"
            alt="Pen Logo"
            width={200}
            height={100}
            className="mb-16 h-20 w-auto"
          />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-60 w-full rounded-xl" /> {/* room image */}
            <Skeleton className="h-10 w-64" /> {/* room name */}
            <Skeleton className="h-6 w-48" /> {/* availability text */}
            <Skeleton className="h-10 w-32" /> {/* book button */}
          </div>
        </div>

        {/* Right column */}
        <div className="w-2/5 space-y-3">
          <Clock />
          <h5 className="text-2xl font-semibold text-secondary">Today&apos;s schedule</h5>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl bg-black/10" />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

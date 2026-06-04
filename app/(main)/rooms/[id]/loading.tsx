import Clock from "@/app/(main)/components/clock";
import PageContainer from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import LoadingGradient from "./loading-gradient";

export default function RoomLoading() {
  return (
    <>
      <LoadingGradient />
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
          {/* Left column */}
          <div className="w-1/2 space-y-10">
            <Image
              src="/pen-master-logo.svg"
              alt="Pen Logo"
              width={200}
              height={100}
              className="mb-16 h-20 w-auto"
            />

            <div className="flex flex-col gap-4">
              <Skeleton className="h-60 w-full rounded-xl" />
              <Skeleton className="h-8 w-56" />

              <div className="space-y-10">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-1/2 space-y-3">
            <Clock />

            <div>
              <p className="text-black`/35 mb-0.5 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Schedule
              </p>
              <h5 className="text-xl font-semibold text-black">Today&apos;s Meetings</h5>
            </div>

            <div className="scrollbar-transparent max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-black/10" />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

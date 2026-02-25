import { Skeleton } from "@/components/ui/skeleton";
import { Building2, DoorOpen } from "lucide-react";

export default function HomeLoading() {
  return (
    <div>
      {/* Building Selection Section Skeleton */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 dark:bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          {/* PlaceCycle Skeleton */}
          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-linear-to-br from-white/80 via-white/60 to-white/40 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent dark:shadow-black/20">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                {/* Prev button */}
                <Skeleton className="h-12 w-12 rounded-xl md:h-14 md:w-14" />

                {/* Building info */}
                <div className="flex-1 space-y-3 text-center">
                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className={`h-1.5 rounded-full ${i === 0 ? "w-6" : "w-1.5"}`}
                      />
                    ))}
                  </div>
                  {/* "Current Location" badge */}
                  <Skeleton className="mx-auto h-6 w-32 rounded-full" />
                  {/* Building name */}
                  <Skeleton className="mx-auto h-8 w-48 md:h-10 md:w-64" />
                  {/* "1 of X buildings" */}
                  <Skeleton className="mx-auto mt-2 h-4 w-28" />
                </div>

                {/* Next button */}
                <Skeleton className="h-12 w-12 rounded-xl md:h-14 md:w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section Skeleton */}
      <div className="px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mt-10">
            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 p-2.5 dark:from-emerald-500/30 dark:to-teal-500/30">
                  <DoorOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-6 w-36" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Dot indicators skeleton */}
                <div className="mr-2 hidden items-center gap-1.5 sm:flex">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className={`rounded-full ${i === 0 ? "h-2 w-6" : "h-2 w-2"}`}
                    />
                  ))}
                </div>
                {/* Arrow buttons skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Room Cards Skeleton */}
            <div className="-mx-4 flex gap-4 overflow-hidden px-4 pb-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-80 shrink-0">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
                    {/* Top accent bar */}
                    <Skeleton className="h-1 w-full rounded-none" />
                    <div className="flex flex-1 flex-col p-6">
                      {/* Room name */}
                      <Skeleton className="mb-3 h-7 w-3/4" />
                      {/* Status */}
                      <div className="mb-6 flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      {/* Spacer */}
                      <div className="flex-1" />
                      {/* Book button */}
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile dots skeleton */}
            <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className={`rounded-full ${i === 0 ? "h-2 w-6" : "h-2 w-2"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

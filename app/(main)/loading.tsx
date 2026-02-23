import { Skeleton } from "@/components/ui/skeleton";
import { Building2, DoorOpen } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-violet-500/15 via-fuchsia-500/10 to-transparent blur-3xl [animation-delay:1s]" />
        <div className="absolute right-1/4 bottom-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl [animation-delay:2s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Building Selection Section Skeleton */}
        <div className="px-6 pt-10 pb-8">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 dark:bg-primary/20">
                <Building2 className="h-5 w-5 animate-pulse text-primary" />
              </div>
              <div>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            {/* Place Cycle Skeleton */}
            <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-white/80 via-white/60 to-white/40 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent dark:shadow-black/20">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl md:h-14 md:w-14" />
                  <div className="flex-1 space-y-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          className={`h-1.5 rounded-full ${i === 1 ? "w-6" : "w-1.5"}`}
                        />
                      ))}
                    </div>
                    <Skeleton className="mx-auto h-5 w-24" />
                    <Skeleton className="mx-auto h-10 w-48 md:h-14 md:w-64" />
                    <Skeleton className="mx-auto h-4 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl md:h-14 md:w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section Skeleton */}
        <div className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="mt-10">
              {/* Section Header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-2.5 dark:from-emerald-500/30 dark:to-teal-500/30">
                    <DoorOpen className="h-5 w-5 animate-pulse text-emerald-600 dark:text-emerald-400" />
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
              <div className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="shrink-0" style={{ width: "320px" }}>
                    <div className="h-full rounded-2xl border border-white/50 bg-white/70 p-6 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
                      {/* Name skeleton */}
                      <Skeleton className="mb-3 h-7 w-3/4" />
                      {/* Status skeleton */}
                      <div className="mb-6 flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      {/* Button skeleton */}
                      <Skeleton className="h-12 w-full rounded-xl" />
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
    </div>
  );
}

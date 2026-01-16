import { Skeleton } from "@/components/ui/skeleton";
import { Building2, DoorOpen } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-violet-500/15 via-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Building Selection Section Skeleton */}
        <div className="px-6 pt-10 pb-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20">
                <Building2 className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            {/* Place Cycle Skeleton */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-xl" />
                  <div className="flex-1 text-center space-y-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className={`h-1.5 rounded-full ${i === 1 ? 'w-6' : 'w-1.5'}`} />
                      ))}
                    </div>
                    <Skeleton className="h-5 w-24 mx-auto" />
                    <Skeleton className="h-10 md:h-14 w-48 md:w-64 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section Skeleton */}
        <div className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mt-10">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/30 dark:to-teal-500/30">
                    <DoorOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-36 mb-1" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Dot indicators skeleton */}
                  <div className="hidden sm:flex items-center gap-1.5 mr-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className={`rounded-full ${i === 0 ? 'w-6 h-2' : 'w-2 h-2'}`} />
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
              <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: "320px" }}
                  >
                    <div className="h-full rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
                      {/* Name skeleton */}
                      <Skeleton className="h-7 w-3/4 mb-3" />
                      {/* Status skeleton */}
                      <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      {/* Button skeleton */}
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile dots skeleton */}
              <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className={`rounded-full ${i === 0 ? 'w-6 h-2' : 'w-2 h-2'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

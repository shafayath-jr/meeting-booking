import { Skeleton } from "@/components/ui/skeleton";

export function MonthCalendarSkeleton() {
  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>

      {/* Weekdays */}
      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>

      {/* Days grid */}
      {Array.from({ length: 5 }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex gap-1">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <Skeleton key={dayIndex} className="aspect-square flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

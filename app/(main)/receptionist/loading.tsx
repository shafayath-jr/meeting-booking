import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, ClipboardList, DoorOpen, MapPin } from "lucide-react";

function ColumnFrame({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/40 bg-linear-to-br from-[#102016] to-[#1E633A]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-secondary">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative flex-1 space-y-2 overflow-hidden p-4">{children}</div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <Skeleton className="h-7 w-7 rounded-lg bg-white/5" />
      <Skeleton className="h-4 flex-1 bg-white/5" />
    </div>
  );
}

function RoomRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <Skeleton className="h-6 w-9 rounded-lg bg-white/5" />
      <Skeleton className="h-4 flex-1 bg-white/5" />
      <Skeleton className="h-2 w-2 rounded-full bg-white/5" />
    </div>
  );
}

function BookingSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative space-y-4 rounded-3xl border border-emerald-900/40 p-4 pt-7">
      <div className="absolute -top-3 left-5 rounded-full border border-emerald-900/40 bg-[#0A8754] px-3 py-1">
        <h5 className="text-xs font-medium text-secondary">{label}</h5>
      </div>
      {children}
    </div>
  );
}

export default function ReceptionistLoading() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-5">
          <div>
            <p className="mb-0.5 text-[10px] font-semibold tracking-[0.22em] text-white/35 uppercase">
              Receptionist
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-secondary">
              Book a Meeting Room
            </h2>
          </div>
          <div className="h-px flex-1 bg-white/10" />
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
            <ClipboardList className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

        <div className="grid h-[calc(100vh-12rem)] gap-4 md:grid-cols-[280px_320px_1fr]">
          <ColumnFrame
            title="Select Building"
            icon={<MapPin className="h-4 w-4 text-emerald-400" />}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <ListRowSkeleton key={i} />
            ))}
          </ColumnFrame>

          <ColumnFrame
            title="Select Room"
            icon={<DoorOpen className="h-4 w-4 text-emerald-400" />}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <RoomRowSkeleton key={i} />
            ))}
          </ColumnFrame>

          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/40 bg-linear-to-br from-[#102016] to-[#1E633A]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                <CalendarClock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-secondary">
                  Book Meeting
                </h3>
              </div>
            </div>

            <div className="relative flex-1 space-y-6 overflow-hidden p-5">
              <BookingSection label="Date">
                <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
              </BookingSection>

              <BookingSection label="Available time slots">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              </BookingSection>

              <BookingSection label="Meeting duration">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-xl bg-white/5" />
                  ))}
                </div>
              </BookingSection>

              <BookingSection label="Meeting details">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-md bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-white/5" />
                    <Skeleton className="h-10 w-full rounded-md bg-white/5" />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Skeleton className="h-4 w-16 bg-white/5" />
                    <Skeleton className="h-11 w-full rounded-md bg-white/5" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Skeleton className="h-11 w-40 rounded-xl bg-white/5" />
                </div>
              </BookingSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

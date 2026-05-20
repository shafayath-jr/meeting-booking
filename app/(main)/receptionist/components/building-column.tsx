"use client";

import { Building } from "@/types/building";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReceptionistBooking } from "./receptionist-booking-context";

type Props = {
  buildings: Building[];
};

export default function BuildingColumn({ buildings }: Props) {
  const { selectedBuildingId, setSelectedBuildingId } = useReceptionistBooking();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#d4e2db] shadow-lg shadow-black/15">
      <div className="relative flex items-center gap-3 border-b border-black/10 px-5 py-5">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <MapPin className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Select Building
          </h3>
        </div>
      </div>

      <div className="relative flex-1 space-y-2 overflow-y-auto p-4">
        {buildings.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <Building2 className="h-10 w-10 text-foreground/20" />
            <p className="text-sm text-foreground/40">No buildings configured</p>
          </div>
        )}

        {buildings.map((building) => {
          const isActive = building.id === selectedBuildingId;
          return (
            <button
              key={building.id}
              onClick={() => setSelectedBuildingId(building.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-emerald-500/30 bg-white/40 hover:border-emerald-500/50 hover:bg-white/60"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-700"
                    : "bg-black/5 text-foreground/50 group-hover:text-foreground/70"
                )}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "flex-1 truncate text-sm font-medium",
                  isActive ? "text-emerald-700" : "text-foreground"
                )}
              >
                {building.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

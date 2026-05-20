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
          <MapPin className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-secondary">
            Select Building
          </h3>
        </div>
      </div>

      <div className="relative flex-1 space-y-2 overflow-y-auto p-4">
        {buildings.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <Building2 className="h-10 w-10 text-white/20" />
            <p className="text-sm text-white/40">No buildings configured</p>
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
                  : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-white/5 text-white/50 group-hover:text-white/70"
                )}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "flex-1 truncate text-sm font-medium",
                  isActive ? "text-secondary" : "text-white/70"
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

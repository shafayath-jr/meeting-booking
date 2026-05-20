"use client";

import { Room } from "@/types/room";
import { DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReceptionistBooking } from "./receptionist-booking-context";

type Props = {
  rooms: Room[];
  isLoading: boolean;
};

export default function RoomColumn({ rooms, isLoading }: Props) {
  const { selectedBuildingId, selectedRoomId, setSelectedRoomId } =
    useReceptionistBooking();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#d4e2db] shadow-lg shadow-black/15">
      <div className="relative flex items-center gap-3 border-b border-black/10 px-5 py-5">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <DoorOpen className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Select Room
          </h3>
        </div>
      </div>

      <div className="relative flex-1 space-y-2 overflow-y-auto p-4">
        {!selectedBuildingId && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <DoorOpen className="h-10 w-10 text-foreground/20" />
            <p className="max-w-[14rem] text-sm text-foreground/40">
              Pick a building to see its rooms
            </p>
          </div>
        )}

        {selectedBuildingId && isLoading && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl border border-black/10 bg-black/5"
              />
            ))}
          </div>
        )}

        {selectedBuildingId && !isLoading && rooms.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <DoorOpen className="h-10 w-10 text-foreground/20" />
            <p className="max-w-[14rem] text-sm text-foreground/40">
              No rooms available for this building
            </p>
          </div>
        )}

        {selectedBuildingId &&
          !isLoading &&
          rooms.map((room, index) => {
            const isActive = room.id === selectedRoomId;
            const roomNumber = String(index + 1).padStart(2, "0");
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                  isActive
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-emerald-500/30 bg-white/40 hover:border-emerald-500/50 hover:bg-white/60"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-2 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-colors",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-700"
                      : "bg-black/5 text-foreground/40 group-hover:text-foreground/60"
                  )}
                >
                  {roomNumber}
                </div>
                <span
                  className={cn(
                    "flex-1 truncate text-sm font-medium",
                    isActive ? "text-emerald-700" : "text-foreground"
                  )}
                >
                  {room.name}
                </span>
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"
                    style={{ animationDuration: "2.5s" }}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

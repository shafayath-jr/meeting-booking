"use client";

import { useEffect, useState } from "react";
import { Building } from "@/types/building";
import { Room } from "@/types/room";
import { getRoomsByBuilding } from "@/actions/room";
import {
  ReceptionistBookingProvider,
  useReceptionistBooking,
} from "./receptionist-booking-context";
import BuildingColumn from "./building-column";
import RoomColumn from "./room-column";
import BookingColumn from "./booking-column";

type Props = {
  buildings: Building[];
};

function ReceptionistGrid({ buildings }: Props) {
  const { selectedBuildingId } = useReceptionistBooking();
  const [loadedBuildingId, setLoadedBuildingId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!selectedBuildingId) return;

    let cancelled = false;
    getRoomsByBuilding(selectedBuildingId).then(({ rooms: fetched }) => {
      if (cancelled) return;
      setRooms(fetched ?? []);
      setLoadedBuildingId(selectedBuildingId);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedBuildingId]);

  const visibleRooms = selectedBuildingId === loadedBuildingId ? rooms : [];
  const isLoadingRooms = !!selectedBuildingId && selectedBuildingId !== loadedBuildingId;

  return (
    <div className="grid h-[calc(100vh-12rem)] gap-4 md:grid-cols-[280px_320px_1fr]">
      <BuildingColumn buildings={buildings} />
      <RoomColumn rooms={visibleRooms} isLoading={isLoadingRooms} />
      <BookingColumn />
    </div>
  );
}

export default function ReceptionistView({ buildings }: Props) {
  return (
    <ReceptionistBookingProvider>
      <ReceptionistGrid buildings={buildings} />
    </ReceptionistBookingProvider>
  );
}

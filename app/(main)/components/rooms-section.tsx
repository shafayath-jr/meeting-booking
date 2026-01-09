"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRoomsByBuilding } from "@/actions/room";
import { Room } from "@/types/room";
import RoomCard from "./room-card";

export default function RoomsSection() {
  const searchParams = useSearchParams();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  const buildingId = searchParams.get("building");

  useEffect(() => {
    if (!buildingId) return;

    const fetchRooms = async () => {
      const roomsResult = await getRoomsByBuilding(buildingId);

      if (!roomsResult.error && roomsResult.rooms) {
        setAvailableRooms(roomsResult.rooms);
      }
    };

    fetchRooms();
  }, [buildingId]);

  return (
    <div>
      {/* heading */}

      <div className="p-4 border rounded-xl">
        <h3 className="text-xl text-center font-semibold">Available Rooms</h3>
      </div>

      {/* rooms */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        {availableRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

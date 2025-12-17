"use client";
import { MEETING_PLACES, MEETING_ROOMS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import RoomCard from "./room-card";

export default function RoomsSection() {
  const searchParams = useSearchParams();

  const placeId = searchParams.get("place");
  const currentPlaceId = placeId ? parseInt(placeId, 10) : MEETING_PLACES[0].id;

  const availableRooms = MEETING_ROOMS.filter(
    (room) => room.placeId === currentPlaceId
  );

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

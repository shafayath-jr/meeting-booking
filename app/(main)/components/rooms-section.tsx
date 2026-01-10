import { Room } from "@/types/room";
import RoomCard from "./room-card";

type Props = {
  rooms: Room[];
};

export default function RoomsSection({ rooms }: Props) {
  return (
    <div>
      {/* heading */}

      <div className="p-4 border rounded-xl">
        <h3 className="text-xl text-center font-semibold">Available Rooms</h3>
      </div>

      {/* rooms */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No rooms available
          </p>
        ) : (
          rooms.map((room) => <RoomCard key={room.id} room={room} />)
        )}
      </div>
    </div>
  );
}

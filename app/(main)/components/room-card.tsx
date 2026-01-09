import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Room } from "@/types/room";
import Link from "next/link";

type Props = {
  room: Room;
};

export default function RoomCard({ room }: Props) {
  return (
    <Card>
      <CardContent>
        <h6 className="font-semibold text-center text-xl">{room.name}</h6>
      </CardContent>

      <CardFooter className="flex items-center justify-center">
        <Button asChild size="lg">
          <Link href={`/rooms/${room.id}`}>Select this room</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

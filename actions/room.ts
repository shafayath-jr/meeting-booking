import { MEETING_ROOMS } from "@/lib/constants";

export const getRoomById = (id: number) => {
  const room = MEETING_ROOMS.find((room) => room.id === id);
  return room;
};

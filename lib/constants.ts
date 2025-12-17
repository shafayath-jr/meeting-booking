import { Room } from "@/types/room";

export const MEETING_PLACES = [
  {
    id: 1,
    name: "Moorfoot House",
  },
  { id: 2, name: "Canary Wharf HX" },
];

export const MEETING_ROOMS: Room[] = [
  {
    id: 1,
    name: "GF-LeftSide",
    placeId: 1,
  },
  {
    id: 2,
    name: "GF-RightSide",
    placeId: 1,
  },
  {
    id: 3,
    name: "2F-MiddleRoom",
    placeId: 1,
  },
  {
    id: 4,
    name: "3F-MiddleRoom",
    placeId: 1,
  },
  {
    id: 5,
    name: "Room-512",
    placeId: 2,
  },
];

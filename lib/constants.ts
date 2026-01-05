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

export const MEETING_DURATION_OPTIONS = [
  {
    value: "5",
    label: "5 Minutes",
  },
  {
    value: "10",
    label: "10 Minutes",
  },
  {
    value: "15",
    label: "15 Minutes",
  },
] as const;

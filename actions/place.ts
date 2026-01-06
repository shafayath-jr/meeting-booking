import { MEETING_PLACES } from "@/lib/constants";

export const getPlaceById = (id: number) => {
  const place = MEETING_PLACES.find((place) => place.id === id);
  return place;
};

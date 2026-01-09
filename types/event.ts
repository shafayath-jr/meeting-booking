export interface Event {
  title: string;
  start_time: string;
  end_time: string;
  date: Date;
  booked_by: string;
  email: string;
  duration: string;
  guests?: string;
  room_id: string;
  building_id: string;
}

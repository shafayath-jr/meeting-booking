export interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  date: Date;
  booked_by: string;
  email: string;
  duration: string;
  guests?: Attendee[];
  room_id: string;
  building_id: string;
  calendar_event_id?: string | null; // Microsoft Teams event ID for sync tracking
}

interface Attendee {
  name: string;
  email: string;
}

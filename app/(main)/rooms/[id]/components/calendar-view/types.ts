import { Meeting } from "@/types/meeting";

export interface CalendarViewState {
  currentMonth: Date;
  selectedDate: Date | null;
  monthMeetings: Meeting[];
  dayMeetings: Meeting[];
  isLoadingMonth: boolean;
  isLoadingDay: boolean;
}

export interface BookingSlot {
  date: Date;
  startTime: string;
}

export interface TimeSlotInfo {
  time: string;
  isAvailable: boolean;
  meeting?: Meeting;
}

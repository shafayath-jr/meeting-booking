import { differenceInMinutes } from "date-fns";

export type DurationOption = "5" | "10" | "15";

export interface MeetingAvailability {
  isOngoingMeeting: boolean;
  availableMinutes: number;
  enabledDurations: DurationOption[];
}

export function calculateAvailableDurations(
  nextMeeting: { start_time: string; end_time: string } | null
): MeetingAvailability {
  const now = new Date();

  if (!nextMeeting) {
    return {
      isOngoingMeeting: false,
      availableMinutes: Infinity,
      enabledDurations: ["5", "10", "15"],
    };
  }

  const nextMeetingStart = new Date(nextMeeting.start_time);
  const nextMeetingEnd = new Date(nextMeeting.end_time);

  // Check if there's an ongoing meeting
  if (now >= nextMeetingStart && now < nextMeetingEnd) {
    return {
      isOngoingMeeting: true,
      availableMinutes: 0,
      enabledDurations: [],
    };
  }

  // Calculate available minutes until next meeting
  const availableMinutes = differenceInMinutes(nextMeetingStart, now);

  // Determine enabled duration options based on available time
  const enabledDurations: DurationOption[] = [];

  if (availableMinutes >= 5) {
    enabledDurations.push("5");
  }
  if (availableMinutes >= 10) {
    enabledDurations.push("10");
  }
  if (availableMinutes >= 15) {
    enabledDurations.push("15");
  }

  return {
    isOngoingMeeting: false,
    availableMinutes,
    enabledDurations,
  };
}

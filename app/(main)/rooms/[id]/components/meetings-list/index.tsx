"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { format, isAfter, isBefore, isSameDay, startOfToday } from "date-fns";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange } from "@/actions/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getCountdown } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import DigitalClockCountdown from "./digital-clock-countdown";
import OngoingMeetingIndicator from "./ongoing-meeting-indicator";

interface MeetingsListProps {
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export default function MeetingsList({ onMeetingClick, className }: MeetingsListProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey } = useMeetingsContext();
  const [allFetchedMeetings, setAllFetchedMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      try {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const { meetings } = await getMeetingsByRoomForDateRange(
          roomId,
          startOfToday().toISOString(),
          futureDate.toISOString()
        );

        const sorted = (meetings || []).sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setAllFetchedMeetings(sorted);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
        setAllFetchedMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [roomId, refreshKey]);

  const ongoingMeeting = useMemo(() => {
    return (
      allFetchedMeetings.find((meeting) => {
        const start = new Date(meeting.start_time);
        const end = new Date(meeting.end_time);
        return isBefore(start, currentTime) && isAfter(end, currentTime);
      }) || null
    );
  }, [allFetchedMeetings, currentTime]);

  const upcomingMeetings = useMemo(() => {
    return allFetchedMeetings.filter((meeting) =>
      isAfter(new Date(meeting.start_time), currentTime)
    );
  }, [allFetchedMeetings, currentTime]);

  const meetingsByDate = useMemo(() => {
    const grouped = new Map<string, Meeting[]>();
    upcomingMeetings.forEach((meeting) => {
      const dateKey = format(new Date(meeting.start_time), "yyyy-MM-dd");
      if (!grouped.has(dateKey)) grouped.set(dateKey, []);
      grouped.get(dateKey)!.push(meeting);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [upcomingMeetings]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="mb-4 text-lg font-semibold">Upcoming Meetings</h2>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
        <p className="text-sm text-muted-foreground">
          {ongoingMeeting ? "1 meeting in progress • " : ""}
          {upcomingMeetings.length} upcoming meeting
          {upcomingMeetings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {ongoingMeeting && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-linear-to-r from-emerald-500/60 to-transparent" />
              <h3 className="px-2 text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                Now
              </h3>
              <div className="h-px flex-1 bg-linear-to-l from-emerald-500/60 to-transparent" />
            </div>
            <OngoingMeetingIndicator
              meeting={ongoingMeeting}
              currentTime={currentTime}
              onMeetingClick={onMeetingClick}
            />
          </div>
        )}

        {upcomingMeetings.length === 0 && !ongoingMeeting ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No upcoming meetings</p>
          </div>
        ) : upcomingMeetings.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            <p className="text-sm">No more meetings scheduled</p>
          </div>
        ) : (
          <div className="space-y-6 pr-2">
            {meetingsByDate.map(([dateKey, dateMeetings]) => {
              const date = new Date(dateKey);
              const isToday = isSameDay(date, new Date());

              return (
                <div key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-px flex-1 bg-linear-to-r from-border/60 to-transparent" />
                    <h3 className="px-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      {isToday ? "Today" : format(date, "EEEE, MMMM d")}
                    </h3>
                    <div className="h-px flex-1 bg-linear-to-l from-border/60 to-transparent" />
                  </div>
                  <div className="space-y-3">
                    {dateMeetings.map((meeting) => {
                      const meetingStart = new Date(meeting.start_time);
                      const countdown = getCountdown(meetingStart, currentTime);
                      const isSoon = countdown ? countdown.totalMinutes < 60 : false;

                      return (
                        <div
                          key={meeting.id}
                          onClick={() => onMeetingClick?.(meeting)}
                          className={cn(
                            "cursor-pointer rounded-xl p-4 transition-all duration-300",
                            "bg-white/50 backdrop-blur-sm dark:bg-white/5",
                            "border border-white/60 dark:border-white/10",
                            "shadow-sm hover:scale-[1.01] hover:shadow-lg",
                            "hover:bg-white/70 dark:hover:bg-white/10",
                            onMeetingClick && "hover:border-primary/40",
                            isSoon &&
                              "border-destructive/40 bg-linear-to-br from-destructive/10 to-destructive/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="mb-1.5 flex items-center gap-2">
                                <h4 className="truncate text-sm font-semibold">
                                  {meeting.title}
                                </h4>
                                {isSoon && (
                                  <Badge
                                    variant="destructive"
                                    className="h-4 animate-pulse px-1.5 py-0 text-[10px]"
                                  >
                                    Soon
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {format(meetingStart, "h:mm a")} -{" "}
                                  {format(new Date(meeting.end_time), "h:mm a")}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground/80">
                                {meeting.booked_by}
                              </p>
                            </div>
                            {countdown && (
                              <DigitalClockCountdown
                                meetingStart={meetingStart}
                                currentTime={currentTime}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

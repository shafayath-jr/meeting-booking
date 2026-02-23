"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInSeconds,
} from "date-fns";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange, getMeetingsByRoom } from "@/actions/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Radio } from "lucide-react";
import { useMeetingsContext } from "@/components/providers/meetings-provider";

interface MeetingsListProps {
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export default function MeetingsList({ onMeetingClick, className }: MeetingsListProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey } = useMeetingsContext();
  // Store all fetched meetings (raw data, not categorized)
  const [allFetchedMeetings, setAllFetchedMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update time every second for real-time status changes
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for smooth countdown and status changes

    return () => clearInterval(interval);
  }, []);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get today's meetings and future meetings
      const today = new Date();
      const { meetings: todayMeetings } = await getMeetingsByRoom(
        roomId,
        today.toISOString()
      );

      // Get meetings for the next 30 days
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const { meetings: futureMeetings } = await getMeetingsByRoomForDateRange(
        roomId,
        today.toISOString(),
        futureDate.toISOString()
      );

      // Combine and deduplicate meetings
      const allMeetings = [...(todayMeetings || []), ...(futureMeetings || [])];
      const uniqueMeetings = Array.from(
        new Map(allMeetings.map((m) => [m.id, m])).values()
      );

      // Sort by start time
      uniqueMeetings.sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      // Store all meetings - categorization happens in useMemo based on currentTime
      setAllFetchedMeetings(uniqueMeetings);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
      setAllFetchedMeetings([]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Fetch meetings on mount and when refreshKey changes (real-time updates)
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings, refreshKey]);

  // Derive ongoing meeting based on current time (recalculated every second)
  const ongoingMeeting = useMemo(() => {
    return (
      allFetchedMeetings.find((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return isBefore(meetingStart, currentTime) && isAfter(meetingEnd, currentTime);
      }) || null
    );
  }, [allFetchedMeetings, currentTime]);

  // Derive upcoming meetings based on current time (recalculated every second)
  const meetings = useMemo(() => {
    return allFetchedMeetings.filter((meeting) => {
      const meetingStart = new Date(meeting.start_time);
      const meetingEnd = new Date(meeting.end_time);
      // Meeting is upcoming if it hasn't started yet
      // Also exclude meetings that have ended
      return isAfter(meetingStart, currentTime) && isAfter(meetingEnd, currentTime);
    });
  }, [allFetchedMeetings, currentTime]);

  // Format countdown time as digital clock (HH:MM:SS or MM:SS)
  const formatDigitalCountdown = useCallback(
    (meetingStart: Date) => {
      const now = currentTime;
      const diffSeconds = differenceInSeconds(meetingStart, now);
      const diffMinutes = differenceInMinutes(meetingStart, now);
      const diffHours = differenceInHours(meetingStart, now);
      const diffDays = differenceInDays(meetingStart, now);

      if (diffSeconds < 0) return null; // Meeting has started

      // Format as digital clock
      if (diffDays > 0) {
        const hours = diffHours % 24;
        const mins = diffMinutes % 60;
        const secs = diffSeconds % 60;
        return {
          days: diffDays,
          hours: String(hours).padStart(2, "0"),
          minutes: String(mins).padStart(2, "0"),
          seconds: String(secs).padStart(2, "0"),
          totalMinutes: diffMinutes,
          totalSeconds: diffSeconds,
        };
      }

      if (diffHours > 0) {
        const mins = diffMinutes % 60;
        const secs = diffSeconds % 60;
        return {
          hours: String(diffHours).padStart(2, "0"),
          minutes: String(mins).padStart(2, "0"),
          seconds: String(secs).padStart(2, "0"),
          totalMinutes: diffMinutes,
          totalSeconds: diffSeconds,
        };
      }

      // Less than 1 hour - show MM:SS
      const mins = Math.floor(diffSeconds / 60);
      const secs = diffSeconds % 60;
      return {
        minutes: String(mins).padStart(2, "0"),
        seconds: String(secs).padStart(2, "0"),
        totalMinutes: diffMinutes,
        totalSeconds: diffSeconds,
      };
    },
    [currentTime]
  );

  // Digital Clock Countdown Component
  const DigitalClockCountdown = ({ meetingStart }: { meetingStart: Date }) => {
    const countdown = formatDigitalCountdown(meetingStart);
    if (!countdown) return null;

    const isSoon = countdown.totalMinutes < 60;
    const hasDays = "days" in countdown;
    const hasHours = "hours" in countdown;

    return (
      <div
        className={cn(
          "min-w-[100px] shrink-0 rounded-lg px-3 py-2 transition-all",
          isSoon
            ? "bg-destructive/10 dark:bg-destructive/20"
            : "bg-primary/10 dark:bg-primary/20"
        )}
      >
        <div className="text-center">
          <div className="mb-0.5 text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
            {isSoon ? "Starting in" : "Starts in"}
          </div>
          <div
            className={cn(
              "font-mono text-base leading-none font-bold",
              isSoon ? "text-destructive" : "text-primary"
            )}
          >
            {hasDays ? (
              <div className="space-y-0.5">
                <div>{countdown.days}d</div>
                <div className="text-xs">
                  {countdown.hours}:{countdown.minutes}:{countdown.seconds}
                </div>
              </div>
            ) : hasHours ? (
              <div>
                {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </div>
            ) : (
              <div>
                {countdown.minutes}:{countdown.seconds}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Format remaining time for ongoing meeting
  const formatRemainingTime = useCallback(
    (meetingEnd: Date) => {
      const now = currentTime;
      const diffSeconds = differenceInSeconds(meetingEnd, now);

      if (diffSeconds <= 0) return null;

      const hours = Math.floor(diffSeconds / 3600);
      const mins = Math.floor((diffSeconds % 3600) / 60);
      const secs = diffSeconds % 60;

      return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(mins).padStart(2, "0"),
        seconds: String(secs).padStart(2, "0"),
        totalSeconds: diffSeconds,
      };
    },
    [currentTime]
  );

  // Calculate progress percentage for ongoing meeting
  const calculateProgress = useCallback(
    (meeting: Meeting) => {
      const start = new Date(meeting.start_time).getTime();
      const end = new Date(meeting.end_time).getTime();
      const now = currentTime.getTime();

      const total = end - start;
      const elapsed = now - start;

      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    },
    [currentTime]
  );

  // Ongoing Meeting Indicator Component
  const OngoingMeetingIndicator = ({ meeting }: { meeting: Meeting }) => {
    const remaining = formatRemainingTime(new Date(meeting.end_time));
    const progress = calculateProgress(meeting);
    const isEndingSoon = remaining && remaining.totalSeconds < 300; // Less than 5 minutes

    if (!remaining) return null;

    return (
      <div
        onClick={() => onMeetingClick?.(meeting)}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300",
          "bg-linear-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/20",
          "dark:from-emerald-500/30 dark:via-emerald-500/15 dark:to-teal-500/30",
          "border-2 border-emerald-500/50 dark:border-emerald-400/50",
          "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/10",
          "hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/30",
          isEndingSoon &&
            "border-amber-500/60 from-amber-500/20 via-amber-500/10 to-orange-500/20 shadow-amber-500/20 dark:from-amber-500/30 dark:via-amber-500/15 dark:to-orange-500/30"
        )}
      >
        {/* Animated background pulse */}
        <div className="animate-pulse-slow absolute inset-0 opacity-30">
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-r",
              isEndingSoon
                ? "from-amber-400/40 via-transparent to-amber-400/40"
                : "from-emerald-400/40 via-transparent to-emerald-400/40"
            )}
          />
        </div>

        {/* Progress bar background */}
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              isEndingSoon
                ? "bg-linear-to-r from-amber-500 to-orange-500"
                : "bg-linear-to-r from-emerald-500 to-teal-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative p-4">
          <div className="flex items-start gap-4">
            {/* Live indicator */}
            <div className="mt-1 shrink-0">
              <div className="relative">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    isEndingSoon ? "bg-amber-500" : "bg-emerald-500"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 animate-ping rounded-full",
                      isEndingSoon ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Meeting info */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                    isEndingSoon
                      ? "border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300"
                      : "border border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  <Radio className="mr-1 h-2.5 w-2.5 animate-pulse" />
                  LIVE
                </Badge>
                {isEndingSoon && (
                  <Badge
                    variant="outline"
                    className="h-4 animate-pulse border-amber-500/50 px-1.5 py-0 text-[10px] text-amber-600 dark:text-amber-400"
                  >
                    Ending soon
                  </Badge>
                )}
              </div>
              <h4 className="mb-1 truncate text-base font-bold">{meeting.title}</h4>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {format(new Date(meeting.start_time), "h:mm a")} -{" "}
                  {format(new Date(meeting.end_time), "h:mm a")}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground/80">
                {meeting.booked_by}
              </p>
            </div>

            {/* Remaining time countdown */}
            <div
              className={cn(
                "min-w-[120px] shrink-0 rounded-lg px-4 py-3",
                "bg-white/60 backdrop-blur-sm dark:bg-black/30",
                "border",
                isEndingSoon ? "border-amber-500/40" : "border-emerald-500/40"
              )}
            >
              <div className="text-center">
                <div
                  className={cn(
                    "mb-1 text-[9px] font-semibold tracking-wider uppercase",
                    isEndingSoon
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  Remaining
                </div>
                <div
                  className={cn(
                    "font-mono text-xl leading-none font-bold tabular-nums",
                    isEndingSoon
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {parseInt(remaining.hours) > 0 ? (
                    <span>
                      {remaining.hours}:{remaining.minutes}:{remaining.seconds}
                    </span>
                  ) : (
                    <span>
                      {remaining.minutes}:{remaining.seconds}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Group meetings by date
  const meetingsByDate = useMemo(() => {
    const grouped = new Map<string, Meeting[]>();

    meetings.forEach((meeting) => {
      const dateKey = format(new Date(meeting.start_time), "yyyy-MM-dd");
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(meeting);
    });

    // Sort dates
    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [meetings]);

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
          {meetings.length} upcoming meeting{meetings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {/* Ongoing Meeting Section */}
        {ongoingMeeting && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-linear-to-r from-emerald-500/60 to-transparent" />
              <h3 className="px-2 text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                Now
              </h3>
              <div className="h-px flex-1 bg-linear-to-l from-emerald-500/60 to-transparent" />
            </div>
            <OngoingMeetingIndicator meeting={ongoingMeeting} />
          </div>
        )}

        {meetings.length === 0 && !ongoingMeeting ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No upcoming meetings</p>
          </div>
        ) : meetings.length === 0 ? (
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
                      const countdown = formatDigitalCountdown(meetingStart);
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
                              <DigitalClockCountdown meetingStart={meetingStart} />
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

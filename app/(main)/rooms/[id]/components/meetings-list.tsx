"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, isAfter, startOfToday, isSameDay, differenceInMinutes, differenceInHours, differenceInDays, differenceInSeconds } from "date-fns";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange, getMeetingsByRoom } from "@/actions/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface MeetingsListProps {
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export default function MeetingsList({
  onMeetingClick,
  className,
}: MeetingsListProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Combine and filter to show only upcoming meetings
      const allMeetings = [...(todayMeetings || []), ...(futureMeetings || [])];
      const uniqueMeetings = Array.from(
        new Map(allMeetings.map((m) => [m.id, m])).values()
      );
      
      // Filter to show only upcoming meetings (not started yet)
      const now = new Date();
      const upcomingMeetings = uniqueMeetings.filter((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        return isAfter(meetingStart, now);
      });

      // Sort by start time
      upcomingMeetings.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      setMeetings(upcomingMeetings);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Update countdown every second for smooth updates
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for smooth countdown

    return () => clearInterval(interval);
  }, []);

  // Format countdown time as digital clock (HH:MM:SS or MM:SS)
  const formatDigitalCountdown = useCallback((meetingStart: Date) => {
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
        hours: String(hours).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
        totalMinutes: diffMinutes,
        totalSeconds: diffSeconds
      };
    }

    if (diffHours > 0) {
      const mins = diffMinutes % 60;
      const secs = diffSeconds % 60;
      return {
        hours: String(diffHours).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
        totalMinutes: diffMinutes,
        totalSeconds: diffSeconds
      };
    }

    // Less than 1 hour - show MM:SS
    const mins = Math.floor(diffSeconds / 60);
    const secs = diffSeconds % 60;
    return {
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
      totalMinutes: diffMinutes,
      totalSeconds: diffSeconds
    };
  }, [currentTime]);

  // Digital Clock Countdown Component
  const DigitalClockCountdown = ({ meetingStart }: { meetingStart: Date }) => {
    const countdown = formatDigitalCountdown(meetingStart);
    if (!countdown) return null;

    const isSoon = countdown.totalMinutes < 60;
    const hasDays = 'days' in countdown;
    const hasHours = 'hours' in countdown;

    return (
      <div className={cn(
        "flex-shrink-0 bg-background border rounded-lg p-3 min-w-[140px]",
        isSoon && "border-destructive/50 bg-destructive/5"
      )}>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">
            {isSoon ? "Starting in" : "Time until"}
          </div>
          <div className={cn(
            "font-mono font-bold text-lg leading-none",
            isSoon ? "text-destructive" : "text-primary"
          )}>
            {hasDays ? (
              <div className="space-y-1">
                <div>{countdown.days}d</div>
                <div className="text-sm">
                  {countdown.hours}:{countdown.minutes}:{countdown.seconds}
                </div>
              </div>
            ) : hasHours ? (
              <div>{countdown.hours}:{countdown.minutes}:{countdown.seconds}</div>
            ) : (
              <div>{countdown.minutes}:{countdown.seconds}</div>
            )}
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
    return Array.from(grouped.entries()).sort((a, b) => 
      a[0].localeCompare(b[0])
    );
  }, [meetings]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="font-semibold text-lg mb-4">Upcoming Meetings</h2>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-shrink-0 mb-4">
        <h2 className="font-semibold text-lg">Upcoming Meetings</h2>
        <p className="text-sm text-muted-foreground">
          {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {meetings.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No upcoming meetings</p>
          </div>
        ) : (
          <div className="space-y-6 pr-2">
            {meetingsByDate.map(([dateKey, dateMeetings]) => {
              const date = new Date(dateKey);
              const isToday = isSameDay(date, new Date());
              
              return (
                <div key={dateKey} className="space-y-2">
                  <div className="sticky top-0 bg-card py-2 border-b">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {isToday ? "Today" : format(date, "EEEE, MMMM d")}
                    </h3>
                  </div>
                  <div className="space-y-3 pl-2">
                    {dateMeetings.map((meeting) => {
                      const meetingStart = new Date(meeting.start_time);
                      const countdown = formatDigitalCountdown(meetingStart);
                      const isSoon = countdown ? countdown.totalMinutes < 60 : false;
                      
                      return (
                        <Card
                          key={meeting.id}
                          onClick={() => onMeetingClick?.(meeting)}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            onMeetingClick && "hover:ring-2 hover:ring-primary",
                            isSoon && "border-destructive/50"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-base truncate">
                                    {meeting.title}
                                  </h4>
                                  {isSoon && (
                                    <Badge variant="destructive" className="text-xs">
                                      Soon
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>
                                    {format(meetingStart, "hh:mm a")} -{" "}
                                    {format(new Date(meeting.end_time), "hh:mm a")}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {meeting.booked_by}
                                </p>
                              </div>
                              {countdown && (
                                <DigitalClockCountdown meetingStart={meetingStart} />
                              )}
                            </div>
                          </CardContent>
                        </Card>
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

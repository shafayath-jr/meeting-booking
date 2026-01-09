"use client";

import { deleteMeeting } from "@/actions/meeting";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Meeting } from "@/types/meeting";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  meeting: Meeting;
};

export default function MeetingCard({ meeting }: Props) {
  const handleDelete = async (meetingId: string) => {
    const res = await deleteMeeting(meetingId);

    if (!res.error) {
      toast.success("Meeting deleted");
    } else {
      console.error(res.error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booked by {meeting.booked_by}</CardTitle>
      </CardHeader>

      <CardContent>
        <p>Start time: {format(new Date(meeting.start_time), "hh:mm a")}</p>
        <p>End time: {format(new Date(meeting.end_time), "hh:mm a")}</p>
      </CardContent>

      <CardFooter>
        <Button
          variant="destructive"
          size="icon-sm"
          className="cursor-pointer"
          onClick={() => handleDelete(meeting.id)}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}

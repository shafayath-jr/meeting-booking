"use client";

import { format } from "date-fns";
import Modal from "@/components/modal";
import { Meeting } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMeeting } from "@/actions/meeting";
import { toast } from "sonner";
import { useMeetingsContext } from "@/components/providers/meetings-provider";

interface MeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onDelete?: () => void;
}

export default function MeetingDetailsModal({
  isOpen,
  onClose,
  meeting,
  onDelete,
}: MeetingDetailsModalProps) {
  const { triggerRefresh } = useMeetingsContext();

  if (!meeting) return null;

  const handleDelete = async () => {
    const res = await deleteMeeting(meeting.id);

    if (!res.error) {
      toast.success("Meeting deleted");
      triggerRefresh(); // Trigger real-time refresh across all components
      onDelete?.();
      onClose();
    } else {
      console.error(res.error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Modal
      title="Meeting Details"
      description="View meeting information"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md"
    >
      <div className="space-y-4 py-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">{meeting.title}</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">
              {format(new Date(meeting.start_time), "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Time:</span>
            <span className="font-medium">
              {format(new Date(meeting.start_time), "hh:mm a")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">End Time:</span>
            <span className="font-medium">
              {format(new Date(meeting.end_time), "hh:mm a")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{meeting.duration}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Booked By:</span>
            <span className="font-medium">{meeting.booked_by}</span>
          </div>

          {meeting.email && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{meeting.email}</span>
            </div>
          )}

          {meeting.guests && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Guests:</span>
              <span className="font-medium">{meeting.guests}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <Button variant="destructive" onClick={handleDelete} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Meeting
          </Button>
        </div>
      </div>
    </Modal>
  );
}

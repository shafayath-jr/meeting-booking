import Modal from "@/components/modal";
import BookMeetingForm from "./book-meeting-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  prefillDate?: Date;
  prefillStartTime?: string;
};

export default function BookMeetingModal({
  isOpen,
  onClose,
  prefillDate,
  prefillStartTime,
}: Props) {
  return (
    <Modal
      title="Book a Meeting"
      description="Schedule a meeting room booking with custom date and time"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl!"
    >
      <BookMeetingForm
        onClose={onClose}
        prefillDate={prefillDate}
        prefillStartTime={prefillStartTime}
      />
    </Modal>
  );
}

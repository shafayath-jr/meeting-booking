import Modal from "@/components/modal";
import QuickMeetingForm from "./quick-meeting-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function QuickMeetingModal({ isOpen, onClose }: Props) {
  return (
    <Modal
      title="Quick Meeting"
      description="Choose the duration to initiate an immediate booking"
      isOpen={isOpen}
      onClose={onClose}
    >
      <QuickMeetingForm />
    </Modal>
  );
}

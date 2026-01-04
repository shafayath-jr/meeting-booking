import Modal from "@/components/modal";

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
      Quick Meeting Modal
    </Modal>
  );
}

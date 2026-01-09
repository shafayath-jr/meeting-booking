import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
};

export default function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  className,
}: Props) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={cn(className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

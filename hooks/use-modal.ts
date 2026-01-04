import { useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function handleOpen() {
    setIsOpen(true);
  }
  function handleClose() {
    setIsOpen(false);
  }

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
}

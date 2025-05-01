import { useState } from "react";

export function useDetailDialog<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return {
    isOpen,
    selectedItem,
    openDialog: (item: T) => {
      setSelectedItem(item);
      setIsOpen(true);
    },
    closeDialog: () => {
      setIsOpen(false);
      setSelectedItem(null);
    },
    dialogProps: {
      open: isOpen,
      onOpenChange: setIsOpen,
      item: selectedItem,
    },
  };
}

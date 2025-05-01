"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DetailField<T> {
  label: string;
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, data: T) => React.ReactNode;
  className?: string;
}

interface ItemDetailDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: T | null;
  fields: DetailField<T>[];
  title?: string;
}

export function ItemDetailDialog<T>({
  open,
  onOpenChange,
  item,
  fields,
  title = "Chi tiết",
}: ItemDetailDialogProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-4">
          <div className="grid grid-cols-2 gap-4 py-2">
            {item &&
              fields.map((field) => {
                const value = getNestedValue(item, field.key);
                return (
                  <div
                    key={field.key}
                    className={`space-y-1 ${field.className || ""}`}
                  >
                    <div className="text-sm font-medium text-gray-500">
                      {field.label}
                    </div>
                    <div className="text-sm text-gray-900">
                      {field.render
                        ? field.render(value, item)
                        : (value ?? "N/A")}
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

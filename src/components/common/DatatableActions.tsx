import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type TableAction<TData> = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (data: TData) => void;
  className?: string;
  iconClassName?: string;
};

interface DataTableActionsProps<TData> {
  row: Row<TData>;
  actions: TableAction<TData>[];
}

export function DataTableActions<TData>({
  row,
  actions,
}: DataTableActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => action.onClick(row.original)}
            className={cn("cursor-pointer", action.className)}
          >
            <action.icon className={cn("mr-2 size-4", action.iconClassName)} />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "cmdk";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
  label: string;
  value: string | number;
};

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: "sm" | "default";
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  noResultsText = "Không tìm thấy kết quả",
  className,
  disabled = false,
  clearable = false,
  size = "default",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerSearchTerm) ||
        option.value.toString().toLowerCase().includes(lowerSearchTerm),
    );
  }, [options, searchTerm]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const numericValue = Number(currentValue);
      const optionValue = options.find(
        (option) =>
          option.value === currentValue ||
          (Number.isInteger(numericValue) && option.value === numericValue),
      )?.value;

      if (value === optionValue) {
        // Clear selection if already selected and clearable is true
        if (clearable) {
          onValueChange("");
        }
      } else {
        onValueChange(optionValue ?? currentValue);
      }
      setOpen(false);
      setSearchTerm("");
    },
    [options, value, onValueChange, clearable],
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange("");
    },
    [onValueChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-size={size}
          disabled={disabled}
          className={cn(
            "relative flex w-full justify-between truncate border-slate-200 bg-white font-normal transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800/70",
            size === "sm" ? "h-8 text-xs" : "h-9 text-sm",
            open &&
              "border-slate-300 ring-2 ring-slate-200 dark:border-slate-600 dark:ring-slate-700",
            !value && "text-slate-500 dark:text-slate-400",
            className,
          )}
        >
          {selectedOption ? (
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {selectedOption.label}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <div className="flex items-center gap-1">
            {clearable && value && (
              <X
                className="ml-1 size-4 shrink-0 text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                onClick={handleClear}
                aria-label="Clear selection"
              />
            )}
            <ChevronsUpDown
              className={cn(
                "ml-1 size-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500",
                open && "rotate-180 transform",
              )}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="animate-in zoom-in-95 w-[var(--radix-popover-trigger-width)] overflow-hidden border-slate-200 p-0 shadow-lg duration-100">
        <Command className="w-full">
          <div className="flex items-center border-b bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
            <Search className="mr-2 size-4 shrink-0 text-slate-500 dark:text-slate-400" />
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="h-9 w-full border-0 bg-transparent text-base placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-500"
            />
            {searchTerm && (
              <X
                className="ml-2 size-4 shrink-0 cursor-pointer text-slate-400 transition-colors duration-150 hover:text-slate-700 dark:hover:text-slate-200"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              />
            )}
          </div>
          <CommandEmpty className="py-6 text-center text-sm text-slate-500 italic dark:text-slate-400">
            {noResultsText}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto px-1 py-1">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label.toLowerCase()}
                onSelect={() => handleSelect(option.value.toString())}
                className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 aria-selected:bg-slate-100 aria-selected:font-medium dark:text-slate-200 dark:hover:bg-slate-800 dark:aria-selected:bg-slate-800"
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="ml-2 size-4 text-emerald-500 dark:text-emerald-400" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

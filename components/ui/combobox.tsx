"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxOption {
  value: string | number;
  label: string;
}

type Props = {
  options: readonly ComboboxOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  onBlur?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
};

export function Combobox({
  options,
  value,
  onValueChange,
  onBlur,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  buttonClassName,
  popoverClassName,
  disabled = false,
  id,
  "aria-invalid": ariaInvalid,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | number>("");

  const currentValue = value !== undefined ? value : internalValue;

  const handleSelect = (selectedValue: string | number) => {
    const newValue = selectedValue === currentValue ? "" : selectedValue;

    if (value === undefined) {
      setInternalValue(newValue);
    }

    onValueChange?.(newValue);
    setOpen(false);
  };

  const selectedOption = options.find(
    (option) => String(option.value) === String(currentValue)
  );

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onBlur?.();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !currentValue && "text-muted-foreground",
            buttonClassName
          )}
        >
          <span className="truncate text-[#315A83]">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={String(option.value)}
                  keywords={[option.label]}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      String(currentValue) === String(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const EMPTY_ARRAY: string[] = [];

export function ComboBox({
  options,
  selected = EMPTY_ARRAY,
  onChange,
  placeholder = "Search...",
  className,
}: ComboBoxProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const filteredOptions = React.useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(term) && !selectedSet.has(opt.value)
    );
  }, [options, searchTerm, selectedSet]);

  const selectedOptions = React.useMemo(
    () => options.filter((opt) => selectedSet.has(opt.value)),
    [options, selectedSet]
  );

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(value: string) {
    onChange([...selected, value]);
    setSearchTerm("");
  }

  function handleRemove(value: string) {
    onChange(selected.filter((v) => v !== value));
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {selectedOptions.length > 0 ? (
        <div className="mb-1 flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-xs text-accent-foreground"
            >
              {opt.label}
              <button
                type="button"
                onClick={() => handleRemove(opt.value)}
                className="ml-0.5 rounded-sm hover:bg-foreground/10"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
      />
      {isOpen && filteredOptions.length > 0 ? (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {filteredOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className="flex w-full cursor-default items-center px-2.5 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

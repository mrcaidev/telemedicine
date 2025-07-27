"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      {value && (
        <X
          className={clsx(
            "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer",
            { "opacity-100": isFocused || value, "opacity-50": !isFocused }
          )}
          onClick={() => onChange("")}
        />
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="pl-10 pr-8 h-10"
      />
    </div>
  );
}

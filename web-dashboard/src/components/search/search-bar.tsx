"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBar {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBar) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by patient name"
        className="pl-10 h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function ClickableDateRangeFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (date: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left w-full md:w-[160px] h-10 text-sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "yyyy-MM-dd") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => date && onChange(date.toISOString())}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

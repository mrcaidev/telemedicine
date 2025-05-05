"use client";

import { Input } from "@/components/ui/input";

interface AppointmentDateFilterProps {
  startDate: string;
  endDate: string;
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
}

export default function AppointmentDateFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: AppointmentDateFilterProps) {
  return (
    <div className="flex gap-4 w-full md:w-auto">
      <Input
        type="date"
        className="h-10"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
      />
      <Input
        type="date"
        className="h-10"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
      />
    </div>
  );
}
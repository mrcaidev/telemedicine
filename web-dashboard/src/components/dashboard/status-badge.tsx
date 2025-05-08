"use client";

import { RawAppointment } from "@/types/appointment";
import {
  CalendarClock,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface StatusBadgeProps {
  appt: RawAppointment;
}

export function StatusBadge({ appt }: StatusBadgeProps) {
  const now = new Date();
  const start = new Date(appt.startAt);
  const end = new Date(appt.endAt);

  let icon = Clock;
  let label = "Not Started";
  let bg = "bg-gray-100";
  let text = "text-gray-800";

  if (appt.status === "to_be_rescheduled") {
    icon = CalendarClock;
    label = "Rescheduling";
    bg = "bg-yellow-100";
    text = "text-yellow-800";
  } else if (appt.status === "cancelled") {
    icon = XCircle;
    label = "Cancelled";
    bg = "bg-red-100";
    text = "text-red-800";
  } else if (now >= start && now < end) {
    icon = CalendarClock;
    label = "In Progress";
    bg = "bg-blue-100";
    text = "text-blue-800";
  } else if (now >= end) {
    icon = CheckCircle;
    label = "Finished";
    bg = "bg-green-100";
    text = "text-green-800";
  }

  const Icon = icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
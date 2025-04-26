"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RawAppointment } from "@/types/appointment";
import { cn } from "@/lib/utils";

interface Props {
  appointments: RawAppointment[];
}

const statusMap: Record<string, string> = {
  normal: "✅ In Progress",
  to_be_rescheduled: "📅 Rescheduling",
  cancelled: "❌ Cancelled",
};

function resolveStatusLabel(appt: RawAppointment): string {
  const now = new Date();
  const start = new Date(appt.startAt);
  const end = new Date(appt.endAt);

  if (appt.status !== "normal") {
    return (
      {
        to_be_rescheduled: "📅 Rescheduling",
        cancelled: "❌ Cancelled",
      }[appt.status] || appt.status
    );
  }

  if (now < start) return "⏳ Not Started";
  if (now >= start && now < end) return "🩺 In Progress";
  return "✅ Finished";
}

export default function TodayAppointmentsCard({ appointments }: Props) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push("/dashboard/doctor/appointments")}
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-lg",
        "border border-gray-200"
      )}
    >
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">📅 Today Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No Appointments Today</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {appointments.slice(0, 5).map((appt) => {
              const timeStr = new Date(appt.startAt).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              );
              return (
                <li key={appt.id} className="flex justify-between">
                  <span>
                    {appt.patient.nickname}({appt.patient.gender})
                  </span>
                  <span>
                    {timeStr}·{resolveStatusLabel(appt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

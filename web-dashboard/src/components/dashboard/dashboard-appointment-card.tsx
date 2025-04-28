"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { RawAppointment } from "@/types/appointment";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  title: string;
  appointments: RawAppointment[];
  limit?: number; // 默认 5
  timeFormat?: "time" | "datetime"; // 控制时间展示格式
  href?: string; // 点击跳转地址
}

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

export default function DashboardAppointmentCard({
  title,
  appointments,
  limit = 5,
  timeFormat = "datetime",
  href = "/dashboard/doctor/appointments",
}: Props) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(href)}
      className={cn(
        "h-64 overflow-y-auto cursor-pointer transition-shadow hover:shadow-md",
        "border border-gray-200"
      )}
    >
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">
            {title.toLowerCase().includes("today")
              ? "No appointments today"
              : "No appointments found"}
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {appointments.slice(0, limit).map((appt) => {
              const timeStr =
                timeFormat === "time"
                  ? new Date(appt.startAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : new Date(appt.startAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

              return (
                <li key={appt.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={appt.patient.avatarUrl || "/default-avatar.png"}
                      alt={appt.patient.nickname}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span className="font-medium">{appt.patient.nickname}</span>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>{timeStr}</p>
                    <p>{resolveStatusLabel(appt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

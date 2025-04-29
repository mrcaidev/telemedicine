"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RawAppointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

const format = (d: string) =>
  new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<RawAppointment>();

  useEffect(() => {
    fetch(`/api/doctor/appointments/${id}`)
      .then((res) => res.json())
      .then((data) => setAppointment(data.data.data));
  }, [id]);

  if (!appointment)
    return <p className="text-center p-6 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Title + Status */}
      <div className="mb-2">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">📄 Appointment Detail</h1>
        <div className="text-sm font-medium text-blue-600 mt-1">
          {resolveStatusLabel(appointment)}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Created at: {format(appointment.createdAt)}
      </div>

      {/* Info Section: Patient + Time (紧凑展示) */}
      <Card className="p-6 max-w-2xl mx-auto space-y-2">
        <CardContent className="fp-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Patient Info */}
          <div
            onClick={() =>
              router.push(
                `/dashboard/doctor/patients/${appointment.patient.id}`
              )
            }
            className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          >
            <img
              src={appointment.patient.avatarUrl || "/p.png"}
              alt={appointment.patient.nickname || "Anonymous"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium">{appointment.patient.nickname || "Anonymous"}</p>
            </div>
          </div>

          {/* Time Info */}
          <div className="text-xs text-gray-700 text-right space-y-0.5 min-w-[150px]">
            <p>
              <span className="text-gray-500">From:</span>{" "}
              <span className="text-blue-600">
                {format(appointment.startAt)}
              </span>
            </p>
            <p>
              <span className="text-gray-500">To:</span>{" "}
              <span className="text-blue-600">{format(appointment.endAt)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section - 主视觉区域 */}
      <Card className="bg-white border rounded-lg shadow-sm min-h-[280px]">
        <CardContent className="space-y-4 p-6 h-full">
          <h2 className="text-2xl font-semibold">📋 Notes</h2>
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {appointment.remark || "No notes available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

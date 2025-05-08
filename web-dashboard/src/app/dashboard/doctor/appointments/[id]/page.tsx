"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RawAppointment } from "@/types/appointment";
import { FileText, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ArrowLeft } from "lucide-react";

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
    <div className="w-full px-8 py-6 space-y-6 ">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Title + Status */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl flex items-center gap-2 font-bold">
          <FileText className="w-6 h-6 text-gray-700" /> Appointment Detail
        </h1>
        <StatusBadge appt={appointment} />
      </div>

      {/* Created At */}
      <div className="text-sm text-gray-500">
        Created at: {format(appointment.createdAt)}
      </div>

      {/* Info Card */}
      <Card className="w-full bg-muted border rounded-xl bg-white shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Patient Info */}
          <div
            onClick={() =>
              router.push(
                `/dashboard/doctor/patients/${appointment.patient.id}`
              )
            }
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 flex-1 min-w-[200px]"
          >
            <img
              src={appointment.patient.avatarUrl || "/p.png"}
              alt={appointment.patient.nickname || "Anonymous"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium">
                {appointment.patient.nickname || "Anonymous"}
              </p>
            </div>
          </div>

          {/* Time Info */}
          <div className="text-xs text-gray-700 text-right space-y-0.5 flex-1 min-w-[200px]">
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

      {/* Notes Section */}
      <Card className="w-full bg-muted border rounded-xl bg-white shadow-sm min-h-[280px]">
        <CardContent className="space-y-4 p-6 h-full">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-gray-700" /> Notes
          </h2>
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {appointment.remark || "No notes available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

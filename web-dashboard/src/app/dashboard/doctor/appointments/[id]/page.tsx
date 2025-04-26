"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RawAppointment } from "@/types/appointment";

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
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<RawAppointment>();

  useEffect(() => {
    fetch(`/api/doctor/appointments/${id}`)
      .then((res) => res.json())
      .then((data) => setAppointment(data.data.data));
  }, [id]);

  console.log("Fetched appointment detail:", appointment);

  if (!appointment) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📄 Appointment Detail</h1>
      <div className="text-sm text-gray-500">
        Created at: {format(appointment.createdAt)}
      </div>

      {/* 🧍 Patient Info */}
      <Card>
        <CardContent className="space-y-1 p-4">
          <h2 className="font-semibold text-lg mb-2">🧍 Patient Information</h2>
          <p>
            <strong>Name:</strong> {appointment.patient.nickname}
          </p>
          <p>
            <strong>Gender:</strong> {appointment.patient.gender}
          </p>
          {appointment.patient.email && (
            <p>
              <strong>Email:</strong> {appointment.patient.email}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 🩺 Doctor Info */}
      <Card>
        <CardContent className="space-y-1 p-4">
          <h2 className="font-semibold text-lg mb-2">🩺 Doctor Information</h2>
          <p>
            <strong>Name:</strong> {appointment.doctor.firstName}{" "}
            {appointment.doctor.lastName}
          </p>
          <p>
            <strong>Specialties:</strong>{" "}
            {appointment.doctor.specialties?.join(", ") ?? "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {appointment.doctor.description}
          </p>
        </CardContent>
      </Card>

      {/* 🕒 Time Info */}
      <Card>
        <CardContent className="space-y-1 p-4">
          <h2 className="font-semibold text-lg mb-2">🕒 Appointment Time</h2>
          <p>
            <strong>From:</strong> {format(appointment.startAt)}
          </p>
          <p>
            <strong>To:</strong> {format(appointment.endAt)}
          </p>
        </CardContent>
      </Card>

      {/* 📝 Status & Remark */}
      <Card>
        <CardContent className="space-y-1 p-4">
          <h2 className="font-semibold text-lg mb-2">📋 Status & Notes</h2>
          <p>
            <strong>Status:</strong> {resolveStatusLabel(appointment)}
          </p>
          <p>
            <strong>Remark:</strong> {appointment.remark}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useAppointments } from "@/components/appointments/useAppointments";
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

export default function DoctorAppointmentsPage() {
  const { appointments, loading, nextCursor, fetchMore } = useAppointments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 My appointments</h1>

      {appointments.map((appt) => {
        const timeStr = new Date(appt.startAt).toLocaleTimeString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Link
            key={appt.id}
            href={`/dashboard/doctor/appointments/${appt.id}`}
          >
            <div className="border p-4 mb-3 rounded shadow-sm hover:bg-gray-50 transition cursor-pointer">
              <p className="font-medium">
                👤 {appt.patient.nickname} ({appt.patient.gender})
              </p>
              <p>🕒 {timeStr}</p>
              <p>📄 Remark: {appt.remark}</p>
              <p>🧾 Status:{resolveStatusLabel(appt)}</p>
            </div>
          </Link>
        );
      })}

      {loading && <p>Loading...</p>}

      {nextCursor && !loading && (
        <button onClick={fetchMore} className="mt-4 text-blue-600 underline">
          Load more appointments
        </button>
      )}
    </div>
  );
}

"use client";

import { useAppointments } from "@/components/appointments/useAppointments";

export default function DoctorAppointmentsPage() {
  const { appointments, loading, nextCursor, fetchMore } = useAppointments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 My appointments</h1>

      {appointments.map((appt) => (
        <div key={appt.id} className="border p-4 mb-3 rounded shadow-sm">
          <p className="font-medium">
            👤 Patient: {appt.patient.nickname || appt.patient.email}
          </p>
          <p>
            🕒 Time:{" "}
            {new Date(appt.startTime).toLocaleTimeString(undefined,{
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>📄 Remark: {appt.remark}</p>
          <p>🧾 Status: {appt.status}</p>
        </div>
      ))}

      {loading && <p>Loading...</p>}

      {nextCursor && !loading && (
        <button onClick={fetchMore} className="mt-4 text-blue-600 underline">
          Load more appointments
        </button>
      )}
    </div>
  );
}

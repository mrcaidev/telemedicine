"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Stethoscope,
  Venus,
  Mars,
  HelpCircle,
  StickyNote,
  CalendarClock,
} from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/types/doctor";
import { RawAppointment } from "@/types/appointment";
import { toast } from "sonner";
import { RescheduleDialog } from "@/components/dialog/appointment-schedule-dialog";

const weekdayMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<RawAppointment[]>([]);

  function GenderIcon({ gender }: { gender: string }) {
    if (gender === "female") return <Venus className="w-4 h-4 text-pink-500" />;
    if (gender === "male") return <Mars className="w-4 h-4 text-blue-500" />;
    return <HelpCircle className="w-4 h-4 text-gray-500" />;
  }

  useEffect(() => {
    fetch(`/api/clinic/doctor/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
      });
  }, [id]);

  useEffect(() => {
    fetch(`/api/clinic/doctor/${id}/appointment`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Appointments data:", data);
        const appointments = data.data.appointments.filter(
          (appt: RawAppointment) => appt.status === "to_be_rescheduled"
        );
        setAppointments(appointments);
      });
  }, [id]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<RawAppointment | null>(null);

  const handleOpen = (appt: RawAppointment) => {
    setSelectedAppt(appt);
    setDialogOpen(true);
  };

  const handleApprove = async (availabilityId: string) => {
    if (!selectedAppt || !doctor) return;

    try {
      const res = await fetch(
        `/api/clinic/appointment?appointmentId=${selectedAppt.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            availabilityId,
            doctorId: doctor.id,
          }),
        }
      );

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to approve appointment");
      }

      toast.success("Appointment rescheduled successfully!");
      router.refresh();

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.id !== selectedAppt.id)
      );

      setDialogOpen(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
      toast.error("Failed to reschedule appointment");
    }
  };

  if (!doctor)
    return (
      <p className="text-center p-6 text-gray-500">Loading doctor info...</p>
    );

  const grouped = doctor.availableTimes?.reduce<
    Record<number, { startTime: string; endTime: string }[]>
  >((acc, cur) => {
    if (!acc[cur.weekday]) acc[cur.weekday] = [];
    acc[cur.weekday].push({ startTime: cur.startTime, endTime: cur.endTime });
    return acc;
  }, {});

  for (const day in grouped) {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl flex items-center gap-2 font-bold">
          <User className="w-6 h-6 text-gray-700" /> Doctor Profile
        </h1>
      </div>

      {/* Info Card */}
      <Card className="w-full bg-muted border rounded-xl bg-white shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <Image
              src={doctor.avatarURL || "/p.png"}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
              width={64}
              height={64}
            />
            <div className="text-sm">
              <p className="font-medium text-lg">
                {doctor.firstName} {doctor.lastName}
              </p>
              <p className="text-gray-500 text-sm">{doctor.email}</p>
            </div>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-700 flex-1 min-w-[200px] space-y-1">
            <p className="flex items-center gap-2">
              <GenderIcon gender={doctor.gender} />
              Gender:{" "}
              <span className="text-blue-600">
                {doctor.gender.toUpperCase()}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-500" />
              Specialties:{" "}
              <span className="text-blue-600">
                {doctor.specialties?.join(", ") || "None"}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <StickyNote className="w-4 h-4 mt-0.5 text-gray-500" />
              Description:{" "}
              <span className="text-gray-800 whitespace-pre-line">
                {doctor.description || "No description available"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-muted border rounded-xl bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-gray-700" /> Available Time
            Slots
          </h2>

          {grouped && Object.keys(grouped).length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {Object.entries(grouped)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([weekday, slots]) => (
                  <li
                    key={weekday}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded border"
                  >
                    <span>{weekdayMap[Number(weekday)]}</span>
                    <span className="text-blue-600">
                      {slots
                        .map((s) => `${s.startTime} - ${s.endTime}`)
                        .join(", ")}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No available times provided.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Appointments，including all the appointment status normal and rescheduling */}
      <Card className="w-full bg-muted border rounded-xl bg-white shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">{`Dr.${doctor.lastName}'s Appointments`}</h2>

          {appointments.length > 0 ? (
            <>
              <ul className="space-y-3">
                {appointments.map((appt) => (
                  <li
                    key={appt.id}
                    className="border rounded-lg p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Patient: {appt.patient?.nickname || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        From{" "}
                        {new Date(appt.startAt).toISOString().substring(11, 16)}{" "}
                        to{" "}
                        {new Date(appt.endAt).toISOString().substring(11, 16)}{" "}
                        on {new Date(appt.startAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        <span className="capitalize text-blue-600">
                          {appt.status}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleOpen(appt)}
                    >
                      Reschedule
                    </Button>
                  </li>
                ))}
              </ul>
              <RescheduleDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleApprove}
                doctor={doctor}
              />
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              No appointments found to be rescheduled.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

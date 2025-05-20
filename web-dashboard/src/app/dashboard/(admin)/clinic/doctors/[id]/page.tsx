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

  function GenderIcon({ gender }: { gender: string }) {
    if (gender === "female") return <Venus className="w-4 h-4 text-pink-500" />;
    if (gender === "male") return <Mars className="w-4 h-4 text-blue-500" />;
    return <HelpCircle className="w-4 h-4 text-gray-500" />;
  }

  useEffect(() => {
    fetch(`/api/clinic/doctor/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data));
  }, [id]);

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
    </div>
  );
}

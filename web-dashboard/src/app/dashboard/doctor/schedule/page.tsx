"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarClock, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Doctor } from "@/types/doctor";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const hourLabels = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getPercent(time: string) {
  const minutes = timeToMinutes(time);
  return ((minutes - 480) / 720) * 100; // 8:00 to 20:00 is the working time window
}

function mergeTimeSlots(
  slots: { id: string; startTime: string; endTime: string }[]
) {
  const sorted = [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  const merged: { startTime: string; endTime: string; slots: typeof slots }[] =
    [];

  for (const slot of sorted) {
    if (merged.length === 0) {
      merged.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        slots: [slot],
      });
    } else {
      const last = merged[merged.length - 1];
      if (timeToMinutes(slot.startTime) <= timeToMinutes(last.endTime)) {
        last.endTime =
          timeToMinutes(slot.endTime) > timeToMinutes(last.endTime)
            ? slot.endTime
            : last.endTime;
        last.slots.push(slot);
      } else {
        merged.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          slots: [slot],
        });
      }
    }
  }
  return merged;
}

function getFreeTimeSlots(slots: { startTime: string; endTime: string }[]) {
  const START = "08:00";
  const END = "20:00";
  const sorted = [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  const result: { startTime: string; endTime: string }[] = [];

  let prevEnd = START;
  for (const slot of sorted) {
    if (timeToMinutes(slot.startTime) > timeToMinutes(prevEnd)) {
      result.push({ startTime: prevEnd, endTime: slot.startTime });
    }
    prevEnd =
      timeToMinutes(slot.endTime) > timeToMinutes(prevEnd)
        ? slot.endTime
        : prevEnd;
  }
  if (timeToMinutes(prevEnd) < timeToMinutes(END)) {
    result.push({ startTime: prevEnd, endTime: END });
  }
  return result;
}

export default function DoctorSchedulePage() {
  const { data: session } = useSession();
  const doctorId = session?.user?.id; // Doctor's ID from the session
  const [availableTimes, setAvailableTimes] = useState<
    Doctor["availableTimes"]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetch(`/api/clinic/doctor/${doctorId}/available-times`) // Fetch the available times for the doctor
        .then((res) => res.json())
        .then((data) => setAvailableTimes(data.data || []))
        .finally(() => setLoading(false)); // Set loading state to false when data is fetched
    }
  }, [doctorId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <CalendarClock className="w-5 h-5" /> My Schedule
      </h1>

      {loading ? (
        <Card className="p-6 h-[500px] flex items-center justify-center text-gray-500 text-base">
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading schedule...
        </Card>
      ) : (
        <Card className="p-6 space-y-2 overflow-auto">
          <div className="grid grid-cols-[100px_1fr] items-center text-sm font-medium text-gray-600">
            <div></div>
            <div className="relative h-6 border-b border-gray-300">
              {hourLabels.map((label, i) => (
                <div
                  key={i}
                  className="absolute top-0 text-center text-xs text-gray-500"
                  style={{
                    left: `${(i / 12) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {weekdays.map((label, day) => {
              const daySlots = availableTimes.filter((t) => t.weekday === day); // Filter available slots by weekday
              const mergedSlots = mergeTimeSlots(daySlots); // Merge time slots if necessary

              return (
                <div
                  key={day}
                  className="grid grid-cols-[100px_1fr] items-center text-sm"
                >
                  <div className="text-gray-700 font-medium">{label}</div>
                  <div className="relative h-12 rounded overflow-hidden">
                    {getFreeTimeSlots(mergedSlots).map((s, i) => (
                      <div
                        key={`free-${i}`}
                        className="absolute top-1 bottom-1 bg-gray-200 rounded"
                        style={{
                          left: `${getPercent(s.startTime)}%`,
                          width: `${
                            getPercent(s.endTime) - getPercent(s.startTime)
                          }%`,
                        }}
                        title={`Free: ${s.startTime} - ${s.endTime}`}
                      />
                    ))}
                    
                    {mergedSlots.map((merged) => (
                      <div
                        key={`${day}-${merged.startTime}-${merged.endTime}`}
                        className="absolute top-1 bottom-1 bg-green-500 hover:bg-green-600 transition-all rounded cursor-pointer"
                        style={{
                          left: `${getPercent(merged.startTime)}%`,
                          width: `${
                            getPercent(merged.endTime) -
                            getPercent(merged.startTime)
                          }%`,
                        }}
                        title={`${merged.startTime} - ${merged.endTime}`} // Display time range when hovered
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types/doctor";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { ScheduleDialog } from "@/components/dialog/clinic-schedule-dialog";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

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
  return ((minutes - 480) / 720) * 100;
}

export default function SchedulePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [availableTimes, setAvailableTimes] = useState<
    Doctor["availableTimes"]
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{
    weekday: number;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [doctorName, setDoctorName] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const { data: session } = useSession();
  const id = session?.user?.clinicId;

  useEffect(() => {
    if (id) {
      fetch(`/api/clinic/doctor?clinicId=${id}`)
        .then((res) => res.json())
        .then((data) => setDoctors(data.data.doctors));
    }
  }, [id]);

  useEffect(() => {
    if (selectedId) {
      setLoadingTimes(true);
      fetch(`/api/clinic/doctor/${selectedId}/available-times`)
        .then((res) => res.json())
        .then((data) => setAvailableTimes(data.data || []))
        .finally(() => setLoadingTimes(false));
    }
  }, [selectedId]);

  function mergeTimeSlots(
    slots: { id: string; startTime: string; endTime: string }[]
  ) {
    const sorted = [...slots].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    const merged: {
      startTime: string;
      endTime: string;
      slots: typeof slots;
    }[] = [];
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
    const result: { startTime: string; endTime: string }[] = [];
    const START = "08:00";
    const END = "20:00";
    const sorted = [...slots].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
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

  async function handleDelete(id: string) {
    await fetch(
      `/api/clinic/doctor/${selectedId}/available-times?availabilityId=${id}`,
      { method: "DELETE" }
    );
    refresh();
  }

  async function handleAddSlot(slot: {
    weekday: number;
    startTime: string;
    endTime: string;
  }) {
    await fetch(`/api/clinic/doctor/${selectedId}/available-times`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slot),
    });
    refresh();
  }

  function refresh() {
    if (selectedId) {
      setLoadingTimes(true);
      fetch(`/api/clinic/doctor/${selectedId}/available-times`)
        .then((res) => res.json())
        .then((data) => setAvailableTimes(data.data || []))
        .finally(() => setLoadingTimes(false));
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <CalendarClock className="w-5 h-5" /> Doctor Weekly Schedule
        </h1>
        <div className="flex gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            className={`cursor-pointer ${
              editMode
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "border-red-500 text-red-500 hover:bg-red-50"
            }`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Exit Edit Mode" : "Edit Schedule"}
          </Button>
          <Input
            placeholder="Enter doctor's full name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-[200px]"
          />
          <Button
            className="cursor-pointer"
            onClick={() => {
              if (!doctorName || !id) return;
              setSearchAttempted(true);
              fetch(
                `/api/clinic/doctor?clinicId=${id}&name=${encodeURIComponent(
                  doctorName
                )}`
              )
                .then((res) => res.json())
                .then((data) => {
                  const found = data.data.doctors?.[0];
                  if (found) {
                    setSelectedId(found.id);
                    setSearchFailed(false);
                  } else {
                    setSelectedId(undefined);
                    setSearchFailed(true);
                  }
                });
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {!searchAttempted && (
        <Card className="p-6 h-[500px] flex items-center justify-center text-gray-400 text-base">
          No data, please search a doctor's full name to view their schedule.
        </Card>
      )}

      {searchAttempted && searchFailed && (
        <Card className="p-6 h-[500px] flex items-center justify-center text-red-500 text-base text-center">
          No doctor found with the name "{doctorName}". Please try again.
        </Card>
      )}

      {searchAttempted && !searchFailed && selectedId && loadingTimes && (
        <Card className="p-6 h-[500px] flex items-center justify-center text-gray-500 text-base">
          <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading schedule...
        </Card>
      )}

      {searchAttempted && !searchFailed && selectedId && !loadingTimes && (
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
              const daySlots = availableTimes.filter((t) => t.weekday === day);
              const mergedSlots = mergeTimeSlots(daySlots);
              const freeSlots = getFreeTimeSlots(mergedSlots);

              return (
                <div
                  key={day}
                  className="grid grid-cols-[100px_1fr] items-center text-sm"
                >
                  <div className="text-gray-700 font-medium">{label}</div>
                  <div className="relative h-12 rounded overflow-hidden">
                    {freeSlots.map((s, i) => (
                      <div
                        key={`free-${i}`}
                        className="absolute top-1 bottom-1 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded"
                        style={{
                          left: `${getPercent(s.startTime)}%`,
                          width: `${
                            getPercent(s.endTime) - getPercent(s.startTime)
                          }%`,
                        }}
                        onClick={() => {
                          if (!editMode) return;
                          setPendingSlot({
                            weekday: day,
                            startTime: s.startTime,
                            endTime: s.endTime,
                          });
                        }}
                      />
                    ))}

                    <ScheduleDialog
                      slot={pendingSlot}
                      onClose={() => setPendingSlot(null)}
                      onConfirm={(slot) => {
                        handleAddSlot(slot);
                        setPendingSlot(null);
                      }}
                    />

                    {!editMode &&
                      mergedSlots.map((merged) => (
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
                          title={`${merged.startTime} - ${merged.endTime}`}
                        />
                      ))}

                    {editMode &&
                      daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="absolute top-1 bottom-1 bg-blue-500 text-white text-xs px-2 rounded flex justify-between items-center"
                          style={{
                            left: `${getPercent(slot.startTime)}%`,
                            width: `${
                              getPercent(slot.endTime) -
                              getPercent(slot.startTime)
                            }%`,
                          }}
                        >
                          <div className="h-full flex items-center justify-center">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <ConfirmDialog
                            onConfirm={() => handleDelete(slot.id)}
                            title="Delete Time Slot"
                            description={`Are you sure you want to delete this time slot ${
                              weekdays[slot.weekday]
                            } ${slot.startTime} - ${slot.endTime}?`}
                          >
                            <button className="absolute top-0 right-1 text-white text-sm cursor-pointer font-bold hover:text-red-400">
                              x
                            </button>
                          </ConfirmDialog>
                        </div>
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

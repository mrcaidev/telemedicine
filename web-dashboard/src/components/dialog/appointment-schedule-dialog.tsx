"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { RawAppointment } from "@/types/appointment";
import { Calendar } from "@/components/ui/calendar";

interface RescheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (availabilityId: string) => void;
  appointment?: RawAppointment;
  doctor?: Doctor;
}

const weekdayMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function RescheduleDialog({
  open,
  onClose,
  onConfirm,
  doctor,
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedWeekday, setSelectedWeekday] = useState<string>("");
  const [selectedAvailabilityId, setSelectedAvailabilityId] =
    useState<string>("");
  const [availabilities, setAvailabilities] = useState<
    Doctor["availableTimes"]
  >([]);
  const [loading, setLoading] = useState(false);
  const handleDateSelect = (date: Date) => {
    console.log("Selected date:", date);
    setSelectedDate(date); // 更新选中的日期
  };

  useEffect(() => {
    if (open && doctor?.id) {
      setSelectedWeekday("");
      setSelectedAvailabilityId("");
      setAvailabilities([]);
      setLoading(true);

      fetch(`/api/clinic/doctor/${doctor.id}/available-times`)
        .then((res) => res.json())
        .then((data) => {
          setAvailabilities(data.data); // 你可根据返回结构调整
        })
        .catch((err) => {
          console.error("Failed to load availabilities:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, doctor?.id]);

  // 更新 selectedWeekday 当日期改变时
  useEffect(() => {
    if (selectedDate) {
      setSelectedWeekday(selectedDate.getDay().toString());
    }
  }, [selectedDate]);

  const availabilitiesForDay = availabilities.filter(
    (a) => a.weekday.toString() === selectedWeekday
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-4 text-gray-500">
            Loading availabilities...
          </p>
        ) : (
          <div className="space-y-4">
            {/* Date Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm w-[120px]">Select Date:</span>
              <Calendar
                selected={selectedDate}
                onDayClick={handleDateSelect}
                className="w-[280px]"
                disabled={[{ before: new Date() }]}
              />
            </div>

            {/* Weekday Selector */}
            {selectedDate && (
              <div className="flex items-center gap-3">
                <span className="text-sm w-[120px]">Weekday:</span>
                <Select
                  value={selectedWeekday}
                  onValueChange={(value) => {
                    setSelectedWeekday(value);
                    setSelectedAvailabilityId("");
                  }}
                  disabled
                >
                  <SelectTrigger className="w-[280px] cursor-pointer">
                    <SelectValue placeholder="Select weekday" />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                    {[...new Set(availabilities.map((a) => a.weekday))].map(
                      (w) => (
                        <SelectItem key={w} value={w.toString()}>
                          {weekdayMap[Number(w)]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time Slot Selector */}
            {selectedWeekday && (
              <div className="flex items-center gap-3">
                <span className="text-sm w-[120px]">Time Slot:</span>
                <Select
                  value={selectedAvailabilityId}
                  onValueChange={setSelectedAvailabilityId}
                >
                  <SelectTrigger className="w-[280px] cursor-pointer">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                    {availabilitiesForDay.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.startTime} - {a.endTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={!selectedAvailabilityId || loading}
            onClick={() => onConfirm(selectedAvailabilityId)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

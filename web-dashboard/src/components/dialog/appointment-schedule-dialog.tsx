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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctor";
import { RawAppointment } from "@/types/appointment";

interface RescheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (startTime: string, endTime: string, date: Date) => void;
  appointment?: RawAppointment;
  doctor?: Doctor;
}

const hourOptions = Array.from(
  { length: 13 },
  (_, i) => `${String(8 + i).padStart(2, "0")}:00`
);

export function RescheduleDialog({
  open,
  onClose,
  onConfirm,
  appointment,
  doctor,
}: RescheduleDialogProps) {
  console.log("RescheduleDialog", appointment);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (open && appointment) {
      const start = new Date(appointment.startAt)
        .toISOString()
        .substring(11, 16);
      const end = new Date(appointment.endAt).toISOString().substring(11, 16);
      const dateOnly = new Date(appointment.startAt);
      setStartTime(start);
      setEndTime(end);
      setDate(dateOnly);
    }
  }, [open, appointment]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 日期选择 */}
          <div className="flex items-center gap-3">
            <span className="text-sm w-[80px]">Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left cursor-pointer"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => {
                    setDate(day);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const doctorAvailableWeekdays = [
                      ...new Set(
                        doctor?.availableTimes.map((t) => t.weekday) ?? []
                      ),
                    ];

                    return (
                      date < today ||
                      !doctorAvailableWeekdays.includes(date.getDay())
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 起始时间选择 */}
          <div className="flex items-center gap-3">
            <span className="text-sm w-[80px]">Start Time:</span>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="w-[160px] cursor-pointer">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm w-[80px]">End Time:</span>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="w-[160px] cursor-pointer">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions
                  .filter((t) => !startTime || t > startTime)
                  .map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!startTime || !endTime || !date}
            onClick={() => onConfirm(startTime, endTime, date!)}
            className="cursor-pointer"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

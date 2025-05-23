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
import { weekdays } from "@/lib/constants";
import { useEffect, useState } from "react";

interface TimeSlot {
  weekday: number;
  startTime: string;
  endTime: string;
}

interface AddSlotDialogProps {
  slot: TimeSlot | null;
  onClose: () => void;
  onConfirm: (slot: TimeSlot) => void;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function generateHourOptions(
  min: string,
  max: string,
  mode: "start" | "end"
): string[] {
  const start = timeToMinutes(min);
  const end = timeToMinutes(max);
  const options: string[] = [];

  for (let t = start; t <= end; t += 60) {
    const hour = Math.floor(t / 60);
    const minute = t % 60;
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;

    if ((mode === "start" && end - t >= 60) || (mode === "end" && t > start)) {
      options.push(timeStr);
    }
  }

  return options;
}

export function ScheduleDialog({
  slot,
  onClose,
  onConfirm,
}: AddSlotDialogProps) {
  const [localSlot, setLocalSlot] = useState<TimeSlot | null>(slot);

  useEffect(() => {
    setLocalSlot(slot); // 每次打开重置
  }, [slot]);

  if (!localSlot || !slot) return null;

  const startOptions = generateHourOptions(
    slot!.startTime,
    slot!.endTime,
    "start"
  );
  const endOptions = generateHourOptions(slot!.startTime, slot!.endTime, "end");

  return (
    <Dialog open={!!slot} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Time Slot for {weekdays[localSlot.weekday]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Original: {slot?.startTime} - {slot?.endTime}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Start:</span>
            <Select
              value={localSlot.startTime}
              onValueChange={(value) =>
                setLocalSlot((prev) => prev && { ...prev, startTime: value })
              }
            >
              <SelectTrigger className="w-[120px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {startOptions.map((t) => (
                  <SelectItem className="cursor-pointer" key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm">End:</span>
            <Select
              value={localSlot.endTime}
              onValueChange={(value) =>
                setLocalSlot((prev) => prev && { ...prev, endTime: value })
              }
            >
              <SelectTrigger className="w-[120px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {endOptions.map((t) => (
                  <SelectItem className="cursor-pointer" key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={
              timeToMinutes(localSlot.endTime) -
                timeToMinutes(localSlot.startTime) <
              60
            }
            className="cursor-pointer"
            onClick={() => onConfirm(localSlot)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

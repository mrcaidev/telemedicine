"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ScheduleTasksCard() {
  return (
    <Card
      className={cn(
        "h-64 overflow-y-auto cursor-pointer transition-shadow hover:shadow-md",
        "border border-gray-200"
      )}
    >
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">⚠️ Schedule Time</h2>
        <p className="text-gray-500 text-sm">No pending tasks</p>
      </CardContent>
    </Card>
  );
}

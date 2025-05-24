import { MedicalRecord } from "@/types/patient";
import { CalendarDays, Stethoscope, StickyNote } from "lucide-react";

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export default function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const date = new Date(record.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border rounded-xl shadow-sm bg-white p-5 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <CalendarDays className="w-4 h-4" />
        {date}
      </div>

      <div className="flex items-center gap-2 font-medium text-gray-800">
        <Stethoscope className="w-5 h-5 text-blue-500" />
        {record.diagnosis}
      </div>

      {record.notes && (
        <p className="text-sm text-gray-700 whitespace-pre-line flex gap-2">
          <StickyNote className="w-4 h-4 text-gray-400 mt-0.5" />
          <span>{record.notes}</span>
        </p>
      )}

      {record.doctorName && (
        <p className="text-xs text-right text-gray-500 italic">
          - Dr. {record.doctorName}
        </p>
      )}
    </div>
  );
}
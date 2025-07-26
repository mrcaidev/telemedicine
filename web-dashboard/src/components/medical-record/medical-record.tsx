import Link from "next/link";
import { MedicalRecord } from "@/types/patient";
import { Card } from "@/components/ui/card";

export default function MedicalRecordCard({
  record,
}: {
  record: MedicalRecord;
}) {
  return (
    <div>
      <Link href={`/dashboard/doctor/records/${record.id}`}>
        <Card className="p-4 space-y-2 hover:bg-gray-50 cursor-pointer">
          {/* 日期 & 诊断 */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span>{" "}
            {record.recordDate || "N/A"}
          </div>
          <div className="text-base font-medium">
            {record.assessmentDiagnosisDesc || "No diagnosis description"}
          </div>

          {/* 生命体征 */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            {record.objectiveBloodPressure && (
              <div>
                <span className="font-semibold">Blood Pressure:</span>{" "}
                {record.objectiveBloodPressure}
              </div>
            )}
            {record.objectiveHeartRate != null && (
              <div>
                <span className="font-semibold">Heart Rate:</span>{" "}
                {record.objectiveHeartRate} bpm
              </div>
            )}
            {record.objectiveTemperature != null && (
              <div>
                <span className="font-semibold">Temperature:</span>{" "}
                {record.objectiveTemperature} °C
              </div>
            )}
            {record.objectiveWeight != null && (
              <div>
                <span className="font-semibold">Weight:</span>{" "}
                {record.objectiveWeight} kg
              </div>
            )}
          </div>

          {/* 主观描述简要 */}
          {record.subjectiveNotes && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {record.subjectiveNotes}
            </p>
          )}

          {/* 药物计划（如果有） */}
          {record.planMedicationName && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Medication:</span>{" "}
              {record.planMedicationName} ({record.planDosageValue})
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
}

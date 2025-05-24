import { MedicalRecord } from "@/types/patient";

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export default function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const format = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-2">
      <div className="text-gray-600 text-sm">Record Date</div>
      <div className="text-base font-medium">{format(record.recordDate)}</div>

      {record.subjectiveNotes && (
        <div>
          <div className="text-gray-600 text-sm">Subjective Notes</div>
          <div>{record.subjectiveNotes}</div>
        </div>
      )}

      {record.assessmentDiagnosisDesc && (
        <div>
          <div className="text-gray-600 text-sm">Diagnosis</div>
          <div>{record.assessmentDiagnosisDesc}</div>
        </div>
      )}

      {(record.objectiveBloodPressure ||
        record.objectiveHeartRate ||
        record.objectiveTemperature) && (
        <div className="grid grid-cols-2 gap-2">
          {record.objectiveBloodPressure && (
            <div>
              <div className="text-gray-600 text-sm">Blood Pressure</div>
              <div>{record.objectiveBloodPressure}</div>
            </div>
          )}
          {record.objectiveHeartRate && (
            <div>
              <div className="text-gray-600 text-sm">Heart Rate</div>
              <div>{record.objectiveHeartRate} bpm</div>
            </div>
          )}
          {record.objectiveTemperature && (
            <div>
              <div className="text-gray-600 text-sm">Temperature</div>
              <div>{record.objectiveTemperature} °C</div>
            </div>
          )}
        </div>
      )}

      {record.planMedicationName && (
        <div>
          <div className="text-gray-600 text-sm">Medication Plan</div>
          <div>{record.planMedicationName}</div>
        </div>
      )}

      {record.planFollowupDate && (
        <div>
          <div className="text-gray-600 text-sm">Follow-up Date</div>
          <div>{format(record.planFollowupDate)}</div>
        </div>
      )}
    </div>
  );
}

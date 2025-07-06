"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MedicalRecord } from "@/types/patient";
import Spinner from "@/components/ui/spinner";

function formatDateTime(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function MedicalRecordDetailPage() {
  const { recordId } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    fetch(`/api/doctor/patients/records/${recordId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched record data:", data);
        setRecord(data.data.data);
      });
  }, [recordId]);

  return (
    <div className="w-full px-8 py-6 space-y-6 min-h-screen">
      <Button variant="outline" className="cursor-pointer" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Medical Record Detail</h1>
        {record?.updatedAt && (
          <div className="text-s text-gray-500 text-right">
            Last updated: {formatDateTime(record.updatedAt)}
          </div>
        )}
      </div>

      <div>
        {!record ? (
          <Spinner />
        ) : (
          <div className="w-full space-y-6">
            {/* 病例头部摘要 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-2">
              <div className="text-gray-500 text-sm">Record Date</div>
              <div className="text-xl font-bold text-gray-800">
                {formatDateTime(record.recordDate)}
              </div>
              {record.assessmentDiagnosisDesc && (
                <div className="text-md font-semibold text-blue-600">
                  🩺 Diagnosis: {record.assessmentDiagnosisDesc}
                </div>
              )}
            </div>

            {/* 主观描述 */}
            {record.subjectiveNotes && (
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-2">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                  🗣️ Subjective Notes
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {record.subjectiveNotes}
                </p>
              </div>
            )}

            {/* 生命体征 */}
            <div className="bg-white border rounded-lg shadow-sm p-5 space-y-2">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                ❤️ Vitals
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700">
                <div>
                  <strong>Blood Pressure:</strong>{" "}
                  {record.objectiveBloodPressure || "N/A"}
                </div>
                <div>
                  <strong>Heart Rate:</strong> {record.objectiveHeartRate} bpm
                </div>
                <div>
                  <strong>Temperature:</strong> {record.objectiveTemperature} °C
                </div>
                <div>
                  <strong>Weight:</strong> {record.objectiveWeight} kg
                </div>
                <div>
                  <strong>Height:</strong> {record.objectiveHeight} cm
                </div>
                <div>
                  <strong>Other:</strong> {record.objectiveOtherVitals || "N/A"}
                </div>
              </div>
            </div>

            {/* 用药信息 */}
            {(record.planMedicationName || record.planDosageValue) && (
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-2">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                  💊 Medication Plan
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700">
                  <div>
                    <strong>Name:</strong> {record.planMedicationName}
                  </div>
                  <div>
                    <strong>Dosage:</strong> {record.planDosageValue}
                  </div>
                  <div>
                    <strong>Frequency:</strong> {record.planFrequencyCode}
                  </div>
                  <div>
                    <strong>Usage:</strong> {record.planUsageCode}
                  </div>
                  <div>
                    <strong>Start:</strong>{" "}
                    {formatDateTime(record.planStartDate)}
                  </div>
                  <div>
                    <strong>Stop:</strong> {formatDateTime(record.planStopDate)}
                  </div>
                </div>
              </div>
            )}

            {/* 跟进计划 */}
            {record.planFollowupDate && (
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-2">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                  📅 Follow-up
                </h2>
                <div className="text-sm text-gray-700">
                  {formatDateTime(record.planFollowupDate)} ·{" "}
                  {record.planFollowupType || "Type N/A"}
                </div>
              </div>
            )}

            {/* 实验室检查 */}
            {(record.planLabTestName || record.planLabTestCode) && (
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-2">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-1">
                  🔬 Lab Test
                </h2>
                <div className="text-sm text-gray-700">
                  <div>
                    <strong>Name:</strong> {record.planLabTestName}
                  </div>
                  <div>
                    <strong>Code:</strong> {record.planLabTestCode}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

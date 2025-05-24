"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { RawPatient, MedicalRecord } from "@/types/patient";
import MedicalRecordCard from "@/components/medical-record/medical-record";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<RawPatient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    fetch(`/api/doctor/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data.data);
        setRecords(data.data.medicalRecords.medicalRecords);
      });
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="w-full px-8 py-6 min-h-screen space-y-6">
      {/* 顶部返回 + 标题 */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <h1 className="text-2xl flex items-center gap-2 font-bold">
        <UserCircle className="w-6 h-6 text-gray-700" /> Patient Detail
      </h1>

      {/* 卡片内容 */}
      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Image
            src={patient.avatarUrl || "/p.png"}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <div className="text-xl font-semibold">
              {patient.nickname || "Anonymous"}
            </div>
            <div className="text-sm text-gray-500">{patient.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Gender</div>
            <div className="font-medium capitalize">{patient.gender}</div>
          </div>
          <div>
            <div className="text-gray-500">Birth Date</div>
            <div className="font-medium">
              {patient.birthDate || "Not Provided"}
            </div>
          </div>
        </div>
      </div>

      {/* 医疗记录 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        {records.map((rec) => (
          <MedicalRecordCard key={rec.id} record={rec} />
        ))}
      </div>
    </div>
  );
}

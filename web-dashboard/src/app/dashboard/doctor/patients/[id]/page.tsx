"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCircle, ArrowLeft } from "lucide-react";
import { RawPatient, MedicalRecord } from "@/types/patient";
import { useCallback } from "react";
import MedicalRecordCard from "@/components/medical-record/medical-record";
import Spinner from "@/components/ui/spinner";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<RawPatient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 5;

  useEffect(() => {
    fetch(`/api/doctor/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data.data.data));
  }, [id]);

  const fetchMoreRecords = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const params = new URLSearchParams({
      sort_date: "desc",
      limit: LIMIT.toString(),
      patientId: id as string,
    });
    if (cursor) params.append("cursor", cursor);

    const res = await fetch(
      `/api/doctor/patients/records?${params.toString()}`
    );
    const data = await res.json();

    console.log("Fetched records:", data);
    const newRecords: MedicalRecord[] = data.data.data.medicalRecords;

    setRecords((prev) => [...prev, ...newRecords]);

    if (newRecords.length < LIMIT) {
      setHasMore(false);
    } else {
      setCursor(newRecords[newRecords.length - 1]?.recordDate ?? null);
    }

    setIsLoading(false);
  },[isLoading, hasMore, cursor, id, LIMIT]);

  useEffect(() => {
    if (id) fetchMoreRecords();
  }, [fetchMoreRecords, id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        fetchMoreRecords();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreRecords, cursor, isLoading, hasMore]);

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
      {!patient ? (
        <div className="bg-white border rounded-xl shadow-sm p-6 flex justify-center items-center h-48">
          <Spinner />
        </div>
      ) : (
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
      )}

      {/* 医疗记录 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        {records.map((rec) => (
          <MedicalRecordCard key={rec.id} record={rec} />
        ))}

        {isLoading && (
          <div className="text-sm text-center text-gray-500">
            Loading more records...
          </div>
        )}
        {!hasMore && (
          <div className="text-sm text-center text-gray-400">
            No more records.
          </div>
        )}
      </div>
    </div>
  );
}

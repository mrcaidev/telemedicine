"use client";

import Link from "next/link";
import { useAppointments } from "@/components/appointments/useAppointments";
import { RawAppointment } from "@/types/appointment";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/search/search-bar";
import AppointmentDateFilter from "@/components/appointments/appointment-date-filter";

function resolveStatusLabel(appt: RawAppointment): string {
  const now = new Date();
  const start = new Date(appt.startAt);
  const end = new Date(appt.endAt);

  if (appt.status !== "normal") {
    return (
      {
        to_be_rescheduled: "📅 Rescheduling",
        cancelled: "❌ Cancelled",
      }[appt.status] || appt.status
    );
  }

  if (now < start) return "⏳ Not Started";
  if (now >= start && now < end) return "🩺 In Progress";
  return "✅ Finished";
}

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const { appointments, loading, nextCursor, fetchMore } = useAppointments();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const hasMore = Boolean(nextCursor);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isFiltered = searchTerm || startDate || endDate;

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );

    const target = loadMoreRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading]);

  const filteredAppointments = appointments.filter((appt) => {
    const nameMatch = appt.patient.nickname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const startTime = new Date(appt.startAt);
    const startOk = startDate ? startTime >= new Date(startDate) : true;
    const endOk = endDate ? startTime <= new Date(endDate) : true;

    return nameMatch && startOk && endOk;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 返回按钮 */}
      <Button variant="outline" onClick={() => router.back()} className="mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* 页面标题 */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        📅 My Appointments
      </h1>

      {/* 搜索与时间过滤器组件 */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <AppointmentDateFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </div>

      {/* 预约卡片列表 */}
      {filteredAppointments.map((appt) => {
        const timeStr = new Date(appt.startAt).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Link
            key={appt.id}
            href={`/dashboard/doctor/appointments/${appt.id}`}
          >
            <div className="border bg-white p-5 mb-4 rounded-2xl shadow hover:shadow-md transition-all hover:bg-blue-50/30 cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={appt.patient.avatarUrl || "/default-avatar.png"}
                    alt={appt.patient.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-semibold text-lg">
                    {appt.patient.nickname}
                  </p>
                </div>
                {/* 右侧：状态 */}
                <span className="text-sm text-gray-600">
                  {resolveStatusLabel(appt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                🕒{" "}
                {new Date(appt.startAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-700">
                📄 Remark: {appt.remark || "N/A"}
              </p>
            </div>
          </Link>
        );
      })}

      {/* 状态区块 */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}

      {!hasMore && !loading && filteredAppointments.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          🎉 No more appointments
        </p>
      )}

      {filteredAppointments.length === 0 && !loading && isFiltered && (
        <p className="text-center text-gray-500 mt-6">
          😥 No matching appointments found
        </p>
      )}

      {/* 自动加载触发器 */}
      <div ref={loadMoreRef} className="h-8" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useAppointments } from "@/components/appointments/useAppointments";
import { useEffect, useRef, useState } from "react";
import { Clock, FileText } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/search/search-bar";
import AppointmentDateFilter from "@/components/appointments/appointment-date-filter";

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
    if (!appt.patient) return false;
    if (!appt.patient.nickname) {
      appt.patient.nickname = "Anonymous";
    }

    const nameMatch = appt.patient.nickname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const startTime = new Date(appt.startAt);

    let startOk = true;
    let endOk = true;

    if (startDate) {
      const startDateObj = new Date(startDate);
      startOk = startTime >= startDateObj;
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      if (startDate && startDate === endDate) {
        endDateObj.setHours(23, 59, 59, 999);
      }
      endOk = startTime <= endDateObj;
    }

    return nameMatch && startOk && endOk;
  });

  return (
    <div className="p-6 w-full">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold mb-6 text-left">My Appointments</h1>

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
                    src={appt.patient.avatarUrl || "/p.png"}
                    alt={appt.patient.nickname || "Anonymous"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-semibold text-lg">
                    {appt.patient.nickname || "Anonymous"}
                  </p>
                </div>

                {/* 状态 Badge */}
                <StatusBadge appt={appt} />
              </div>

              <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                {timeStr}
              </p>

              <p className="text-sm text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Remark: {appt.remark || "N/A"}
              </p>
            </div>
          </Link>
        );
      })}

      {/* 状态提示区域 */}
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

      {/* 加载触发器 */}
      <div ref={loadMoreRef} className="h-8" />
    </div>
  );
}

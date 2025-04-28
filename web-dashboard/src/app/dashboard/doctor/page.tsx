"use client";

import PendingTasksCard from "@/components/dashboard/pending-tasks-card";
import DataStatisticsCard from "@/components/dashboard/data-statistics-card";
import { RawAppointment } from "@/types/appointment";
import { useEffect, useState } from "react";
import DashboardAppointmentCard from "@/components/dashboard/dashboard-appointment-card";

function filterAppointments(appointments: RawAppointment[]) {
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((appt) => {
    const apptDate = new Date(appt.startAt).toISOString().split("T")[0];
    return apptDate === today;
  });
}

function sortAndLimitAppointments(appointments: RawAppointment[], limit = 5) {
  return [...appointments]
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    )
    .slice(0, limit);
}

export default function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<RawAppointment[]>(
    []
  );
  const [allAppointments, setAllAppointments] = useState<RawAppointment[]>([]);

  useEffect(() => {
    fetch("/api/doctor/appointments")
      .then((res) => res.json())
      .then((data) => {
        const appts = data.data.appointments;
        setTodayAppointments(filterAppointments(appts));
        setAllAppointments(sortAndLimitAppointments(appts));
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📅 今日预约速览 */}
        <DashboardAppointmentCard
          title="📅 Today Appointments"
          appointments={todayAppointments}
          timeFormat="time"
        />

        {/* 📋 所有预约入口 */}
        <DashboardAppointmentCard
          title="📋 All Appointments"
          appointments={allAppointments}
          timeFormat="datetime"
        />

        {/* ⚠️ 待处理事项 */}
        <PendingTasksCard />

        {/* 📊 数据统计占位 */}
        <DataStatisticsCard />
      </div>
    </div>
  );
}

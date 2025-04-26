"use client";

import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search/search-bar";
import AISummaryEntry from "@/components//smart-system/ai-summary-entry";
import TodayAppointmentsCard from "@/components/appointments/today-appointments-card";
import { RawAppointment } from "@/types/appointment";
import { useEffect, useState } from "react";

function filterAppointments(appointments: RawAppointment[]) {
  const today = new Date().toISOString().split("T")[0];
  return appointments.filter((appt) => {
    const apptDate = new Date(appt.startAt).toISOString().split("T")[0];
    return apptDate === today;
  });
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<RawAppointment[]>([]);

  useEffect(() => {
    fetch("/api/doctor/appointments")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched appointments:", data.data.appointments);
        const filtered = filterAppointments(data.data.appointments);
        setAppointments(filtered);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div>
          <AISummaryEntry />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 今日预约速览 */}
        <TodayAppointmentsCard appointments={appointments} />

        {/* 病人病历摘要 */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📝 Patient Medical Record Summary</h2>
            <p className="text-gray-500">No summary data available</p>

          </CardContent>
        </Card>

        {/* 待处理事项 */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📋 Pending Tasks</h2>
            <p className="text-gray-500">No pending tasks</p>
          </CardContent>
        </Card>

        {/* 数据统计占位 */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">📊 Data Statistics</h2>
            <p className="text-gray-500">No visualization data available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

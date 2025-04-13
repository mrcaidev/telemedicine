"use client"

import DashboardCard from "@/components/dashboard/Dashboard"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

export default function DoctorHomePage() {
  const chartData = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 5 },
    { day: "Wed", count: 4 },
    { day: "Thu", count: 6 },
    { day: "Fri", count: 2 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 📈 本周预约趋势 */}
      <DashboardCard
        title="📈 本周预约趋势"
        actionText="查看统计"
        actionHref="/dashboard/doctor/stats"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        }
      />

      {/* 📅 今日预约速览 */}
      <DashboardCard
        title="📅 今日预约速览"
        actionText="查看全部"
        actionHref="/dashboard/doctor/appointments"
      >
        <ul className="space-y-2 text-sm">
          <li>09:00 - 王小明（视频会诊）✅</li>
          <li>10:30 - 李红（门诊）🕐</li>
          <li>14:00 - 陈建国（电话）❌</li>
        </ul>
      </DashboardCard>

      {/* ⏳ 待处理事项 */}
      <DashboardCard
        title="⏳ 待处理事项"
        actionText="去处理"
        actionHref="/dashboard/doctor/tasks"
      >
        <ul className="list-disc pl-4 space-y-1 text-sm">
          <li>待填写病历：王小明</li>
          <li>未审核资料：李红</li>
          <li>13:30 会诊提醒：陈建国</li>
        </ul>
      </DashboardCard>

      {/* 🤖 AI 病历摘要 */}
      <DashboardCard
        title="🤖 AI 病历摘要"
        actionText="查看摘要"
        actionHref="/dashboard/doctor/ai-summary"
      >
        <p className="text-sm text-gray-600">
          最近上传的 3 位病人资料已生成 AI 总结，点击查看详情。
        </p>
      </DashboardCard>
    </div>
  )
}

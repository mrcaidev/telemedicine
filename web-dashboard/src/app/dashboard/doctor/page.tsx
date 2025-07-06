"use client";

import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, DatePicker, Space } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    newPatientsToday: 0,
    newPatientsPercentage: 0,
    pendingAppointments: 0,
    pendingAppointmentsToday: 0,
  });

  const [monthlyData, setMonthlyData] = useState<
    { month: string; count: number }[]
  >([]);
  const [symptomData, setSymptomData] = useState<
    { rank: number; symptom: string; count: number }[]
  >([]);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(11, "month").startOf("month"),
    dayjs().endOf("month"),
  ]);

  const disableFutureMonths = (current: dayjs.Dayjs) => {
    return current && current.isAfter(dayjs().endOf("month"), "month");
  };
  const fetchTrends = (startMonth: dayjs.Dayjs, endMonth: dayjs.Dayjs) => {
    const startMonthFormatted = startMonth.format("YYYY-MM");
    const endMonthFormatted = endMonth.format("YYYY-MM");

    fetch(
      `/api/doctor/dashboard/doctorTrends?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMonthlyData(data.data.data.appointmentsTrends);
      });
  };

  useEffect(() => {
    fetch("/api/doctor/dashboard/stats")
      .then((res) => res.json())
      .then((res) => setStats(res.data.data));

    fetch("/api/doctor/dashboard/rank")
      .then((res) => res.json())
      .then((res) => setSymptomData(res.data));
  }, []);

  useEffect(() => {
    fetchTrends(range[0], range[1]);
  }, [range]);

  return (
    <div className="p-6">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Today: {stats.todayAppointments}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="New Patients Today"
              value={stats.newPatientsToday}
              prefix={<UserAddOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              New Patients Percentage: {stats.newPatientsPercentage * 100}%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Appointments"
              value={stats.pendingAppointments}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Pending Appointments Today: {stats.pendingAppointmentsToday}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 月度图 + 症状榜 */}
      <Row gutter={16} className="mb-6">
        <Col span={16}>
          <Card
            title="Monthly Appointment Trend"
            extra={
              <Space>
                <RangePicker
                  picker="month"
                  allowClear={false}
                  value={range}
                  onChange={(val) => {
                    if (val && val[0] && val[1]) {
                      setRange(val as [Dayjs, Dayjs]);
                      fetchTrends(val[0], val[1]);
                    }
                  }}
                  disabledDate={disableFutureMonths}
                />
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  shared={false}
                  formatter={(v) => [`${v} appointments`, "Appointments"]}
                />
                <Bar
                  dataKey="count"
                  fill="#1890ff"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Symptom Keyword Ranking">
            <Table
              dataSource={symptomData}
              columns={[
                { title: "Rank", dataIndex: "rank", key: "rank", width: 80 },
                { title: "Symptom", dataIndex: "symptom", key: "symptom" },
                { title: "Occurrences", dataIndex: "count", key: "count" },
              ]}
              pagination={false}
              size="small"
              rowKey="rank"
              bordered={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

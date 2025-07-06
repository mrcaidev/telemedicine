"use client";

import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Tabs, DatePicker } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TeamOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export default function ClinicDashboard() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(5, "month").startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingDoctorRequest: 0,
    urgentDoctorRequest: 0,
    doctorCount: 0,
    doctorAvailableCount: 0,
  });

  const [appointmentTrendData, setAppointmentTrendData] = useState([]);
  const [perDoctorData, setPerDoctorData] = useState<Record<string, any>[]>([]);
  const [perSymptomData, setPerSymptomData] = useState([]);
  const [doctorRanking, setDoctorRanking] = useState([]);

  function transformDoctorAppointments(raw: any[]) {
    const allDoctors = new Set<string>();

    // 先收集所有医生名称
    raw.forEach((item) => {
      item.doctorAppointments.forEach((d: any) => {
        allDoctors.add(d.doctorName);
      });
    });

    return raw.map((item) => {
      const base: Record<string, any> = { month: item.month };
      allDoctors.forEach((doctor) => {
        const found = item.doctorAppointments.find(
          (entry: any) => entry.doctorName === doctor
        );
        base[doctor] = found ? found.appointments : 0;
      });
      return base;
    });
  }

  const fetchTrends = (startMonth: dayjs.Dayjs, endMonth: dayjs.Dayjs) => {
    const startMonthFormatted = startMonth.format("YYYY-MM");
    const endMonthFormatted = endMonth.format("YYYY-MM");

    fetch(
      `/api/clinic/dashboard/trends?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`
    )
      .then((res) => res.json())
      .then((res) => {
        setAppointmentTrendData(res.data.clinicAppointments);
        setPerSymptomData(res.data.perSymptomData.symptoms);

        const rawPerDoctorData = res.data.perDoctorData.doctorAppointments;
        const transformed = transformDoctorAppointments(rawPerDoctorData);
        setPerDoctorData(transformed);
      });
  };

  useEffect(() => {
    fetch("/api/clinic/dashboard/stats")
      .then((res) => res.json())
      .then((res) => setStats(res.data.data));

    fetch("/api/clinic/dashboard/rank")
      .then((res) => res.json())
      .then((res) => setDoctorRanking(res.data));
  }, []);

  useEffect(() => {
    fetchTrends(range[0], range[1]);
  }, [range]);

  return (
    <div className="p-6">
      {/* 顶部三个指标卡片 */}
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
              title="Pending Doctor Requests"
              value={stats.pendingDoctorRequest}
              prefix={<UserSwitchOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Urgent: {stats.urgentDoctorRequest}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats.doctorCount}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              No appointment today: {stats.doctorAvailableCount}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 下方图表区块 */}
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="Appointment Trend Analysis"
            extra={
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
                disabledDate={(date) => date.isAfter(dayjs(), "month")}
              />
            }
          >
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  label: "Total Appointments",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={appointmentTrendData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1890ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
                {
                  key: "2",
                  label: "Appointments Per Doctor",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={perDoctorData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip shared={false} />
                        {Object.keys(perDoctorData[0] || {})
                          .filter((key) => key !== "month")
                          .map((doctor, i) => (
                            <Bar
                              key={doctor}
                              dataKey={doctor}
                              stackId="a"
                              fill={
                                [
                                  "#82ca9d",
                                  "#8884d8",
                                  "#ffc658",
                                  "#a0d911",
                                  "#ff4d4f",
                                ][i % 5]
                              }
                            />
                          ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
                {
                  key: "3",
                  label: "Top Symptoms",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={perSymptomData}>
                        <XAxis dataKey="symptom" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* 医生排行榜 */}
        <Col span={8}>
          <Card title="Doctor Appointment Ranking">
            <Table
              dataSource={doctorRanking}
              columns={[
                { title: "Rank", dataIndex: "rank", key: "rank" },
                { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
                { title: "Appointments", dataIndex: "count", key: "count" },
              ]}
              pagination={false}
              size="small"
              rowKey="rank"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

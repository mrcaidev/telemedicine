"use client";

import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Tabs, DatePicker } from "antd";
import {
  ClusterOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function PlatformDashboard() {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(12, "month").startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalClinics: 0,
    totalDoctors: 0,
  });

  const [clinicTrend, setClinicTrend] = useState([]);
  const [doctorTrend, setDoctorTrend] = useState([]);
  const [clinicRanking, setClinicRanking] = useState([]);

  const disableFutureMonths = (current: dayjs.Dayjs) => {
    return current && current.isAfter(dayjs().endOf("month"), "month");
  };
  const fetchTrends = (startMonth: dayjs.Dayjs, endMonth: dayjs.Dayjs) => {
    const startMonthFormatted = startMonth.format("YYYY-MM");
    const endMonthFormatted = endMonth.format("YYYY-MM");

    fetch(
      `/api/platform/dashboard/platformTrend?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`
    )
      .then((res) => res.json())
      .then((data) => {
        setClinicTrend(data.clinicTrend);
        setDoctorTrend(data.doctorTrend);
      });
  };

  useEffect(() => {
    fetch("/api/platform/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data.data.data));

    fetch("/api/platform/dashboard/clinicRank")
      .then((res) => res.json())
      .then((data) => setClinicRanking(data.ranks));
  }, []);

  useEffect(() => {
    fetchTrends(range[0], range[1]);
  }, [range]);

  return (
    <div className="p-6">
      {/* 1️⃣ 顶部统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Clinics"
              value={stats.totalClinics}
              prefix={<ClusterOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats.totalDoctors}
              prefix={<UserOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 2️⃣ 图表 + 榜单 */}
      <Row gutter={16}>
        {/* 左侧 Tab 图表 */}
        <Col span={16}>
          <Card
            title="Clinic & Doctor Trend Analysis"
            extra={
              <RangePicker
                allowClear={false}
                value={range}
                picker="month"
                onChange={(val) => {
                  if (val && val[0] && val[1]) {
                    setRange(val as [dayjs.Dayjs, dayjs.Dayjs]);
                    fetchTrends(val[0], val[1]);
                  }
                }}
                disabledDate={disableFutureMonths}
              />
            }
          >
            <Tabs
              defaultActiveKey="clinic"
              items={[
                {
                  key: "clinic",
                  label: "Clinic Count",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={clinicTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clinicCount" fill="#1890ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
                {
                  key: "doctor",
                  label: "Doctor Count",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={doctorTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="doctorCount" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* 右侧诊所榜单 */}
        <Col span={8}>
          <Card title="Top Clinics by Doctor Count">
            <Table
              dataSource={clinicRanking}
              columns={[
                { title: "Rank", dataIndex: "rank", key: "rank" },
                { title: "Clinic", dataIndex: "clinicName", key: "clinicName" },
                {
                  title: "Doctors",
                  dataIndex: "doctorCount",
                  key: "doctorCount",
                },
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

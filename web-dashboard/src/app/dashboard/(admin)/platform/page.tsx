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
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalClinics: 0,
    totalClinicAdmins: 0,
  });

  const [clinicTrend, setClinicTrend] = useState([]);
  const [doctorTrend, setDoctorTrend] = useState([]);
  const [clinicRanking, setClinicRanking] = useState([]);

  useEffect(() => {
    fetch("/api/platform/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setClinicTrend(data.clinicTrend);
        setDoctorTrend(data.doctorTrend);
        setClinicRanking(data.clinicRanking);
      });
  }, []);

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
              title="Clinic Admins"
              value={stats.totalClinicAdmins}
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
                onChange={(val) => {
                  if (val) setRange(val as [dayjs.Dayjs, dayjs.Dayjs]);
                }}
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
                        <Bar dataKey="count" fill="#1890ff" />
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
                        <Bar dataKey="count" fill="#82ca9d" />
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
                { title: "Clinic", dataIndex: "clinic", key: "clinic" },
                { title: "Doctors", dataIndex: "doctorCount", key: "doctorCount" },
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
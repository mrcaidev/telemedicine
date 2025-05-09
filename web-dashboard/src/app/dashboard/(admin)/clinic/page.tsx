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
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function ClinicDashboard() {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("year"),
    dayjs().endOf("year"),
  ]);

  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingDoctors: 0,
    doctorCount: 0,
  });

  const [appointmentTrendData, setAppointmentTrendData] = useState([]);
  const [perDoctorData, setPerDoctorData] = useState([]);
  const [perSymptomData, setPerSymptomData] = useState([]);
  const [doctorRanking, setDoctorRanking] = useState([]);

  useEffect(() => {
    fetch("/api/clinic/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setAppointmentTrendData(data.appointmentTrendData);
        setPerDoctorData(data.perDoctorData);
        setPerSymptomData(data.perSymptomData);
        setDoctorRanking(data.doctorRanking);
      });
  }, []);

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
              This Month: 120
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Doctor Requests"
              value={stats.pendingDoctors}
              prefix={<UserSwitchOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Urgent: 1
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
              No appointment today: 1
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
                allowClear={false}
                value={range}
                onChange={(val) => {
                  if (val) setRange(val as [dayjs.Dayjs, dayjs.Dayjs]);
                }}
              />
            }
          >
            <Tabs
              defaultActiveKey="1"
              items={[
                // 按月展示预约
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
                // 按医生展示预约，只展示前三医生，剩余医生为其它
                {
                  key: "2",
                  label: "Appointments Per Doctor",
                  children: (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={perDoctorData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="DrLee" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="DrWang" stackId="a" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                },
                // 按症状展示预约，只展示前三症状，剩余症状为其它
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
                { title: "Doctor", dataIndex: "doctor", key: "doctor" },
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

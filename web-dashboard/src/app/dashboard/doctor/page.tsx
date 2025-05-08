"use client";

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
import dayjs from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;

const presetRanges = {
  Today: [dayjs(), dayjs()],
  "This Week": [dayjs().startOf("week"), dayjs().endOf("week")],
  "This Month": [dayjs().startOf("month"), dayjs().endOf("month")],
  "This Year": [dayjs().startOf("year"), dayjs().endOf("year")],
};

const stats = {
  totalAppointments: 1280,
  Patients: 6,
  pendingAppointments: 20,
};

const fullMonthlyData = [
  { month: "Jan", count: 215 },
  { month: "Feb", count: 328 },
  { month: "Mar", count: 252 },
  { month: "Apr", count: 215 },
  { month: "May", count: 263 },
  { month: "Jun", count: 228 },
  { month: "Jul", count: 289 },
  { month: "Aug", count: 301 },
  { month: "Sep", count: 312 },
  { month: "Oct", count: 326 },
  { month: "Nov", count: 337 },
  { month: "Dec", count: 349 },
];

const symptomData = [
  { rank: 1, symptom: "Cough", count: 87 },
  { rank: 2, symptom: "Abdominal Pain", count: 76 },
  { rank: 3, symptom: "Chest Tightness", count: 65 },
  { rank: 4, symptom: "Headache", count: 59 },
  { rank: 5, symptom: "Fever", count: 53 },
  { rank: 6, symptom: "Sore Throat", count: 47 },
  { rank: 7, symptom: "Nausea", count: 41 },
  { rank: 8, symptom: "Dizziness", count: 39 },
  { rank: 9, symptom: "Shortness of Breath", count: 36 },
];

const columns = [
  { title: "Rank", dataIndex: "rank", key: "rank", width: 80 },
  { title: "Symptom", dataIndex: "symptom", key: "symptom" },
  { title: "Occurrences", dataIndex: "count", key: "count" },
];

export default function DoctorDashboard() {
  const [monthlyData] = useState(fullMonthlyData);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf("year"),
    dayjs().endOf("year"),
  ]);

  return (
    <div className="p-6">
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
              title="New Patients Today"
              value={stats.Patients}
              prefix={<UserAddOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              New Patients Percentage: 66.7%
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
              Pending Appointments Today: 9
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-6">
        <Col span={16}>
          <Card
            title="Monthly Appointment Trend"
            extra={
              <Space>
                <RangePicker
                  allowClear={false}
                  value={range}
                  onChange={(val) => {
                    if (val) setRange(val as [dayjs.Dayjs, dayjs.Dayjs]);
                  }}
                />
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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
              columns={columns}
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
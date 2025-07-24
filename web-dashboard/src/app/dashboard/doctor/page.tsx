"use client";

import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, DatePicker, Space } from "antd";
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
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(11, "month").startOf("month"),
    dayjs().endOf("month"),
  ]);

  const [loading, setLoading] = useState(true); // For tracking data loading state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState(false); // To handle API errors

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
        if (data && data.data) {
          setMonthlyData(data.data.data.appointmentsTrends || []);
        } else {
          setMonthlyData([]); // Set empty array if data is not available
        }
        setLoading(false); // Set loading to false when data is fetched
        setError(false); // Reset error state
      })
      .catch(() => {
        setLoading(false); // Set loading to false even if error occurs
        setError(true); // Set error state when API fetch fails
      });
  };

  useEffect(() => {
    fetch("/api/doctor/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data.data || {});
        setStats((prevStats) => ({
          ...prevStats,
          newPatientsPercentage: prevStats.newPatientsPercentage
            ? prevStats.newPatientsPercentage
            : 0,
          newPatientsToday: prevStats.newPatientsToday || 0,
        }));
      })
      .catch(() => {
        setError(true); // Set error state if fetch fails
        setLoading(false); // Stop loading
      });
  }, []);

  useEffect(() => {
    fetchTrends(range[0], range[1]);
  }, [range]);

  // Display 'No Data' if no data is available or if there is an error
  const renderNoDataMessage = () => {
    return <div>No Data Available</div>;
  };

  return (
    <div className="p-6">
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats?.totalAppointments || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Today: {stats?.todayAppointments || 0}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="New Patients Today"
              value={stats?.newPatientsToday || 0}
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
              value={stats.pendingAppointments || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 28 }}
            />
            <div className="mt-2 pt-2 border-t text-gray-500 text-sm">
              Pending Appointments Today: {stats.pendingAppointmentsToday || 0}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 月度图 + 症状榜 */}
      <Row gutter={24} className="mb-6">
        <Col span={24}>
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
            {loading ? (
              <div>Loading...</div>
            ) : monthlyData.length > 0 ? (
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
            ) : (
              renderNoDataMessage()
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";

// 模拟预约数据（仅返回给 doctorId === "1" 的）
const mockAppointments = Array.from({ length: 20 }).map((_, i) => {
  const start = new Date("2025-04-20T08:00:00Z");
  start.setHours(start.getHours() + i); // 每个预约间隔1小时

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  return {
    id: `a${i + 1}`,
    doctor: { id: "1", firstName: "Luke", lastName: "Shen" },
    patient: {
      id: `p${i + 1}`,
      nickname: `Patient${i + 1}`,
      gender: i % 2 === 0 ? "male" : "female",
    },
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    status: i % 3 === 0 ? "cancelled" : "normal",
    createdAt: new Date(start.getTime() - 86400000).toISOString(), // 提前1天创建
    remark: i % 2 === 0 ? "Routine check" : "Follow-up",
    date: start.toISOString().split("T")[0],
    endAt: end.toISOString(),
  };
});


// ✅ 仅允许对这些字段排序（防止访问非法字段）
const VALID_SORT_FIELDS = ["startTime", "endTime", "createdAt", "date", "endAt"];

// 排序函数（按字段和顺序排序）
function sortAppointments(arr: any[], field: string, order: string) {
  return [...arr].sort((a, b) => {
    const timeA = new Date((a as Record<string, any>)[field]).getTime();
    const timeB = new Date((b as Record<string, any>)[field]).getTime();
    return order === "desc" ? timeB - timeA : timeA - timeB;
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const doctorId = searchParams.get("doctorId");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sortBy = searchParams.get("sortBy") || "endAt";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const cursor = searchParams.get("cursor");

  if (!doctorId) {
    return NextResponse.json({ code: 400, message: "Missing doctorId" }, { status: 400 });
  }

  if (!VALID_SORT_FIELDS.includes(sortBy)) {
    return NextResponse.json({ code: 400, message: "Invalid sortBy field" }, { status: 400 });
  }

  // 过滤指定医生的数据
  let data = mockAppointments.filter((a) => a.doctor.id === doctorId);

  // 排序
  data = sortAppointments(data, sortBy, sortOrder);

  // 游标分页
  if (cursor) {
    const cursorTime = new Date(cursor).getTime();
    data = data.filter((a) => {
      const value = new Date((a as Record<string, any>)[sortBy]).getTime();
      return sortOrder === "asc" ? value > cursorTime : value < cursorTime;
    });
  }

  // 取出分页数据
  const page = data.slice(0, limit);
  const lastItem = page[page.length - 1];

  return NextResponse.json({
    code: 200,
    message: "Mock appointments",
    data: {
      appointments: page,
      nextCursor: lastItem ? (lastItem as Record<string, any>)[sortBy] : null,
    },
  });
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const startMonth = url.searchParams.get("startMonth");
  const endMonth = url.searchParams.get("endMonth");
  const clinicId = url.searchParams.get("clinicId");

  const startDateISO = convertToISO8601(startMonth);
  const endDateISO = convertToISO8601(endMonth);

  try {
    const headers = {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    };

    const [appointments, appointmentsPerDoctor] = await Promise.all([
      fetch(
        `${BACKEND_API}/meta/appointment/trends?startAt=${startDateISO}&endAt=${endDateISO}&clinicId=${clinicId}`,
        { headers }
      ),
      fetch(
        `${BACKEND_API}/meta/appointment/per-doctor-month?startAt=${startDateISO}&endAt=${endDateISO}`,
        {
          headers,
        }
      ),
    ]);

    if (!appointments.ok || !appointmentsPerDoctor.ok) {
      return NextResponse.json(
        { error: "One or both resources failed to load." },
        { status: 500 }
      );
    }

    const appointmentsData = await appointments.json();
    const perDoctorData = await appointmentsPerDoctor.json();

    const mergedData = {
      ...appointmentsData.data,
      perDoctorData: perDoctorData.data,
    };
    return NextResponse.json({ data: mergedData, status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trends",},
      { status: 500 }
    );
  }
}

function convertToISO8601(month: string | null): string | null {
  if (!month) return null; // 如果没有传递参数，则返回 null

  const [year, monthNumber] = month.split("-"); // 分解成 year 和 month
  const date = new Date(Date.UTC(+year, +monthNumber - 1, 1, 8, 0, 0)); // 设置为每个月的1号，08:00:00 UTC 时间

  return date.toISOString(); // 返回完整的 ISO 8601 格式字符串
}

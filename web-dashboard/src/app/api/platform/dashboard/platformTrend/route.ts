import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dayjs from "dayjs";

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

  try {
    const res = await fetch(
      `${BACKEND_API}/meta/user/trends?startMonth=${startMonth}&endMonth=${endMonth}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", res.status, errText);
      return new Response("Backend Error", { status: res.status });
    }

    const data = await res.json();
    const { clinicTrend, doctorTrend } = formatPlatformTrends(
      data.data.platformtrends
    );
    return NextResponse.json({ clinicTrend, doctorTrend });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPlatformTrends(platformtrends: any[]) {
  const clinicTrend = platformtrends.map((item) => ({
    month: item.month,
    clinicCount: item.clinicCount,
  }));

  const doctorTrend = platformtrends.map((item) => ({
    month: item.month,
    doctorCount: item.doctorCount,
  }));

  clinicTrend.sort((a, b) => dayjs(a.month).diff(dayjs(b.month)));
  doctorTrend.sort((a, b) => dayjs(a.month).diff(dayjs(b.month)));

  return { clinicTrend, doctorTrend };
}

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

  try {
    const res = await fetch(`${BACKEND_API}/dashboard/clinic/doctorRank`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", res.status, errText);
      return new Response("Backend Error", { status: res.status });
    }

    const data = await res.json();
    const ranks = data.data.ranks
      .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
      .map((item: { doctorName: string; count: number }, index: number) => ({
        rank: index + 1,
        doctorName: item.doctorName,
        count: item.count,
      }));
    return NextResponse.json({ data: ranks });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch ranks" },
      { status: 500 }
    );
  }
}

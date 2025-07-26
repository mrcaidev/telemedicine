import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get("appointmentId");
  const body = await request.json();

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${appointmentId}/request-reschedule`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

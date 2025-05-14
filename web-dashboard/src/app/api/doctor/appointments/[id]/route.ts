import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = session.user.id;
  const token = session.user.token;
  const { id } = await params;
  const appointmentId = id;

  try {
    const response = await fetch(
      `${BACKEND_API}/appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 可选：检查是否属于该 doctor
    if (data?.doctor?.id && data.doctor.id !== doctorId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointment detail:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

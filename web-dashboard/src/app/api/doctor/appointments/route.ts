import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RawAppointment } from "@/types/appointment";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const VALID_SORT_FIELDS = ["startAt", "endAt", "createdAt"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json(
      { code: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const doctorId = session.user.id;
  const token = session.user.token;

  if (!req.url.startsWith("http")) {
    throw new Error("req.url must be an absolute URL");
  }
  
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get("cursor");
  const limit = searchParams.get("limit") || "10";
  const sortBy = searchParams.get("sortBy") || "endAt";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : "endAt";

  const backendUrl = new URL(`${BACKEND_API}/appointments`);
  backendUrl.searchParams.append("doctorId", doctorId);
  backendUrl.searchParams.append("limit", limit);
  backendUrl.searchParams.append("sortBy", safeSortBy);
  backendUrl.searchParams.append("sortOrder", sortOrder);
  if (cursor && safeSortBy === "endAt")
    backendUrl.searchParams.append("cursor", cursor);

  try {
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Backend Error]", errorText);
      return NextResponse.json(
        { code: response.status, message: "Backend Error" },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result || !result.data || !Array.isArray(result.data.appointments)) {
      console.error("[Format Error]", result);
      return NextResponse.json({
        code: 500,
        message: "Invalid response format from backend",
      });
    }

    const appointments: RawAppointment[] = result.data.appointments;

    appointments.sort((a, b) => {
      const timeA = new Date(
        a[safeSortBy as keyof RawAppointment] as string
      ).getTime();
      const timeB = new Date(
        b[safeSortBy as keyof RawAppointment] as string
      ).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return NextResponse.json({
      code: 200,
      message: "Success",
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({
      code: 500,
      message: "Internal Server Error",
      error,
    });
  }
}

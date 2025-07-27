import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = session.user.token;

  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();

  try {
    const response = await fetch(`${BACKEND_API}/medical-records?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient detail:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  console.log("Creating medical record with body:", body);

  const res = await fetch(`${BACKEND_API}/medical-records`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ message: "Create failed", error: data }, { status: res.status });
  }

  return NextResponse.json({ message: "OK", data });
}

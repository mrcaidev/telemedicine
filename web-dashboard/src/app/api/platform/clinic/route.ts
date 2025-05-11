import { NextRequest, NextResponse } from "next/server";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_API}/clinics`);
    const data = await res.json();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch clinics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_API}/clinics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Create clinic failed" },
      { status: 500 }
    );
  }
}

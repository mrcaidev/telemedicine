import { NextRequest, NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${BACKEND_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}
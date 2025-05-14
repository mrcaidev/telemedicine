import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_API}/clinics`, {
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
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_API}/clinics`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", res.status, errText);
      return new Response("Backend Error", { status: res.status });
    }
    
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

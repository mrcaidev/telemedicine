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
    const res = await fetch(`${BACKEND_API}/medications?limit=999`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch reference data");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching reference data:", error);
    return NextResponse.json(
      { error: "Failed to fetch reference data" },
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
    const res = await fetch(`${BACKEND_API}/medications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Failed to create medication");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating medication:", error);
    return NextResponse.json(
      { error: "Failed to create medication" },
      { status: 500 }
    );
  }
}

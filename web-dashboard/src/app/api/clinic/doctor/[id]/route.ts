import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const headers = {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    };

    const [doctorRes, timesRes] = await Promise.all([
      fetch(`${BACKEND_API}/doctors/${id}`, { headers }),
      fetch(`${BACKEND_API}/doctor-availabilities/${id}`, {
        headers,
      }),
    ]);

    if (!doctorRes.ok || !timesRes.ok) {
      return NextResponse.json(
        { error: "One or both resources failed to load." },
        { status: 500 }
      );
    }

    const doctorData = await doctorRes.json();
    const timeData = await timesRes.json();

    const merged = {
      ...doctorData.data,
      availableTimes: timeData.data,
    };

    return NextResponse.json(merged, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Get doctor failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const body = await req.json();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_API}/doctors/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Update doctor failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_API}/doctors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error();

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

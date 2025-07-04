import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

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
    const res = await fetch(`${BACKEND_API}/clinics/${id}`, {
      method: "PATCH",
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

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Update clinic failed" },
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
    const res = await fetch(`${BACKEND_API}/clinics/${id}`, {
      method: "DELETE",
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

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();

  const { code } = await params;
  if (!code) {
    return NextResponse.json(
      { error: "Code parameter is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_API}/medications/${code}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error updating reference data:", error);
    return NextResponse.json(
      { error: "Failed to update reference data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { code } = await params;
  if (!code) {
    return NextResponse.json(
      { error: "Code parameter is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_API}/medications/${code}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete reference data");
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting reference data:", error);
    return NextResponse.json(
      { error: "Failed to delete reference data" },
      { status: 500 }
    );
  }
}

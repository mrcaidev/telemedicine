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

  const token = session.user.token;
  const { id } = await params;
  const recordId = id;

  try {
    const response = await fetch(`${BACKEND_API}/medical-records/${recordId}`, {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = session.user.token;
  const { id } = await params;
  const recordId = id;

  try {
    const body = await req.json();

    console.log("Updating record...");
    console.log("Request body:", body);
    const response = await fetch(`${BACKEND_API}/medical-records/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to update record");
    }

    const updatedRecord = await response.json();

    return NextResponse.json(
      { updatedRecord },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "doctor") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = session.user.token;
  const { id } = await params;
  const recordId = id;

  try {
    const response = await fetch(`${BACKEND_API}/medical-records/${recordId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete record");
    }

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

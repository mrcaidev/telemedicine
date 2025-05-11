import { NextRequest, NextResponse } from "next/server";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_API}/clinics/${id}/clinic-admins`);
    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch clinics" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const clinicId = params.id;
  const body = await req.json();

  const payload = {
    ...body,
    role: "clinic_admin",
    clinicId,
  };

  try {
    const res = await fetch(`${BACKEND_API}/clinic-admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to create clinic admin" },
      { status: 500 }
    );
  }
}

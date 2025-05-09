import { NextRequest, NextResponse } from "next/server";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_API}/doctors`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_API}/doctors/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_API}/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "Create doctor failed" }, { status: 500 });
  }
}

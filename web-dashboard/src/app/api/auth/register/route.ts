import { NextRequest, NextResponse } from "next/server";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Mocking the request for demonstration purposes
  // In a real-world scenario, you would send this to your backend API
  console.log("🔍 Mock register request:", body);

  if (body.email === "existing@example.com") {
    return new NextResponse("Email already registered", { status: 400 });
  }

  return new NextResponse("Mocked: User registered", { status: 200 });

  // Uncomment the following code to send the request to the backend API
  
  try {
    const res = await fetch(`${BACKEND_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}

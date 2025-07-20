import {  NextResponse } from "next/server";
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
    const headers = {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    };

    const [appointmentStats, platformStats] = await Promise.all([
      fetch(`${BACKEND_API}/meta/appointment/totals`, { headers }),
      fetch(`${BACKEND_API}/meta/user/totals`, { headers }),
    ]);

    if (!appointmentStats.ok || !platformStats.ok) {
      return NextResponse.json(
        { error: "One or both resources failed to load." },
        { status: 500 }
      );
    }

    const appointmentsData = await appointmentStats.json();
    const platformData = await platformStats.json();

    console.log("Appointments Data:", appointmentsData);
    console.log("Platform Data:", platformData);

    const data = {
      totalAppointments: appointmentsData.data.totalAppointments,
      totalClinics: platformData.data.totalClinics,
      totalDoctors: platformData.data.totalDoctors,
    };
    return NextResponse.json({ data });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const startMonth = url.searchParams.get("startMonth");
  const endMonth = url.searchParams.get("endMonth");

  try {
    const headers = {
      Authorization: `Bearer ${session.user.token}`,
      "Content-Type": "application/json",
    };

    const [appointments, appointmentsPerDoctor, appointmentsPerSymptom] =
      await Promise.all([
        fetch(
          `${BACKEND_API}/dashboard/clinic/appointments?startMonth=${startMonth}&endMonth=${endMonth}`,
          { headers }
        ),
        fetch(
          `${BACKEND_API}/dashboard/clinic/appointmentsPerDoctor?startMonth=${startMonth}&endMonth=${endMonth}`,
          {
            headers,
          }
        ),
        fetch(
          `${BACKEND_API}/dashboard/clinic/appointmentsPerSymptom?startMonth=${startMonth}&endMonth=${endMonth}`,
          {
            headers,
          }
        ),
      ]);

    if (
      !appointments.ok ||
      !appointmentsPerDoctor.ok ||
      !appointmentsPerSymptom.ok
    ) {
      return NextResponse.json(
        { error: "One or both resources failed to load." },
        { status: 500 }
      );
    }

    const appointmentsData = await appointments.json();
    const perDoctorData = await appointmentsPerDoctor.json();
    const perSymptomData = await appointmentsPerSymptom.json();

    const mergedData = {
      ...appointmentsData.data,
      perDoctorData: perDoctorData.data,
      perSymptomData: perSymptomData.data,
    };
    return NextResponse.json({ data: mergedData, status: 200 });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}

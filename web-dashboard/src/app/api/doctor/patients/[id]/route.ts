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
  const patientId = id;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const patientRes = await fetch(`${BACKEND_API}/patients/${patientId}`, {
      headers,
    });

    if (!patientRes.ok) {
      return NextResponse.json({ message: "Failed to fetch patient" }, { status: 500 });
    }

    const data = await patientRes.json();

    // const [patientRes, medicalRecordsRes] = await Promise.all([
    //   fetch(`${BACKEND_API}/patients/${patientId}`, { headers }),
    //   fetch(`${BACKEND_API}/medical-records?patientId=${patientId}`, { headers }),
    // ]);

    // if (!patientRes.ok || !medicalRecordsRes.ok) {
    //   return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    // }

    // const patientData = await patientRes.json();
    // const medicalRecordsData = await medicalRecordsRes.json();

    // const data = {
    //   ...patientData.data,
    //   medicalRecords: medicalRecordsData.data,
    // };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient detail:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

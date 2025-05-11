import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stats: {
      totalAppointments: 1234,
      pendingDoctors: 3,
      doctorCount: 12,
    },
    appointmentTrendData: [
      { month: "Jan", count: 123 },
      { month: "Feb", count: 211 },
      { month: "Mar", count: 189 },
    ],
    perDoctorData: [
      { month: "Jan", DrLee: 50, DrWang: 73 },
      { month: "Feb", DrLee: 80, DrWang: 131 },
    ],
    perSymptomData: [
      { symptom: "Fever", count: 78 },
      { symptom: "Cough", count: 65 },
      { symptom: "Fatigue", count: 53 },
    ],
    doctorRanking: [
      { rank: 1, doctor: "Dr.Lee", count: 126 },
      { rank: 2, doctor: "Dr.Wang", count: 109 },
    ],
  });
}

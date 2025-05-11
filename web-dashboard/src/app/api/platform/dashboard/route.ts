import { NextResponse } from "next/server";

export async function GET() {
  const stats = {
    totalAppointments: 1280,
    totalClinics: 12,
    totalClinicAdmins: 12,
  };

  const clinicTrend = [
    { month: "Jan", count: 8 },
    { month: "Feb", count: 10 },
    { month: "Mar", count: 12 },
    { month: "Apr", count: 12 },
  ];

  const doctorTrend = [
    { month: "Jan", count: 20 },
    { month: "Feb", count: 26 },
    { month: "Mar", count: 30 },
    { month: "Apr", count: 34 },
  ];

  const clinicRanking = [
    { rank: 1, clinic: "Sunrise Clinic", doctorCount: 6 },
    { rank: 2, clinic: "HealthFirst", doctorCount: 5 },
    { rank: 3, clinic: "WellCare SG", doctorCount: 5 },
    { rank: 4, clinic: "MediPlus", doctorCount: 4 },
    { rank: 5, clinic: "QuickHealth", doctorCount: 4 },
  ];

  return NextResponse.json({
    stats,
    clinicTrend,
    doctorTrend,
    clinicRanking,
  });
}

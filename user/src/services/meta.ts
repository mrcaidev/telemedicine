import * as metaRepository from "@/repositories/meta";

export async function findTotals() {
  const userTotals = await metaRepository.countUsers();
  const clinicTotal = await metaRepository.countClinics();
  return {
    totalPlatformAdmins:
      userTotals.find((row) => row.role === "platform_admin")?.total || 0,
    totalClinicAdmins:
      userTotals.find((row) => row.role === "clinic_admin")?.total || 0,
    totalDoctors: userTotals.find((row) => row.role === "doctor")?.total || 0,
    totalPatients: userTotals.find((row) => row.role === "patient")?.total || 0,
    totalClinics: clinicTotal,
  };
}

export async function findTrends() {
  const trends = await metaRepository.countClinicsAndDoctorsByMonth();
  return trends;
}

export async function rankClinics() {
  const clinicRanks = await metaRepository.rankClinics();
  return clinicRanks;
}

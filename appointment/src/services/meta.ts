import * as metaRepository from "@/repositories/meta";

export async function countAppointments() {
  const total = await metaRepository.countAppointments();
  return total;
}

export async function findClinicAppointmentTrends(
  clinicId: string,
  timeRange: { startAt: string; endAt: string },
) {
  const trends = await metaRepository.countClinicAppointmentsByMonth(
    clinicId,
    timeRange,
  );
  return trends;
}

export async function findDoctorAppointmentTrends(
  doctorId: string,
  timeRange: { startAt: string; endAt: string },
) {
  const trends = await metaRepository.countDoctorAppointmentsByMonth(
    doctorId,
    timeRange,
  );
  return trends;
}

export async function findClinicStats(clinicId: string) {
  const stats = await metaRepository.selectClinicStats(clinicId);
  return stats;
}

export async function findDoctorStats(clinicId: string) {
  const stats = await metaRepository.selectDoctorStats(clinicId);
  return stats;
}

export async function findClinicAppointmentsGroupByDoctors(
  clinicId: string,
  timeRange: { startAt: string; endAt: string },
) {
  const appointments =
    await metaRepository.selectClinicAppointmentsGroupByDoctors(
      clinicId,
      timeRange,
    );
  return appointments;
}

export async function rankDoctorsByAppointmentCount(clinicId: string) {
  const ranks = await metaRepository.rankDoctorsByAppointmentCount(clinicId);
  return ranks;
}

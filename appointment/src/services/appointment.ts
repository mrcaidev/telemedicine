import * as appointmentRepository from "@/repositories/appointment";
import type { AppointmentStatus, Role } from "@/utils/types";

export async function findAll(
  options: {
    status?: AppointmentStatus;
    sortBy: "startAt" | "endAt";
    sortOrder: "asc" | "desc";
    limit: number;
    cursor: string | null;
  },
  user: { id: string; role: Role },
) {
  const appointments = await appointmentRepository.findAll({
    ...options,
    ...(user.role === "patient" && { patientId: user.id }),
    ...(user.role === "doctor" && { doctorId: user.id }),
  });

  const nextCursor =
    appointments.length < options.limit
      ? null
      : appointments[appointments.length - 1]?.[options.sortBy];

  return { appointments, nextCursor } as const;
}

import type { Doctor, DoctorAvailability } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { request } from "./request";

export function useDoctorQuery(id: string) {
  return useQuery<Doctor>({
    queryKey: ["doctor", id],
    queryFn: async () => {
      return await request.get(`/doctors/${id}`);
    },
  });
}

export function useDoctorAvailabilitiesQuery(doctorId: string) {
  return useQuery<DoctorAvailability[]>({
    queryKey: ["doctor", doctorId, "availabilities"],
    queryFn: async () => {
      return await request.get(`/doctor-availabilities/${doctorId}`);
    },
  });
}

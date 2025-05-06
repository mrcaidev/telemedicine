import type { Doctor, DoctorAvailability } from "@/utils/types";
import {
  type QueryKey,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
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

export function useDoctorSearchQuery(q: string) {
  return useInfiniteQuery<
    {
      doctors: Omit<Doctor, "role" | "email">[];
      nextCursor: number | null;
    },
    Error,
    Omit<Doctor, "role" | "email">[],
    QueryKey,
    number | null
  >({
    queryKey: ["doctors", q],
    queryFn: async ({ pageParam: cursor }) => {
      const params = new URLSearchParams({
        q,
        limit: String(10),
        ...(cursor === null ? {} : { cursor: String(cursor) }),
      });
      return await request.get(`/doctors/search?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => data.pages.flatMap((page) => page.doctors),
  });
}

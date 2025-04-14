import type { Appointment } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { request } from "./request";

type UseAppointmentsQueryOptions = {
  limit?: number;
  cursor?: string;
  sortBy?: "date";
  sortOrder?: "asc" | "desc";
};

export function useAppointmentsQuery(
  options: UseAppointmentsQueryOptions = {},
) {
  const { limit = 10, cursor, sortBy = "date", sortOrder = "asc" } = options;

  return useQuery<Appointment[]>({
    queryKey: ["appointment", { limit, cursor, sortBy, sortOrder }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("limit", String(limit));
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);
      if (cursor) {
        params.append("cursor", cursor);
      }
      return await request.get(`/appointments?${params}`);
    },
  });
}

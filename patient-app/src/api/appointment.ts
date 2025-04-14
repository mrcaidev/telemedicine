import type { Appointment } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { request } from "./request";

type UseAppointmentsQueryOptions = {
  limit?: number;
  after?: string;
};

export function useAppointmentsQuery(
  options: UseAppointmentsQueryOptions = {},
) {
  const { limit = 10, after } = options;

  return useQuery<Appointment[]>({
    queryKey: ["appointment", { limit, after }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("limit", String(limit));
      if (after) {
        params.append("after", after);
      }
      return await request.get(`/appointments?${params}`);
    },
  });
}

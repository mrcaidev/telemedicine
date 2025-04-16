import type { Appointment } from "@/utils/types";
import {
  type QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "./request";

type UseAppointmentsInfiniteQueryOptions = {
  limit?: number;
  sortBy?: "startAt" | "endAt";
  sortOrder?: "asc" | "desc";
};

export function useAppointmentsInfiniteQuery(
  options: UseAppointmentsInfiniteQueryOptions = {},
) {
  const { limit = 10, sortBy = "endAt", sortOrder = "asc" } = options;

  return useInfiniteQuery<
    { appointments: Appointment[]; nextCursor: string | null },
    Error,
    Appointment[],
    QueryKey,
    string | null
  >({
    queryKey: ["appointments", { limit, sortBy, sortOrder }],
    queryFn: async ({ pageParam: cursor }) => {
      const params = new URLSearchParams({
        limit: String(limit),
        sortBy,
        sortOrder,
        ...(cursor && { cursor }),
      });
      return await request.get(`/appointments?${params}`);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => data.pages.flatMap((page) => page.appointments),
  });
}

export function useAppointmentQuery(id: string) {
  return useQuery<Appointment>({
    queryKey: ["appointment", id],
    queryFn: async () => {
      return await request.get(`/appointments/${id}`);
    },
  });
}

export function useCancelAppointmentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<null, Error, void>({
    mutationFn: async () => {
      return await request.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
  });
}

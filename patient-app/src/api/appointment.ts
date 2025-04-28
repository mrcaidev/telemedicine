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

export function useBookAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Appointment,
    Error,
    { availabilityId: string; remark: string }
  >({
    mutationFn: async (variables) => {
      return await request.post("/appointments", variables);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Appointment>(["appointment", data.id], data);
    },
  });
}

export function useCancelAppointmentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Appointment,
    Error,
    void,
    { snapshot: Appointment | undefined }
  >({
    mutationFn: async () => {
      return await request.post(`/appointments/${id}/cancel`);
    },
    onMutate: async () => {
      // 防止乐观更新被刚到达的旧请求覆盖。
      await queryClient.cancelQueries({ queryKey: ["appointment", id] });

      // 拍摄旧数据快照。
      const snapshot = queryClient.getQueryData<Appointment>([
        "appointment",
        id,
      ]);

      // 乐观更新。
      queryClient.setQueryData<Appointment>(["appointment", id], (snapshot) => {
        if (!snapshot) {
          return undefined;
        }
        return { ...snapshot, status: "cancelled" };
      });

      // 暂存旧数据快照。
      return { snapshot };
    },
    onSuccess: (data) => {
      // 将乐观更新替换为真实数据。
      queryClient.setQueryData<Appointment>(["appointment", id], data);

      // 更新预约列表有点麻烦，直接丢弃所有缓存拉倒。
      // TODO：可以考虑给预约列表也做一下乐观更新。https://github.com/TanStack/query/discussions/848
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (_, __, context) => {
      // 如果找不到快照，就没法回滚，算了。
      if (!context?.snapshot) {
        return;
      }

      // 回滚到旧数据快照。
      queryClient.setQueryData<Appointment>(
        ["appointment", id],
        context.snapshot,
      );
    },
  });
}

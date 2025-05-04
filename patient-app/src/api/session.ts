import type { ChatSession } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useSessionsQuery() {
  return useQuery<Omit<ChatSession, "history">[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      return await request.get("/sessions");
    },
  });
}

export function useActiveSessionQuery() {
  return useQuery<{ id: string | null }>({
    queryKey: ["active-session"],
    queryFn: async () => {
      return await request.get("/sessions/active");
    },
  });
}

export function useSessionQuery(id: string) {
  return useQuery<ChatSession>({
    queryKey: ["session", id],
    queryFn: async () => {
      return await request.get(`/sessions/${id}`);
    },
  });
}

export function useStartSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation<ChatSession>({
    mutationFn: async () => {
      return await request.post("/sessions");
    },
    onSuccess: (data) => {
      queryClient.setQueryData<{ id: string | null }>(["active-session"], {
        id: data.id,
      });
      queryClient.setQueryData<ChatSession>(["session", data.id], data);
    },
  });
}

import type { ChatEvaluation, ChatMessage, ChatSession } from "@/utils/types";
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

export function useSendMessageMutation(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    | ({ type: "message" } & ChatMessage)
    | ({ type: "evaluation" } & ChatEvaluation),
    Error,
    { content: string }
  >({
    mutationFn: async (variables) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await request.post(`/sessions/${sessionId}/chat`, variables);
    },
    // 用户发出消息后，马上把这条用户消息加入会话的消息列表。
    onMutate: (variables) => {
      queryClient.setQueryData<ChatSession>(
        ["session", sessionId],
        (oldSession) => {
          if (!oldSession) {
            return oldSession;
          }
          return {
            ...oldSession,
            history: [...oldSession.history, { role: "user", ...variables }],
          };
        },
      );
    },
    // AI 回复消息后，分情况更新会话。
    onSuccess: (data) => {
      queryClient.setQueryData<ChatSession>(
        ["session", sessionId],
        (oldSession) => {
          if (!oldSession) {
            return oldSession;
          }
          // 如果回复的是普通消息，就加入会话的消息列表。
          if (data.type === "message") {
            const { type, ...message } = data;
            return {
              ...oldSession,
              history: [...oldSession.history, message],
            };
          }
          // 如果回复的是评估结果，就更新会话的评估结果。
          if (data.type === "evaluation") {
            const { type, ...evaluation } = data;
            return {
              ...oldSession,
              evaluation,
            };
          }
          // 按理来说没有其它消息类型了。要是走到这一步，说明肯定哪里出错了。
          console.error(`Unrecognized reply format: ${data}`);
          return oldSession;
        },
      );
    },
  });
}

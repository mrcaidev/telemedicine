import { tokenStore } from "@/utils/secure-store";
import type { Patient } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useMeQuery() {
  return useQuery<Patient>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/auth/me");
    },
  });
}

export function useLogInWithEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient & { token: string },
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (variables) => {
      return await request.post("/auth/login", variables);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStore.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useLogInWithGoogleMutation() {
  const queryClient = useQueryClient();

  return useMutation<Patient & { token: string }, Error, { idToken: string }>({
    mutationFn: async (variables) => {
      return await request.post("/oauth/google/login", variables);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStore.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useLogOutMutation() {
  const queryClient = useQueryClient();

  return useMutation<null, Error, void>({
    mutationFn: async () => {
      return await request.post("/auth/logout");
    },
    onSuccess: async () => {
      await tokenStore.remove();

      queryClient.cancelQueries();
      queryClient.clear();
    },
  });
}

export function useSendOtpMutation() {
  return useMutation<null, Error, { email: string }>({
    mutationFn: async (variables) => {
      return await request.post("/otp", variables);
    },
  });
}

export function useUpdateEmailMutation() {
  return useMutation<null, Error, { email: string; otp: string }>({
    mutationFn: async (variables) => {
      return await request.put("/auth/me/email", variables);
    },
    // onSuccess 什么也不用干，因为更新邮箱后必须强制登出，
    // 登出时反正会把所有缓存都清除。
  });
}

export function useUpdatePasswordMutation() {
  return useMutation<null, Error, { oldPassword: string; newPassword: string }>(
    {
      mutationFn: async (variables) => {
        return await request.put("/auth/me/password", variables);
      },
      // onSuccess 什么也不用干，因为更新密码不会影响任何缓存。
    },
  );
}

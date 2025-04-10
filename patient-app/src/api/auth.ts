import { tokenStore } from "@/utils/secure-store";
import type { Patient } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useMeQuery() {
  return useQuery<Patient>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/me");
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
      return await request.post("/login", variables);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStore.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
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

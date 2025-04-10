import { tokenStore } from "@/utils/secure-store";
import type { Patient } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useCreatePatientMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Patient & { token: string },
    Error,
    { email: string; password: string; otp: string }
  >({
    mutationFn: async (variables) => {
      return await request.post("/patients", variables);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStore.setItem(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

import { tokenStore } from "@/utils/secure-store";
import type { Patient } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";
import { useMeQuery } from "./auth";

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
      await tokenStore.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useUpdatePatientMutation() {
  const { data: me } = useMeQuery();

  const queryClient = useQueryClient();

  return useMutation<
    Patient,
    Error,
    Partial<Pick<Patient, "nickname" | "gender" | "birthDate">>
  >({
    mutationFn: async (variables) => {
      return await request.patch(`/patients/${me!.id}`, variables);
    },
    onSuccess: (data) => {
      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], data);
    },
  });
}

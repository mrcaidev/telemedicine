import type { Patient } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "./request";

export function useMeQuery() {
  return useQuery<Patient>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/me");
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

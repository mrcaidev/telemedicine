import { useMutation } from "@tanstack/react-query";
import { request } from "./request";

export function useSendOtpMutation() {
  return useMutation<null, Error, { email: string }>({
    mutationFn: async (variables) => {
      return await request.post("/otp", variables);
    },
  });
}

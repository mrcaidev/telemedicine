import { useMutation } from "@tanstack/react-query";

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      return await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    },
  });
}

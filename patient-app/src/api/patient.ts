import { devSleep } from "@/utils/dev";
import type { Patient } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";

const mockPatient: Patient = {
  id: "ea0c3f1c-b3f4-4299-a3a4-598c49605a6c",
  email: "mock@example.com",
  nickname: "Mock",
  avatarUrl: null,
  gender: "male",
  birthDate: "1987-06-05",
  createdAt: "2025-04-10T14:58:28.020Z",
};

export function useCreatePatientMutation() {
  return useMutation<
    Patient & { token: string },
    Error,
    { email: string; password: string; otp: string }
  >({
    mutationFn: async (variables) => {
      await devSleep(1000);
      return { ...mockPatient, token: "mock-jwt" };
    },
  });
}

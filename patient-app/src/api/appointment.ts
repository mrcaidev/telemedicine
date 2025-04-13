import type { Appointment } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useUpcomingAppointmentQuery() {
  return useQuery({
    queryKey: ["appointment", "upcoming"],
    queryFn: () => {
      return {
        id: "7d6f6577-98b5-45e4-9636-9affc2e02e45",
        patient: {
          id: "756cc974-6d5f-4013-9ced-c45776582362",
          email: "patient@example.com",
          nickname: "John Doe",
          avatarUrl: null,
          gender: "male",
          birthDate: "1990-01-01",
          createdAt: "2023-10-01T00:00:00Z",
        },
        doctor: {
          id: "1f0051a4-49ff-46c4-b91d-56ddf6554ad3",
          email: "doctor@example.com",
          firstName: "Jane",
          lastName: "Smith",
          avatarUrl: null,
          gender: "female",
          description: "Experienced physician with a passion for patient care.",
          specialties: ["Cardiology"],
          createdAt: "2023-10-01T01:00:00Z",
        },
        date: "2025-10-11",
        startTime: "18:00",
        endTime: "19:00",
        remark: "",
        status: "normal",
        createdAt: "2025-04-11T02:00:00Z",
      } as Appointment;
    },
  });
}

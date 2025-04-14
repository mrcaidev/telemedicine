import type { Appointment } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useUpcomingAppointmentQuery() {
  return useQuery({
    queryKey: ["appointment", "upcoming"],
    queryFn: () => {
      return {
        id: "1477e1db-7b92-44dc-9df0-e1fb1ac39b53",
        patient: {
          id: "756cc974-6d5f-4013-9ced-c45776582362",
          email: "patient@example.com",
          nickname: "Asha_Kuvalis",
          avatarUrl: "https://avatars.githubusercontent.com/u/78269445",
          gender: "female",
          birthDate: "2001-08-23",
          createdAt: "2025-04-10T05:41:12.219Z",
        },
        doctor: {
          id: "1f0051a4-49ff-46c4-b91d-56ddf6554ad3",
          email: "doctor@example.com",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: "https://avatars.githubusercontent.com/u/1024025",
          gender: "male",
          description: "Experienced physician with a passion for patient care.",
          specialties: ["Cardiology", "Dermatology"],
          createdAt: "2024-10-01T01:00:00Z",
        },
        date: "2025-4-15",
        startTime: "18:00",
        endTime: "19:00",
        remark:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "normal",
        createdAt: "2025-04-11T02:00:00Z",
      } as Appointment;
    },
  });
}

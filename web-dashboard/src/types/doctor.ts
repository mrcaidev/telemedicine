export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarURL: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
  createdAt: string;
  availableTimes: AvailableTime[];
}

export interface AvailableTime {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
}

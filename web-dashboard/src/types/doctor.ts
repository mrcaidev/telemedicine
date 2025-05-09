export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarURL: string | null;
  gender: "male" | "female";
  specialties: string[];
}

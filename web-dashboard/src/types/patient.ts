export interface RawPatient {
  id: string;
  nickname: string;
  avatarUrl?: string;
  role: "patient";
  email: string;
  gender: "male" | "female";
  birthDate?: string;
}
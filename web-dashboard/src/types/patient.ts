export interface RawPatient {
  id: string;
  nickname: string;
  avatarUrl?: string;
  role: "patient";
  email: string;
  gender: "male" | "female";
  birthDate?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  notes?: string;
  doctorName?: string;
}
export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

export type Gender = "male" | "female";

export type User = {
  id: string;
  role: Role;
  email: string;
  passwordHash: string | null;
};

export type PlatformAdmin = {
  id: string;
};

export type Clinic = {
  id: string;
  name: string;
};

export type ClinicAdmin = {
  id: string;
  clinic: Clinic;
  firstName: string;
  lastName: string;
};

export type Doctor = {
  id: string;
  clinic: Clinic;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender;
  description: string;
  specialties: string[];
};

export type Patient = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: Gender | null;
  birthDate: string | null;
};

export type WithFull<T extends PlatformAdmin | ClinicAdmin | Doctor | Patient> =
  Pick<User, "id" | "role" | "email"> & T;

export type OtpVerification = {
  id: string;
  email: string;
  otp: string;
  sentAt: string;
  verifiedAt: string | null;
};

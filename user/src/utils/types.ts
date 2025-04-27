export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

export type Gender = "male" | "female";

export type UserCommon = {
  id: string;
  role: Role;
  email: string;
  passwordHash: string | null;
};

export type PlatformAdmin = Pick<UserCommon, "id" | "role" | "email"> & {};

export type Clinic = {
  id: string;
  name: string;
};

export type ClinicAdmin = Pick<UserCommon, "id" | "role" | "email"> & {
  firstName: string;
  lastName: string;
  clinic: Clinic;
};

export type Doctor = Pick<UserCommon, "id" | "role" | "email"> & {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender;
  description: string;
  specialties: string[];
  clinic: Clinic;
};

export type Patient = Pick<UserCommon, "id" | "role" | "email"> & {
  nickname: string | null;
  avatarUrl: string | null;
  gender: Gender | null;
  birthDate: string | null;
};

export type User = PlatformAdmin | ClinicAdmin | Doctor | Patient;

export type OtpVerification = {
  id: string;
  email: string;
  otp: string;
  sentAt: string;
  verifiedAt: string | null;
};

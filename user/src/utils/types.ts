export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

export type Gender = "male" | "female";

export type UserCommon = {
  id: string;
  role: Role;
  email: string;
  passwordHash: string | null;
  passwordSalt: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type PlatformAdmin = UserCommon & {};

export type Clinic = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: PlatformAdmin["id"];
  deletedAt: string | null;
  deletedBy: PlatformAdmin["id"] | null;
};

export type ClinicAdmin = UserCommon & {
  clinicId: Clinic["id"];
  firstName: string;
  lastName: string;
  createdBy: PlatformAdmin["id"];
  deletedBy: PlatformAdmin["id"] | null;
};

export type Doctor = UserCommon & {
  clinicId: Clinic["id"];
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender;
  description: string;
  specialties: string[];
  createdBy: ClinicAdmin["id"];
  deletedBy: ClinicAdmin["id"] | null;
};

export type Patient = UserCommon & {
  nickname: string;
  avatarUrl: string | null;
  gender: Gender | null;
  birthDate: string | null;
};

export type OtpVerification = {
  id: string;
  email: string;
  otp: string;
  sentAt: string;
  verifiedAt: string | null;
};

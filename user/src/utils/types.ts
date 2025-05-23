export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type PartiallyRequired<T, K extends keyof T> = Prettify<
  Required<Pick<T, K>> & Partial<T>
>;

export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

export type Account = {
  id: string;
  role: Role;
  email: string;
  createdAt: string;
};

export type PrivateAccount = Prettify<
  Account & { passwordHash: string | null }
>;

export type Actor = Pick<Account, "id" | "role" | "email">;

export type PlatformAdminProfile = {
  id: string;
};

export type PlatformAdmin = Prettify<Account & PlatformAdminProfile>;

export type Clinic = {
  id: string;
  name: string;
  createdAt: string;
};

export type ClinicAdminProfile = {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
};

export type ClinicAdminFullProfile = Prettify<
  Omit<ClinicAdminProfile, "clinicId"> & { clinic: Clinic }
>;

export type ClinicAdmin = Prettify<Account & ClinicAdminFullProfile>;

export type Gender = "male" | "female";

export type DoctorProfile = {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender;
  description: string;
  specialties: string[];
};

export type DoctorFullProfile = Prettify<
  Omit<DoctorProfile, "clinicId"> & { clinic: Clinic }
>;

export type Doctor = Prettify<Account & DoctorFullProfile>;

export type PatientProfile = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: Gender | null;
  birthDate: string | null;
};

export type Patient = Prettify<Account & PatientProfile>;

export type Profile =
  | PlatformAdminProfile
  | ClinicAdminProfile
  | DoctorProfile
  | PatientProfile;

export type FullProfile =
  | PlatformAdminProfile
  | ClinicAdminFullProfile
  | DoctorFullProfile
  | PatientProfile;

export type User = PlatformAdmin | ClinicAdmin | Doctor | Patient;

export type OtpVerification = {
  id: string;
  email: string;
  otp: string;
  sentAt: string;
  verifiedAt: string | null;
};

export type GoogleIdentity = {
  id: string;
  userId: string;
  googleId: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  action:
    | "register_with_email_and_password"
    | "log_in_with_email_and_password"
    | "register_with_google"
    | "link_to_google"
    | "log_in_with_google"
    | "update_email"
    | "update_password"
    | "reset_password"
    | "log_out";
  createdAt: string;
};

export type User = {
  id: string;
  role: "platform_admin" | "clinic_admin" | "doctor" | "patient";
  email: string;
  passwordHash: string | null;
  passwordSalt: string | null;
  createdAt: string;
  createdBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type OtpVerification = {
  id: string;
  email: string;
  otp: string;
  sentAt: string;
  verifiedAt: string | null;
};

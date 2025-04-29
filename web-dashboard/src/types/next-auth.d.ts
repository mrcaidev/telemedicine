import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: "doctor" | "clinic_admin" | "platform_admin";
      token: string;
      avatarUrl?: string | null;
      clinicId?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "doctor" | "clinic_admin" | "platform_admin";
    token: string;
    avatarUrl?: string | null;
    clinicId?: string | null;
  }

  interface JWT {
    id: string;
    role: "doctor" | "clinic_admin" | "platform_admin";
    accessToken: string;
    avatarUrl?: string | null;
    clinicId?: string | null;
  }
}

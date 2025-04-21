import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: "DOCTOR" | "CLINIC" | "PLATFORM";
      token: string;
      avatar?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "DOCTOR" | "CLINIC" | "PLATFORM";
    token: string;
    avatar?: string | null;
  }

  interface JWT {
    id: string;
    role: "DOCTOR" | "CLINIC" | "PLATFORM";
    accessToken: string;
    avatar?: string | null;
  }
}

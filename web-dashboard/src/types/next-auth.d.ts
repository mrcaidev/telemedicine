import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "DOCTOR" | "PATIENT" | "CLINIC" | "PLATFORM"; // 你定义的角色
    };
  }

  interface User {
    role?: "DOCTOR" | "PATIENT" | "CLINIC" | "PLATFORM";
  }

  interface JWT {
    role?: "DOCTOR" | "PATIENT" | "CLINIC" | "PLATFORM";
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

  export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //Mocking a login request to the backend API
        // if (credentials?.email === "doctor@test.com") {
        //   return {
        //     id: "1",
        //     email: "doctor@test.com",
        //     role: "DOCTOR",
        //     token: "mock-token",
        //     name: "Dr. Skywalker",
        //     avatar:
        //       "https://ui-avatars.com/api/?name=Dr+Shen&background=0D8ABC&color=fff",
        //   };
        // }

        // if (credentials?.email === "clinic@test.com") {
        //   return {
        //     id: "2",
        //     email: "clinic@test.com",
        //     role: "CLINIC",
        //     token: "mock-token",
        //     name: "Clinic Admin",
        //     avatar:
        //       "https://ui-avatars.com/api/?name=Clinic+Admin&background=F59E0B&color=fff",
        //   };
        // }

        // if (credentials?.email === "platform@test.com") {
        //   return {
        //     id: "3",
        //     email: "platform@test.com",
        //     role: "PLATFORM",
        //     token: "mock-token",
        //     name: "Platform Admin",
        //     avatar:
        //       "https://ui-avatars.com/api/?name=Platform&background=10B981&color=fff",
        //   };
        // }

        // return null;
        //End Mocking
        const res = await fetch(`${BACKEND_API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const result = await res.json();

        const data = result.data;

        if (!res.ok || !data.token || !data.role) return null;

        return {
          id: data.id,
          email: data.email,
          name: `${data.firstName ?? ""} ${data.lastName ?? ""}`,
          role: data.role,
          token: data.token,
          avatar: data.avatarUrl ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "doctor" | "clinic_admin" | "platform_admin";
        session.user.token = token.accessToken as string;
        session.user.avatar = token.avatar as string | null;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

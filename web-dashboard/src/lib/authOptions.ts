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

        console.log(`[AUDIT] Login: ${data.email} at ${new Date().toISOString()}`);

        if (!res.ok || !data.token || !data.role) return null;

        return {
          id: data.id,
          email: data.email,
          name: `${data.firstName ?? "peter"} ${data.lastName ?? "griffin"}`,
          role: data.role,
          token: data.token,
          avatarUrl: data.avatarUrl ?? "/d.png",
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
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "doctor" | "clinic_admin" | "platform_admin";
        session.user.token = token.accessToken as string;
        session.user.avatarUrl = token.avatarUrl as string | null;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

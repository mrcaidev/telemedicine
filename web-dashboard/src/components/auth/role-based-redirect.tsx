"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleBasedRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session.user?.role;

      if (role === "DOCTOR") {
        router.push("/dashboard/doctor");
      } else if (role === "CLINIC") {
        router.push("/dashboard/clinic");
      } else if (role === "PLATFORM") {
        router.push("/dashboard/platform");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  return null;
}

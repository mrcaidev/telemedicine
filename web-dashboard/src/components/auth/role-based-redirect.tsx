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

      if (role === "doctor") {
        router.push("/dashboard/doctor");
      } else if (role === "clinic_admin") {
        router.push("/dashboard/clinic");
      } else if (role === "platform_admin") {
        router.push("/dashboard/platform");
      } else {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  return null;
}

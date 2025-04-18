// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("dummy_token");
    if (!token) router.push("/login");
  }, []);

  return <div className="p-6">Protected Dashboard - Welcome!</div>;
}
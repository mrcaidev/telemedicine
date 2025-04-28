"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function logout() {
  localStorage.removeItem("token");
  sessionStorage.clear();

  signOut({ callbackUrl: "/" });
}

export default function AuthMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <Button asChild className="cursor-pointer">
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  const user = session.user;
  const dashboardUrl =
    user?.role === "doctor"
      ? "/dashboard/doctor"
      : user?.role === "clinic_admin"
      ? "/dashboard/clinic"
      : user?.role === "platform_admin"
      ? "/dashboard/platform"
      : "/dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mt-2">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={dashboardUrl}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            logout;
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

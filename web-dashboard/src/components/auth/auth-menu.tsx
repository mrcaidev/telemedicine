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

export default function AuthMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <Button asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  const user = session.user;
  const dashboardUrl =
    user?.role === "DOCTOR"
      ? "/dashboard/doctor"
      : user?.role === "CLINIC"
      ? "/dashboard/clinic"
      : user?.role === "PLATFORM"
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
        <DropdownMenuItem asChild>
          <Link href={dashboardUrl}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

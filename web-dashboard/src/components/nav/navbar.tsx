"use client";

import { Button } from "@/components/ui/button";
import { Globe, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Sheetbar from "@/components/nav/sheetbar";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="w-full h-15 sticky top-0 z-10 bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center text-sm">
      {/* 左侧标题 */}
      {/* <div className="font-semibold text-lg text-blue-600">Telemedicine</div> */}
      <div className="flex items-center space-x-4">
        <Sheetbar />
        <Link
          href="/"
          className="text-blue-600 font-semibold text-lg hidden md:inline hover:underline"
        >
          Telemedicine
        </Link>
      </div>

      {/* 右侧功能区 */}
      <div className="flex items-center space-x-4 text-gray-700">
        {/* 语言切换 待增加*/}
        <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
          <Globe className="w-4 h-4" />
          <span>En</span>
        </div>

        {status === "authenticated" && user ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert(`Profile: ${user.name}`)}
              className="cursor-pointer hover:text-blue-600"
            >
              <User className="w-4 h-4" />
              {user.name ?? "User"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-2 cursor-pointer hover:text-blue-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

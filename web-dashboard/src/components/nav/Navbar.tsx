"use client";

import { Button } from "@/components/ui/button";
import { Globe, LogOut, User } from "lucide-react";
import Sheetbar from "@/components/nav/Sheetbar";

export default function Navbar() {
  return (
    <header className="w-full h-15 sticky top-0 z-10 bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center text-sm">
      {/* 左侧标题 */}
      {/* <div className="font-semibold text-lg text-blue-600">Telemedicine</div> */}
      <div className="flex items-center space-x-4">
        <Sheetbar />
        <span className="text-blue-600 font-semibold text-lg hidden md:inline">Telemedicine</span>
      </div>

      {/* 右侧功能区 */}
      <div className="flex items-center space-x-4 text-gray-700">
        {/* 语言切换 待增加*/}
        <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600">
          <Globe className="w-4 h-4" />
          <span>En</span>
        </div>

        {/* 用户菜单 */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Dr. Zhang</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("Profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Sign Out")}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert("Profile")}
            className="px-2"
          >
            <User className="w-4 h-4" />
            Dr. Zhang
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert("Sign Out")}
            className="px-2"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Home, Calendar, Users, CalendarClock } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const menu = [
  { label: "Dashboard", icon: Home, href: "/dashboard/doctor" },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/dashboard/doctor/appointments",
  },
  {
    label: "Schedule",
    icon: CalendarClock,
    href: "/dashboard/doctor/schedule",
  },

  { label: "Profile", icon: Users, href: "/dashboard/doctor/profile" },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen bg-white border-r px-4 py-6 hidden md:block fixed ">
      <nav className="space-y-2">
        {menu.map((item) => {
          const isActive =
            item.href === "/dashboard/doctor/appointments"
              ? pathname.startsWith("/dashboard/doctor/appointments") ||
                pathname.startsWith("/dashboard/doctor/patients")
              : pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md transition",
                "text-gray-700 hover:text-blue-600 hover:bg-gray-100",
                {
                  "bg-blue-100 text-blue-600 font-medium": isActive,
                }
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

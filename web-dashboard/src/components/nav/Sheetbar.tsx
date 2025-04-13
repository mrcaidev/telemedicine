"use client"

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"

const menu = [
  { label: "Home", href: "/dashboard/doctor" },
  { label: "Appointments", href: "/dashboard/doctor/appointments" },
  { label: "Patients", href: "/dashboard/doctor/patients" },
  { label: "Settings", href: "/dashboard/doctor/settings" },
]

export default function Sheetbar() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-4">
      <SheetTitle>Navgation Bar</SheetTitle>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "block px-3 py-2 rounded-md hover:bg-gray-100",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

import Link from "next/link"
import { Home, Calendar, Users } from "lucide-react"

const menu = [
  { label: "Home", icon: Home, href: "/dashboard/doctor" },
  { label: "Appointments", icon: Calendar, href: "/dashboard/doctor/appointments" },
  { label: "Patients", icon: Users, href: "/dashboard/doctor/patients" },
  // { label: "Settings", icon: Settings, href: "/dashboard/doctor/settings" },
]

export default function DoctorSidebar() {
  return (
    <aside className="w-56 h-screen bg-white border-r px-4 py-6 hidden md:block">
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md transition"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

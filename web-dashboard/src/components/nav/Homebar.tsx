"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
    const [open, setOpen] = useState(false)
  
    return (
      <header className="h-20 bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            TeleMedicine
          </Link>
  
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-blue-600">About us</Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600">Service Support</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact us</Link>
          </nav>
  
          {/* CTA */}
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
  
          {/* Mobile Menu Icon */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
  
        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
            <Link href="/about" className="block text-gray-700 hover:text-blue-600">About us</Link>
            <Link href="/services" className="block text-gray-700 hover:text-blue-600">Service Support</Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600">Contact us</Link>
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        )}
      </header>
    )
  }
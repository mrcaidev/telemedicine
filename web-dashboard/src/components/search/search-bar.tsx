'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative w-full h-10">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search for patient name or symptom..."
        className="pl-10 h-full"
      />
    </div>
  )
}
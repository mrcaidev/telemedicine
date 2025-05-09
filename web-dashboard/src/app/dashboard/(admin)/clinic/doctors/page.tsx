"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Doctor } from "@/types/doctor";

export default function ClinicDoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch("/api/clinic/doctor")
      .then((res) => res.json())
      .then((data) => setDoctors(data.data.doctors))
      .catch(() =>
        toast.error("Loading doctors failed", {
          description: "can't load doctors, please try again later.",
        })
      );
  }, []);

  const handleDelete = (id: string) => {
    fetch(`/api/clinic/doctor/${id}`, { method: "DELETE" })
      .then(() => {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
        toast("Deleted successfully", {
          description: "Doctor has been deleted successfully.",
        });
      })
      .catch(() => toast("Delete failed"));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Doctor Management</h1>
        <Button onClick={() => console.log("Add doctor")} className="gap-2 cursor-pointer">
          <Plus size={16} /> Add Doctor
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <Image
                    src={doctor.avatarURL || "/p.png"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    width={32}
                    height={32}
                  />
                </Avatar>
              </TableCell>
              <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.gender}</TableCell>
              <TableCell>{doctor.specialties.join(", ")}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => console.log("Edit", doctor)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => handleDelete(doctor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

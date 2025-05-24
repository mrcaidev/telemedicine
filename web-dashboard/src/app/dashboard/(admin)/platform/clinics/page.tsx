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
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Clinic } from "@/types/clinic";
import { ClinicFormDialog } from "@/components/dialog/clinic-form-dialog";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import Link from "next/link";

export default function PlatformClinicList() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch("/api/platform/clinic")
      .then((res) => res.json())
      .then((data) => setClinics(data.data.data))
      .catch(() =>
        toast.error("Failed to load clinics", {
          description: "Please try again later.",
        })
      );
  }, [refreshTrigger]);

  const refreshClinics = () => setRefreshTrigger((prev) => prev + 1);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/platform/clinic/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setClinics((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted successfully", {
        description: "Clinic has been deleted.",
      });
    } catch {
      toast.error("Delete failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Clinic Management</h1>

        <ClinicFormDialog onSuccess={refreshClinics}>
          <Button className="gap-2 cursor-pointer">
            <Plus size={16} /> Add Clinic
          </Button>
        </ClinicFormDialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Clinic Name</TableHead>
            <TableHead>Create At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics.map((clinic) => (
            <TableRow key={clinic.id}>
              <TableCell>
                <Link
                  href={`/dashboard/platform/clinics/${
                    clinic.id
                  }?name=${encodeURIComponent(clinic.name)}`}
                >
                  {clinic.name}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(clinic.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <ClinicFormDialog
                  defaultValues={clinic}
                  onSuccess={refreshClinics}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </ClinicFormDialog>
                <ConfirmDialog
                  onConfirm={() => handleDelete(clinic.id)}
                  description={`Are you sure you want to delete "${clinic.name}"? This action cannot be undone.`}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </ConfirmDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

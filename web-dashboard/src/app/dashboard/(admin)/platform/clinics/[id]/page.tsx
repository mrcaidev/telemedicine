"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
import { ClinicAdmin } from "@/types/clinic-admin";
import { ClinicAdminFormDialog } from "@/components/dialog/clinic-admin-form-dialog";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";

export default function ClinicDetailPage() {
  const { id } = useParams();
  const [admins, setAdmins] = useState<ClinicAdmin[]>([]);

  const searchParams = useSearchParams();
  const clinicName = searchParams.get("name") || "";

  useEffect(() => {
    fetch(`/api/platform/clinic-admin?clinicId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data.data.data);
      })
      .catch(() => {
        toast.error("Failed to load clinic admins");
      });
  }, [id]);

  const refreshAdmins = () => {
    fetch(`/api/platform/clinic-admin?clinicId=${id}`)
      .then((res) => res.json())
      .then((data) => setAdmins(data.data.data));
  };

  const handleDelete = async (adminId: string) => {
    try {
      const res = await fetch(`/api/platform/clinic-admin/${adminId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setAdmins((prev) => prev.filter((a) => a.id !== adminId));
      toast.success("Admin deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Clinic: {clinicName || " "}</h1>

        <ClinicAdminFormDialog
          clinicId={id as string}
          onSuccess={refreshAdmins}
        >
          <Button className="gap-2 cursor-pointer">
            <Plus size={16} /> Add Admin
          </Button>
        </ClinicAdminFormDialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <ClinicAdminFormDialog
                    defaultValues={admin}
                    clinicId={id as string}
                    onSuccess={refreshAdmins}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </ClinicAdminFormDialog>

                  <ConfirmDialog
                    onConfirm={() => handleDelete(admin.id)}
                    description={`Delete admin ${admin.firstName} ${admin.lastName}?`}
                  >
                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </ConfirmDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No admins found for this clinic.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const editSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

type CreateClinicAdminForm = z.infer<typeof createSchema>;
type EditClinicAdminForm = z.infer<typeof editSchema>;

type Props = {
  defaultValues?: EditClinicAdminForm & { id: string };
  clinicId: string;
  onSuccess: () => void;
  children: React.ReactNode;
};

export function ClinicAdminFormDialog({
  defaultValues,
  clinicId,
  onSuccess,
  children,
}: Props) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);

  const schema = isEdit ? editSchema : createSchema;

  const form = useForm<CreateClinicAdminForm | EditClinicAdminForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (
    values: CreateClinicAdminForm | EditClinicAdminForm
  ) => {
    const payload = isEdit
      ? values
      : {
          ...values,
          role: "clinic_admin",
          id: clinicId,
        };

    try {
      const res = await fetch(
        isEdit
          ? `/api/platform/clinic-admin/${defaultValues!.id}`
          : `/api/platform/clinic-admin?clinicId=${clinicId}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Admin updated" : "Admin created");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error(isEdit ? "Update failed" : "Create failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Admin" : "Add Admin"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {!isEdit && (
            <>
              <Input placeholder="Email" {...form.register("email")} />
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
            </>
          )}
          <Input placeholder="First Name" {...form.register("firstName")} />
          <Input placeholder="Last Name" {...form.register("lastName")} />
          <Button type="submit" className="w-full cursor-pointer">
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

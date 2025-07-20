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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// const specialtiesOptions = [
//   "Cardiology",
//   "Neurology",
//   "Pediatrics",
//   "Orthopedics",
//   "Dermatology",
// ]; // TODO: Replace with dynamic options

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

type Gender = z.infer<typeof editSchema>["gender"];

const editSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  gender: z.enum(["male", "female"]).optional(),
  description: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

type CreateDoctorForm = z.infer<typeof createSchema>;
type EditDoctorForm = z.infer<typeof editSchema>;

type DoctorFormDialogProps = {
  defaultValues?: EditDoctorForm & { id: string };
  onSuccess: () => void;
  children: React.ReactNode;
};

export function DoctorFormDialog({
  defaultValues,
  onSuccess,
  children,
}: DoctorFormDialogProps) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);

  const form = useForm<CreateDoctorForm | EditDoctorForm>({
    resolver: zodResolver(isEdit ? (editSchema as any) : (createSchema as any)), // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues,
  });

  const handleSubmit = async (values: CreateDoctorForm | EditDoctorForm) => {
    try {
      const payload = isEdit
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.keys(values).reduce((diff: any, key) => {
            const k = key as keyof EditDoctorForm;
            const editValues = values as EditDoctorForm;
            const newValue = editValues[k];
            const oldValue = defaultValues?.[k];

            const isEqual =
              Array.isArray(newValue) && Array.isArray(oldValue)
                ? JSON.stringify(newValue) === JSON.stringify(oldValue)
                : newValue === oldValue;

            if (!isEqual) {
              diff[k] = newValue;
            }

            return diff;
          }, {})
        : {
            ...(values as CreateDoctorForm),
          };

      if (isEdit && Object.keys(payload).length === 0) {
        toast.info("No changes to update");
        setOpen(false);
        return;
      }

      const res = await fetch(
        isEdit
          ? `/api/clinic/doctor/${defaultValues!.id}`
          : "/api/clinic/doctor",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Doctor updated" : "Doctor created");
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
          <DialogTitle>{isEdit ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {!isEdit && (
            <>
              <Input placeholder="Email" {...form.register("email")} />
              <Input
                placeholder="Password"
                type="password"
                {...form.register("password")}
              />
            </>
          )}

          <Input placeholder="First Name" {...form.register("firstName")} />
          <Input placeholder="Last Name" {...form.register("lastName")} />

          {isEdit && (
            <>
              <Input placeholder="Avatar URL" {...form.register("avatarUrl")} />

              <Select
                onValueChange={(val) => form.setValue("gender", val as Gender)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Description"
                {...form.register("description")}
              />
              <Textarea
                placeholder="Specialties (comma separated)"
                onChange={(e) =>
                  form.setValue(
                    "specialties",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
              />
            </>
          )}

          <Button type="submit" className="cursor-pointer w-full">
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

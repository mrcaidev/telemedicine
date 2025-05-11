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

const schema = z.object({
  name: z.string().min(1, "Clinic name is required"),
});

type ClinicForm = z.infer<typeof schema>;

type Props = {
  defaultValues?: { id: string; name: string };
  onSuccess: () => void;
  children: React.ReactNode;
};

export function ClinicFormDialog({ defaultValues, onSuccess, children }: Props) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);

  const form = useForm<ClinicForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (values: ClinicForm) => {
    try {
      const res = await fetch(
        isEdit ? `/api/platform/clinic/${defaultValues!.id}` : "/api/platform/clinic",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Clinic updated" : "Clinic created");
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
          <DialogTitle>{isEdit ? "Edit Clinic" : "Add Clinic"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input placeholder="Clinic Name" {...form.register("name")} />
          <Button type="submit" className="w-full cursor-pointer">
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
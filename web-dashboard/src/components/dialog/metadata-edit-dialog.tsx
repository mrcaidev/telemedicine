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

// 动态验证模式
const schema = z.object({
  code: z.string().min(1, "Code is required"), // code 字段为必填
  name: z.string().optional(), // 对于 medication 和 lab-test 类型，name 为可选
  description: z.string().optional(), // 对于 diagnosis 类型，description 为可选
});

type ReferenceForm = z.infer<typeof schema>;

type Props = {
  defaultValues?: {
    code: string;
    name?: string;
    description?: string;
  }; // 默认值，支持编辑
  onSuccess: () => void;
  children: React.ReactNode;
  type: string; // 传递类型信息
};

export function EditFormDialog({
  defaultValues,
  onSuccess,
  children,
  type,
}: Props) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);

  const form = useForm<ReferenceForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // 处理表单提交
  const handleSubmit = async (values: ReferenceForm) => {
    try {
      const res = await fetch(
        isEdit
          ? `/api/platform/metadata/${type}/${defaultValues!.code}` // 编辑时 API
          : `/api/platform/metadata/${type}`, // 新增时 API
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? `${type} updated` : `${type} created`);
      setOpen(false);
      onSuccess();
    } catch {
      toast.error(isEdit ? `${type} update failed` : `${type} create failed`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${type}` : `Add ${type}`}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* 始终显示 code */}
          <Input placeholder="Code" {...form.register("code")} disabled={isEdit} />

          {/* diagnosis 类型只有 description */}
          {type === "diagnoses" && (
            <Input placeholder="Description" {...form.register("description")} />
          )}

          {/* medications 和 lab-tests 类型只有 name */}
          {type !== "diagnoses" && (
            <Input placeholder="Name" {...form.register("name")} />
          )}

          <Button type="submit" className="w-full cursor-pointer">
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

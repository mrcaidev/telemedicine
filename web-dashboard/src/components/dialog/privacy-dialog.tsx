"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PolicyDialogLinkProps {
  label: string; // 链接文字，例如 Terms、Privacy Policy
  title: string; // 弹窗标题
  children: ReactNode; // 弹窗内容
  className?: string;
}

export default function PolicyDialog({
  label,
  title,
  children,
  className = "text-blue-500 cursor-pointer underline",
}: PolicyDialogLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 max-h-[60vh] overflow-y-auto">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
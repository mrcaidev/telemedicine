"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { EditFormDialog } from "@/components/dialog/metadata-edit-dialog";

const RESOURCE_OPTIONS = [
  { value: "diagnoses", label: "Diagnosis Types" },
  { value: "medications", label: "Medications" },
  { value: "lab-tests", label: "Lab Tests" },
];

type ReferenceItem = {
  code: string;
  name?: string;
  description?: string;
};

export default function ReferenceManager() {
  const [selected, setSelected] = useState("diagnoses");
  const [data, setData] = useState<ReferenceItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const res = await fetch("/api/platform/metadata/diagnoses");
      const json = await res.json();
      console.log("Diagnoses data:", json);
      setData(json.data.diagnosis || []);
    };

    const fetchMedications = async () => {
      const res = await fetch("/api/platform/metadata/medications");
      const json = await res.json();
      setData(json.data.medications || []);
    };

    const fetchLabTests = async () => {
      const res = await fetch("/api/platform/metadata/lab-tests");
      const json = await res.json();
      setData(json.data.labTests || []);
    };

    if (selected === "diagnoses") fetchDiagnoses();
    else if (selected === "medications") fetchMedications();
    else if (selected === "lab-tests") fetchLabTests();
  }, [selected, refreshTrigger]);

  const getDisplayName = (item: ReferenceItem) =>
    item.name || item.description || "-";

  const handleDelete = async (code: string) => {
    try {
      const res = await fetch(`/api/platform/metadata/${selected}/${code}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setData((prev) => prev.filter((item) => item.code !== code));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Metadata Manager</h1>

      <div className="flex items-center gap-4 justify-between mb-4">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-[240px] cursor-pointer">
            <SelectValue placeholder="Select reference type" />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_OPTIONS.map((opt) => (
              <SelectItem
                className="cursor-pointer"
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <EditFormDialog
          onSuccess={() => {
            setRefreshTrigger((prev) => prev + 1);
            setOpenCreateDialog(false);
          }}
          type={selected}
        >
          <Button variant="outline" className="cursor-pointer">
            <Plus className="w-4 h-4" /> Add {selected}
          </Button>
        </EditFormDialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Code</TableHead>
            <TableHead className="w-3/4">Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.code}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{getDisplayName(item)}</TableCell>
              <TableCell className="text-right space-x-2">
                {/* 编辑按钮 */}
                <EditFormDialog
                  defaultValues={item}
                  onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                  type={selected}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </EditFormDialog>

                {/* 删除按钮 */}
                <ConfirmDialog
                  onConfirm={() => handleDelete(item.code)}
                  description={`Are you sure you want to delete "${
                    item.name || item.description
                  }"? This action cannot be undone.`}
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

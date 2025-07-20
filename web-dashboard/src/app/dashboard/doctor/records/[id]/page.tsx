"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Atom } from "lucide-react";
import { MedicalRecord } from "@/types/patient";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

function formatDateTime(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

type OptionItem = { code: string; description: string };
type OptionNameItem = { code: string; name: string };

export default function MedicalRecordDetailPage() {
  const { id } = useParams();
  const recordId = id as string;
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});

  const [diagnosisOptions, setDiagnosisOptions] = useState<OptionItem[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<OptionNameItem[]>(
    []
  );
  const [labTestOptions, setLabTestOptions] = useState<OptionNameItem[]>([]);

  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/doctor/patients/records/${recordId}`)
      .then((res) => res.json())
      .then((data) => {
        const fetched = data.data.data;
        setRecord(fetched);
        setFormData(fetched);
      });
  }, [recordId]);

  useEffect(() => {
    fetch("/api/platform/metadata/diagnoses")
      .then((res) => res.json())
      .then((data) => {
        setDiagnosisOptions(data.data.diagnosis);
      });

    fetch("/api/platform/metadata/medications")
      .then((res) => res.json())
      .then((data) => setMedicationOptions(data.data.medications));

    fetch("/api/platform/metadata/lab-tests")
      .then((res) => res.json())
      .then((data) => setLabTestOptions(data.data.labTests));
  }, []);

  const handleDelete = async () => {
    const res = await fetch(`/api/doctor/patients/records/${recordId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Record deleted");
    router.push(`/dashboard/doctor/appointments`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof MedicalRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const updates: Partial<MedicalRecord> = {};

    for (const key in formData) {
      const typedKey = key as keyof MedicalRecord;
      if (formData[typedKey] !== record?.[typedKey]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updates[typedKey] = formData[typedKey] as any;
      }
    }

    if (Object.keys(updates).length === 0) {
      toast.info("No changes to update");
      return;
    }

    const res = await fetch(`/api/doctor/patients/records/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }

    toast.success("Record updated");
    setEditMode(false);
    const updated = await res.json();
    setRecord(updated.updatedRecord.data);
    setFormData(updated.updatedRecord.data);
  };

  if (!record) return <Spinner />;

  const renderField = (label: string, key: keyof MedicalRecord, unit = "") => (
    <div>
      <strong>{label}:</strong>{" "}
      {editMode ? (
        <Input
          value={formData[key] || ""}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      ) : (
        <span>{record[key] ? `${record[key]}${unit}` : "N/A"}</span>
      )}
    </div>
  );

  const renderLinkedSelectField = (
    codeLabel: string,
    descLabel: string,
    codeKey: keyof MedicalRecord,
    descKey: keyof MedicalRecord,
    options: { code: string; description: string }[]
  ) => {
    const currentCode = formData[codeKey] || "";
    const currentDesc = formData[descKey] || "";

    return (
      <>
        <div>
          <strong>{codeLabel}:</strong>{" "}
          {editMode ? (
            <Select value={String(currentCode)} disabled>
              <SelectTrigger className="w-full opacity-70 cursor-not-allowed">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.code} value={o.code}>
                    {o.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{currentCode || "N/A"}</span>
          )}
        </div>

        <div>
          <strong>{descLabel}:</strong>{" "}
          {editMode ? (
            <Select
              value={String(currentDesc)}
              onValueChange={(selectedDesc) => {
                const matched = options.find(
                  (o) => o.description === selectedDesc
                );
                setFormData((prev) => ({
                  ...prev,
                  [descKey]: selectedDesc,
                  [codeKey]: matched?.code || "",
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.code} value={o.description}>
                    {o.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{currentDesc || "N/A"}</span>
          )}
        </div>
      </>
    );
  };

  const renderLinkedSelectNameField = (
    codeLabel: string,
    descLabel: string,
    codeKey: keyof MedicalRecord,
    descKey: keyof MedicalRecord,
    options: { code: string; name: string }[]
  ) => {
    const currentCode = formData[codeKey] || "";
    const currentDesc = formData[descKey] || "";

    return (
      <>
        <div>
          <strong>{codeLabel}:</strong>{" "}
          {editMode ? (
            <Select value={String(currentCode)} disabled>
              <SelectTrigger className="w-full opacity-70 cursor-not-allowed">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.code} value={o.code}>
                    {o.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{currentCode || "N/A"}</span>
          )}
        </div>

        <div>
          <strong>{descLabel}:</strong>{" "}
          {editMode ? (
            <Select
              value={String(currentDesc)}
              onValueChange={(selectedDesc) => {
                const matched = options.find((o) => o.name === selectedDesc);
                setFormData((prev) => ({
                  ...prev,
                  [descKey]: selectedDesc,
                  [codeKey]: matched?.code || "",
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.code} value={o.name}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{currentDesc || "N/A"}</span>
          )}
        </div>
      </>
    );
  };

  const fetchAISummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/doctor/patients/records/${recordId}/ai-summary`
      );
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      setSummary(data.data.data);
    } catch {
      setSummary("No summary available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-8 py-6 space-y-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (open && !summary) fetchAISummary();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="default" className="cursor-pointer">
              <Atom className="mr-2" />
              AI Summary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>AI Summary</DialogTitle>
              <DialogDescription>
                Below is the Ai-generated summary of the record
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-auto mt-2 text-sm text-gray-700 whitespace-pre-line">
              {loading ? <Spinner /> : summary || "No summary available."}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Medical Record Detail</h1>
        {record.updatedAt && (
          <div className="text-sm text-gray-500 ml-auto">
            Last updated: {formatDateTime(record.updatedAt)}
          </div>
        )}
        {!editMode ? (
          <Button
            variant="outline"
            onClick={() => setEditMode(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2" />
            Edit
          </Button>
        ) : (
          <Button onClick={handleUpdate} className="cursor-pointer">
            Save
          </Button>
        )}
        <ConfirmDialog
          title="Confirm Deletion"
          description="Are you sure you want to delete this medical record?"
          onConfirm={handleDelete}
        >
          <Button variant="destructive" className="ml-2 cursor-pointer">
            <Trash2 className="mr-2" />
            Delete
          </Button>
        </ConfirmDialog>
      </div>

      <div className="space-y-6">
        {/* Patient Vitals */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          <h2 className="text-xl font-semibold">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            {renderField("Blood Pressure", "objectiveBloodPressure")}
            {renderField("Heart Rate", "objectiveHeartRate", " bpm")}
            {renderField("Temperature", "objectiveTemperature", " °C")}
            {renderField("Weight", "objectiveWeight", " kg")}
            {renderField("Height", "objectiveHeight", " cm")}
            {renderField("Other Vitals", "objectiveOtherVitals")}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          <h2 className="text-xl font-semibold">Diagnosis</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            {renderLinkedSelectField(
              "Diagnosis Code",
              "Diagnosis Description",
              "assessmentDiagnosisCode",
              "assessmentDiagnosisDesc",
              diagnosisOptions
            )}
            {renderField("Diagnosis Date", "assessmentDiagnosisDate")}
            {renderField("Follow-up Date", "planFollowupDate")}
            {renderField("Follow-up Type", "planFollowupType")}
          </div>
        </div>

        {/* Medication */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          <h2 className="text-xl font-semibold">Medication Plan</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            {renderLinkedSelectNameField(
              "Medication Code",
              "Medication Name",
              "planMedicationCode",
              "planMedicationName",
              medicationOptions
            )}
            {renderField("Dosage Value", "planDosageValue")}
            {renderField("Frequency Code", "planFrequencyCode")}
            {renderField("Usage Code", "planUsageCode")}
            {renderField("Start Date", "planStartDate")}
            {renderField("Stop Date", "planStopDate")}
          </div>
        </div>

        {/* Lab Test */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          <h2 className="text-xl font-semibold">Lab Test</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
            {renderLinkedSelectNameField(
              "Lab Test Code",
              "Lab Test Name",
              "planLabTestCode",
              "planLabTestName",
              labTestOptions
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          <h2 className="text-xl font-semibold">Subjective Notes</h2>
          {editMode ? (
            <textarea
              value={formData.subjectiveNotes || ""}
              onChange={(e) => handleChange("subjectiveNotes", e.target.value)}
              className="w-full h-24 border rounded p-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {record.subjectiveNotes || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";

// 定义表单校验 schema
const schema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  recordDate: z.string(),

  assessmentDiagnosisCode: z.string().nullable(),
  assessmentDiagnosisDate: z.string(),
  assessmentDiagnosisDesc: z.string().nullable(),

  objectiveBloodPressure: z.string().nullable(),
  objectiveHeartRate: z.coerce.number().nullable(),
  objectiveHeight: z.coerce.number().nullable(),
  objectiveOtherVitals: z.string().nullable(),
  objectiveTemperature: z.coerce.number().nullable(),
  objectiveWeight: z.coerce.number().nullable(),

  subjectiveNotes: z.string().nullable(),

  planDosageValue: z.string().nullable(),
  planFollowupDate: z.string().nullable(),
  planFollowupType: z.string().nullable(),
  planFrequencyCode: z.string().nullable(),
  planLabTestCode: z.string().nullable(),
  planLabTestName: z.string().nullable(),
  planMedicationCode: z.string().nullable(),
  planMedicationName: z.string().nullable(),
  planStartDate: z.string().nullable(),
  planStopDate: z.string().nullable(),
  planUsageCode: z.string().nullable(),
});

type MedicalRecordFormValues = z.infer<typeof schema>;

export default function CreateMedicalRecordPage() {
  const { appointmentId } = useParams();
  const router = useRouter();

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointmentId: appointmentId as string,
      patientId: "", // 后面 fetch appointment 取值填入
      recordDate: new Date().toISOString().split("T")[0],
    },
  });

  // 预加载 appointment，自动填充 patientId
  useEffect(() => {
    fetch(`/api/doctor/appointments/${appointmentId}`)
      .then((res) => res.json())
      .then((data) => {
        const pid = data.data.data.patient.id;
        form.setValue("patientId", pid);
      });
  }, [appointmentId]);

  const onSubmit = async (values: MedicalRecordFormValues) => {
    const res = await fetch("/api/doctor/patients/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("Create failed");
      return;
    }

    toast.success("Medical record created");
    router.push(`/dashboard/doctor/appointments/${appointmentId}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📝 Create Medical Record</h1>

      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input {...form.register("recordDate")} placeholder="Record Date" type="date" />
        <Input {...form.register("assessmentDiagnosisCode")} placeholder="Diagnosis Code" />
        <Input {...form.register("assessmentDiagnosisDate")} type="date" />
        <Input {...form.register("assessmentDiagnosisDesc")} placeholder="Diagnosis Description" />
        <Input {...form.register("objectiveBloodPressure")} placeholder="Blood Pressure" />
        <Input {...form.register("objectiveHeartRate")} type="number" placeholder="Heart Rate" />
        <Input {...form.register("objectiveHeight")} type="number" placeholder="Height" />
        <Input {...form.register("objectiveOtherVitals")} placeholder="Other Vitals" />
        <Input {...form.register("objectiveTemperature")} type="number" placeholder="Temperature" />
        <Input {...form.register("objectiveWeight")} type="number" placeholder="Weight" />
        <Input {...form.register("subjectiveNotes")} placeholder="Subjective Notes" />
        <Input {...form.register("planDosageValue")} placeholder="Dosage Value" />
        <Input {...form.register("planFollowupDate")} type="date" />
        <Input {...form.register("planFollowupType")} placeholder="Followup Type" />
        <Input {...form.register("planFrequencyCode")} placeholder="Frequency Code" />
        <Input {...form.register("planLabTestCode")} placeholder="Lab Code" />
        <Input {...form.register("planLabTestName")} placeholder="Lab Name" />
        <Input {...form.register("planMedicationCode")} placeholder="Medication Code" />
        <Input {...form.register("planMedicationName")} placeholder="Medication Name" />
        <Input {...form.register("planStartDate")} type="date" />
        <Input {...form.register("planStopDate")} type="date" />
        <Input {...form.register("planUsageCode")} placeholder="Usage Code" />

        <div className="col-span-2 flex justify-end pt-4">
          <Button className="cursor-pointer" type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}

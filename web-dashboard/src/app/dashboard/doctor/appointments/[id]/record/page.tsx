"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";

// Define schema for validation
const schema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  recordDate: z.string(),

  objectiveBloodPressure: z.string().nullable().optional(),
  objectiveHeartRate: z.string().nullable().optional(),
  objectiveHeight: z.string().nullable().optional(),
  objectiveOtherVitals: z.string().nullable().optional(),
  objectiveTemperature: z.string().nullable().optional(),
  objectiveWeight: z.string().nullable().optional(),

  // Diagnosis Information
  assessmentDiagnosisCode: z.string().nullable().optional(),
  assessmentDiagnosisDate: z.string(),
  assessmentDiagnosisDesc: z.string().nullable().optional(),
  planFollowupDate: z.string().nullable().optional(),
  planFollowupType: z.string().nullable().optional(),

  // Treatment Plan
  planDosageValue: z.string().nullable().optional(),
  planFrequencyCode: z.string().nullable().optional(),
  planMedicationCode: z.string().nullable().optional(),
  planMedicationName: z.string().nullable().optional(),
  planStartDate: z.string().nullable().optional(),
  planStopDate: z.string().nullable().optional(),
  planUsageCode: z.string().nullable().optional(),

  // Lab Test Information
  planLabTestCode: z.string().nullable().optional(),
  planLabTestName: z.string().nullable().optional(),

  subjectiveNotes: z.string().nullable().optional(),
});

type MedicalRecordFormValues = z.infer<typeof schema>;
type OptionItem = { code: string; description: string };
type OptionNameItem = { code: string; name: string };

export default function CreateMedicalRecordPage() {
  const { id } = useParams();
  const appointmentId = id as string;
  const router = useRouter();

  const [diagnosisOptions, setDiagnosisOptions] = useState<OptionItem[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<OptionNameItem[]>(
    []
  );
  const [labTestOptions, setLabTestOptions] = useState<OptionNameItem[]>([]);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointmentId: appointmentId as string,
      patientId: "", // Fill patient ID after fetching appointment data
      recordDate: new Date().toISOString().split("T")[0],
    },
  });

  const diagnosisCode = form.watch("assessmentDiagnosisCode");
  const medicationCode = form.watch("planMedicationCode");
  const labTestCode = form.watch("planLabTestCode");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    unit: string
  ) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots
    setValue(value ? `${value}${unit}` : ""); // Append unit to value
  };

  // Preload appointment and fill in patientId
  useEffect(() => {
    fetch(`/api/doctor/appointments/${appointmentId}`)
      .then((res) => res.json())
      .then((data) => {
        const pid = data.data.data.patient.id;
        form.setValue("patientId", pid);
      });
  }, [appointmentId, form]);

  const onSubmit = async (values: MedicalRecordFormValues) => {
    const cleanValue = (value: string | null | undefined, key: string) => {
      if (value === undefined || value === null) return "";

      // 只对指定字段去单位
      const fieldsToClean = [
        "objectiveHeight",
        "objectiveWeight",
        "objectiveBloodPressure",
        "objectiveHeartRate",
        "objectiveTemperature",
      ];

      // 如果当前字段在需要去单位的字段中，则移除单位
      if (fieldsToClean.includes(key)) {
        return value?.toString().replace(/[^0-9.-]+/g, ""); // 只保留数字
      }

      // 否则，返回原始值
      return value;
    };

    const cleanedValues = Object.entries(
      values
    ).reduce<MedicalRecordFormValues>((acc, [key, value]) => {
      // 对每个字段应用 `cleanValue` 函数
      acc[key as keyof MedicalRecordFormValues] = cleanValue(value, key);
      return acc;
    }, {} as MedicalRecordFormValues);

    console.log("Submitting record with values:", cleanedValues);

    const res = await fetch("/api/doctor/patients/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedValues),
    });

    if (!res.ok) {
      toast.error("Create failed");
      return;
    }

    toast.success("Medical record created");
    router.push(`/dashboard/doctor/appointments/${appointmentId}`);
  };

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

  // 处理诊断描述 -> 设置诊断编码
  const handleDiagnosisDescChange = (desc: string) => {
    const item = diagnosisOptions.find((i) => i.description === desc);
    form.setValue("assessmentDiagnosisDesc", desc);
    form.setValue("assessmentDiagnosisCode", item?.code);

    form.setValue(
      "assessmentDiagnosisDate",
      new Date().toISOString().split("T")[0]
    ); // Set today's date as diagnosis date
  };

  // // 药物名称 -> 编码
  const handleMedicationNameChange = (medicationName: string) => {
    const item = medicationOptions.find((i) => i.name === medicationName);
    form.setValue("planMedicationName", medicationName);
    form.setValue("planMedicationCode", item?.code);
  };

  // // 化验名称 -> 编码
  const handleLabTestNameChange = (labTestName: string) => {
    const item = labTestOptions.find((i) => i.name === labTestName);
    form.setValue("planLabTestName", labTestName);
    form.setValue("planLabTestCode", item?.code);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-8 max-w-3xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-bold flex justify-between items-center">
        Create Medical Record
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </span>{" "}
        {/* Display today's date */}
      </h1>

      {/* Card 1: Patient Information */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Height */}
          <div className="w-full">
            <Input
              value={height}
              {...form.register("objectiveHeight")}
              onChange={(e) => handleInputChange(e, setHeight, " cm")}
              placeholder="Height"
              type="text"
              className="w-full pr-12"
            />
          </div>

          {/* Weight */}
          <div className="w-full">
            <Input
              value={weight}
              {...form.register("objectiveWeight")}
              onChange={(e) => handleInputChange(e, setWeight, " kg")}
              placeholder="Weight"
              type="text"
              className="w-full pr-12"
            />
          </div>

          {/* Blood Pressure */}
          <div className="w-full">
            <Input
              value={bloodPressure}
              {...form.register("objectiveBloodPressure")}
              onChange={(e) => handleInputChange(e, setBloodPressure, " mmHg")}
              placeholder="Blood Pressure"
              type="text"
              className="w-full pr-12"
            />
          </div>

          {/* Heart Rate */}
          <div className="w-full">
            <Input
              value={heartRate}
              {...form.register("objectiveHeartRate")}
              onChange={(e) => handleInputChange(e, setHeartRate, " bpm")}
              placeholder="Heart Rate"
              type="text"
              className="w-full pr-12"
            />
          </div>

          {/* Temperature */}
          <div className="w-full">
            <Input
              value={temperature}
              {...form.register("objectiveTemperature")}
              onChange={(e) => handleInputChange(e, setTemperature, " °C")}
              placeholder="Temperature"
              type="text"
              className="w-full pr-12"
            />
          </div>

          {/* Other Vitals */}
          <div className="w-full">
            <Input
              {...form.register("objectiveOtherVitals")}
              placeholder="Other Vitals"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Diagnosis */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Diagnosis Information</h2>

        {/* Grid for Diagnosis Code and Description */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="w-full">
            <Select disabled value={diagnosisCode || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Diagnosis Code" />
              </SelectTrigger>
              <SelectContent>
                {diagnosisOptions?.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select onValueChange={handleDiagnosisDescChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Diagnosis Description" />
              </SelectTrigger>
              <SelectContent>
                {diagnosisOptions?.map((item) => (
                  <SelectItem key={item.code} value={item.description}>
                    {item.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Diagnosis Date */}
        <div className="mt-4 grid grid-cols-2 gap-6">
          <div className="w-full">
            <div className="text-sm text-gray-500 mb-2">Diagnosis Date:</div>
            <Input
              {...form.register("assessmentDiagnosisDate")}
              type="date"
              placeholder="Diagnosis Date"
              className="w-full"
            />
          </div>

          {/* Follow-up Date */}
          <div className="w-full">
            <div className="text-sm text-gray-500 mb-2">Follow-up Date</div>
            <Input
              {...form.register("planFollowupDate")}
              type="date"
              placeholder="Follow-up Date"
              className="w-full"
            />
          </div>
        </div>

        {/* Follow-up Type */}
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Follow-up Type</div>
          <Input
            {...form.register("planFollowupType")}
            placeholder="E.g. in-person / video / phone"
            className="w-full"
          />
        </div>
      </div>

      {/* Card 3: Treatment Plan */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Treatment Plan</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Medication Code Select */}
          <Select value={medicationCode || ""} disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Medication Code" />
            </SelectTrigger>
            <SelectContent>
              {medicationOptions.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Medication Name Select */}
          <Select onValueChange={handleMedicationNameChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Medication Name" />
            </SelectTrigger>
            <SelectContent>
              {medicationOptions.map((item) => (
                <SelectItem key={item.code} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dosage Value Input */}
          <Input
            {...form.register("planDosageValue")}
            placeholder="Dosage Value"
            className="w-full"
          />

          {/* Frequency Code Input */}
          <Input
            {...form.register("planFrequencyCode")}
            placeholder="Frequency Code"
            className="w-full"
          />

          {/* Usage Code Input */}
          <Input
            {...form.register("planUsageCode")}
            placeholder="Usage Code"
            className="w-full"
          />
        </div>

        {/* Last two Date Inputs in a New Row */}
        <div className="mt-4">
          <div className="flex gap-4 w-full">
            {/* Plan Start Date */}
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-2">Plan Start Date:</div>
              <Input
                {...form.register("planStartDate")}
                type="date"
                placeholder="Start Date"
                className="w-full"
              />
            </div>

            {/* Plan Stop Date */}
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-2">Plan Stop Date:</div>
              <Input
                {...form.register("planStopDate")}
                type="date"
                placeholder="Stop Date"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Lab Test */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Lab Test</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select value={labTestCode || ""} disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Lab Test Code" />
            </SelectTrigger>
            <SelectContent>
              {labTestOptions.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleLabTestNameChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Lab Test Name" />
            </SelectTrigger>
            <SelectContent>
              {labTestOptions.map((item) => (
                <SelectItem key={item.code} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Card 5: Subjective Notes */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Subjective Notes</h2>
        <div className="mt-4">
          <textarea
            {...form.register("subjectiveNotes")}
            placeholder="Enter subjective notes"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-2 flex justify-end pt-4">
        <Button className="cursor-pointer" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}

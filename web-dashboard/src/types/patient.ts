export interface RawPatient {
  id: string;
  nickname: string;
  avatarUrl?: string;
  role: "patient";
  email: string;
  gender: "male" | "female";
  birthDate?: string;
}

export interface MedicalRecord {
  id: string;

  appointmentId?: string;

  // Diagnosis
  assessmentDiagnosisCode?: string;
  assessmentDiagnosisDate?: string;
  assessmentDiagnosisDesc?: string;

  // Vitals (Objective)
  objectiveBloodPressure?: string;
  objectiveHeartRate?: number;
  objectiveHeight?: number;
  objectiveOtherVitals?: string;
  objectiveTemperature?: number;
  objectiveWeight?: number;

  // Subjective
  subjectiveNotes?: string;

  // Plan (Medication / Follow-up)
  planMedicationCode?: string;
  planMedicationName?: string;
  planDosageValue?: string;
  planFrequencyCode?: string;
  planUsageCode?: string;
  planStartDate?: string;
  planStopDate?: string;

  // Follow-up
  planFollowupDate?: string;
  planFollowupType?: string;

  // Lab
  planLabTestCode?: string;
  planLabTestName?: string;

  // Metadata
  patientId?: string;
  recordDate?: string;
  createdAt?: string;
  updatedAt?: string;
}


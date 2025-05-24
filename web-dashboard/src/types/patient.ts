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
  id?: string;
  appointmentId?: string;
  assessmentDiagnosisCode?: string;
  assessmentDiagnosisDate?: string;
  assessmentDiagnosisDesc?: string;
  createdAt?: string;
  objectiveBloodPressure?: string;
  objectiveHeartRate?: number;
  objectiveHeight?: number;
  objectiveOtherVitals?: string;
  objectiveTemperature?: number;
  objectiveWeight?: number;
  patientId?: string;
  planDosageValue?: string;
  planFollowupDate?: string;
  planFollowupType?: string;
  planFrequencyCode?: string;
  planLabTestCode?: string;
  planLabTestName?: string;
  planMedicationCode?: string;
  planMedicationName?: string;
  planStartDate?: string;
  planStopDate?: string;
  planUsageCode?: string;
  recordDate?: string;
  subjectiveNotes?: string;
  updatedAt?: string;
}

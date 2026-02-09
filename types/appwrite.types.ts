import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

export interface AppointmentResponse {
  success: boolean;
  data?: any;
  error?: string;
  code?: AppointmentErrorCode;
  //AI IMPLEMENTATION
  /* suggestions?: AlternativeSlot[]; */
}

export interface AvailabilityCheckResult {
  available: boolean;
  conflictingAppointment?: any;
}

//AI IMPLEMENTATION
/* export interface AlternativeSlot {
  schedule: string;
  available: boolean;
  reason?: string;
} */

export type AppointmentStatus = "scheduled" | "pending" | "cancelled";

export interface AppointmentErrorCode {
  SLOT_UNAVAILABLE: "SLOT_UNAVAILABLE";
  RACE_CONDITION_CONFLICT: "RACE_CONDITION_CONFLICT";
  CREATION_FAILED: "CREATION_FAILED";
  VALIDATION_ERROR: "VALIDATION_ERROR";
}

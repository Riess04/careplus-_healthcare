import { z } from "zod";
import { APPOINTMENT_CONSTANTS } from "@/constants/appointment";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z
    .array(z.instanceof(File))
    .optional()
    .default([])
    .refine(
      (files) => {
        //if no files, validation passes (optional field)
        if (!files || files.length === 0) return true;
        //check file size
        return files[0].size <= MAX_FILE_SIZE;
      },
      {
        message: "File size must be less than 5MB",
      }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        //check file type
        return ACCEPTED_FILE_TYPES.includes(files[0].type);
      },
      {
        message: "Only JPG, PNG, and PDF files are accepted.",
      }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        //check file is not empty
        return files[0].size > 0;
      },
      {
        message: "File cannot be empty",
      }
    ),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z
    .string()
    .min(1, "Doctor selection is required")
    .min(2, "Select at least one doctor"),
  schedule: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: "Appointment must be scheduled for a future date and time,",
    })
    .refine(
      (date) => {
        const hour = date.getHours();
        const { WORK_START_HOUR, WORK_END_HOUR } = APPOINTMENT_CONSTANTS;
        return hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
      },
      {
        message:
          "Appointment must be scheduled during working hours (9 AM - 5 PM)",
      }
    ),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(1000, "Reason must not exceed 1000 characters")
    .optional(),
  note: z.string().max(1000, "Note must not exceed 1000 hours").optional(),
  cancellationReason: z
    .string()
    .max(1000, "CancellationReason must not exceed 1000 characters")
    .optional(),
});

export type ScheduleAppointmentFormValues = z.infer<
  typeof ScheduleAppointmentSchema
>;

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

export { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES };

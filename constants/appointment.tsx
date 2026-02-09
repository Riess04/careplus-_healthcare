export const APPOINTMENT_CONSTANTS = {
  WORK_START_HOUR: 9,
  WORK_END_HOUR: 17,
  DEFAULT_SLOT_DURATION: 30,
} as const;

export const APPOINTMENT_STATUSES = {
  SCHEDULED: "scheduled",
  PENDING: "pending",
  CANCELLED: "cancelled",
} as const;

export const ERROR_MESSAGES = {
  SLOT_UNAVAILABLE:
    "This time slot is no longer available. Please select another time.",
  RACE_CONDITION:
    "This time slot was just booked by another user. Please refresh and select a different time.",
  ALREADY_BOOKED: "This appointment slot is already booked.",
  INVALID_REFERENCE:
    "Invalid patient or doctor reference. Please verify the IDs.",
  CREATION_FAILED:
    "Failed to create appointment. Please try again or contact support.",
};

export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: "Appointment scheduled successfully",
  APPOINTMENT_UPDATED: "Appointment updated successfully",
  APPOINTMENT_CANCELLED: "Appointment cancelled successfully",
} as const;

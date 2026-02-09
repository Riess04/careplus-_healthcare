"use-server";

import { Query } from "node-appwrite";
import {
  databases,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
} from "../appwrite.config";
import { AvailabilityCheckResult } from "@/types/appwrite.types";
import HandleAppwriteError from "./appwriteErrors";

export const normalizeSchedule = (schedule: Date | string): string => {
  return typeof schedule === "string"
    ? new Date(schedule).toISOString()
    : schedule.toISOString();
};

export const checkAppointmentAvailability = async (
  primaryPhysician: string,
  schedule: Date | string,
): Promise<AvailabilityCheckResult> => {
  try {
    //standardize the date formats
    const normalizedSchedule = normalizeSchedule(schedule);

    //check for current bookings
    const existingBookings = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("primaryPhysician", [primaryPhysician]),
        Query.equal("schedule", [normalizedSchedule]),
        Query.notEqual("status", ["cancelled"]),
      ],
    );

    return {
      available: existingBookings.total === 0,
      conflictingAppointment:
        existingBookings.total > 0 ? existingBookings.documents[0] : undefined,
    };
  } catch (error) {
    console.error("Availability check error:", error);
    return { available: false };
  }
};

//functions that handles user-friendly error messages
HandleAppwriteError;

//show alternative booking times
export const getAvailableSlots = async (
  primaryPhysician: string,
  date: Date,
  slotDurationMinutes: number = 30,
): Promise<string[]> => {
  try {
    const WORK_START_HOUR = 9;
    const WORK_END_HOUR = 17;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    //fetch all booked slots for this day
    const bookedSlots = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("primaryPhysician", [primaryPhysician]),
        Query.greaterThanEqual("schedule", startOfDay.toISOString()),
        Query.lessThanEqual("schedule", endOfDay.toISOString()),
        Query.notEqual("status", ["cancelled"]),
      ],
    );

    const bookedTimes = new Set(
      bookedSlots.documents.map((doc) => {
        return new Date(doc.schedule).toISOString();
      }),
    );

    //generate all possible time slots
    const availableSlots: string[] = [];
    const currentDate = new Date(date);

    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
        currentDate.setHours(hour, minute, 0, 0);
        const slotTime = currentDate.toISOString();

        if (!bookedTimes.has(slotTime)) {
          availableSlots.push(slotTime);
        }
      }
    }
    return availableSlots;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }
};

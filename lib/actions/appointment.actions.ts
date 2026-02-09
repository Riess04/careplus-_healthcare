"use server";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { formatDateTime, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getPatient } from "./patient.actions";
import { Appointment } from "@/types/appwrite.types";
import { checkAppointmentAvailability } from "./appointment.helpers";
import { normalizeSchedule } from "./appointment.helpers";
import { ERROR_MESSAGES } from "@/constants/appointment";
import HandleAppwriteError from "./appwriteErrors";

export const CreateAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const normalizedSchedule = await normalizeSchedule(appointment.schedule);

    const availabilityCheck = await checkAppointmentAvailability(
      appointment.primaryPhysician,
      normalizedSchedule,
    );

    if (!availabilityCheck.available) {
      return { success: false, error: ERROR_MESSAGES.SLOT_UNAVAILABLE };
    }

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        ...appointment,
        schedule: normalizeSchedule,
      },
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.log("An error occurred while creating a new appointment: ", error);

    const errorResult = HandleAppwriteError(error);
    return { success: false, error: errorResult.error };
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    );

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return parseStringify(appointment);
  } catch (error) {
    console.log(
      "An error occurred while retrieving the existing appointment: ",
      error,
    );
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );

    const appointmentsWithPatients = await Promise.all(
      appointments.documents.map(async (appointment: any) => {
        const patient = await getPatient(appointment.userId);
        return {
          ...appointment,
          patient: patient,
        };
      }),
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointmentsWithPatients as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }

        return acc;
      },
      initialCounts,
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointmentsWithPatients,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(
      "An error occurred while retrieving the recent appointments:",
      error,
    );
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment,
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    //if successful, SMS Verification
    const smsMessage = `
    Hi there, it's CarePlus.
    ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(appointment.schedule!, timeZone).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
    }
    `;
    await sendSMSNotification(userId, smsMessage);

    revalidatePath(`/admin`);
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log("An error occurred while scheduling an appointment:", error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId],
    );

    return parseStringify(message);
  } catch (error) {
    console.log("An error occurred while sending sms", error);
  }
};

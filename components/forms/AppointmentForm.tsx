"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Form } from "@/components/ui/form";
import {
  CreateAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { FormFieldType } from "./PatientForm";
import { SelectItem } from "../ui/select";

import "react-phone-number-input/style.css";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import Image from "next/image";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setIsOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setIsOpen?: (isOpen: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    //@ts-ignore
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>,
  ) => {
    setIsLoading(true);

    let status;

    switch (type) {
      case "schedule":
        status = "scheduled";
        break;

      case "cancel":
        status = "cancelled";
        break;

      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        const newAppointment = await CreateAppointment(appointmentData);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setIsOpen && setIsOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;

    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;

    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          //@ts-ignore
          onSubmit,
        )}
        className="space-y-6 flex-1"
      >
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment </h1>
            <p className="text-dark-700">
              Request a new appointment within seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a Doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyy - h: mm aa"
              iconSrc="/assets/icons/calender.svg"
              iconAlt="calender"
            />

            <div
              className={`flex flex-col gap-6 ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Additional comments/notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const RequestSuccess = async ({
  params,
  searchParams,
}: AsyncSearchParamProps) => {
  const { userId } = await params;
  const sp = await searchParams;
  const appointmentId = (sp?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician,
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%] ">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            alt="success"
            width={300}
            height={280}
            unoptimized
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p> A message will be sent shortly confirming your appointment.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />

            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calender.svg"
              alt="calender"
              height={24}
              width={24}
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button className="shad-primary-btn" variant="outline" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">© 2026 CarePulse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;

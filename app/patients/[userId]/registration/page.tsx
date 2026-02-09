import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

const Registration = async ({ params }: AsyncSearchParamProps) => {
  //extract userId from params
  const { userId } = await params;
  const user = await getUser(userId);
  const patient = await getPatient(userId);

  //redirect to new appointment page if patient already exists
  if (patient) {
    redirect(`/patients/${userId}/new-appointment`);
  } else {
    return (
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container">
          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="patient"
              width={1000}
              height={1000}
              className="mb-12 h-10 w-fit"
            />
            <RegistrationForm user={user} />

            <p className="copyright py-12">© 2026 CarePlus</p>
          </div>
        </section>

        <Image
          src="/assets/images/register-img.png"
          alt="registration"
          width={1000}
          height={1000}
          className="side-img max-w-[390px]"
        />
      </div>
    );
  }
};

export default Registration;

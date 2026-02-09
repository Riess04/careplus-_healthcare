import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import AdminLink from "@/components/AdminLink";

const Home = async () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[490px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2026 CarePlus
            </p>
            <AdminLink />
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        alt="patient"
        width={1000}
        height={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;

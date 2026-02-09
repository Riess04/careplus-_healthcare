"use client";

import { useState } from "react";
import PasskeyModal from "./PasskeyModal";

const AdminLink = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PasskeyModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <p
        onClick={() => {
          setShowModal(true);
        }}
        className="text-green-500 cursor-pointer hover:underline-offset-2"
      >
        Admin
      </p>
    </>
  );
};
export default AdminLink;

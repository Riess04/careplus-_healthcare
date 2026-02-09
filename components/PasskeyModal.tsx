"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decryptedKey, encryptKey, formatRemainingTime } from "@/lib/utils";

interface PasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasskeyModal = ({ isOpen, onClose }: PasskeyModalProps) => {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  //state to track number of attempts
  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts: number = 5;

  //lockout state/mechanism
  const [isLockedOut, setIsLockedOut] = useState(false);
  //refer to typescript
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const lockoutDuration = 300000;

  //function checking if user isLockedOut
  const checkLockOutStatus = () => {
    if (isLockedOut && lockoutEndTime) {
      const currentTime = Date.now();

      if (currentTime >= lockoutEndTime) {
        //lockout has ended,reset lockout state
        setIsLockedOut(false);
        setLockoutEndTime(null);
        setAttemptCount(0);
        setError("");
        return 0;
      } else {
        // calculate remaining lockout time
        return lockoutEndTime - currentTime;
      }
    }

    return 0;
  };

  //check for existing encrypted key in local storage
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  //auto redirect if valid key exists
  useEffect(() => {
    if (!isOpen) return;

    if (encryptedKey) {
      const accessKey = decryptedKey(encryptedKey);

      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!) {
        router.push("/admin");
        onClose();
      }
    }
  }, [isOpen]);

  //function to close modal and reset states
  const closeModal = () => {
    setPasskey("");
    setError("");
    onClose();
  };

  //function to validate passkey
  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    //check if user is lockedOut, and retrieve remaining time
    const remainingTimeMs = checkLockOutStatus();

    if (remainingTimeMs > 0) {
      return;
    }

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);

      //reset lockout states
      setAttemptCount(0);
      setIsLockedOut(false);
      setLockoutEndTime(null);
      setError("");

      router.push("/admin");
      onClose();
    } else {
      //increment attemptCount
      setAttemptCount((prevCount) => prevCount + 1);

      //handle user's max attempts
      if (attemptCount + 1 >= maxAttempts) {
        setIsLockedOut(true);
        //Set lockout end time
        const endTime = Date.now() + lockoutDuration;
        setLockoutEndTime(endTime);

        //store lockout info in localstorage
        localStorage.setItem("lockoutEndTime", endTime.toString());
      } else {
        const remainingAttempts = maxAttempts - attemptCount;
        setError(
          `Invalid Passkey. Please try again. ${remainingAttempts} attempts remaining.`
        );
      }
    }
  };

  //useEffect to check for existing lockout on component mount
  useEffect(() => {
    //check if there is a lockout in session
    const storedLockoutTime = localStorage.getItem("lockoutEndTime");

    //if user is still locked out
    if (storedLockoutTime) {
      const storedTime = parseInt(storedLockoutTime);
      const currentTime = Date.now();

      if (currentTime < storedTime) {
        //user is still locked out, restore lockout state
        setIsLockedOut(true);
        setLockoutEndTime(storedTime);
      } else {
        localStorage.removeItem("lockoutEndTime");
      }
    }
  }, []);

  //set/update timer
  useEffect(() => {
    if (!isLockedOut || !lockoutEndTime) {
      setRemainingTime(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, lockoutEndTime - Date.now());
      setRemainingTime(remaining);

      if (remaining === 0) {
        setIsLockedOut(false);
        setLockoutEndTime(null);
        setAttemptCount(0);
        setError("");
        localStorage.removeItem("lockoutEndTime");
      }
    };

    //initial call to set timer immediately
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut, lockoutEndTime]);

  return (
    <AlertDialog open={isOpen} onOpenChange={closeModal}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            {isLockedOut
              ? "Account temporarily locked"
              : "Admin Access Verification"}
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLockedOut
              ? "Max attempts exceeded. Your account has been temporarily locked."
              : "To access the admin page, please enter the passkey."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isLockedOut ? (
          //locked out state
          <div className="py-8 text-center">
            <p className="text-14-regular text-dark-600 mb-3">
              Please try again in:
            </p>
            <div className="text-5xl font-bold text-red-700 mb-4">
              {formatRemainingTime(remainingTime)}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${(remainingTime / lockoutDuration) * 100}%`,
                }}
              />
            </div>

            <p className="text-12-regular text-dark-600 mt-3">
              Access will be restored automatically.
            </p>
          </div>
        ) : (
          // Normal state
          <>
            <div>
              <InputOTP
                maxLength={6}
                value={passkey}
                onChange={(value) => setPasskey(value)}
              >
                <InputOTPGroup className="shad-otp">
                  <InputOTPSlot className="shad-otp-slot" index={0} />
                  <InputOTPSlot className="shad-otp-slot" index={1} />
                  <InputOTPSlot className="shad-otp-slot" index={2} />
                  <InputOTPSlot className="shad-otp-slot" index={3} />
                  <InputOTPSlot className="shad-otp-slot" index={4} />
                  <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
              </InputOTP>

              {error && (
                <p className="shad-error text-14-regular mt-4 flex justify-center">
                  {error}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={(e) => validatePasskey(e)}
                className="shad-primary-btn w-full"
                disabled={passkey.length !== 6}
              >
                Enter Admin Passkey
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;

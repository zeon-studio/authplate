import { sendVerificationOtp } from "@/actions/opt";
import { OTP } from "@/actions/opt/types";
import { useSubmitForm } from "@/hooks/useSubmit";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function Timer({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { action } = useSubmitForm<OTP>(sendVerificationOtp);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const sendOTP = async () => {
    setMinutes(2);
    setSeconds(59);
    try {
      startTransition(() => {
        action({ email });
      });
    } catch (error: any) {
      toast.error(error.message || "Something went Wrong!");
    }
  };

  return (
    <div className="flex justify-between items-center">
      {(seconds > 0 || minutes > 0) && (
        <p>
          Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </p>
      )}
      {
        <Button
          type="button"
          variant={"link"}
          onClick={sendOTP}
          className="text-right ml-auto"
          disabled={minutes !== 0 || seconds !== 0 || isPending}
        >
          Resend
        </Button>
      }
    </div>
  );
}

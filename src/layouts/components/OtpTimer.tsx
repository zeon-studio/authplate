import { sendOtp } from "@/app/actions/otp";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/hooks/useMutation";
import { cn } from "@/lib/utils/shadcn";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

export function OtpTimer({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(59);
  
  const { action, isPending } = useMutation(sendOtp, {
    onSuccess() {
      setMinutes(2);
      setSeconds(59);
      toast.success("OTP Sent!");
    },
    onError({ error }) {
      toast.error(error.message || "Something went Wrong!");
    },
  });

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

  return (
    <>
      <div
        className={cn("flex justify-between items-center absolute", className)}
      >
        {(seconds > 0 || minutes > 0) && (
          <p>
            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        )}
        <form
          ref={formRef}
          id="otpGenarator"
          action={action}
          className="ml-auto"
        >
          <Input type="hidden" name="email" value={email} />
          <Button
            type="button"
            variant="link"
            className="ml-auto cursor-pointer"
            disabled={minutes !== 0 || seconds !== 0 || isPending}
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
          >
            Resend
          </Button>
        </form>
      </div>
    </>
  );
}

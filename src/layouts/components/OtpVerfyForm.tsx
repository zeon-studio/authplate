"use client";

import { sendOtp } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@/hooks/useMutation";
import { otpSchema } from "@/lib/validation/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Timer } from "./timer";
import { Label } from "./ui/label";

const OtpVerifyForm = () => {
  const { data: session, status } = useSession();
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { action, isPending } = useMutation(sendOtp, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        return;
      }
    },
    onSuccess() {},
  });

  useEffect(() => {
    if (status === "authenticated" && !session.user.emailVerified) {
      // sent otp to email
    }
  }, [session?.user.emailVerified, status]);

  return (
    <>
      <Form {...otpForm}>
        <form action={action} className="space-y-3 text-left">
          <div className="mb-4 text-left">
            <Label className="from-input mb-2.5 inline-block">Enter OTP:</Label>
            <div className="space-y-2">
              <InputOTP maxLength={6}>
                <InputOTPGroup className="w-full">
                  <InputOTPSlot className="w-full" index={0} />
                  <InputOTPSlot className="w-full" index={1} />
                  <InputOTPSlot className="w-full" index={2} />
                  <InputOTPSlot className="w-full" index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Timer email={session?.user.email!} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <>
                Verifying
                <Loader2 className="size-4 animate-spin ml-2" />
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OtpVerifyForm;

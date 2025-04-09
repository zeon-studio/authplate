"use client";

import { verifyOtp } from "@/app/actions/otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@/hooks/useMutation";
import { otpSchema } from "@/lib/validation/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { OtpTimer } from "../OtpTimer";
import { Input } from "../ui/input";
import ResetPasswordForm from "./ResetPasswordForm";

type OtpVerifyFormProps = {
  email: string;
  password?: string;
};

const OtpVerifyForm = ({ email, password }: OtpVerifyFormProps) => {
  const pathname = usePathname();
  const isForgotPassword = pathname.includes("forgot-password");
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  const { action, isPending } = useMutation(verifyOtp, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        otpForm.trigger();
        return;
      }
      toast.error(error.message || "Something went Wrong!");
    },
    async onSuccess() {
      toast.success("OTP Verified!");
      if (isForgotPassword) {
        setShowResetPasswordForm(true);
        return;
      }
      signIn("credentials", {
        email: email,
        password: password!,
      });
    },
  });

  return showResetPasswordForm ? (
    <ResetPasswordForm email={email!} />
  ) : (
    <div className="relative">
      <Form {...otpForm}>
        <form
          id="otpVerification"
          action={action}
          className="space-y-3 text-left"
        >
          <div className="mb-4 text-left">
            <div className="space-y-2">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter OTP:</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot className="w-full" index={0} />
                          <InputOTPSlot className="w-full" index={1} />
                          <InputOTPSlot className="w-full" index={2} />
                          <InputOTPSlot className="w-full" index={3} />
                          <InputOTPSlot className="w-full" index={4} />
                          <InputOTPSlot className="w-full" index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Input type="hidden" name="email" value={email} />
          </div>

          <div className="pt-10">
            <Button
              size={"lg"}
              disabled={isPending}
              type="submit"
              className="w-full "
            >
              {isPending ? (
                <>
                  Verifying
                  <Loader2 className="size-4 animate-spin ml-2" />
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>

        <OtpTimer
          email={email}
          className="absolute left-0 bottom-[47px] w-full"
        />
      </Form>
    </div>
  );
};

export default OtpVerifyForm;

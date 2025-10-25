"use client";

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
import { emailOtp, signIn } from "@/lib/auth/auth-client";
import { otpSchema } from "@/lib/validation/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { OtpTimer } from "../OtpTimer";
import { Input } from "../ui/input";
import ResetPasswordForm from "./ResetPasswordForm";

type OtpVerifyFormProps = {
  email: string;
  password?: string;
};

type OTPPayload = z.infer<typeof otpSchema>;

const OtpVerifyForm = ({ email, password }: OtpVerifyFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const callbackURL = decodeURIComponent(searchParams.get("from") || "/");
  const pathname = usePathname();
  const isForgotPassword = pathname.startsWith("/forgot-password");
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  const otpForm = useForm<OTPPayload>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // const { action, isPending } = useMutation(verifyOtp, {
  //   onError({ error }) {
  //     if (error.type === "VALIDATION_ERROR") {
  //       otpForm.trigger();
  //       return;
  //     }
  //     toast.error(error.message || "Something went Wrong!");
  //   },
  //   async onSuccess() {
  //     toast.success("OTP Verified!");
  //     if (isForgotPassword) {
  //       setShowResetPasswordForm(true);
  //       return;
  //     }
  //     signIn("credentials", {
  //       email: email,
  //       password: password!,
  //     });
  //   },
  // });

  const onSubmit = async (values: OTPPayload) => {
    if (isForgotPassword) {
      await emailOtp.checkVerificationOtp(
        {
          email,
          type: "forget-password", // required
          otp: values.otp,
        },
        {
          onSuccess: () => {
            setShowResetPasswordForm(true);
          },
        },
      );
      return;
    }

    await emailOtp.verifyEmail(
      { email, otp: values.otp },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: async () => {
          if (password) {
            await signIn.email({
              email,
              password,
              callbackURL: callbackURL,
              rememberMe: true, // false to not remember the session
            });
          }
          setIsPending(false);
          toast.success("Email verification is successful");
        },
        onError: async (ctx) => {
          console.log({ error: ctx.error });
          setIsPending(false);
          toast.success(ctx.error.message);
        },
      },
    );
  };

  if (showResetPasswordForm) {
    return (
      <ResetPasswordForm
        email={email}
        otp={otpForm.getValues("otp")}
        callbackURL={callbackURL}
      />
    );
  }

  return (
    <div className="relative">
      <Form {...otpForm}>
        <form
          id="otpVerification"
          onSubmit={otpForm.handleSubmit(onSubmit)}
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

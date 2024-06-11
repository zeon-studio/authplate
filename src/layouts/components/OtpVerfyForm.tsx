"use client";

import { sendVerificationOtp, verifyOtp } from "@/actions/opt";
import { OTP } from "@/actions/opt/types";
import { useSubmitForm } from "@/hooks/useSubmit";
import { otpSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Timer } from "./timer";
import { Button } from "./ui/button";

const OtpVerifyForm = () => {
  const { data, update } = useSession();
  const { user } = data || {};
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = otpForm.watch("otp");
  const { action: sendVerificationOtpRequest } =
    useSubmitForm<OTP>(sendVerificationOtp);

  const { action: verifyOtpRequest, state } = useSubmitForm<OTP>(verifyOtp, {
    onSuccess(state, ref) {
      toast.success(state.message);
      update({
        emailVerified: true,
      } as any);
    },
  });

  useEffect(() => {
    if (otp.length >= 4) {
      formRef.current?.submit();
    }
  }, []);

  return (
    <>
      <Form {...otpForm}>
        <form
          ref={formRef}
          className="mx-auto max-w-md"
          onSubmit={otpForm.handleSubmit((data) => {
            startTransition(() => {
              verifyOtpRequest({ email: user?.email!, otp: data.otp });
            });
          })}
        >
          <div className="mb-4">
            <FormField
              control={otpForm.control}
              name={"otp"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    OTP
                    <span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="* * * *" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Timer email={user?.email!} />
          <Button disabled={isPending} className="w-full rounded-full">
            Verify
          </Button>
        </form>
      </Form>
    </>
  );
};

export default OtpVerifyForm;

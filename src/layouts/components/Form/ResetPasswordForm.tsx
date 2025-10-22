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
import { Input } from "@/components/ui/input";
import { emailOtp, signIn } from "@/lib/auth/auth-client";
import { resetPasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PasswordInput from "../PasswordInput";

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
        password: "Password123@",
        confirmPassword: "Password123@",
      }
    : {
        password: "",
        confirmPassword: "",
      };

type ResetPasspayload = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({
  email,
  otp,
  callbackURL,
}: {
  email: string;
  otp: string;
  callbackURL: string;
}) => {
  const [isPending, setIsPending] = useState(false);

  const resetPasswordForm = useForm<ResetPasspayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultValues,
  });

  // const { action, isPending } = useMutation(resetPassword, {
  //   onSuccess: () => {
  //     toast.success("Password reset successfully");
  //     router.push("/signin"); // redirect to signin page after resetting password
  //   },
  //   onError: ({ error }) => {
  //     if (error.type === "VALIDATION_ERROR") {
  //       resetPasswordForm.trigger();
  //       return;
  //     }
  //     toast.error(error.message || "Something went wrong");
  //   },
  // });

  const onSubmit = async (values: ResetPasspayload) => {
    await emailOtp.resetPassword(
      {
        email,
        otp,
        password: values.password,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: async () => {
          setIsPending(false);
          toast.success("Password reset successfully");
          await signIn.email({
            email,
            password: values.password,
            callbackURL,
            rememberMe: true, // false to not remember the session
          });
        },
        onError: (ctx) => {
          setIsPending(false);
          toast.error(ctx.error.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
        className="space-y-2.5"
      >
        <Input type="hidden" name="email" value={email} />
        <div>
          <FormField
            control={resetPasswordForm.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4 ">
          <FormField
            control={resetPasswordForm.control}
            name={"confirmPassword"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

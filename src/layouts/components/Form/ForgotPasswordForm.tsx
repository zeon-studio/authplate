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
import { forgetPassword } from "@/lib/auth/auth-client";
import { forgotPasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  onOtpRequired: (params: { email: string; password: string }) => void;
};

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
      email: "murad.themefisher@gmail.com",
    }
    : {
      email: "",
    };

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = ({ onOtpRequired }: Props) => {
  const [isPending, setIsPending] = useState(false);
  const forgotPasswordForm = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async ({ email }: ForgotPasswordPayload) => {
    await forgetPassword.emailOtp(
      { email },
      {
        onRequest: () => setIsPending(true),
        onSuccess: () => {
          setIsPending(false);
          toast.success("OTP sent to your email");
          onOtpRequired({
            email: forgotPasswordForm.getValues("email")!,
            password: "",
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
    <Form {...forgotPasswordForm}>
      <form
        onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
        className="mx-auto max-w-md"
      >
        <FormField
          control={forgotPasswordForm.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="abc@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size={"lg"}
          className="px-4 font-bold w-full text-lg mt-4"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Forgot Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;

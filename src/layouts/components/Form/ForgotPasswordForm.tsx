"use client";

import { forgotPassword } from "@/app/actions/user";
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
import { useMutation } from "@/hooks/useMutation";
import { forgotPasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import OtpVerifyForm from "../OtpVerfyForm";

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
        email: "mukles.themefisher@gmail.com",
      }
    : {
        email: "",
      };

const ForgotPasswordForm = () => {
  const [showVerifyForm, setVerifyForm] = useState(false);
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: defaultValues,
  });

  const { action, isPending } = useMutation(forgotPassword, {
    onSuccess() {
      toast.success("OTP sent to your email");
      setVerifyForm(true);
    },
    onError() {
      toast.error("Something went wrong");
      setVerifyForm(false);
    },
  });

  return showVerifyForm ? (
    <>
      <OtpVerifyForm email={forgotPasswordForm.getValues("email")} />
    </>
  ) : (
    <Form {...forgotPasswordForm}>
      <form action={action} className="mx-auto max-w-md">
        <FormField
          control={forgotPasswordForm.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-3">Email</FormLabel>
              <FormControl>
                <Input placeholder="abc@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="py-2 text-black px-4 font-bold w-full text-lg mt-4"
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

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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  onOtpRequired: (params: { email: string; password: string }) => void;
};

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
        email: "mukles.themefisher@gmail.com",
      }
    : {
        email: "",
      };

const ForgotPasswordForm = ({ onOtpRequired }: Props) => {
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: defaultValues,
  });

  const { action, isPending } = useMutation(forgotPassword, {
    onSuccess() {
      toast.success("OTP sent to your email");
      onOtpRequired({
        email: forgotPasswordForm.getValues("email")!,
        password: "",
      });
    },
    onError({ error }) {
      toast.error(error.message);
    },
  });

  return (
    <Form {...forgotPasswordForm}>
      <form action={action} className="mx-auto max-w-md">
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

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
import { loginUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../PasswordInput";
import { emailOtp, signIn } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const defaultValues =
  process.env.NODE_ENV === "production"
    ? {
        email: "",
        password: "",
      }
    : {
        email: "siashuvo1@gmail.com",
        password: "@Password123",
      };

const LoginForm = ({
  onOtpRequired,
}: {
  onOtpRequired: (params: { email: string; password: string }) => void;
}) => {
  const searchParams = useSearchParams();
  const callbackURL = decodeURIComponent(searchParams.get("from") || "/");
  const [isPending, setIsPending] = useState(false);
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: defaultValues,
  });

  // const { action, isPending } = useMutation(loginUser, {
  //   onError({ error }) {
  //     if (error.type === "VALIDATION_ERROR") {
  //       loginForm.trigger();
  //       return;
  //     }
  //     if (error.type === "OTP_REQUIRED") {
  //       console.log(error);
  //       onOtpRequired({
  //         email: loginForm.getValues("email")!,
  //         password: loginForm.getValues("password")!,
  //       });
  //       return;
  //     }
  //     toast(error.type, {
  //       description: error.message,
  //     });
  //   },
  //   onSuccess() {
  //     toast.success("Login successful");
  //   },
  // });

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof loginUserSchema>) => {
    await signIn.email(
      {
        email,
        password,
        callbackURL: callbackURL || "/",
        rememberMe: true, // false to not remember the session
      },
      {
        //callbacks
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: () => {
          toast.success("Login successful");
          setIsPending(false);
        },
        onError: async (ctx) => {
          setIsPending(false);
          // Handle the error
          if (ctx.error.status === 403) {
            toast.warning("Please verify your email address");
            onOtpRequired({ email, password });
            await emailOtp.sendVerificationOtp({
              email,
              type: "email-verification", // required
            });
            return;
          }
          //you can also show the original error message
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <FormField
            control={loginForm.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3">
                  Email
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="abc@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={loginForm.control}
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

        <div className="flex justify-end">
          <Link
            href={`/forgot-password?from=${encodeURIComponent(callbackURL)}`}
            className="text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          size={"lg"}
          className="font-bold w-full text-lg mt-4"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;

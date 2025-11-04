"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailOtp, signUp } from "@/lib/auth/auth-client";
import { registerUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../PasswordInput";

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
      firstName: "John",
      lastName: "Doe",
      email: "murad.themefisher@gmail.com",
      password: "@Password123",
      confirmPassword: "@Password123",
      isTermsAccepted: true,
    }
    : {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isTermsAccepted: false,
    };

type RegisterPayload = z.infer<typeof registerUserSchema>;

export default function RegisterForm({
  onOtpRequired,
}: {
  onOtpRequired: (params: { email: string; password: string }) => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const registerForm = useForm<RegisterPayload>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: defaultValues,
  });

  // const { action, isPending } = useMutation(createUser, {
  //   onError({ error }) {
  //     if (error.type === "VALIDATION_ERROR") {
  //       registerForm.trigger();
  //       return;
  //     }
  //     toast(error.type, {
  //       description: error.message,
  //     });
  //   },
  //   onSuccess() {
  //     toast("Success!", {
  //       description: "User registered successfully.",
  //     });
  //     onOtpRequired({
  //       email: registerForm.getValues("email")!,
  //       password: registerForm.getValues("password")!,
  //     });
  //     registerForm.reset();
  //   },
  // });

  const onSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: RegisterPayload) => {
    await signUp.email(
      {
        name: firstName,
        firstName: firstName,
        lastName,
        email,
        password,
        callbackURL: "/",
      },
      {
        //callbacks
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: async () => {
          toast.success("User registered successfully.");
          setIsPending(false);
          onOtpRequired({
            email: registerForm.getValues("email")!,
            password: registerForm.getValues("password")!,
          });
          registerForm.reset();
          await emailOtp.sendVerificationOtp({
            email: registerForm.getValues("email"),
            type: "email-verification", // required
          });
        },
        onError: (ctx) => {
          setIsPending(false);
          // Handle the error
          if (ctx.error.status === 403) {
            toast.warning("Please verify your email address");
            onOtpRequired({
              email: ctx.request.body.email,
              password: ctx.request.body.password,
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
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onSubmit)}
        className="mx-auto mb-10 row"
      >
        <div className="mb-4 col-12 md:col-6">
          <FormField
            control={registerForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name:
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4 col-12 md:col-6">
          <FormField
            control={registerForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name:
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormField
            control={registerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
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
        <div className="mb-4 col-12 md:col-6">
          <FormField
            control={registerForm.control}
            name="password"
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
        <div className="mb-4 col-12 md:col-6">
          <FormField
            control={registerForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3">
                  Confirm Password
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center mb-4">
          <FormField
            control={registerForm.control}
            name="isTermsAccepted"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="terms"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="accent-black"
                    />
                  </FormControl>
                  <FormLabel className="mb-0" htmlFor="terms">
                    Accept terms and conditions
                  </FormLabel>
                </div>
                <FormMessage className="flex-1 w-full" />
              </FormItem>
            )}
          />
        </div>

        <div className="col-12">
          <Button
            disabled={isPending}
            type="submit"
            className="font-bold text-lg w-full"
          >
            {isPending ? "Loading..." : "Register"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

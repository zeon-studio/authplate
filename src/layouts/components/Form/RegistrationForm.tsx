"use client";

import { createUser } from "@/app/actions/user";
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
import { useMutation } from "@/hooks/useMutation";
import { registerUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
        firstName: "John",
        lastName: "Doe",
        email: "mukles.themefisher@gmail.com",
        password: "Password123!",
        confirmPassword: "Password123!",
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

export default function RegisterForm({
  onOtpRequired,
}: {
  onOtpRequired: (params: { email: string; password: string }) => void;
}) {
  const registerForm = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: defaultValues,
  });

  const { action, isPending } = useMutation(createUser, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        registerForm.trigger();
        return;
      }
      toast(error.type, {
        description: error.message,
      });
    },
    onSuccess() {
      registerForm.reset();
      toast("Success!", {
        description: "User registered successfully.",
      });

      onOtpRequired({
        email: registerForm.getValues("email")!,
        password: registerForm.getValues("password")!,
      });
    },
  });

  return (
    <Form {...registerForm}>
      <form action={action} className="mx-auto mb-10 row">
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
                  <Input
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
                <FormLabel>
                  Confirm Password
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="accent-black"
                    />
                  </FormControl>
                  <FormLabel htmlFor="terms">
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

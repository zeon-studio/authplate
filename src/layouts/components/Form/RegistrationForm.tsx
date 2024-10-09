"use client";

import { createUser } from "@/actions/user";
import { UserRegister } from "@/actions/user/types";
import { useSubmitForm } from "@/hooks/useSubmit";
import { registerSchema } from "@/lib/validation";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
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
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isTermsAccepted: false,
    },
  });

  const { action, state } = useSubmitForm<UserRegister>(createUser, {
    async onSuccess() {
      const { email, password } = registerForm.getValues();
      await signIn("credentials", {
        email,
        password,
      });
    },
  });

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit((data) => {
          action(data);
        })}
        className="mx-auto mb-10 row"
      >
        <div className="mb-4 col-12 md:col-6">
          <FormField
            control={registerForm.control}
            name={"firstName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name:
                  <span className="text-red-500">*</span>
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
            name={"lastName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name:
                  <span className="text-red-500">*</span>
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
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                  <span className="text-red-500">*</span>
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
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                  <span className="text-red-500">*</span>
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
            name={"confirmPassword"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password
                  <span className="text-red-500">*</span>
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
            name={"isTermsAccepted"}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="accent-black"
                      onClick={() => {
                        field.onChange(!field.value);
                      }}
                      checked={field.value}
                      id="terms"
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

        {state?.isError && (
          <div className="mb-4">
            <p className="text-destructive">{state.message}</p>
          </div>
        )}

        <div className="col-12">
          <Button
            type="submit"
            className={`font-bold text-lg w-full`}
            aria-disabled={isPending}
          >
            {isPending ? "submitting..." : "submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;

"use client";

import { loginUser } from "@/app/actions/user";
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
import { loginUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const defaultValues =
  process.env.NODE_ENV === "production"
    ? {
        email: "",
        password: "",
      }
    : {
        email: "mukles.themefisher@gmail.com",
        password: "Password123!",
      };

const LoginForm = () => {
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: defaultValues,
  });

  const { action, isPending } = useMutation(loginUser, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        loginForm.trigger();
        return;
      }
      toast(error.type, {
        description: error.message,
      });
    },
    onSuccess() {
      loginForm.reset();
      toast("Success!", {
        description: "User register in successfully.",
      });
    },
  });

  return (
    <Form {...loginForm}>
      <form action={action} className="space-y-3">
        <div>
          <FormField
            control={loginForm.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3">
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
        <div>
          <FormField
            control={loginForm.control}
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

        <Button
          type="submit"
          className="  py-2 px-4 font-bold w-full text-lg mt-4"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;

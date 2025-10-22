"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { changePassword } from "@/lib/auth/auth-client";
import { updatePasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../PasswordInput";
import { Button } from "../ui/button";

type UpdatePassPayload = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordForm() {
  const [isPending, setIsPending] = useState(false);

  const passwordForm = useForm<UpdatePassPayload>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // const { action, isPending } = useMutation(updatePassword, {
  //   onError({ error }) {
  //     if (error.type === "VALIDATION_ERROR") {
  //       passwordForm.trigger();
  //       return;
  //     }
  //     toast(error.type, {
  //       description: error.message,
  //     });
  //   },
  //   onSuccess() {
  //     toast.success("Password updated successfully");
  //     passwordForm.reset();
  //   },
  // });

  const onSubmit = async (values: UpdatePassPayload) => {
    await changePassword(
      {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true, // true to revoke other sessions
      },
      {
        onRequest: () => setIsPending(true),
        onError(ctx) {
          setIsPending(false);
          toast.error(ctx.error.message || "Something went wrong!!");
        },
        onSuccess() {
          setIsPending(false);
          toast.success("Password updated successfully");
          passwordForm.reset();
        },
      },
    );
  };

  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={passwordForm.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="New Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={passwordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isPending}
          type="submit"
          className="font-bold text-lg w-full"
        >
          {isPending ? "Loading..." : "Change password"}
        </Button>
      </form>
    </Form>
  );
}

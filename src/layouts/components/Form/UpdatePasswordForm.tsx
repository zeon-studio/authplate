import { resetPassword } from "@/app/actions/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@/hooks/useMutation";
import { updatePasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../PasswordInput";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function UpdatePasswordForm() {
  const { data: session } = useSession();
  const passwordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { action, isPending } = useMutation(resetPassword, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        passwordForm.trigger();
        return;
      }
      toast(error.type, {
        description: error.message,
      });
    },
    onSuccess() {
      toast.success("Password updated successfully");
      passwordForm.reset();
    },
  });

  return (
    <Form {...passwordForm}>
      <form action={action} className="space-y-4">
        <Input type="hidden" name="email" value={session?.user.email} />
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
                <Input
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

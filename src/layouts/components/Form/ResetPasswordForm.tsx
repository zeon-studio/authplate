"use client";
import { resetPassword } from "@/app/actions/user";
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
import { resetPasswordSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues =
  process.env.NODE_ENV === "development"
    ? {
        password: "password123$",
        confirmPassword: "password123$",
      }
    : {
        password: "",
        confirmPassword: "",
      };

const ResetPasswordForm = ({ email }: { email: string }) => {
  const router = useRouter();
  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: defaultValues,
  });

  const { action, isPending } = useMutation(resetPassword, {
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/signin"); // redirect to signin page after resetting password
    },
    onError: ({ error }) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <Form {...resetPasswordForm}>
      <form action={action} className="space-y-2.5">
        <Input type="hidden" name="email" value={email} />
        <div>
          <FormField
            control={resetPasswordForm.control}
            name={"password"}
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
        <div className="mb-4 ">
          <FormField
            control={resetPasswordForm.control}
            name={"confirmPassword"}
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

        <div>
          <Button>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;

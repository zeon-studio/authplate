"use client";

import { updateUser } from "@/app/actions/user";
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
import { updateUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function UserInfoUpdateForm() {
  const { data: session, update } = useSession();
  const profileForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: session?.user.firstName,
      lastName: session?.user.lastName,
      image: session?.user.image ?? "",
    },
  });

  const { action, isPending } = useMutation(updateUser, {
    onError({ error }) {
      if (error.type === "VALIDATION_ERROR") {
        profileForm.trigger();
        return;
      }
      toast(error.type, {
        description: error.message,
      });
    },
    onSuccess() {
      update({
        ...profileForm.getValues(),
      });
      toast("Success!", {
        description: "User info updated successfully.",
      });
    },
  });

  return (
    <Form {...profileForm}>
      <form action={action} className="space-y-4">
        <Input type="hidden" name="id" value={session?.user.id} />

        <FormField
          control={profileForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={profileForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={profileForm.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  placeholder="URL_ADDRESS.com/image.png"
                  {...field}
                  value={field.value || ""}
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
          {isPending ? "Loading..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}

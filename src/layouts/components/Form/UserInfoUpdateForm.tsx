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
import { Session, updateUser } from "@/lib/auth/auth-client";
import { updateUserSchema } from "@/lib/validation/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type UpdateUserPayload = z.infer<typeof updateUserSchema>;

export default function UserInfoUpdateForm({
  authPromise,
}: {
  authPromise: Promise<Session | null>;
}) {
  const auth = use(authPromise);
  const [isPending, setIsPending] = useState(false);

  const profileForm = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      image: "",
    },
  });

  useEffect(() => {
    if (auth?.user.firstName) {
      profileForm.setValue("firstName", auth?.user.firstName);
    }
    if (auth?.user.lastName) {
      profileForm.setValue("lastName", auth?.user.lastName);
    }
    if (auth?.user.image) {
      profileForm.setValue("image", auth?.user.image);
    }
  }, [
    auth?.user.image,
    auth?.user.firstName,
    auth?.user.lastName,
    profileForm,
  ]);

  // const { action, isPending } = useMutation(updateUser, {
  //   onError({ error }) {
  //     if (error.type === "VALIDATION_ERROR") {
  //       profileForm.trigger();
  //       return;
  //     }
  //     toast(error.type, {
  //       description: error.message,
  //     });
  //   },
  //   onSuccess() {
  //     update({
  //       ...profileForm.getValues(),
  //     });
  //     toast("Success!", {
  //       description: "User info updated successfully.",
  //     });
  //   },
  // });

  const onSubmit = async (values: UpdateUserPayload) => {
    await updateUser(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        image: values.image,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: () => {
          setIsPending(false);
          toast.success("Info updated successfully");
        },
        onError: (ctx) => {
          setIsPending(false);
          toast.error(ctx.error.message || "Something went wrong!");
        },
      },
    );
  };

  return (
    <Form {...profileForm}>
      <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-4">
        <Input type="hidden" name="id" value={auth?.user.id} />

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

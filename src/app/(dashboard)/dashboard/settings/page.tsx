"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import UpdatePasswordForm from "@/layouts/components/Form/UpdatePasswordForm";
import UserInfoUpdateForm from "@/layouts/components/Form/UserInfoUpdateForm";
import { Provider } from "@prisma/client";
import { Lock, User2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AccountSettings() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and update your personal information
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User2 className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>
              Update your personal information here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserInfoUpdateForm />
          </CardContent>
        </Card>
        {session?.user.provider === Provider.CREDENTIALS && (
          <>
            <Separator />

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Change Password</CardTitle>
                </div>
                <CardDescription>Update your password here.</CardDescription>
              </CardHeader>
              <CardContent>
                <UpdatePasswordForm />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

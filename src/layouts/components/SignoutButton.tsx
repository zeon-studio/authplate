"use client";

import { signOut } from "@/lib/auth/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <Button
      className="w-full"
      onClick={handleSignOut}
      // size={2}
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;

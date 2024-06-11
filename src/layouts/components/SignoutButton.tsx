"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignOutButton = () => {
  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("remember");
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

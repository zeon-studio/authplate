"use client";

import LoginForm from "@/components/Form/LoginForm";
import { Button } from "@/components/ui/button";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  if (showOtp) {
    return <OtpVerifyForm {...loginInfo} />;
  }

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="h2 font-semibold">Sign in to your account</h1>
        <p className="text-center">
          Don&apos;t Have An Account?{" "}
          <Link
            className="font-semibold text-primary cursor-pointer"
            href="/signup"
          >
            sign up
          </Link>
        </p>
      </div>
      <div className="mx-auto max-w-md">
        <LoginForm
          onOtpRequired={(params: { email: string; password: string }) => {
            setLoginInfo((prev) => ({ ...prev, ...params }));
            setShowOtp(true);
          }}
        />
        <div className="space-y-5 mt-5">
          <div className="w-full text-center">Or Continue With</div>
          <Button
            onClick={async () => {
              await signIn("google");
            }}
            className="w-full"
          >
            <SiGoogle size={23} className="mr-3 inline-block" />
            <span>Login With Goggle</span>
          </Button>

          <Button
            onClick={() => {
              signIn("github");
            }}
            className="w-full"
          >
            <SiGithub size={24} className="mr-3 inline-block" />
            <span>Login With Github</span>
          </Button>
        </div>
      </div>
    </>
  );
}

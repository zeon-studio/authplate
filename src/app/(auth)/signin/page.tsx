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

        <div className="relative mt-6 w-full h-[1px] bg-[#B3B8C2] mb-4">
          <span className="absolute bg-light z-10 inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
            Or Continue With
          </span>
        </div>

        <div className="space-y-5 mt-5">
          <Button
            onClick={async () => {
              await signIn("google");
            }}
            size={"lg"}
            className="w-full text-lg font-semibold"
          >
            <SiGoogle size={30} className="mr-1.5 inline-block" />
            <span>Login With Goggle</span>
          </Button>

          <Button
            onClick={() => {
              signIn("github");
            }}
            className="w-full text-lg font-semibold"
            size={"lg"}
          >
            <SiGithub size={30} className="mr-1.5 inline-block" />
            <span>Login With Github</span>
          </Button>
        </div>
      </div>
    </>
  );
}

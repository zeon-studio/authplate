"use client";

import RegisterForm from "@/components/Form/RegistrationForm";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { Button } from "@/layouts/components/ui/button";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
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
        <h1 className="h2 font-semibold">Create an account</h1>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary cursor-pointer"
            href="/signin"
          >
            signin
          </Link>
        </p>
      </div>

      <RegisterForm
        onOtpRequired={({
          email,
          password,
        }: {
          email: string;
          password: string;
        }) => {
          setLoginInfo((prev) => ({ ...prev, email, password }));
          setShowOtp(true);
        }}
      />

      <div className="relative w-full h-[1px] bg-[#B3B8C2] mb-4">
        <span className="absolute bg-light z-10 inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
          Or Continue With
        </span>
      </div>

      <div className="space-y-4">
        <Button
          onClick={async () => {
            await signIn("google");
          }}
          size={"lg"}
          className="w-full font-semibold mt-3"
        >
          <SiGoogle size={23} className="mr-3 inline-block" />
          <span>Login With Goggle</span>
        </Button>

        <Button
          onClick={() => {
            signIn("github");
          }}
          className="w-full font-semibold"
          size={"lg"}
        >
          <SiGithub size={24} className="mr-3 inline-block" />
          <span>Login With Github</span>
        </Button>
      </div>
    </>
  );
}

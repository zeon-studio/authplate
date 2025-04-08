"use client";

import RegisterForm from "@/components/Form/RegistrationForm";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { Button } from "@/layouts/components/ui/button";
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
          Already have an account? Sign in?{" "}
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

      <div>
        <Button className="w-full bg-primary text-white py-2 rounded-md">
          Continue with Google
        </Button>
        <Button className="w-full bg-white text-black py-2 rounded-md mt-2">
          Continue with Github
        </Button>
      </div>
    </>
  );
}

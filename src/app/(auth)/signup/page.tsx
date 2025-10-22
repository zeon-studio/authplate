"use client";

import RegisterForm from "@/components/Form/RegistrationForm";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { Button } from "@/layouts/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { use, useState } from "react";

type SearchParams = Promise<{ from?: string }>;

export default function Register({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { from } = use(searchParams);
  const callbackURL = decodeURIComponent(from || "/");

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [showOtp, setShowOtp] = useState(false);

  if (showOtp) {
    return <OtpVerifyForm {...loginInfo} />;
  }

  const signinWithGoogle = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: callbackURL || "/", // redirect after the user authenticates with the provider
        // errorCallbackURL: "/error",
        // newUserCallbackURL: "/welcome",
        disableRedirect: true, // disable the automatic redirect to the provider.
      },
      {
        //callbacks
        onRequest: () => {},
        onSuccess: () => {},
        onError: (ctx) => {
          // Handle the error
          if (ctx.error.status === 403) {
            alert("Please verify your email address");
            return;
          }
          //you can also show the original error message
          alert(ctx.error.message);
        },
      },
    );
  };

  const signinWithGithub = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: callbackURL || "/", // redirect after the user authenticates with the provider
        // errorCallbackURL: "/error",
        // newUserCallbackURL: "/welcome",
        disableRedirect: true, // disable the automatic redirect to the provider.
      },
      {
        //callbacks
        onRequest: () => {},
        onSuccess: () => {},
        onError: (ctx) => {
          // Handle the error
          if (ctx.error.status === 403) {
            alert("Please verify your email address");
            return;
          }
          //you can also show the original error message
          alert(ctx.error.message);
        },
      },
    );
  };

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
          onClick={signinWithGoogle}
          size={"lg"}
          className="w-full font-semibold mt-3"
        >
          <SiGoogle size={23} className="mr-3 inline-block" />
          <span>Login With Google</span>
        </Button>

        <Button
          onClick={signinWithGithub}
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

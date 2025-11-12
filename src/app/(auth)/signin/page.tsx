"use client";

import LoginForm from "@/components/Form/LoginForm";
import { Button } from "@/components/ui/button";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { signIn } from "@/lib/auth/auth-client";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { use, useState } from "react";

type SearchParams = Promise<{ from?: string }>;

export default function SignIn({
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
    await signIn.social({
      provider: "google",
      callbackURL, // redirect after the user authenticates with the provider
      // errorCallbackURL: "/error",
      // newUserCallbackURL: "/welcome",
      // disableRedirect: true, // disable the automatic redirect to the provider.
    });
  };

  const signinWithGithub = async () => {
    await signIn.social({ provider: "github", callbackURL });
  };

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

        <div className="relative mt-6 w-full h-px bg-[#B3B8C2] mb-4">
          <span className="absolute bg-light z-10 inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs sm:text-base">
            Or Continue With
          </span>
        </div>

        <div className="space-y-5 mt-5">
          <Button
            onClick={signinWithGoogle}
            size={"lg"}
            className="w-full text-lg font-semibold"
          >
            <SiGoogle size={30} className="mr-1.5 inline-block" />
            <span>Login With Google</span>
          </Button>

          <Button
            onClick={signinWithGithub}
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

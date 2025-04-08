"use client";

import ForgotPasswordForm from "@/layouts/components/Form/ForgotPasswordForm";
import OtpVerifyForm from "@/layouts/components/Form/OtpVerfyForm";
import { useState } from "react";

export default function ForgotPasswordPage() {
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
      <div className="text-center">
        <h1 className="mb-4 text-center">Forgot Password</h1>
        <p className="mb-8">
          Enter your email address to receive a password reset link.
        </p>
      </div>
      <ForgotPasswordForm
        onOtpRequired={(params: { email: string; password: string }) => {
          setLoginInfo((prev) => ({ ...prev, ...params }));
          setShowOtp(true);
        }}
      />
    </>
  );
}

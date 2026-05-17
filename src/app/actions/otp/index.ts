"use server";

import { prisma } from "@/lib/prisma";
import { otpSchema } from "@/lib/validation/otp.schema";
import "server-only";
import { TResult, safeAction } from "..";
import { mailSender } from "../sender";

type TOtpResponse = { token: string; expires: string };

export const sendOtp = async (
  state: TResult<TOtpResponse>,
  formData: FormData,
) => {
  return safeAction<TOtpResponse>(async () => {
    const data = Object.fromEntries(formData);

    const user = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.otpVerification.upsert({
      where: { userId: user.id },
      update: { token: otp, expires: expiresIn.toISOString() },
      create: { userId: user.id, token: otp, expires: expiresIn.toISOString() },
    });

    await mailSender.otpSender(user.email!, otp);
    return { token: otp, expires: expiresIn.toISOString() };
  });
};

export const verifyOtp = async (
  state: TResult<TOtpResponse>,
  formData: FormData,
) => {
  return safeAction<TOtpResponse>(async () => {
    const data = Object.fromEntries(formData);
    otpSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const otpVerification = await prisma.otpVerification.findUnique({
      where: { userId: user.id },
    });

    if (!otpVerification) {
      throw new Error("OTP verification record not found");
    }

    if (new Date(otpVerification.expires) < new Date()) {
      throw new Error("OTP expired");
    }

    if (otpVerification.token !== data.otp) {
      throw new Error("Invalid OTP");
    }

    await prisma.otpVerification.delete({ where: { userId: user.id } });
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return { token: otpVerification.token, expires: otpVerification.expires };
  });
};

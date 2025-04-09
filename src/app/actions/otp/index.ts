"use server";
import "server-only";

import db from "@/lib/prisma";
import { otpSchema } from "@/lib/validation/otp.schema";
import { OtpVerification } from "@prisma/client";
import { Result, safeAction } from "..";
import { mailSender } from "../sender";

// sent otp to email
export const sendOtp = async (
  state: Result<OtpVerification>,
  formData: FormData,
) => {
  return safeAction<OtpVerification>(async () => {
    const data = Object.fromEntries(formData);

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresIn = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Create or update OTP verification record
    // Upsert OTP verification record
    const verification = await db.otpVerification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        token: otp,
        expires: expiresIn,
      },
      create: {
        token: otp,
        expires: expiresIn,
        userId: user.id,
      },
    });

    // Send OTP via email
    await mailSender.otpSender(user.email!, otp);
    return verification;
  });
};

// verify otp
export const verifyOtp = async (
  state: Result<OtpVerification>,
  formData: FormData,
) => {
  return safeAction<OtpVerification>(async () => {
    const data = Object.fromEntries(formData);
    otpSchema.parse(data);
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find OTP verification record
    const verification = await db.otpVerification.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!verification) {
      throw new Error("OTP not found");
    }
    // Check if OTP is expired
    if (new Date(verification.expires) < new Date()) {
      throw new Error("OTP expired");
    }

    // Check if OTP is correct
    if (verification.token !== data.otp) {
      throw new Error("Invalid OTP");
    }
    // delete otp
    await db.otpVerification.delete({
      where: {
        userId: user.id,
      },
    });

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    return verification;
  });
};

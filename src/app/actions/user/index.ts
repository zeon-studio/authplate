"use server";
import "server-only";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { otpSchema } from "@/lib/validation/otp.schema";
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  updateUserSchema,
} from "@/lib/validation/user.schema";
import { OtpVerification, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Result, safeAction } from "..";
import { mailSender } from "../sender";

export const createUser = async (state: Result<User>, formData: FormData) => {
  return safeAction<User>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = registerUserSchema.parse({
      ...data,
      isTermsAccepted: data.isTermsAccepted === "on",
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email! },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const encryptedPassword = await bcryptjs.hash(validatedData.password, 10);

    return await prisma.user.create({
      data: {
        emailVerified: false,
        isTermsAccepted: true,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        password: encryptedPassword,
        provider: "CREDENTIALS",
      },
    });
  });
};

export const loginUser = async (state: Result<any>, formData: FormData) => {
  return safeAction<any>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = loginUserSchema.parse(data);
    try {
      return await signIn("credentials", validatedData);
    } catch (error) {
      if (error instanceof AuthError) {
        const { message } = error.cause as {
          message: string;
        };
        switch (error.type) {
          case "CredentialsSignin":
            throw new CredentialsSignin(message);
          case "AccessDenied":
            throw new CredentialsSignin(message);
        }
      }
      if (isRedirectError(error)) {
        throw error;
      }
    }
  });
};

export const verifyUserWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Result<User>> => {
  return safeAction(async () => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }
    const isValidPassword = await bcryptjs.compare(password, user.password!);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    if (!user.emailVerified) {
      const formData = new FormData();
      formData.append("email", email as string);
      await sendOtp(null, formData);
    }

    return user;
  });
};

export const updateUser = async (state: Result<User>, formData: FormData) => {
  return safeAction<User>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = updateUserSchema.parse(data);
    const user = await prisma.user.update({
      where: {
        id: data.id as string,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      },
    });
    return user;
  });
};

// sent otp to email
export const sendOtp = async (
  state: Result<OtpVerification>,
  formData: FormData,
) => {
  return safeAction<OtpVerification>(async () => {
    const data = Object.fromEntries(formData);

    // Find user by email
    const user = await prisma.user.findUnique({
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
    const verification = await prisma.otpVerification.upsert({
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
    const user = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find OTP verification record
    const verification = await prisma.otpVerification.findUnique({
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
    await prisma.otpVerification.delete({
      where: {
        userId: user.id,
      },
    });

    await prisma.user.update({
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

// forgot password
export const forgotPassword = async (
  state: Result<OtpVerification>,
  formData: FormData,
) => {
  return safeAction<OtpVerification>(async () => {
    const data = Object.fromEntries(formData);
    // Find user by email
    const user = await prisma.user.findUnique({
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
    const verification = await prisma.otpVerification.upsert({
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

// reset password
export const resetPassword = async (
  state: Result<User>,
  formData: FormData,
) => {
  return safeAction<User>(async () => {
    const data = Object.fromEntries(formData);

    resetPasswordSchema.parse(data);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email as string },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // after otp verification we are going to update the password

    const encryptedPassword = await bcryptjs.hash(data.password as string, 10);
    // update password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: encryptedPassword,
      },
    });

    return user;
  });
};

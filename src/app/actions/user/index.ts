"use server";
import "server-only";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "@/lib/validation/user.schema";
import { OtpVerification, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { Result, safeAction } from "..";

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
        function getFromValue(digest: string): string {
          const urlPattern = /NEXT_REDIRECT;(?:replace|push);(.*?);/;
          const match = digest.match(urlPattern);

          if (match) {
            try {
              const url = new URL(match[1]);
              return url.searchParams.get("from") || "/";
            } catch {
              // If URL construction fails, return "/"
            }
          }

          return "/";
        }

        redirect(getFromValue(error.digest));
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

    return user;
  });
};

export const updatUser = async (state: Result<User>, formData: FormData) => {
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
    const verification = await prisma.otpVerification.create({
      data: {
        token: otp,
        expires: expiresIn,
        userId: user.id,
      },
    });

    // TODO: Implement email sending logic here
    // Send OTP to user's email

    return verification;
  });
};

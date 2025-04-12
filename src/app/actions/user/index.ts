"use server";
import "server-only";

import { signIn } from "@/lib/auth";
import { connectToMongoDB } from "@/lib/mongoose";
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "@/lib/validation/user.schema";
import { IOtpVerification } from "@/models/types/otpVerification.types";
import { UserType } from "@/models/types/user.types";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Result, safeAction } from "..";
import { sendOtp } from "../otp";

// register user
export const createUser = async (
  state: Result<UserType>,
  formData: FormData,
) => {
  return safeAction<UserType>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = registerUserSchema.parse({
      ...data,
      isTermsAccepted: data.isTermsAccepted === "on",
    });

    await connectToMongoDB();
    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const encryptedPassword = await bcryptjs.hash(validatedData.password, 10);

    const newUser = await User.create({
      emailVerified: false,
      isTermsAccepted: true,
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      password: encryptedPassword,
      provider: "CREDENTIALS",
    });

    // send otp
    const formDataOtp = new FormData();
    formDataOtp.append("email", newUser.email!);
    await sendOtp(null, formDataOtp);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, _id, ...userWithoutPassword } = newUser.toObject();

    return userWithoutPassword as UserType;
  });
};

export const loginUser = async (state: Result<any>, formData: FormData) => {
  return safeAction<any>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = loginUserSchema.parse(data);
    try {
      connectToMongoDB();
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
}): Promise<Result<UserType>> => {
  return safeAction(async () => {
    await connectToMongoDB();

    const user = await User.findOne({ email }).select({
      email: 1,
      password: 1,
      emailVerified: 1,
      firstName: 1,
      lastName: 1,
      image: 1,
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
      formData.append("email", email);
      sendOtp(null, formData);
      throw new Error("User not verified");
    }

    return user;
  });
};

// update user
export const updateUser = async (
  state: Result<UserType>,
  formData: FormData,
) => {
  return safeAction<UserType>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = updateUserSchema.parse(data);
    const user = await User.findByIdAndUpdate(
      data.id as string,
      {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        image: validatedData.image,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });
};

// forgot password
export const forgotPassword = async (
  state: Result<IOtpVerification>,
  formData: FormData,
) => {
  return safeAction<IOtpVerification>(async () => {
    const data = Object.fromEntries(formData);
    await connectToMongoDB();
    // Find user by email
    const user = await User.findOne({ email: data.email as string });
    if (!user) {
      throw new Error("User not found");
    }

    formData.append("email", data.email);
    const verification = await sendOtp(null, formData);
    if (!verification?.success) {
      throw new Error("Something went wrong");
    }

    return verification.data;
  });
};

// reset password
export const resetPassword = async (
  state: Result<UserType>,
  formData: FormData,
) => {
  return safeAction<UserType>(async () => {
    const data = Object.fromEntries(formData);

    resetPasswordSchema.parse(data);

    await connectToMongoDB();
    // Find user by email
    const user = await User.findOne({ email: data.email as string });

    if (!user) {
      throw new Error("User not found");
    }

    // after otp verification we are going to update the password
    const encryptedPassword = await bcryptjs.hash(data.password as string, 10);

    // update password
    await User.findByIdAndUpdate(
      user.id,
      {
        password: encryptedPassword,
      },
      { new: true },
    ).select({
      _id: 0,
      password: 0,
      __v: 0,
      updatedAt: 0,
    });

    return user;
  });
};

// update password
export const updatePassword = async (
  state: Result<UserType>,
  formData: FormData,
) => {
  return safeAction<UserType>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = updatePasswordSchema.parse(data);

    await connectToMongoDB();
    // Find user by email
    const user = await User.findOne({
      email: validatedData.email,
    }).select({
      email: 1,
      password: 1,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // verify password
    const isValidPassword = await bcryptjs.compare(
      validatedData.oldPassword,
      user.password!,
    );

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const encryptedPassword = await bcryptjs.hash(
      validatedData.newPassword,
      10,
    );

    await User.updateOne(
      {
        email: validatedData.email,
      },
      {
        password: encryptedPassword,
      },
    );

    return user;
  });
};

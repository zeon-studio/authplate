"use server";
import "server-only";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  loginUserSchema,
  updateUserSchema,
  userSchema,
} from "@/lib/validation/user.schema";
import { User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { Result, safeAction } from "..";

export const createUser = async (state: Result<User>, formData: FormData) => {
  return safeAction<User>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = userSchema.parse(data);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const encryptedPassword = await bcryptjs.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        image: validatedData.image,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        password: encryptedPassword,
      },
    });

    return { ...user };
  });
};

export const loginUser = async (state: Result<any>, formData: FormData) => {
  return safeAction<any>(async () => {
    const data = Object.fromEntries(formData);
    const validatedData = loginUserSchema.parse(data);
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
    });
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

    const isValidPassword = await bcryptjs.compare(password, user.password);

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

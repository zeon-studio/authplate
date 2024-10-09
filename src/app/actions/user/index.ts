"use server";

import { UserLogin, UserRegister } from "@/actions/user/types";
import { signIn } from "@/auth";
import { ExtractVariables, SubmitFormState } from "@/hooks/useSubmit";
import { salt } from "@/lib/constant";
import prisma from "@/lib/prismaClient";
import { loginSchema, registerSchema } from "@/lib/validation";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import "server-only";
import { mutate } from "../index";
import { createToken } from "../jwt";

export const createUser = async (
  prevState: SubmitFormState<UserRegister>,
  userData: Partial<User>,
): Promise<SubmitFormState<UserRegister>> => {
  return await mutate<UserRegister>(async () => {
    const email = userData.email!;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return {
        data: null,
        error: [],
        message: "User already exit!",
        isError: true,
        isSuccess: false,
        statusCode: 409,
      };
    }
    const password = userData.password!;
    const hashedPassword = await bcrypt.hash(password, salt!);

    try {
      await prisma.$connect();
      try {
        const accessToken = await createToken({
          id: userData.email,
          email: userData.email,
        });

        const newUser = await prisma.user.create({
          // @ts-ignore
          data: {
            ...userData,
            emailVerified: false,
            provider: password ? "Credentials" : "Github",
            password: hashedPassword,
            accessToken,
          },
        });
        return {
          data: newUser,
          error: [],
          isError: false,
          isSuccess: true,
          message: "user created successfully!",
          statusCode: 201,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    } catch {
      return {
        data: null,
        error: [],
        isError: true,
        message: "Something went wrong",
        statusCode: 500,
      };
    }
  });
};
export const register = async (
  prevState: SubmitFormState<UserRegister>,
  data: ExtractVariables<UserRegister>,
): Promise<SubmitFormState<UserRegister>> => {
  const userData = data;

  const validate = registerSchema.safeParse(userData);
  if (!validate.success) {
    return {
      data: null,
      error: [],
      message: null,
      isError: true,
      isSuccess: false,
      statusCode: 400,
    };
  }

  return await mutate<UserRegister>(async () => {
    const email = userData.email;
    const password = userData.password;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return {
        data: null,
        error: [],
        message: "User already exit!",
        isError: true,
        isSuccess: false,
        statusCode: 409,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    try {
      await prisma.$connect();
      delete data.confirmPassword;
      try {
        const accessToken = await createToken({
          id: data.email,
          email: data.email,
        });

        const newUser = await prisma.user.create({
          data: {
            ...data,
            emailVerified: false,
            provider: "Credentials",
            password: hashedPassword,
            accessToken,
          },
        });

        return {
          data: newUser,
          error: [],
          isError: false,
          isSuccess: true,
          message: "user created successfully!",
          statusCode: 201,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    } catch {
      return {
        data: null,
        error: [],
        isError: true,
        message: "Something went wrong",
        statusCode: 500,
      };
    }
  });
};

export const login = async (
  prevState: SubmitFormState<UserLogin>,
  data: ExtractVariables<UserLogin>,
): Promise<SubmitFormState<UserLogin>> => {
  const validate = loginSchema.safeParse(data);

  if (validate.success) {
    try {
      await signIn("credentials", data);
      return {
        data: null,
        message: "login successfully!",
        isSuccess: true,
        isError: false,
        error: [],
        statusCode: 500,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              data: null,
              error: [],
              message: "Credentials not match!",
              isError: true,
              isSuccess: false,
              statusCode: 500,
            };
          case "AccessDenied":
            return {
              data: null,
              error: [],
              message: "AccessDenied.",
              isError: true,
              isSuccess: false,
              statusCode: 500,
            };
        }
      }
      return {
        data: null,
        error: [],
        message: "something went wrong!",
        isError: true,
        isSuccess: false,
        statusCode: 500,
      };
    }
  } else {
    return {
      data: null,
      error: [],
      message: "something went wrong!",
      isError: true,
      isSuccess: false,
      statusCode: 500,
    };
  }
};

"use server";

import { ExtractVariables, SubmitFormState } from "@/hooks/useSubmit";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import "server-only";
import { mutate } from "..";
import { otpSender } from "../sender";
import { OTP } from "./types";

const generateOtp = () => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 5);
  return { otp, expirationTime };
};

const sentOtp = async (email: string) => {
  const { otp, expirationTime } = generateOtp();
  const token = await bcrypt.hash(otp, 10);
  await prisma.$connect();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "user not found" };
  }

  await prisma.otpVerification.create({
    data: {
      expires: expirationTime.toISOString(),
      token,
      userId: user.id,
    },
  });

  await otpSender(email, otp);
};

export const sendVerificationOtp = async (
  prevState: SubmitFormState<OTP>,
  data: ExtractVariables<OTP>,
): Promise<SubmitFormState<OTP>> => {
  const { email } = data;
  return await mutate<OTP>(async () => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        error: [],
        message: "user not found",
        isError: true,
        isSuccess: false,
        data: null,
        statusCode: 400,
      };
    }

    await prisma.otpVerification.deleteMany({ where: { userId: user.id } });
    await sentOtp(email);

    return {
      error: [],
      message: "OTP sent successfully!",
      isError: false,
      isSuccess: true,
      data: null,
      statusCode: 200,
    };
  });
};

export const verifyOtp = async (
  prevState: SubmitFormState<OTP>,
  data: ExtractVariables<OTP>,
): Promise<SubmitFormState<OTP>> => {
  const { email, otp } = data;
  return await mutate<OTP>(async () => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        error: [],
        message: "user not found",
        isError: true,
        isSuccess: false,
        data: null,
        statusCode: 400,
      };
    }

    const otpVerification = await prisma.otpVerification.findFirst({
      where: { userId: user.id },
    });

    if (!otpVerification) {
      return {
        error: [],
        message: "OTP not found",
        isError: true,
        isSuccess: false,
        data: null,
        statusCode: 400,
      };
    }

    const isOtpValid = await bcrypt.compare(otp!, otpVerification.token);
    if (!isOtpValid) {
      return {
        error: [],
        message: "Incorrect OTP",
        isError: true,
        isSuccess: false,
        data: null,
        statusCode: 400,
      };
    }

    const currentTime = new Date();
    if (new Date(otpVerification.expires) < currentTime) {
      return {
        error: [],
        message: "OTP expired",
        isError: true,
        isSuccess: false,
        data: null,
        statusCode: 400,
      };
    }

    // await prisma.otpVerification.deleteMany({ where: { userId: user.id } });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return {
      error: [],
      message: "OTP verified successfully!",
      isError: false,
      isSuccess: true,
      data: null,
      statusCode: 200,
    };
  });
};

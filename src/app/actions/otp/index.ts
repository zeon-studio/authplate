"use server";
import "server-only";

import { connectToMongoDB } from "@/lib/mongoose";
import { otpSchema } from "@/lib/validation/otp.schema";
import OtpVerificationModel from "@/models/OtpVerification";
import { IOtpVerification } from "@/models/OtpVerification/type";
import UserModel from "@/models/User";
import { Result, safeAction } from "..";
import { mailSender } from "../sender";

// sent otp to email
export const sendOtp = async (
  state: Result<IOtpVerification>,
  formData: FormData,
) => {
  return safeAction<IOtpVerification>(async () => {
    await connectToMongoDB();
    const data = Object.fromEntries(formData);

    // Find user by email
    const user = await UserModel.findOne({ email: data.email as string });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresIn = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Upsert OTP verification record
    const abc = await OtpVerificationModel.findOneAndUpdate(
      { userId: user._id },
      { token: otp, expires: expiresIn },
      { upsert: true, new: true },
    );

    // Create or update OTP verification record
    // Upsert OTP verification record
    const verification = await OtpVerificationModel.findOneAndUpdate(
      { userId: user._id },
      { token: otp, expires: expiresIn },
      { upsert: true, new: true },
    ).select({
      token: 1,
      _id: 0,
    });

    // Send OTP via email
    await mailSender.otpSender(user.email!, otp);
    return verification.toJSON();
  });
};

// verify otp
export const verifyOtp = async (
  state: Result<IOtpVerification>,
  formData: FormData,
) => {
  return safeAction<IOtpVerification>(async () => {
    const data = Object.fromEntries(formData);
    otpSchema.parse(data);
    // Find user by email

    await connectToMongoDB();
    const user = await UserModel.findOne({ email: data.email as string });

    if (!user) {
      throw new Error("User not found");
    }

    // Find OTP verification record
    const otpVerification = await OtpVerificationModel.findOne({
      userId: user.id,
    }).select({
      token: 1,
      expires: 1,
      _id: 0,
    });

    if (!otpVerification) {
      throw new Error("OTP verification record not found");
    }
    // Check if OTP is expired
    if (new Date(otpVerification.expires) < new Date()) {
      throw new Error("OTP expired");
    }

    // Check if OTP is correct
    if (otpVerification.token !== data.otp) {
      throw new Error("Invalid OTP");
    }
    // delete otp
    await OtpVerificationModel.deleteOne({ userId: user.id });

    await UserModel.findByIdAndUpdate(user.id, { emailVerified: true });

    return otpVerification.toJSON();
  });
};

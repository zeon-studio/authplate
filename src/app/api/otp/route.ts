// import ApiError from "@/errors/ApiError";
import { dbConnect } from "@/db/db";
import { Url_Params } from "@/db/model/urlparams.model";
import { generateRandomBase24 } from "@/lib/generateUrlParams";
import { NextRequest, NextResponse } from "next/server";
import { optVerificationService } from "../utils";

export const POST = async (request: NextRequest) => {
  const { email, otp, type, currentTime, reset } = await request.json();
  await dbConnect();
  if (type === "verify user") {
    const data = await optVerificationService.verifyUserService(
      email,
      currentTime,
    );
    const params = generateRandomBase24(data.token);
    await optVerificationService.createUrlParams(email, params);
    return NextResponse.json({
      status: 200,
      params: params,
    });
  } else if (type === "verify otp") {
    await optVerificationService.verifyOtpService(email, otp, currentTime);
    const params = generateRandomBase24(email + otp);
    if (reset) {
      await optVerificationService.createUrlParams(email, params);
      return NextResponse.json({
        status: 200,
        message: "OTP verified",
        params: params,
      });
    } else {
      await Url_Params.findOneAndDelete({ email });
      return NextResponse.json({
        status: 200,
        message: "OTP verified",
      });
    }
  } else if (type === "resend") {
    optVerificationService.resendOtpService(email, currentTime);
  } else {
    return NextResponse.json({
      status: 400,
      message: "Invalid request type",
    });
  }
};

export const PATCH = async (request: NextRequest) => {
  const { email, password, currentPassword, type } = await request.json();
  await dbConnect();
  if (type === "reset-password") {
    await optVerificationService.resetPasswordService(email, password);
    await Url_Params.findOneAndDelete({ email });
    return NextResponse.json({
      status: 200,
      message: "Password reset successfully",
    });
  } else if (type === "update-password") {
    await optVerificationService.updatePasswordService(
      email,
      currentPassword,
      password,
    );
  }
};
// user verification for password recovery

// send verification otp

import { dbConnect } from "@/db/db";
import { User } from "@/db/model/user.model";
import ApiError from "@/error/ApiError";
import { generateRandomBase24 } from "@/lib/generateUrlParams";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { optVerificationService } from "../utils";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  await dbConnect();
  const hashedPassword = await bcrypt.hash(body.password, 5);
  const verify = await optVerificationService.verifyUserService(
    body.email,
    new Date().toISOString(),
  );
  const params = generateRandomBase24(verify.token);
  await optVerificationService.createUrlParams(body.email, params);
  try {
    const user = await User.findOne({ email: body.email });
    if (user) {
      throw new ApiError("user already exist", 400, "");
    }
    const userCreated = await User.create({
      ...body,
      password: hashedPassword,
      isValid: false,
    });
    return NextResponse.json({
      status: 200,
      params: params,
    });
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};

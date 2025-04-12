import { UserType } from "@/models/types/user.types";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as UserType;
  const user = await User.findOne({ email: data.email });
  if (!user) {
    const newUser = await User.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      emailVerified: true,
      isTermsAccepted: true,
      provider: data.provider,
    });

    return NextResponse.json(
      { data: newUser, message: "User created" },
      { status: 201 },
    );
  }

  return NextResponse.json(
    {
      data: user,
      message: "User found",
    },
    {
      status: 200,
    },
  );
}

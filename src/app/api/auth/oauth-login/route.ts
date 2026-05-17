import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
        emailVerified: true,
        isTermsAccepted: true,
        provider: data.provider,
      },
    });

    return NextResponse.json(
      { data: newUser, message: "User created" },
      { status: 201 },
    );
  }

  return NextResponse.json({ data: user, message: "User found" }, { status: 200 });
}

import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/utils/stripe";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 },
    );
  }
  try {
    await stripe.subscriptions.cancel(body);

    return NextResponse.json({ subs: "data" }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}

import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/utils/stripe";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { subscriptionId, subscriptionPriceId, newProductId } = body || {};
  try {
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscriptionPriceId,
            price: newProductId,
          },
        ],
      },
    );
    return NextResponse.json({ subs: "data" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ subs: error }, { status: 500 });
  }
};

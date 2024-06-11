import config from "@/config/config.json";
import { authOptions } from "@/lib/auth";
import { fetchUser } from "@/lib/fetchUser";
import { stripe } from "@/lib/utils/stripe";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const { base_url } = config.site;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const user = await fetchUser(session?.user?.email!);
  const { price, quantity } = body || {};
  if (!session?.user) {
    throw new Error("You must be signed in to make a purchase");
  }
  const line_items = quantity ? { price, quantity } : { price };
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user?.stripe_customer_id! || null,
    line_items: [line_items],
    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/dashboard/subscriptions" +
          `?session_id={CHECKOUT_SESSION_ID}`
        : base_url +
          "/dashboard/subscriptions" +
          `?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : base_url,
    subscription_data: {
      metadata: {
        payingUserId: session.user.email,
      },
      trial_period_days: 14,
    },
  } as Stripe.Checkout.SessionCreateParams);

  if (!checkoutSession.url) {
    return NextResponse.json(
      {
        error: {
          code: "stripe-error",
          message: "Could not create checkout session",
        },
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ session: checkoutSession }, { status: 200 });
}

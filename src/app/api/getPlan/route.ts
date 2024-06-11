import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  const stripeResponse = await stripe.prices.list();

  const plans = stripeResponse.data;

  return NextResponse.json(plans);
}

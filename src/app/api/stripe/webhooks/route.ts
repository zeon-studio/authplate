import { dbConnect } from "@/db/db";
import { User } from "@/db/model/user.model";
import { fetchUser } from "@/lib/fetchUser";
import { stripe } from "@/lib/utils/stripe";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret: string =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_WEBHOOK_SECRET!
    : (process.env.STRIPE_WEBHOOK_SECRET as string);

const webhookHandler = async (req: NextRequest) => {
  await dbConnect();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.log(err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      {
        error: {
          message: `Webhook Error: ${errorMessage}`,
        },
      },
      { status: 400 },
    );
  }
  // getting to the data we want from the event
  const subscription = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "customer.subscription.created":
      await fetchUser(subscription.metadata.payingUserId);
      await User.findOneAndUpdate(
        {
          stripe_customer_id: subscription.customer,
        },
        {
          isActive: true,
          stripe_subscription_id: subscription.id,
        },
      );
      break;
    case "customer.subscription.deleted":
      const deleteData = await User.findOneAndUpdate(
        {
          stripe_customer_id: subscription.customer,
        },
        {
          isActive: false,
          stripe_subscription_id: "",
        },
        { new: true },
      );

      break;
    case "customer.subscription.updated":
      await fetchUser(subscription.metadata.payingUserId);
      const update = await User.findOneAndUpdate(
        {
          stripe_customer_id: subscription.customer,
        },
        {
          isActive: true,
          stripe_subscription_id: subscription.id,
        },
        { new: true },
      );
      break;
    default:
      throw new Error("Unhandled relevant event!");
  }
  revalidatePath("/dashboard/subscriptions");
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ received: true });
};

export { webhookHandler as POST };

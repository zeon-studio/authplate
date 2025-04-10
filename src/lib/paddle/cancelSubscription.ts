"use server";
import { safeAction } from "@/app/actions";
import { connectToMongoDB } from "@/lib/mongoose";
import SubscriptionModel from "@/models/Subscription";
import { revalidatePath } from "next/cache";
import "server-only";
import { getPaddleInstance } from "./getPaddleInstance";

export async function cancelSubscription(subscriptionId: string) {
  const paddle = getPaddleInstance();
  return await safeAction(async () => {
    await connectToMongoDB();
    const response = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });
    await SubscriptionModel.findOneAndUpdate(
      { orderId: subscriptionId },
      {
        $set: {
          status: "CANCELED",
          canceledAt: new Date(),
        },
      },
    );
    revalidatePath("/dashboard/subscriptions");
    return JSON.parse(JSON.stringify(response));
  });
}

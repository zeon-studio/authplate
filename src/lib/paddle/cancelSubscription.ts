"use server";
import { safeAction } from "@/app/actions";
import db from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import "server-only";
import { getPaddleInstance } from "./getPaddleInstance";

export async function cancelSubscription(subscriptionId: string) {
  const paddle = getPaddleInstance();
  return await safeAction(async () => {
    const response = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });
    await db.subscription.update({
      where: {
        orderId: subscriptionId,
      },
      data: {
        status: SubscriptionStatus.CANCELED,
        canceledAt: new Date(),
      },
    });
    revalidatePath("/dashboard/subscriptions");
    return JSON.parse(JSON.stringify(response));
  });
}

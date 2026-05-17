"use server";
import { safeAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import "server-only";
import { getPaddleInstance } from "./getPaddleInstance";

export async function cancelSubscription(subscriptionId: string) {
  const paddle = getPaddleInstance();
  return await safeAction(async () => {
    const response = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });
    await prisma.subscription.update({
      where: { orderId: subscriptionId },
      data: { status: "CANCELED", canceledAt: new Date() },
    });
    revalidatePath("/dashboard/subscriptions");
    return JSON.parse(JSON.stringify(response));
  });
}

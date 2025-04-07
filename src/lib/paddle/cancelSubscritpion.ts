"use server";
import { safeAction } from "@/app/actions";
import "server-only";
import { getPaddleInstance } from "./get-paddle-instance";

export async function cancelSubscription(subscriptionId: string) {
  const paddle = getPaddleInstance();
  return await safeAction(async () => {
    const response = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });
    return JSON.parse(JSON.stringify(response));
  });
}

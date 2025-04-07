import { db } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";
import { safeAction } from "..";

export function getActiveSubscriptions(userId: string) {
  return safeAction(async () => {
    return await db.subscription.findMany({
      where: {
        userId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
}

// get user payment history
export function getUserPaymentHistory(userId: string) {
  return safeAction(async () => {
    return await db.payment.findMany({
      where: {
        userId,
      },
      include: {
        subscription: {
          select: {
            billingCycle: true,
            planName: true,
            status: true,
            planId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
}

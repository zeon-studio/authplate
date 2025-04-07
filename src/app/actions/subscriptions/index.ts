import { db } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";
import { safeAction } from "..";

export function getActiveSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await db.subscription.findMany({
      where: {
        userId,
        OR: [
          {
            status: SubscriptionStatus.LIFETIME,
          },
          {
            AND: [
              {
                lastBillingDate: {
                  lte: currentDate,
                },
              },
              {
                nextBillingDate: {
                  gte: currentDate,
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
}

export function getExpiredSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await db.subscription.findMany({
      where: {
        userId,
        nextBillingDate: {
          lt: currentDate,
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

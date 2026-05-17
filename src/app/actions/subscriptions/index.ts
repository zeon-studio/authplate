import { prisma } from "@/lib/prisma";
import { safeAction } from "..";

export function getActiveSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await prisma.subscription.findMany({
      where: {
        userId,
        OR: [
          { status: "LIFETIME" },
          {
            AND: [
              { lastBillingDate: { lte: currentDate } },
              { nextBillingDate: { gte: currentDate } },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  });
}

export function getExpiredSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await prisma.subscription.findMany({
      where: {
        userId,
        nextBillingDate: { lt: currentDate },
      },
      orderBy: { createdAt: "desc" },
    });
  });
}

export function getUserPaymentHistory(userId: string) {
  return safeAction(async () => {
    return await prisma.payment.findMany({
      where: { userId },
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
    });
  });
}

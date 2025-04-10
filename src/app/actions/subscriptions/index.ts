import PaymentModel from "@/models/Payment";
import SubscriptionModel from "@/models/Subscription";
import { safeAction } from "..";

export function getActiveSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await SubscriptionModel.find({
      userId,
      $or: [
        {
          status: "LIFETIME",
        },
        {
          $and: [
            {
              lastBillingDate: {
                $lte: currentDate,
              },
            },
            {
              nextBillingDate: {
                $gte: currentDate,
              },
            },
          ],
        },
      ],
    }).sort({ createdAt: -1 });
  });
}

export function getExpiredSubscriptions(userId: string) {
  return safeAction(async () => {
    const currentDate = new Date();
    return await SubscriptionModel.find({
      userId,
      nextBillingDate: {
        $lt: currentDate,
      },
    }).sort({ createdAt: -1 });
  });
}

// get user payment history
export function getUserPaymentHistory(userId: string) {
  return safeAction(async () => {
    return await PaymentModel.find({
      userId,
    })
      .populate({
        path: "subscription",
        select: "billingCycle planName status planId",
      })
      .sort({ createdAt: -1 });
  });
}

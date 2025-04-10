import { connectToMongoDB } from "@/lib/mongoose";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { BillingCycle } from "@/models/Subscription/type";
import { safeAction } from "..";

export function getActiveSubscriptions(userId: string) {
  return safeAction(async () => {
    await connectToMongoDB();
    const currentDate = new Date();
    return await Subscription.find({
      userId,
      $or: [
        {
          status: BillingCycle.LIFETIME,
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
    await connectToMongoDB();
    const currentDate = new Date();
    return await Subscription.find({
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
    await connectToMongoDB();
    return await Payment.find({
      userId,
    })
      .populate({
        path: "subscription",
        select: "billingCycle planName status planId",
      })
      .sort({ createdAt: -1 });
  });
}

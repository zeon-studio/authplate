import { connectToMongoDB } from "@/lib/mongoose";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { BillingCycle } from "@/models/Subscription/type";
import { Types } from "mongoose";
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
    const histories = await Payment.aggregate([
      {
        $match: { userId: new Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "orderId",
          foreignField: "orderId",
          as: "subscription",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $unwind: "$subscription",
      },
      {
        $project: {
          totalAmount: 1,
          taxAmount: 1,
          amount: 1,
          status: 1,
          currency: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          orderId: 1,
          subscription: 1,
          createdAt: 1,
        },
      },
    ]);
    return histories;
  });
}

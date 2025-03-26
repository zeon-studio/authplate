import {
  EventEntity,
  EventName,
  TransactionPaidEvent,
} from "@paddle/paddle-node-sdk";
import { prisma } from "../prisma";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        break;
      case EventName.TransactionCompleted:
        break;
      case EventName.TransactionPaymentFailed:
        break;
    }
  }

  async orderCreated(eventData: TransactionPaidEvent) {
    const { id: transactionId, customData, subscriptionId } = eventData.data;
    const { userEmail, packageName, billingFrequency } = customData as {
      userEmail: string;
      packageName: string;
      billingFrequency: string;
    };

    if (subscriptionId || billingFrequency !== "lifetime") {
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    console.log({ user });

    if (!user) {
      return;
    }

    await prisma.subscription.create({
      data: {
        userId: user!.id,
        planId: packageName,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(),
        subscriptionId: transactionId,
        canceledAt: null,
        lastBillingDate: new Date(),
        trialEndsAt: null,
      },
    });
  }
}

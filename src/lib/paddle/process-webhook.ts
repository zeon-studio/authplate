import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import { prisma } from "@/lib/prisma";
import {
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionItemNotification,
  SubscriptionUpdatedEvent,
  TransactionCompletedEvent,
  TransactionItemNotification,
} from "@paddle/paddle-node-sdk";
import {
  BillingCycle,
  PaymentStatus,
  SubscriptionStatus,
} from "@prisma/client";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        this.subscriptionCreated(eventData);
        break;
      case EventName.TransactionCompleted:
        this.lifetimeSubscriptionCreated(eventData);
        this.paymentCreated(eventData);
        break;
      case EventName.SubscriptionUpdated:
        this.subscriptionUpdated(eventData);
        break;
    }
  }

  async subscriptionUpdated(eventData: SubscriptionUpdatedEvent) {
    const {
      id: subscriptionId,
      status,
      nextBilledAt,
      currentBillingPeriod,
      firstBilledAt,
      items,
    } = eventData.data;
    const subscription = await prisma.subscription.findUnique({
      where: {
        orderId: subscriptionId,
      },
    });

    if (!subscription) {
      return;
    }

    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: this.getSubscriptionStatus(status),
        nextBillingDate: nextBilledAt,
        trialEndsAt:
          status === "trialing" ? currentBillingPeriod?.endsAt : null,
        planId: this.getPlanId(items)!,
        planName: this.getPlanName(items)!,
        lastBillingDate: !subscription.lastBillingDate
          ? firstBilledAt
          : subscription.nextBillingDate,
      },
    });
  }

  async lifetimeSubscriptionCreated(eventData: TransactionCompletedEvent) {
    const {
      id: transactionId,
      customData,
      subscriptionId,
      items,
    } = eventData.data;

    if (subscriptionId) {
      return;
    }

    const { email: userEmail } = customData as {
      email: string;
    };
    const user = await this.getUserEmail(userEmail);
    if (!user) {
      return;
    }

    await prisma.subscription.create({
      data: {
        userId: user!.id,
        planId: this.getPlanId(items)!,
        status: SubscriptionStatus.LIFETIME,
        orderId: subscriptionId || transactionId,
        planName: this.getPlanName(items)!,
        startDate: new Date(),
        billingCycle: BillingCycle.LIFETIME,
      },
    });
  }

  async paymentCreated(eventData: TransactionCompletedEvent) {
    const {
      id: transactionId,
      subscriptionId,
      details,
      customData,
      discountId,
      currencyCode,
    } = eventData.data;

    const { email: userEmail } = customData as {
      email: string;
    };

    const user = await this.getUserEmail(userEmail);

    if (!user) {
      return;
    }

    const earnings = +(details?.totals?.total ?? "0") / 100;
    const taxAmount = +(details?.totals?.tax ?? "0") / 100;
    const processingFee = +(details?.totals?.fee ?? "0") / 100;
    const totalAmount = +(earnings + taxAmount + processingFee).toFixed(2);

    await prisma.payment.create({
      data: {
        userId: user!.id,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        processingFee: processingFee,
        earnings: earnings,
        currency: currencyCode,
        paymentMethod: "paddle",
        status: PaymentStatus.COMPLETED,
        orderId: subscriptionId || transactionId,
        transactionId: transactionId,
        discountId: discountId ?? null,
      },
    });
  }

  async subscriptionCreated(eventData: SubscriptionCreatedEvent) {
    const {
      id: subscriptionId,
      transactionId,
      customData,
      nextBilledAt,
      currentBillingPeriod,
      firstBilledAt,
      items,
    } = eventData.data;

    const { email: userEmail } = customData as {
      email: string;
    };

    const user = await this.getUserEmail(userEmail);

    if (!user) {
      return;
    }

    await prisma.subscription.create({
      data: {
        userId: user!.id,
        planId: this.getPlanId(items)!,
        status: this.getSubscriptionStatus(eventData.data.status),
        lastBillingDate: firstBilledAt!,
        orderId: subscriptionId || transactionId,
        canceledAt: null,
        startDate: currentBillingPeriod?.startsAt || firstBilledAt!,
        trialEndsAt:
          eventData.data.status === "trialing"
            ? currentBillingPeriod?.endsAt
            : null,
        nextBillingDate: nextBilledAt || currentBillingPeriod?.endsAt,
        planName: this.getPlanName(items)!,
        billingCycle: this.getBillingCycle(items),
      },
    });
  }

  getPlanId(
    items:
      | SubscriptionCreatedEvent["data"]["items"]
      | TransactionCompletedEvent["data"]["items"],
  ) {
    const item = items[0];
    if (item instanceof SubscriptionItemNotification) {
      return item.price?.id || item.product?.id;
    }

    if (item instanceof TransactionItemNotification) {
      return item.price?.id;
    }
  }

  getPlanName(
    items:
      | SubscriptionCreatedEvent["data"]["items"]
      | TransactionCompletedEvent["data"]["items"],
  ) {
    const item = items[0];
    if (item instanceof TransactionItemNotification) {
      return item.price?.name;
    }

    if (item instanceof SubscriptionItemNotification) {
      return item.price?.name || item.product?.name;
    }
  }

  getSubscriptionStatus(status: SubscriptionCreatedEvent["data"]["status"]) {
    switch (status) {
      case "active":
        return SubscriptionStatus.ACTIVE;
      case "past_due":
        return SubscriptionStatus.PAST_DUE;
      case "trialing":
        return SubscriptionStatus.TRIALING;
      case "canceled":
        return SubscriptionStatus.CANCELED;
      case "paused":
        return SubscriptionStatus.PAUSED;
      default:
        return SubscriptionStatus.ACTIVE;
    }
  }

  async getUserEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  getBillingCycle(
    items:
      | SubscriptionCreatedEvent["data"]["items"]
      | TransactionCompletedEvent["data"]["items"],
  ): BillingCycle {
    const currentId = this.getPlanId(items);

    if (!currentId) {
      return BillingCycle.DAILY;
    }

    const cycle = PricingTier.reduce<BillingCycle>((acc, tier) => {
      const ids = Object.entries(tier.priceId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const found = ids.find(([_, id]) => id === currentId);
      return found ? (found[0] as BillingCycle) : acc;
    }, BillingCycle.DAILY);

    return cycle;
  }
}

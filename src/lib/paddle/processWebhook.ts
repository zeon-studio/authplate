import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import { EBillingCycle } from "@/app/actions/paddle/type";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";
import {
  EventEntity,
  EventName,
  SubscriptionStatus as PaddleSubscriptionStatus,
  SubscriptionCreatedEvent,
  SubscriptionItemNotification,
  SubscriptionScheduledChangeNotification,
  SubscriptionUpdatedEvent,
  TransactionCompletedEvent,
  TransactionItemNotification,
} from "@paddle/paddle-node-sdk";

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
      items,
      scheduledChange,
    } = eventData.data;

    const subscription = await prisma.subscription.findUnique({
      where: { orderId: subscriptionId },
    });

    if (!subscription || scheduledChange?.action === "cancel") {
      return;
    }

    if (scheduledChange?.action) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: this.getSubscriptionStatus(scheduledChange) },
      });
      return;
    }

    await prisma.subscription.update({
      where: { orderId: subscriptionId },
      data: {
        status: this.getSubscriptionStatus(status),
        nextBillingDate: nextBilledAt ? new Date(nextBilledAt) : undefined,
        trialEndsAt:
          status === "trialing" && currentBillingPeriod?.endsAt
            ? new Date(currentBillingPeriod.endsAt)
            : null,
        planId: this.getPlanId(items)!,
        planName: this.getPlanName(items)!,
        lastBillingDate: items[0].previouslyBilledAt
          ? new Date(items[0].previouslyBilledAt)
          : undefined,
      },
    });
  }

  async lifetimeSubscriptionCreated(eventData: TransactionCompletedEvent) {
    const { id: transactionId, customData, subscriptionId, items } =
      eventData.data;

    if (subscriptionId) {
      return;
    }

    const { email: userEmail } = customData as { email: string };
    const user = await this.getUserByEmail(userEmail);
    if (!user) return;

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: this.getPlanId(items)!,
        status: "LIFETIME",
        orderId: subscriptionId || transactionId,
        planName: this.getPlanName(items)!,
        startDate: new Date(),
        billingCycle: EBillingCycle.LIFETIME,
      },
    });
  }

  async paymentCreated(eventData: TransactionCompletedEvent) {
    try {
      const {
        id: transactionId,
        subscriptionId,
        details,
        customData,
        discountId,
        currencyCode,
      } = eventData.data;

      const { email: userEmail } = (customData as { email: string }) || {};
      const user = await this.getUserByEmail(userEmail);
      if (!user) return;

      const earnings = +(details?.totals?.total ?? "0") / 100;
      const taxAmount = +(details?.totals?.tax ?? "0") / 100;
      const processingFee = +(details?.totals?.fee ?? "0") / 100;
      const totalAmount = +(earnings + taxAmount + processingFee).toFixed(2);

      await prisma.payment.create({
        data: {
          userId: user.id,
          totalAmount,
          taxAmount,
          processingFee,
          earnings,
          currency: currencyCode || "",
          paymentMethod: "paddle",
          status: "COMPLETED",
          orderId: subscriptionId || transactionId,
          transactionId: transactionId,
          discountId: discountId || undefined,
        },
      });
    } catch (error) {
      console.log("Error creating payment:", error);
    }
  }

  async subscriptionCreated(eventData: SubscriptionCreatedEvent) {
    try {
      const {
        id: subscriptionId,
        transactionId,
        customData,
        nextBilledAt,
        currentBillingPeriod,
        firstBilledAt,
        items,
      } = eventData.data;

      const { email: userEmail } = (customData as { email: string }) || {};
      const user = await this.getUserByEmail(userEmail);
      if (!user) return;

      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: this.getPlanId(items)!,
          status: this.getSubscriptionStatus(eventData.data.status),
          lastBillingDate: firstBilledAt ? new Date(firstBilledAt) : new Date(),
          orderId: subscriptionId || transactionId!,
          canceledAt: null,
          startDate: currentBillingPeriod?.startsAt
            ? new Date(currentBillingPeriod.startsAt)
            : firstBilledAt
              ? new Date(firstBilledAt)
              : new Date(),
          trialEndsAt:
            eventData.data.status === "trialing" && currentBillingPeriod?.endsAt
              ? new Date(currentBillingPeriod.endsAt)
              : null,
          nextBillingDate:
            nextBilledAt
              ? new Date(nextBilledAt)
              : currentBillingPeriod?.endsAt
                ? new Date(currentBillingPeriod.endsAt)
                : null,
          planName: this.getPlanName(items)!,
          billingCycle: this.getBillingCycle(items),
        },
      });
    } catch (error) {
      console.log("Error creating subscription:", error);
    }
  }

  getPlanId(
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
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
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
  ) {
    const item = items[0];
    if (item instanceof TransactionItemNotification) {
      return item.price?.name;
    }
    if (item instanceof SubscriptionItemNotification) {
      return item.price?.name || item.product?.name;
    }
  }

  getSubscriptionStatus(
    status: PaddleSubscriptionStatus | SubscriptionScheduledChangeNotification,
  ): SubscriptionStatus {
    if (status instanceof SubscriptionScheduledChangeNotification) {
      switch (status.action) {
        case "cancel":
          return SubscriptionStatus.CANCELED;
        case "pause":
          return SubscriptionStatus.PAUSED;
        case "resume":
          return SubscriptionStatus.ACTIVE;
        default:
          return SubscriptionStatus.ACTIVE;
      }
    }

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

  async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.log("Error finding user:", error);
      return null;
    }
  }

  getBillingCycle(
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
  ): EBillingCycle {
    const currentId = this.getPlanId(items);

    if (!currentId) {
      return EBillingCycle.DAILY;
    }

    const cycle = PricingTier.reduce<EBillingCycle>((acc, tier) => {
      const ids = Object.entries(tier.priceId as Record<string, unknown>);
      const found = ids.find(([, id]) => id === currentId);
      return found ? (found[0] as EBillingCycle) : acc;
    }, EBillingCycle.DAILY);

    return cycle;
  }
}

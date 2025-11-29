import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import { connectToMongoDB } from "@/lib/mongoose";
import Payment from "@/models/payment.model";
import Subscription from "@/models/subscription.model";
import { PaymentStatus } from "@/models/types/payment.types";
import {
  BillingCycle,
  SubscriptionStatus,
} from "@/models/types/subscription.types";
import User from "@/models/user.model";
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
    await connectToMongoDB();
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

    const subscription = await Subscription.findOne({
      orderId: subscriptionId,
    });

    if (!subscription || scheduledChange?.action === "cancel") {
      return;
    }

    if (scheduledChange?.action) {
      await Subscription.updateOne(
        { _id: subscription._id },
        {
          $set: {
            status: this.getSubscriptionStatus(scheduledChange),
          },
        },
      );
      return;
    }

    await Subscription.updateOne(
      { orderId: subscriptionId },
      {
        $set: {
          status: this.getSubscriptionStatus(status),
          nextBillingDate: nextBilledAt,
          trialEndsAt:
            status === "trialing" ? currentBillingPeriod?.endsAt : null,
          planId: this.getPlanId(items)!,
          planName: this.getPlanName(items)!,
          lastBillingDate: items[0].previouslyBilledAt,
        },
      },
    );
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

    await Subscription.create({
      userId: user!._id,
      planId: this.getPlanId(items)!,
      status: SubscriptionStatus.LIFETIME,
      orderId: subscriptionId || transactionId,
      planName: this.getPlanName(items)!,
      startDate: new Date(),
      billingCycle: BillingCycle.LIFETIME,
    } as any);
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

      const { email: userEmail } =
        (customData as {
          email: string;
        }) || {};

      const user = await this.getUserEmail(userEmail);

      if (!user) {
        return;
      }

      const earnings = +(details?.totals?.total ?? "0") / 100;
      const taxAmount = +(details?.totals?.tax ?? "0") / 100;
      const processingFee = +(details?.totals?.fee ?? "0") / 100;
      const totalAmount = +(earnings + taxAmount + processingFee).toFixed(2);

      await Payment.create({
        userId: user!._id,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        processingFee: processingFee,
        earnings: earnings,
        currency: currencyCode || undefined,
        paymentMethod: "paddle",
        status: PaymentStatus.COMPLETED,
        orderId: subscriptionId || transactionId,
        transactionId: transactionId || undefined,
        discountId: discountId || undefined,
      } as any);
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

      const { email: userEmail } =
        (customData as {
          email: string;
        }) || {};

      const user = await this.getUserEmail(userEmail);

      if (!user) {
        return;
      }

      await Subscription.create({
        userId: user!._id,
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
      } as any);
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
  ) {
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

  async getUserEmail(email: string) {
    try {
      const user = await User.findOne({
        email: email,
      });

      return user;
    } catch (error) {
      console.log("Error finding user:", error);
    }
  }

  // Updated logic to use `BillingCycle`
  getBillingCycle(
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
  ): BillingCycle {
    const currentId = this.getPlanId(items);

    if (!currentId) {
      return BillingCycle.DAILY;
    }

    const cycle = PricingTier.reduce<BillingCycle>((acc, tier) => {
      const ids = Object.entries(tier.priceId as Record<string, unknown>);
      const found = ids.find(([, id]) => id === currentId);
      return found ? (found[0] as BillingCycle) : acc;
    }, BillingCycle.DAILY);

    return cycle;
  }
}

import { PricingTier } from "@/app/actions/paddle/pricing-tier";
import connectMongo from "@/lib/mongoose";
import PaymentModel from "@/models/Payment";
import SubscriptionModel from "@/models/Subscription";
import UserModel from "@/models/User";
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

// Replace invalid `db` usage with Mongoose models
const subscriptionsCollection = SubscriptionModel;
const usersCollection = UserModel;
const paymentsCollection = PaymentModel;

// Added missing definitions for `SubscriptionStatus`, `BillingCycle`, and `PaymentStatus`

const SubscriptionStatus = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
  PAUSED: "paused",
  LIFETIME: "lifetime",
};

// Adjusted `BillingCycle` logic to ensure correct type usage
const BillingCycle = {
  DAILY: "daily",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  LIFETIME: "lifetime",
} as const;

type BillingCycleType = keyof typeof BillingCycle;

const PaymentStatus = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
};

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    await connectMongo();
    console.log("Processing event:", eventData.eventType);
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        console.log("Handling subscription created event");
        this.subscriptionCreated(eventData);
        break;
      case EventName.TransactionCompleted:
        console.log("Handling transaction completed event");
        this.lifetimeSubscriptionCreated(eventData);
        this.paymentCreated(eventData);
        break;
      case EventName.SubscriptionUpdated:
        console.log("Handling subscription updated event");
        this.subscriptionUpdated(eventData);
        break;
    }
  }

  async subscriptionUpdated(eventData: SubscriptionUpdatedEvent) {
    console.log("Starting subscription update process");
    const {
      id: subscriptionId,
      status,
      nextBilledAt,
      currentBillingPeriod,
      items,
      scheduledChange,
    } = eventData.data;

    console.log("Finding subscription with orderId:", subscriptionId);
    const subscription = await subscriptionsCollection.findOne({
      orderId: subscriptionId,
    });

    if (!subscription || scheduledChange?.action === "cancel") {
      console.log("Subscription not found or scheduled for cancellation");
      return;
    }

    if (scheduledChange?.action) {
      console.log("Processing scheduled change:", scheduledChange.action);
      await subscriptionsCollection.updateOne(
        { id: subscription.id },
        {
          $set: {
            status: this.getSubscriptionStatus(scheduledChange),
          },
        },
      );
      return;
    }

    console.log("Updating subscription details");
    await subscriptionsCollection.updateOne(
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
    console.log("Starting lifetime subscription creation process");
    const {
      id: transactionId,
      customData,
      subscriptionId,
      items,
    } = eventData.data;

    if (subscriptionId) {
      console.log("Subscription ID exists, skipping lifetime creation");
      return;
    }

    const { email: userEmail } = customData as {
      email: string;
    };

    console.log("Finding user with email:", userEmail);
    const user = await this.getUserEmail(userEmail);
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Creating lifetime subscription");
    await subscriptionsCollection.insertOne({
      userId: user!.id,
      planId: this.getPlanId(items)!,
      status: SubscriptionStatus.LIFETIME,
      orderId: subscriptionId || transactionId,
      planName: this.getPlanName(items)!,
      startDate: new Date(),
      billingCycle: BillingCycle.LIFETIME,
    });
  }

  async paymentCreated(eventData: TransactionCompletedEvent) {
    try {
      console.log("Starting payment creation process");
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

      console.log("Finding user with email:", userEmail);
      const user = await this.getUserEmail(userEmail);

      if (!user) {
        console.log("User not found");
        return;
      }

      console.log("Calculating payment amounts");
      const earnings = +(details?.totals?.total ?? "0") / 100;
      const taxAmount = +(details?.totals?.tax ?? "0") / 100;
      const processingFee = +(details?.totals?.fee ?? "0") / 100;
      const totalAmount = +(earnings + taxAmount + processingFee).toFixed(2);

      console.log("Creating payment record");
      await paymentsCollection.insertOne({
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
      });
    } catch (error) {
      console.log("Error creating payment:", error);
    }
  }

  async subscriptionCreated(eventData: SubscriptionCreatedEvent) {
    try {
      console.log("Starting subscription creation process");
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

      console.log("Finding user with email:", userEmail);
      const user = await this.getUserEmail(userEmail);

      if (!user) {
        console.log("User not found");
        return;
      }

      console.log("Creating subscription record");
      await subscriptionsCollection.insertOne({
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
      });
    } catch (error) {
      console.log("Error creating subscription:", error);
    }
  }

  getPlanId(
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
  ) {
    console.log("Getting plan ID");
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
    console.log("Getting plan name");
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
    console.log("Getting subscription status");
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
      console.log("Finding user by email:", email);
      const user = await usersCollection.findOne({
        email: email,
      });

      return user;
    } catch (error) {
      console.log("Error finding user:", error);
    }
  }

  // Updated logic to use `BillingCycleType`
  getBillingCycle(
    items: SubscriptionItemNotification[] | TransactionItemNotification[],
  ): BillingCycleType {
    console.log("Getting billing cycle");
    const currentId = this.getPlanId(items);

    if (!currentId) {
      console.log("No plan ID found, defaulting to daily billing");
      return "DAILY";
    }

    const cycle = PricingTier.reduce<BillingCycleType>((acc, tier) => {
      const ids = Object.entries(tier.priceId as Record<string, unknown>);
      const found = ids.find(([, id]) => id === currentId);
      return found ? (found[0] as BillingCycleType) : acc;
    }, "DAILY");

    console.log("Determined billing cycle:", cycle);
    return cycle;
  }
}

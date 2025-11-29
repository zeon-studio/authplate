import mongoose from "mongoose";

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
  PAUSED = "PAUSED",
  TRIALING = "TRIALING",
  LIFETIME = "LIFETIME",
}

export enum BillingCycle {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  ANNUAL = "ANNUAL",
  LIFETIME = "LIFETIME",
}

export interface ISubscription {
  userId: mongoose.Types.ObjectId | string;
  planId: string;
  status: SubscriptionStatus;
  orderId: string;
  planName?: string;
  startDate?: Date;
  trialEndsAt?: Date;
  nextBillingDate?: Date;
  lastBillingDate?: Date;
  canceledAt?: Date;
  billingCycle?: BillingCycle;
  createdAt: Date;
  updatedAt: Date;
}

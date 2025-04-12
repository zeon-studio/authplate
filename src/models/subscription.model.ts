import mongoose, { Model, Schema, model } from "mongoose";
import {
  BillingCycle,
  ISubscription,
  SubscriptionStatus,
} from "./types/subscription.types";

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
    },
    orderId: { type: String, required: true, unique: true },
    planName: { type: String },
    startDate: { type: Date },
    trialEndsAt: { type: Date },
    nextBillingDate: { type: Date },
    lastBillingDate: { type: Date },
    canceledAt: { type: Date },
    billingCycle: { type: String, enum: Object.values(BillingCycle) },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;

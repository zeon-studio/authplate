import mongoose, { Schema, model } from "mongoose";
import { BillingCycle, SubscriptionStatus } from "./type";

const SubscriptionSchema = new Schema({
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
});

const Subscription =
  mongoose.models.Subscription || model("Subscription", SubscriptionSchema);
export default Subscription;

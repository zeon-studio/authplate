import mongoose, { Schema, model } from "mongoose";

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: String, required: true },
  status: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  planName: { type: String },
  startDate: { type: Date },
  trialEndsAt: { type: Date },
  nextBillingDate: { type: Date },
  lastBillingDate: { type: Date },
  canceledAt: { type: Date },
  billingCycle: { type: String },
});

const SubscriptionModel =
  mongoose.models.Subscription || model("Subscription", SubscriptionSchema);
export default SubscriptionModel;

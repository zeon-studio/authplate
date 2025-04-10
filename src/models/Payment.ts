import mongoose, { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: { type: Number, required: true },
  taxAmount: { type: Number },
  processingFee: { type: Number },
  earnings: { type: Number },
  currency: { type: String },
  paymentMethod: { type: String },
  status: { type: String },
  orderId: { type: String, required: true, unique: true },
  transactionId: { type: String },
  discountId: { type: String },
});

const PaymentModel = mongoose.models.Payment || model("Payment", PaymentSchema);
export default PaymentModel;

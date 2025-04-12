import mongoose, { Model, Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "./type";

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number },
    processingFee: { type: Number },
    earnings: { type: Number },
    currency: { type: String },
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    orderId: { type: String, required: true, unique: true },
    transactionId: { type: String },
    discountId: { type: String },
  },
  {
    timestamps: true,
  },
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || model<IPayment>("Payment", PaymentSchema);

export default Payment;

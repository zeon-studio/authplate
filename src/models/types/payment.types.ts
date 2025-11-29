import mongoose from "mongoose";

export enum PaymentStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PENDING = "PENDING",
}

export interface IPayment {
  userId: mongoose.Types.ObjectId | string;
  totalAmount: number;
  taxAmount?: number;
  processingFee?: number;
  earnings?: number;
  currency?: string;
  paymentMethod?: string;
  status: PaymentStatus;
  orderId: string;
  transactionId?: string;
  discountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

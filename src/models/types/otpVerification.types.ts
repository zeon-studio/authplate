import { Schema } from "mongoose";

// Define the interface for OTP verification document
export interface IOtpVerification {
  userId: Schema.Types.ObjectId | string;
  token: string;
  expires: Date;
}

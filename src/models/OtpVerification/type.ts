import { Schema } from "mongoose";

// Define the interface for OTP verification document
export interface IOtpVerification {
  userId: Schema.Types.ObjectId;
  token: string;
  expires: Date;
}

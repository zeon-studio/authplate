import { Model, Schema, model, models } from "mongoose";
import { IOtpVerification } from "./types/otpVerification.types";

const OtpVerificationSchema = new Schema<IOtpVerification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

const OtpVerification: Model<IOtpVerification> =
  models.OtpVerification ||
  model<IOtpVerification>("OtpVerification", OtpVerificationSchema);

export default OtpVerification;

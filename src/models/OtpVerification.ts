import { Schema, model, models } from "mongoose";

const OtpVerificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

const OtpVerificationModel =
  models.OtpVerification || model("OtpVerification", OtpVerificationSchema);

export default OtpVerificationModel;

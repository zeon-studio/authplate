import mongoose, { Model, Schema } from "mongoose";
import { Provider, UserType } from "./types/user.types";

const UserSchema = new Schema<UserType>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isTermsAccepted: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(Provider),
      required: true,
    },
    password: {
      type: String,
      select: false,
      minlength: 6,
    },
    verifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "OtpVerification",
      },
    ],
    subscriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Add indexes for frequently queried fields
UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1 });

// Create or get existing model
const User: Model<UserType> =
  mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
